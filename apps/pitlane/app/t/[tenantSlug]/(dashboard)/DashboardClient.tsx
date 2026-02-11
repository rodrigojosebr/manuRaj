'use client';

import Link from 'next/link';
import { css } from '../../../../../../styled-system/css';
import { Card, CardContent, CardHeader, CardTitle, Badge, getStatusBadgeVariant, getMachineStatusBadgeVariant } from '@pitkit';
import type { SessionUser, MetricsResponse } from '@manuraj/domain';
import { ROLE_DISPLAY_NAMES, WORK_ORDER_STATUS_DISPLAY, MACHINE_STATUS_DISPLAY } from '@manuraj/domain';
import { formatRelativeTime } from '@manuraj/shared-utils';

interface DashboardClientProps {
  user: SessionUser;
  metrics: MetricsResponse | null;
  recentMachines: Array<{
    _id: string;
    name: string;
    code: string;
    status: string;
    createdAt: string;
  }>;
  recentWorkOrders: Array<{
    _id: string;
    type: string;
    status: string;
    description: string;
    machineId: { name?: string; code?: string } | string;
    createdAt: string;
  }>;
}

export function DashboardClient({
  user,
  metrics,
  recentMachines,
  recentWorkOrders,
}: DashboardClientProps) {
  const baseUrl = `/t/${user.tenantSlug}`;

  return (
    <div>
      {/* Page header */}
      <div className={css({ marginBottom: '6' })}>
        <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
          Dashboard
        </h1>
        <p className={css({ color: 'gray.600', marginTop: '1' })}>
          Bem-vindo, {user.name}! ({ROLE_DISPLAY_NAMES[user.role]})
        </p>
      </div>

      {/* Metrics cards - only for supervisors */}
      {metrics && (
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: '4',
            marginBottom: '6',
          })}
        >
          <MetricCard
            title="Máquinas"
            value={metrics.totalMachines}
            icon="⚙️"
            href={`${baseUrl}/machines`}
          />
          <MetricCard
            title="OS Abertas"
            value={metrics.openWorkOrders}
            icon="📋"
            href={`${baseUrl}/work-orders?status=open`}
            variant={metrics.openWorkOrders > 10 ? 'warning' : 'default'}
          />
          <MetricCard
            title="OS Atrasadas"
            value={metrics.overdueWorkOrders}
            icon="⚠️"
            href={`${baseUrl}/work-orders?overdue=true`}
            variant={metrics.overdueWorkOrders > 0 ? 'danger' : 'success'}
          />
          <MetricCard
            title="Concluídas (mês)"
            value={metrics.completedThisMonth}
            icon="✅"
            href={`${baseUrl}/work-orders?status=completed`}
          />
          <MetricCard
            title="Tempo Médio (min)"
            value={metrics.avgCompletionTimeMin || '-'}
            icon="⏱️"
          />
          <MetricCard
            title="Preventivas Vencidas"
            value={metrics.preventivePlansDue}
            icon="📅"
            href={`${baseUrl}/preventive-plans`}
            variant={metrics.preventivePlansDue > 0 ? 'warning' : 'success'}
          />
        </div>
      )}

      {/* Recent data */}
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'repeat(2, 1fr)' },
          gap: '6',
        })}
      >
        {/* Recent work orders */}
        <Card>
          <CardHeader>
            <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
              <CardTitle>Ordens de Serviço Recentes</CardTitle>
              <Link
                href={`${baseUrl}/work-orders`}
                className={css({ fontSize: 'sm', color: 'brand.600', _hover: { textDecoration: 'underline' } })}
              >
                Ver todas
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentWorkOrders.length === 0 ? (
              <p className={css({ color: 'gray.500', textAlign: 'center', padding: '4' })}>
                Nenhuma ordem de serviço encontrada
              </p>
            ) : (
              <div className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
                {recentWorkOrders.map((wo) => (
                  <Link
                    key={wo._id}
                    href={`${baseUrl}/work-orders/${wo._id}`}
                    className={css({
                      display: 'block',
                      padding: '3',
                      borderRadius: 'md',
                      border: '1px solid',
                      borderColor: 'gray.200',
                      _hover: { backgroundColor: 'gray.50' },
                    })}
                  >
                    <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1' })}>
                      <Badge variant={getStatusBadgeVariant(wo.status)}>
                        {WORK_ORDER_STATUS_DISPLAY[wo.status] || wo.status}
                      </Badge>
                      <span className={css({ fontSize: 'xs', color: 'gray.500' })}>
                        {formatRelativeTime(wo.createdAt)}
                      </span>
                    </div>
                    <p className={css({ fontSize: 'sm', color: 'gray.900', lineClamp: 1 })}>
                      {wo.description}
                    </p>
                    <p className={css({ fontSize: 'xs', color: 'gray.500', marginTop: '1' })}>
                      {typeof wo.machineId === 'object' && wo.machineId.name
                        ? `${wo.machineId.name} (${wo.machineId.code})`
                        : 'Máquina não especificada'}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent machines */}
        <Card>
          <CardHeader>
            <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
              <CardTitle>Máquinas</CardTitle>
              <Link
                href={`${baseUrl}/machines`}
                className={css({ fontSize: 'sm', color: 'brand.600', _hover: { textDecoration: 'underline' } })}
              >
                Ver todas
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentMachines.length === 0 ? (
              <p className={css({ color: 'gray.500', textAlign: 'center', padding: '4' })}>
                Nenhuma máquina cadastrada
              </p>
            ) : (
              <div className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
                {recentMachines.map((machine) => (
                  <Link
                    key={machine._id}
                    href={`${baseUrl}/machines/${machine._id}`}
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '3',
                      borderRadius: 'md',
                      border: '1px solid',
                      borderColor: 'gray.200',
                      _hover: { backgroundColor: 'gray.50' },
                    })}
                  >
                    <div>
                      <p className={css({ fontWeight: 'medium', color: 'gray.900' })}>
                        {machine.name}
                      </p>
                      <p className={css({ fontSize: 'sm', color: 'gray.500' })}>
                        {machine.code}
                      </p>
                    </div>
                    <Badge variant={getMachineStatusBadgeVariant(machine.status)}>
                      {MACHINE_STATUS_DISPLAY[machine.status] || machine.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Metric card component
interface MetricCardProps {
  title: string;
  value: number | string;
  icon: string;
  href?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

function MetricCard({ title, value, icon, href, variant = 'default' }: MetricCardProps) {
  const variantStyles = {
    default: { borderColor: 'gray.200', iconBg: 'gray.100' },
    success: { borderColor: 'green.200', iconBg: 'green.100' },
    warning: { borderColor: 'yellow.200', iconBg: 'yellow.100' },
    danger: { borderColor: 'red.200', iconBg: 'red.100' },
  };

  const styles = variantStyles[variant];

  const content = (
    <div
      className={css({
        backgroundColor: 'white',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: styles.borderColor,
        padding: '4',
        display: 'flex',
        alignItems: 'center',
        gap: '4',
        _hover: href ? { boxShadow: 'md' } : {},
        transition: 'box-shadow 0.2s',
      })}
    >
      <div
        className={css({
          width: '12',
          height: '12',
          borderRadius: 'lg',
          backgroundColor: styles.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'xl',
        })}
      >
        {icon}
      </div>
      <div>
        <p className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
          {value}
        </p>
        <p className={css({ fontSize: 'sm', color: 'gray.600' })}>{title}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
