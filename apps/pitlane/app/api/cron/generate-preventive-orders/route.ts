import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import {
  preventivePlanRepository,
  workOrderRepository,
  userRepository,
} from '@manuraj/data-access';
import { createLogger } from '@manuraj/shared-utils';

const log = createLogger({ module: 'cron', job: 'generate-preventive-orders' });

/**
 * POST /api/cron/generate-preventive-orders
 *
 * Cron job that generates work orders from due preventive plans.
 * Protected by CRON_SECRET header validation.
 *
 * Schedule: daily via Vercel Cron or external scheduler.
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export async function POST(req: NextRequest) {
  // Validate cron secret
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED', message: 'Invalid cron secret' },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    // Find all due plans across all tenants
    const duePlans = await preventivePlanRepository.findAllDue();

    if (duePlans.length === 0) {
      return NextResponse.json({
        status: 'ok',
        message: 'No due plans found',
        created: 0,
      });
    }

    // Group plans by tenantId to find a supervisor per tenant
    const plansByTenant = new Map<string, typeof duePlans>();
    for (const plan of duePlans) {
      const tid = plan.tenantId.toString();
      if (!plansByTenant.has(tid)) plansByTenant.set(tid, []);
      plansByTenant.get(tid)!.push(plan);
    }

    let created = 0;
    let errors = 0;

    for (const [tenantId, plans] of plansByTenant) {
      // Find a supervisor to use as createdBy
      const { users } = await userRepository.findByTenant(tenantId, {
        role: 'general_supervisor',
        active: true,
        limit: 1,
      });

      if (users.length === 0) {
        log.error({ tenantId, plansCount: plans.length }, 'No active supervisor found, skipping plans');
        errors += plans.length;
        continue;
      }

      const createdById = users[0]._id.toString();

      for (const plan of plans) {
        try {
          const machineId = plan.machineId._id
            ? plan.machineId._id.toString()
            : plan.machineId.toString();

          // Create preventive work order
          await workOrderRepository.create(tenantId, createdById, {
            machineId,
            type: 'preventive',
            priority: 'medium',
            description: `Manutenção preventiva: ${plan.name}`,
          });

          // Advance the plan's next due date
          await preventivePlanRepository.advanceNextDueDate(
            tenantId,
            plan._id.toString()
          );

          created++;
        } catch (err) {
          log.error({ planId: String(plan._id), err }, 'Error processing plan');
          errors++;
        }
      }
    }

    return NextResponse.json({
      status: 'ok',
      processed: duePlans.length,
      created,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    log.error({ error }, 'Cron job failed');
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message: 'Cron job failed' },
      { status: 500 }
    );
  }
}
