'use client';

import { useState } from 'react';
import {
  Heading,
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
type WoStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

const TABS: { key: TabFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'assigned', label: 'Atribuidas' },
  { key: 'in_progress', label: 'Em Andamento' },
  { key: 'completed', label: 'Concluidas' },
];

function WorkOrderCard({ wo }: { wo: SerializedWorkOrder }) {
  const overdue = wo.status !== 'completed' && wo.status !== 'cancelled' && isOverdue(wo.dueDate);

  return (
    <S.Card woStatus={wo.status as WoStatus} overdue={overdue}>
      {/* Machine info */}
      {wo.machine && (
        <S.CardMachine>
          <S.CardMachineIcon><Icon icon="wrench" size="sm" /></S.CardMachineIcon>
          <S.CardMachineText>
            {wo.machine.name} ({wo.machine.code})
          </S.CardMachineText>
        </S.CardMachine>
      )}

      {/* Description */}
      <S.CardDescription>
        {truncate(wo.description, 80)}
      </S.CardDescription>

      {/* Badges: type + priority */}
      <S.CardBadges>
        <Badge variant={wo.type === 'corrective' ? 'danger' : wo.type === 'preventive' ? 'info' : 'default'}>
          {WORK_ORDER_TYPE_DISPLAY[wo.type] || wo.type}
        </Badge>
        <Badge variant={getPriorityBadgeVariant(wo.priority)}>
          {WORK_ORDER_PRIORITY_DISPLAY[wo.priority] || wo.priority}
        </Badge>
        {overdue && <Badge variant="danger">Vencida</Badge>}
      </S.CardBadges>

      {/* Meta: due date + time spent */}
      <S.CardMeta>
        {overdue ? (
          <S.OverdueIndicator>
            {wo.dueDate ? `Prazo: ${formatDate(wo.dueDate)}` : 'Sem prazo'}
          </S.OverdueIndicator>
        ) : (
          <span>
            {wo.dueDate ? `Prazo: ${formatDate(wo.dueDate)}` : 'Sem prazo'}
          </span>
        )}
        <span>
          {wo.timeSpentMin ? `${formatMinutes(wo.timeSpentMin)}` : ''}
        </span>
      </S.CardMeta>

      {/* Status bar */}
      <S.StatusBar woStatus={wo.status as WoStatus}>
        {WORK_ORDER_STATUS_DISPLAY[wo.status] || wo.status}
      </S.StatusBar>
    </S.Card>
  );
}

export function MinhasOsClient({ workOrders, tenantSlug }: MinhasOsClientProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const filtered = workOrders.filter((wo) => {
    if (activeTab === 'all') return wo.status !== 'cancelled';
    return wo.status === activeTab;
  });

  return (
    <S.Wrapper>
      {/* Page header */}
      <S.PageHeader>
        <Heading as="h1">Minhas OS</Heading>
        <S.Subtitle>
          {workOrders.length} {workOrders.length === 1 ? 'ordem de servico' : 'ordens de servico'}
        </S.Subtitle>
      </S.PageHeader>

      {/* Filter tabs */}
      <S.TabsContainer>
        {TABS.map((t) => (
          <S.Tab
            key={t.key}
            active={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </S.Tab>
        ))}
      </S.TabsContainer>

      {/* Card list */}
      {filtered.length > 0 ? (
        <S.CardList>
          {filtered.map((wo) => (
            <S.CardLink
              key={wo._id}
              href={`/t/${tenantSlug}/minhas-os/${wo._id}`}
            >
              <WorkOrderCard wo={wo} />
            </S.CardLink>
          ))}
        </S.CardList>
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
    </S.Wrapper>
  );
}
