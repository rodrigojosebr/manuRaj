'use client';

import {
  Badge,
  getMachineStatusBadgeVariant,
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
} from '@pitkit';
import {
  MACHINE_STATUS_DISPLAY,
  WORK_ORDER_STATUS_DISPLAY,
  WORK_ORDER_PRIORITY_DISPLAY,
} from '@manuraj/domain';
import { truncate, formatDate } from '@manuraj/shared-utils';
import * as S from './page.styles';

export interface SerializedMachineDetail {
  _id: string;
  name: string;
  code: string;
  location: string;
  manufacturer: string;
  model: string;
  serial: string;
  status: string;
}

export interface SerializedMachineWO {
  _id: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  dueDate: string | null;
  machine: { name: string; code: string } | null;
}

interface MachineDetailClientProps {
  machine: SerializedMachineDetail;
  workOrders: SerializedMachineWO[];
  tenantSlug: string;
}

function WOCard({ wo, tenantSlug }: { wo: SerializedMachineWO; tenantSlug: string }) {
  return (
    <S.WoCardLink href={`/t/${tenantSlug}/minhas-os/${wo._id}`}>
      <S.WoCard woStatus={wo.status as 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'}>
        <S.WoDescription>{truncate(wo.description, 80)}</S.WoDescription>
        <S.WoBadges>
          <Badge variant={getStatusBadgeVariant(wo.status)}>
            {WORK_ORDER_STATUS_DISPLAY[wo.status] || wo.status}
          </Badge>
          <Badge variant={getPriorityBadgeVariant(wo.priority)}>
            {WORK_ORDER_PRIORITY_DISPLAY[wo.priority] || wo.priority}
          </Badge>
        </S.WoBadges>
        {wo.dueDate && (
          <S.WoMeta>Prazo: {formatDate(wo.dueDate)}</S.WoMeta>
        )}
      </S.WoCard>
    </S.WoCardLink>
  );
}

export function MachineDetailClient({ machine, workOrders, tenantSlug }: MachineDetailClientProps) {
  return (
    <S.Wrapper>
      {/* Back link */}
      <S.BackLink href={`/t/${tenantSlug}/maquinas`}>
        <S.InfoIcon icon="arrow-left" size="sm" /> Voltar
      </S.BackLink>

      {/* Header */}
      <S.Header>
        <S.MachineTitle>{machine.name}</S.MachineTitle>
        <S.Badges>
          <Badge variant="default">{machine.code}</Badge>
          <Badge variant={getMachineStatusBadgeVariant(machine.status)}>
            {MACHINE_STATUS_DISPLAY[machine.status] || machine.status}
          </Badge>
        </S.Badges>
      </S.Header>

      {/* Info section */}
      <S.Section>
        <S.SectionTitle>Informacoes</S.SectionTitle>
        <S.InfoGrid>
          {machine.location && (
            <S.InfoRow>
              <S.InfoIcon icon="map-pin" size="md" />
              <S.InfoContent>
                <S.InfoLabel>Localizacao</S.InfoLabel>
                <S.InfoValue>{machine.location}</S.InfoValue>
              </S.InfoContent>
            </S.InfoRow>
          )}
          {machine.manufacturer && (
            <S.InfoRow>
              <S.InfoIcon icon="factory" size="md" />
              <S.InfoContent>
                <S.InfoLabel>Fabricante</S.InfoLabel>
                <S.InfoValue>{machine.manufacturer}</S.InfoValue>
              </S.InfoContent>
            </S.InfoRow>
          )}
          {machine.model && (
            <S.InfoRow>
              <S.InfoIcon icon="ruler" size="md" />
              <S.InfoContent>
                <S.InfoLabel>Modelo</S.InfoLabel>
                <S.InfoValue>{machine.model}</S.InfoValue>
              </S.InfoContent>
            </S.InfoRow>
          )}
          {machine.serial && (
            <S.InfoRow>
              <S.InfoIcon icon="hash" size="md" />
              <S.InfoContent>
                <S.InfoLabel>Serial</S.InfoLabel>
                <S.InfoValue>{machine.serial}</S.InfoValue>
              </S.InfoContent>
            </S.InfoRow>
          )}
        </S.InfoGrid>
      </S.Section>

      {/* Recent WOs */}
      <S.Section>
        <S.SectionTitle>
          OS Recentes ({workOrders.length})
        </S.SectionTitle>
        {workOrders.length > 0 ? (
          <S.WoList>
            {workOrders.map((wo) => (
              <WOCard key={wo._id} wo={wo} tenantSlug={tenantSlug} />
            ))}
          </S.WoList>
        ) : (
          <S.EmptyMessage>Nenhuma OS para esta maquina</S.EmptyMessage>
        )}
      </S.Section>
    </S.Wrapper>
  );
}
