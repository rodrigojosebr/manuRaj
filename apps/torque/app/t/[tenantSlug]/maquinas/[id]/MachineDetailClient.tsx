'use client';

import Link from 'next/link';
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
    <Link
      href={`/t/${tenantSlug}/minhas-os/${wo._id}`}
      className={S.woCardLink}
    >
      <div className={S.woCard(wo.status)}>
        <p className={S.woDescription}>{truncate(wo.description, 80)}</p>
        <div className={S.woBadges}>
          <Badge variant={getStatusBadgeVariant(wo.status)}>
            {WORK_ORDER_STATUS_DISPLAY[wo.status] || wo.status}
          </Badge>
          <Badge variant={getPriorityBadgeVariant(wo.priority)}>
            {WORK_ORDER_PRIORITY_DISPLAY[wo.priority] || wo.priority}
          </Badge>
        </div>
        {wo.dueDate && (
          <p className={S.woMeta}>Prazo: {formatDate(wo.dueDate)}</p>
        )}
      </div>
    </Link>
  );
}

export function MachineDetailClient({ machine, workOrders, tenantSlug }: MachineDetailClientProps) {
  return (
    <div className={S.wrapper}>
      {/* Back link */}
      <Link href={`/t/${tenantSlug}/maquinas`} className={S.backLink}>
        &#8592; Voltar
      </Link>

      {/* Header */}
      <div className={S.header}>
        <div className={S.machineTitle}>{machine.name}</div>
        <div className={S.badges}>
          <Badge variant="default">{machine.code}</Badge>
          <Badge variant={getMachineStatusBadgeVariant(machine.status)}>
            {MACHINE_STATUS_DISPLAY[machine.status] || machine.status}
          </Badge>
        </div>
      </div>

      {/* Info section */}
      <div className={S.section}>
        <div className={S.sectionTitle}>Informacoes</div>
        <div className={S.infoGrid}>
          {machine.location && (
            <div className={S.infoRow}>
              <span className={S.infoIcon}>&#x1F4CD;</span>
              <div className={S.infoContent}>
                <div className={S.infoLabel}>Localizacao</div>
                <div className={S.infoValue}>{machine.location}</div>
              </div>
            </div>
          )}
          {machine.manufacturer && (
            <div className={S.infoRow}>
              <span className={S.infoIcon}>&#x1F3ED;</span>
              <div className={S.infoContent}>
                <div className={S.infoLabel}>Fabricante</div>
                <div className={S.infoValue}>{machine.manufacturer}</div>
              </div>
            </div>
          )}
          {machine.model && (
            <div className={S.infoRow}>
              <span className={S.infoIcon}>&#x1F4D0;</span>
              <div className={S.infoContent}>
                <div className={S.infoLabel}>Modelo</div>
                <div className={S.infoValue}>{machine.model}</div>
              </div>
            </div>
          )}
          {machine.serial && (
            <div className={S.infoRow}>
              <span className={S.infoIcon}>&#x1F522;</span>
              <div className={S.infoContent}>
                <div className={S.infoLabel}>Serial</div>
                <div className={S.infoValue}>{machine.serial}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent WOs */}
      <div className={S.section}>
        <div className={S.sectionTitle}>
          OS Recentes ({workOrders.length})
        </div>
        {workOrders.length > 0 ? (
          <div className={S.woList}>
            {workOrders.map((wo) => (
              <WOCard key={wo._id} wo={wo} tenantSlug={tenantSlug} />
            ))}
          </div>
        ) : (
          <p className={S.emptyMessage}>Nenhuma OS para esta maquina</p>
        )}
      </div>
    </div>
  );
}
