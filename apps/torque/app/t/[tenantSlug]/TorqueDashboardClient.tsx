'use client';

import Link from 'next/link';
import { Heading, Text } from '@pitkit';
import * as S from './page.styles';

interface DashboardStats {
  assignedOpen: number;
  inProgress: number;
  overdue: number;
}

interface TorqueDashboardClientProps {
  userName: string;
  tenantSlug: string;
  stats: DashboardStats;
}

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

function QuickActionCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link href={href} className={S.actionCard}>
      <span className={S.actionIcon}>{icon}</span>
      <div>
        <p className={S.actionTitle}>{title}</p>
        <p className={S.actionDescription}>{description}</p>
      </div>
    </Link>
  );
}

export function TorqueDashboardClient({ userName, tenantSlug, stats }: TorqueDashboardClientProps) {
  return (
    <div className={S.wrapper}>
      {/* Greeting */}
      <div className={S.greetingSection}>
        <Text size="sm" color="muted">Bem-vindo</Text>
        <Heading as="h1">Olá, {userName}</Heading>
      </div>

      {/* Quick Stats */}
      <div className={S.statsGrid}>
        <StatCard label="Minhas OS Abertas" value={stats.assignedOpen} color="brand" />
        <StatCard label="Em Andamento" value={stats.inProgress} color="warning" />
        <StatCard label="Vencidas" value={stats.overdue} color="danger" />
      </div>

      {/* Quick Actions */}
      <h2 className={S.actionsTitle}>Ações Rápidas</h2>

      <div className={S.actionsList}>
        <QuickActionCard
          href={`/t/${tenantSlug}/minhas-os`}
          title="Ver Minhas OS"
          description="Ordens de serviço atribuídas a você"
          icon="📋"
        />
        <QuickActionCard
          href={`/t/${tenantSlug}/nova-solicitacao`}
          title="Abrir Solicitação"
          description="Reportar problema em máquina"
          icon="➕"
        />
        <QuickActionCard
          href={`/t/${tenantSlug}/maquinas`}
          title="Consultar Máquinas"
          description="Ver lista de equipamentos"
          icon="⚙️"
        />
      </div>
    </div>
  );
}
