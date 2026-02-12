'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heading,
  Text,
  Badge,
  Icon,
  getPriorityBadgeVariant,
  EmptyState,
} from '@pitkit';
import {
  WORK_ORDER_STATUS_DISPLAY,
  WORK_ORDER_TYPE_DISPLAY,
  WORK_ORDER_PRIORITY_DISPLAY,
} from '@manuraj/domain';
import { formatDate, formatMinutes, isOverdue, truncate } from '@manuraj/shared-utils';
import * as S from './page.styles';

interface SerializedWorkOrder {
  _id: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  dueDate: string | null;
  startedAt: string | null;
  timeSpentMin: number | null;
  machine: { name: string; code: string } | null;
}

interface MinhasOsClientProps {
  workOrders: SerializedWorkOrder[];
  tenantSlug: string;
}

type TabFilter = 'all' | 'assigned' | 'in_progress' | 'completed';

const TABS: { key: TabFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'assigned', label: 'Atribuidas' },
  { key: 'in_progress', label: 'Em Andamento' },
  { key: 'completed', label: 'Concluidas' },
];

function WorkOrderCard({ wo }: { wo: SerializedWorkOrder }) {
  const overdue = wo.status !== 'completed' && wo.status !== 'cancelled' && isOverdue(wo.dueDate);

  return (
    <div className={`${S.card(wo.status)} ${overdue ? S.cardOverdue : ''}`}>
      {/* Machine info */}
      {wo.machine && (
        <div className={S.cardMachine}>
          <span className={S.cardMachineIcon}><Icon icon="wrench" size="sm" /></span>
          <span className={S.cardMachineText}>
            {wo.machine.name} ({wo.machine.code})
          </span>
        </div>
      )}

      {/* Description */}
      <p className={S.cardDescription}>
        {truncate(wo.description, 80)}
      </p>

      {/* Badges: type + priority */}
      <div className={S.cardBadges}>
        <Badge variant={wo.type === 'corrective' ? 'danger' : wo.type === 'preventive' ? 'info' : 'default'}>
          {WORK_ORDER_TYPE_DISPLAY[wo.type] || wo.type}
        </Badge>
        <Badge variant={getPriorityBadgeVariant(wo.priority)}>
          {WORK_ORDER_PRIORITY_DISPLAY[wo.priority] || wo.priority}
        </Badge>
        {overdue && <Badge variant="danger">Vencida</Badge>}
      </div>

      {/* Meta: due date + time spent */}
      <div className={S.cardMeta}>
        <span className={overdue ? S.overdueIndicator : ''}>
          {wo.dueDate ? `Prazo: ${formatDate(wo.dueDate)}` : 'Sem prazo'}
        </span>
        <span>
          {wo.timeSpentMin ? `${formatMinutes(wo.timeSpentMin)}` : ''}
        </span>
      </div>

      {/* Status bar */}
      <div className={S.statusBar(wo.status)}>
        {WORK_ORDER_STATUS_DISPLAY[wo.status] || wo.status}
      </div>
    </div>
  );
}

export function MinhasOsClient({ workOrders, tenantSlug }: MinhasOsClientProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const filtered = workOrders.filter((wo) => {
    if (activeTab === 'all') return wo.status !== 'cancelled';
    return wo.status === activeTab;
  });

  return (
    <div className={S.wrapper}>
      {/* Page header */}
      <div className={S.pageHeader}>
        <Heading as="h1">Minhas OS</Heading>
        <Text size="sm" className={S.subtitle}>
          {workOrders.length} {workOrders.length === 1 ? 'ordem de servico' : 'ordens de servico'}
        </Text>
      </div>

      {/* Filter tabs */}
      <div className={S.tabsContainer}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={S.tab(activeTab === t.key)}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Card list */}
      {filtered.length > 0 ? (
        <div className={S.cardList}>
          {filtered.map((wo) => (
            <Link
              key={wo._id}
              href={`/t/${tenantSlug}/minhas-os/${wo._id}`}
              className={S.cardLink}
            >
              <WorkOrderCard wo={wo} />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="clipboard"
          title="Nenhuma OS encontrada"
          description={
            activeTab === 'all'
              ? 'Voce nao possui ordens de servico atribuidas.'
              : `Nenhuma OS com status "${TABS.find((t) => t.key === activeTab)?.label}".`
          }
          size="md"
        />
      )}
    </div>
  );
}
