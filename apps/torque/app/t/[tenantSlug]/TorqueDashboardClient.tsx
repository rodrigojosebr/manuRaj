'use client';

import Link from 'next/link';
import { Heading, Badge, getPriorityBadgeVariant, getStatusBadgeVariant } from '@pitkit';
import {
  ROLE_DISPLAY_NAMES,
  WORK_ORDER_STATUS_DISPLAY,
  WORK_ORDER_PRIORITY_DISPLAY,
} from '@manuraj/domain';
import type { UserRole } from '@manuraj/domain';
import { truncate, formatDate, daysUntil } from '@manuraj/shared-utils';
import * as S from './page.styles';

// ─── Types ──────────────────────────────────────────────────────────────────

interface SerializedWorkOrder {
  _id: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  dueDate: string | null;
  machine: { name: string; code: string } | null;
}

interface SerializedPreventivePlan {
  _id: string;
  name: string;
  nextDueDate: string;
  machine: { name: string; code: string } | null;
}

interface DashboardStats {
  assignedOpen: number;
  inProgress: number;
  overdue: number;
  completedThisMonth: number;
  totalMachines: number;
}

interface TorqueDashboardClientProps {
  userName: string;
  userRole: string;
  tenantSlug: string;
  stats: DashboardStats;
  recentWorkOrders: SerializedWorkOrder[];
  dueSoonPlans: SerializedPreventivePlan[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getFormattedDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'brand' | 'success' | 'warning' | 'danger';
}) {
  return (
    <div className={S.statCard(color)}>
      <p className={S.statValue(color)}>{value}</p>
      <p className={S.statLabel}>{label}</p>
    </div>
  );
}

function RecentWOCard({ wo }: { wo: SerializedWorkOrder }) {
  return (
    <div className={S.woCard(wo.status)}>
      {wo.machine && (
        <p className={S.woMachine}>
          {wo.machine.name} ({wo.machine.code})
        </p>
      )}
      <p className={S.woDescription}>{truncate(wo.description, 80)}</p>
      <div className={S.woBadges}>
        <Badge variant={getStatusBadgeVariant(wo.status)}>
          {WORK_ORDER_STATUS_DISPLAY[wo.status] || wo.status}
        </Badge>
        <Badge variant={getPriorityBadgeVariant(wo.priority)}>
          {WORK_ORDER_PRIORITY_DISPLAY[wo.priority] || wo.priority}
        </Badge>
      </div>
    </div>
  );
}

function PreventivePlanCard({ plan }: { plan: SerializedPreventivePlan }) {
  const days = daysUntil(plan.nextDueDate);
  const isUrgent = days <= 2;

  return (
    <div className={S.planCard}>
      <span className={S.planIcon}>📅</span>
      <div className={S.planInfo}>
        <p className={S.planName}>
          {plan.name}
          {plan.machine && ` - ${plan.machine.name}`}
        </p>
        <p className={isUrgent ? S.planUrgent : S.planMeta}>
          Vence em: {formatDate(plan.nextDueDate)} ({days} {days === 1 ? 'dia' : 'dias'})
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function TorqueDashboardClient({
  userName,
  userRole,
  tenantSlug,
  stats,
  recentWorkOrders,
  dueSoonPlans,
}: TorqueDashboardClientProps) {
  const roleDisplayName = ROLE_DISPLAY_NAMES[userRole as UserRole] || userRole;
  const basePath = `/t/${tenantSlug}`;

  return (
    <div className={S.wrapper}>
      {/* Section 1: Greeting */}
      <div className={S.greetingSection}>
        <div className={S.greetingLeft}>
          <Heading as="h1">Ola, {userName}</Heading>
          <Badge variant="default">{roleDisplayName}</Badge>
        </div>
        <p className={S.greetingDate}>{getFormattedDate()}</p>
      </div>

      {/* Section 2: Stats */}
      <div className={S.statsGrid}>
        <StatCard label="OS Abertas" value={stats.assignedOpen} color="brand" />
        <StatCard label="Em Andamento" value={stats.inProgress} color="warning" />
        <StatCard label="Vencidas" value={stats.overdue} color="danger" />
        <StatCard label="Concluidas no mes" value={stats.completedThisMonth} color="success" />
      </div>

      {/* Section 3: Recent Work Orders */}
      <div className={S.recentSection}>
        <div className={S.sectionHeader}>
          <h2 className={S.sectionTitle}>OS Recentes</h2>
          <Link href={`${basePath}/minhas-os`} className={S.sectionLink}>
            Ver todas
          </Link>
        </div>
        {recentWorkOrders.length > 0 ? (
          <div className={S.woList}>
            {recentWorkOrders.map((wo) => (
              <Link
                key={wo._id}
                href={`${basePath}/minhas-os/${wo._id}`}
                className={S.woCardLink}
              >
                <RecentWOCard wo={wo} />
              </Link>
            ))}
          </div>
        ) : (
          <p className={S.emptyMessage}>Nenhuma OS atribuida a voce</p>
        )}
      </div>

      {/* Section 4: Preventive Plans */}
      <div className={S.plansSection}>
        <div className={S.sectionHeader}>
          <h2 className={S.sectionTitle}>Manutencoes Programadas</h2>
        </div>
        {dueSoonPlans.length > 0 ? (
          <div className={S.plansList}>
            {dueSoonPlans.map((plan) => (
              <PreventivePlanCard key={plan._id} plan={plan} />
            ))}
          </div>
        ) : (
          <p className={S.emptyMessage}>Nenhuma manutencao programada nos proximos 7 dias</p>
        )}
      </div>

      {/* Section 5: Quick Actions */}
      <div className={S.sectionHeader}>
        <h2 className={S.sectionTitle}>Acoes Rapidas</h2>
      </div>
      <div className={S.actionsGrid}>
        <Link href={`${basePath}/nova-solicitacao`} className={S.actionCard}>
          <span className={S.actionIcon}>➕</span>
          <span className={S.actionTitle}>Nova Solicitacao</span>
        </Link>
        <Link href={`${basePath}/minhas-os`} className={S.actionCard}>
          <span className={S.actionIcon}>📋</span>
          <span className={S.actionTitle}>Minhas OS</span>
          <span className={S.actionMeta}>{stats.assignedOpen + stats.inProgress} pendentes</span>
        </Link>
        <Link href={`${basePath}/maquinas`} className={S.actionCard}>
          <span className={S.actionIcon}>⚙️</span>
          <span className={S.actionTitle}>Maquinas</span>
          <span className={S.actionMeta}>{stats.totalMachines} equipamentos</span>
        </Link>
        <Link href={`${basePath}/config`} className={S.actionCard}>
          <span className={S.actionIcon}>🔧</span>
          <span className={S.actionTitle}>Configuracoes</span>
        </Link>
      </div>
    </div>
  );
}
