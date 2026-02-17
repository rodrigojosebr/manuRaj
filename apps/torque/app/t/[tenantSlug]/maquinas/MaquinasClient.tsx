'use client';

import { useState } from 'react';
import {
  Heading,
  Badge,
  Card,
  Icon,
  getMachineStatusBadgeVariant,
  EmptyState,
} from '@pitkit';
import type { CardColorScheme } from '@pitkit';
import { MACHINE_STATUS_DISPLAY } from '@manuraj/domain';
import * as S from './page.styles';

interface SerializedMachine {
  _id: string;
  name: string;
  code: string;
  location: string;
  manufacturer: string;
  model: string;
  serial: string;
  status: string;
}

interface MaquinasClientProps {
  machines: SerializedMachine[];
  tenantSlug: string;
}

type TabFilter = 'all' | 'operational' | 'maintenance' | 'stopped';

const TABS: { key: TabFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'operational', label: 'Operacional' },
  { key: 'maintenance', label: 'Manutenção' },
  { key: 'stopped', label: 'Parada' },
];

function getMachineColorScheme(status: string): CardColorScheme {
  switch (status) {
    case 'operational': return 'success';
    case 'maintenance': return 'warning';
    case 'stopped': return 'danger';
    case 'decommissioned': return 'neutral';
    default: return 'neutral';
  }
}

function MachineCard({ machine: m }: { machine: SerializedMachine }) {
  return (
    <Card variant="outlined" colorScheme={getMachineColorScheme(m.status)} borderPosition="left" padding="md">
      <S.MachineHeader>
        <Icon icon="wrench" size="md" />
        <S.MachineName>{m.name}</S.MachineName>
      </S.MachineHeader>
      <S.MachineCode>{m.code}</S.MachineCode>
      {m.location && <S.MachineDetail><Icon icon="map-pin" size="xs" /> {m.location}</S.MachineDetail>}
      {(m.manufacturer || m.model) && (
        <S.MachineDetail>
          {[m.manufacturer, m.model].filter(Boolean).join(' \u2022 ')}
        </S.MachineDetail>
      )}
      <S.MachineBadgeRow>
        <Badge variant={getMachineStatusBadgeVariant(m.status)}>
          {MACHINE_STATUS_DISPLAY[m.status] || m.status}
        </Badge>
      </S.MachineBadgeRow>
    </Card>
  );
}

export function MaquinasClient({ machines, tenantSlug }: MaquinasClientProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const filtered = machines.filter((m) => {
    if (activeTab === 'all') return true;
    return m.status === activeTab;
  });

  return (
    <S.Wrapper>
      {/* Page header */}
      <S.PageHeader>
        <Heading as="h1">Máquinas</Heading>
        <S.Subtitle>
          {machines.length} {machines.length === 1 ? 'equipamento' : 'equipamentos'}
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
          {filtered.map((m) => (
            <S.CardLink
              key={m._id}
              href={`/t/${tenantSlug}/maquinas/${m._id}`}
            >
              <MachineCard machine={m} />
            </S.CardLink>
          ))}
        </S.CardList>
      ) : (
        <EmptyState
          icon="gear"
          title="Nenhuma máquina encontrada"
          description={
            activeTab === 'all'
              ? 'Nenhum equipamento cadastrado neste tenant.'
              : `Nenhuma máquina com status "${TABS.find((t) => t.key === activeTab)?.label}".`
          }
          size="md"
        />
      )}
    </S.Wrapper>
  );
}
