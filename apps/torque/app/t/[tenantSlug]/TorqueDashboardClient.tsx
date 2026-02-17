'use client';

import { Heading, Badge, Icon, getPriorityBadgeVariant, getStatusBadgeVariant } from '@pitkit';
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

type WoStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

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
    <S.StatCard colorScheme={color}>
      <S.StatValue colorScheme={color}>{value}</S.StatValue>
      <S.StatLabel>{label}</S.StatLabel>
    </S.StatCard>
  );
}

function RecentWOCard({ wo }: { wo: SerializedWorkOrder }) {
  return (
    <S.WoCard woStatus={wo.status as WoStatus}>
      {wo.machine && (
        <S.WoMachine>
          {wo.machine.name} ({wo.machine.code})
        </S.WoMachine>
      )}
      <S.WoDescription>{truncate(wo.description, 80)}</S.WoDescription>
      <S.WoBadges>
        <Badge variant={getStatusBadgeVariant(wo.status)}>
          {WORK_ORDER_STATUS_DISPLAY[wo.status] || wo.status}
        </Badge>
        <Badge variant={getPriorityBadgeVariant(wo.priority)}>
          {WORK_ORDER_PRIORITY_DISPLAY[wo.priority] || wo.priority}
        </Badge>
      </S.WoBadges>
    </S.WoCard>
  );
}

function PreventivePlanCard({ plan }: { plan: SerializedPreventivePlan }) {
  const days = daysUntil(plan.nextDueDate);
  const isUrgent = days <= 2;

  return (
    <S.PlanCard>
      <S.PlanIcon><Icon icon="calendar" size="md" /></S.PlanIcon>
      <S.PlanInfo>
        <S.PlanName>
          {plan.name}
          {plan.machine && ` - ${plan.machine.name}`}
        </S.PlanName>
        {isUrgent ? (
          <S.PlanUrgent>
            Vence em: {formatDate(plan.nextDueDate)} ({days} {days === 1 ? 'dia' : 'dias'})
          </S.PlanUrgent>
        ) : (
          <S.PlanMeta>
            Vence em: {formatDate(plan.nextDueDate)} ({days} {days === 1 ? 'dia' : 'dias'})
          </S.PlanMeta>
        )}
      </S.PlanInfo>
    </S.PlanCard>
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
    <S.Wrapper>
      {/* Section 1: Greeting */}
      <S.GreetingSection>
        <S.GreetingLeft>
          <Heading as="h1">Ola, {userName}</Heading>
          <Badge variant="default">{roleDisplayName}</Badge>
        </S.GreetingLeft>
        <S.GreetingDate>{getFormattedDate()}</S.GreetingDate>
      </S.GreetingSection>

      {/* Section 2: Stats */}
      <S.StatsGrid>
        <StatCard label="OS Abertas" value={stats.assignedOpen} color="brand" />
        <StatCard label="Em Andamento" value={stats.inProgress} color="warning" />
        <StatCard label="Vencidas" value={stats.overdue} color="danger" />
        <StatCard label="Concluidas no mes" value={stats.completedThisMonth} color="success" />
      </S.StatsGrid>

      {/* Section 3: Recent Work Orders */}
      <S.RecentSection>
        <S.SectionHeader>
          <S.SectionTitle>OS Recentes</S.SectionTitle>
          <S.SectionLink href={`${basePath}/minhas-os`}>
            Ver todas
          </S.SectionLink>
        </S.SectionHeader>
        {recentWorkOrders.length > 0 ? (
          <S.WoList>
            {recentWorkOrders.map((wo) => (
              <S.WoCardLink key={wo._id} href={`${basePath}/minhas-os/${wo._id}`}>
                <RecentWOCard wo={wo} />
              </S.WoCardLink>
            ))}
          </S.WoList>
        ) : (
          <S.EmptyMessage>Nenhuma OS atribuida a voce</S.EmptyMessage>
        )}
      </S.RecentSection>

      {/* Section 4: Preventive Plans */}
      <S.PlansSection>
        <S.SectionHeader>
          <S.SectionTitle>Manutencoes Programadas</S.SectionTitle>
        </S.SectionHeader>
        {dueSoonPlans.length > 0 ? (
          <S.PlansList>
            {dueSoonPlans.map((plan) => (
              <PreventivePlanCard key={plan._id} plan={plan} />
            ))}
          </S.PlansList>
        ) : (
          <S.EmptyMessage>Nenhuma manutencao programada nos proximos 7 dias</S.EmptyMessage>
        )}
      </S.PlansSection>

      {/* Section 5: Quick Actions */}
      <S.SectionHeader>
        <S.SectionTitle>Acoes Rapidas</S.SectionTitle>
      </S.SectionHeader>
      <S.ActionsGrid>
        <S.ActionCard href={`${basePath}/nova-solicitacao`}>
          <S.ActionIcon><Icon icon="plus-circle" size="lg" /></S.ActionIcon>
          <S.ActionTitle>Nova Solicitacao</S.ActionTitle>
        </S.ActionCard>
        <S.ActionCard href={`${basePath}/minhas-os`}>
          <S.ActionIcon><Icon icon="clipboard" size="lg" /></S.ActionIcon>
          <S.ActionTitle>Minhas OS</S.ActionTitle>
          <S.ActionMeta>{stats.assignedOpen + stats.inProgress} pendentes</S.ActionMeta>
        </S.ActionCard>
        <S.ActionCard href={`${basePath}/maquinas`}>
          <S.ActionIcon><Icon icon="gear" size="lg" /></S.ActionIcon>
          <S.ActionTitle>Maquinas</S.ActionTitle>
          <S.ActionMeta>{stats.totalMachines} equipamentos</S.ActionMeta>
        </S.ActionCard>
        <S.ActionCard href={`${basePath}/config`}>
          <S.ActionIcon><Icon icon="wrench" size="lg" /></S.ActionIcon>
          <S.ActionTitle>Configuracoes</S.ActionTitle>
        </S.ActionCard>
      </S.ActionsGrid>
    </S.Wrapper>
  );
}
