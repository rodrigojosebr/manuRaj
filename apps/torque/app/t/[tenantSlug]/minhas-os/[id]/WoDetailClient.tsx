'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Badge,
  Button,
  Icon,
  TextField,
  TextareaField,
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
} from '@pitkit';
import {
  WORK_ORDER_STATUS_DISPLAY,
  WORK_ORDER_TYPE_DISPLAY,
  WORK_ORDER_PRIORITY_DISPLAY,
  hasPermission,
  PERMISSIONS,
  type UserRole,
} from '@manuraj/domain';
import { formatDate, formatMinutes, daysUntil, isOverdue } from '@manuraj/shared-utils';
import { startWorkOrderAction, finishWorkOrderAction } from './actions';
import * as S from './page.styles';

export interface SerializedWorkOrderDetail {
  _id: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  dueDate: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  timeSpentMin: number | null;
  notes: string | null;
  partsUsed: { name: string; qty: number; unit?: string }[];
  machine: { name: string; code: string; location?: string } | null;
  assignedTo: { name: string } | null;
  createdAt: string;
}

interface WoDetailClientProps {
  workOrder: SerializedWorkOrderDetail;
  tenantSlug: string;
  userRole: string;
}

export function WoDetailClient({ workOrder: wo, tenantSlug, userRole }: WoDetailClientProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showFinishForm, setShowFinishForm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [timeSpentMin, setTimeSpentMin] = useState('');
  const [notes, setNotes] = useState('');

  const overdue = wo.status !== 'completed' && wo.status !== 'cancelled' && isOverdue(wo.dueDate);
  const canStart = hasPermission(userRole as UserRole, PERMISSIONS.WORK_ORDERS_START);
  const canFinish = hasPermission(userRole as UserRole, PERMISSIONS.WORK_ORDERS_FINISH);

  async function handleStart() {
    setIsStarting(true);
    setActionError(null);
    const result = await startWorkOrderAction(wo._id);
    setIsStarting(false);
    if (result.success) {
      setSuccessMessage('OS iniciada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
      router.refresh();
    } else {
      setActionError(result.error || 'Erro ao iniciar OS.');
    }
  }

  async function handleFinish() {
    setIsFinishing(true);
    setActionError(null);
    const data: { timeSpentMin?: number; notes?: string } = {};
    if (timeSpentMin) data.timeSpentMin = parseInt(timeSpentMin, 10);
    if (notes.trim()) data.notes = notes.trim();

    const result = await finishWorkOrderAction(wo._id, data);
    setIsFinishing(false);
    if (result.success) {
      setSuccessMessage('OS finalizada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowFinishForm(false);
      router.refresh();
    } else {
      setActionError(result.error || 'Erro ao finalizar OS.');
    }
  }

  return (
    <div className={S.wrapper}>
      {/* Back link */}
      <Link href={`/t/${tenantSlug}/minhas-os`} className={S.backLink}>
        <Icon icon="arrow-left" size="sm" /> Voltar
      </Link>

      {/* Header: machine + badges */}
      <div className={S.header}>
        {wo.machine && (
          <div className={S.machineTitle}>
            {wo.machine.name} ({wo.machine.code})
          </div>
        )}
        <div className={S.badges}>
          <Badge variant={getStatusBadgeVariant(wo.status)}>
            {WORK_ORDER_STATUS_DISPLAY[wo.status] || wo.status}
          </Badge>
          <Badge variant={wo.type === 'corrective' ? 'danger' : wo.type === 'preventive' ? 'info' : 'default'}>
            {WORK_ORDER_TYPE_DISPLAY[wo.type] || wo.type}
          </Badge>
          <Badge variant={getPriorityBadgeVariant(wo.priority)}>
            {WORK_ORDER_PRIORITY_DISPLAY[wo.priority] || wo.priority}
          </Badge>
          {overdue && <Badge variant="danger">Vencida</Badge>}
        </div>
      </div>

      {/* Description */}
      <div className={S.section}>
        <div className={S.sectionTitle}>Descricao</div>
        <p className={S.descriptionText}>{wo.description}</p>
      </div>

      {/* Info */}
      <div className={S.section}>
        <div className={S.sectionTitle}>Informacoes</div>
        <div className={S.infoGrid}>
          {wo.machine?.location && (
            <div className={S.infoRow}>
              <span className={S.infoIcon}><Icon icon="map-pin" size="md" /></span>
              <div className={S.infoContent}>
                <div className={S.infoLabel}>Localizacao</div>
                <div className={S.infoValue}>{wo.machine.location}</div>
              </div>
            </div>
          )}

          <div className={S.infoRow}>
            <span className={S.infoIcon}><Icon icon="calendar" size="md" /></span>
            <div className={S.infoContent}>
              <div className={S.infoLabel}>Prazo</div>
              <div className={S.infoValue}>
                {wo.dueDate ? (
                  <>
                    {formatDate(wo.dueDate)}
                    {wo.status !== 'completed' && wo.status !== 'cancelled' && (
                      overdue ? (
                        <span className={S.overdueWarning}> (vencida)</span>
                      ) : (
                        <span> ({daysUntil(wo.dueDate)} dias)</span>
                      )
                    )}
                  </>
                ) : (
                  'Sem prazo'
                )}
              </div>
            </div>
          </div>

          {wo.assignedTo && (
            <div className={S.infoRow}>
              <span className={S.infoIcon}><Icon icon="user" size="md" /></span>
              <div className={S.infoContent}>
                <div className={S.infoLabel}>Atribuido a</div>
                <div className={S.infoValue}>{wo.assignedTo.name}</div>
              </div>
            </div>
          )}

          <div className={S.infoRow}>
            <span className={S.infoIcon}><Icon icon="calendar" size="md" /></span>
            <div className={S.infoContent}>
              <div className={S.infoLabel}>Criada em</div>
              <div className={S.infoValue}>{formatDate(wo.createdAt)}</div>
            </div>
          </div>

          {wo.startedAt && (
            <div className={S.infoRow}>
              <span className={S.infoIcon}><Icon icon="play" size="md" /></span>
              <div className={S.infoContent}>
                <div className={S.infoLabel}>Iniciada em</div>
                <div className={S.infoValue}>{formatDate(wo.startedAt)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completed result */}
      {wo.status === 'completed' && (
        <div className={S.section}>
          <div className={S.sectionTitle}>Resultado</div>
          <div className={S.resultGrid}>
            {wo.finishedAt && (
              <div className={S.resultRow}>
                <span className={S.resultIcon}><Icon icon="check-circle" size="md" /></span>
                <span className={S.resultLabel}>Concluida em</span>
                <span className={S.resultValue}>{formatDate(wo.finishedAt)}</span>
              </div>
            )}
            {wo.timeSpentMin != null && wo.timeSpentMin > 0 && (
              <div className={S.resultRow}>
                <span className={S.resultIcon}><Icon icon="clock" size="md" /></span>
                <span className={S.resultLabel}>Tempo:</span>
                <span className={S.resultValue}>{formatMinutes(wo.timeSpentMin)}</span>
              </div>
            )}
            {wo.notes && (
              <div className={S.resultRow}>
                <span className={S.resultIcon}><Icon icon="file-text" size="md" /></span>
                <span className={S.resultLabel}>Notas:</span>
                <span className={S.resultValue}>{wo.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className={S.successBanner}>{successMessage}</div>
      )}

      {/* Action area */}
      {wo.status !== 'completed' && wo.status !== 'cancelled' && (
        <div className={S.actionArea}>
          {actionError && <div className={S.actionError}>{actionError}</div>}

          {/* Start button: show when assigned/open and user can start */}
          {(wo.status === 'assigned' || wo.status === 'open') && canStart && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isStarting}
              onClick={handleStart}
            >
              Iniciar OS
            </Button>
          )}

          {/* Finish: show when in_progress and user can finish */}
          {wo.status === 'in_progress' && canFinish && (
            <>
              {!showFinishForm ? (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setShowFinishForm(true)}
                >
                  Finalizar OS
                </Button>
              ) : (
                <div className={S.section}>
                  <div className={S.sectionTitle}>Finalizar OS</div>
                  <div className={S.finishForm}>
                    <TextField
                      label="Tempo gasto (minutos)"
                      type="number"
                      placeholder="Ex: 120"
                      value={timeSpentMin}
                      onChange={(e) => setTimeSpentMin(e.target.value)}
                    />
                    <TextareaField
                      label="Observacoes"
                      placeholder="Descreva o que foi feito..."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isFinishing}
                      onClick={handleFinish}
                    >
                      Confirmar Finalizacao
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
