'use client';

import { useState } from 'react';
import {
  Heading,
  Text,
  Badge,
  Card,
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
      <div className={S.machineHeader}>
        <span>&#x1F527;</span>
        <span className={S.machineName}>{m.name}</span>
      </div>
      <p className={S.machineCode}>{m.code}</p>
      {m.location && <p className={S.machineDetail}>&#x1F4CD; {m.location}</p>}
      {(m.manufacturer || m.model) && (
        <p className={S.machineDetail}>
          {[m.manufacturer, m.model].filter(Boolean).join(' \u2022 ')}
        </p>
      )}
      <div className={S.machineBadgeRow}>
        <Badge variant={getMachineStatusBadgeVariant(m.status)}>
          {MACHINE_STATUS_DISPLAY[m.status] || m.status}
        </Badge>
      </div>
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
    <div className={S.wrapper}>
      {/* Page header */}
      <div className={S.pageHeader}>
        <Heading as="h1">Máquinas</Heading>
        <Text size="sm" className={S.subtitle}>
          {machines.length} {machines.length === 1 ? 'equipamento' : 'equipamentos'}
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
          {filtered.map((m) => (
            <MachineCard key={m._id} machine={m} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="&#x2699;&#xFE0F;"
          title="Nenhuma máquina encontrada"
          description={
            activeTab === 'all'
              ? 'Nenhum equipamento cadastrado neste tenant.'
              : `Nenhuma máquina com status "${TABS.find((t) => t.key === activeTab)?.label}".`
          }
          size="md"
        />
      )}
    </div>
  );
}
