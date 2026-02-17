'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <S.Wrapper>
      {/* Back link */}
      <S.BackLink href={`/t/${tenantSlug}/minhas-os`}>
        <Icon icon="arrow-left" size="sm" /> Voltar
      </S.BackLink>

      {/* Header: machine + badges */}
      <S.Header>
        {wo.machine && (
          <S.MachineTitle>
            {wo.machine.name} ({wo.machine.code})
          </S.MachineTitle>
        )}
        <S.Badges>
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
        </S.Badges>
      </S.Header>

      {/* Description */}
      <S.Section>
        <S.SectionTitle>Descricao</S.SectionTitle>
        <S.DescriptionText>{wo.description}</S.DescriptionText>
      </S.Section>

      {/* Info */}
      <S.Section>
        <S.SectionTitle>Informacoes</S.SectionTitle>
        <S.InfoGrid>
          {wo.machine?.location && (
            <S.InfoRow>
              <S.InfoIcon icon="map-pin" size="md" />
              <S.InfoContent>
                <S.InfoLabel>Localizacao</S.InfoLabel>
                <S.InfoValue>{wo.machine.location}</S.InfoValue>
              </S.InfoContent>
            </S.InfoRow>
          )}

          <S.InfoRow>
            <S.InfoIcon icon="calendar" size="md" />
            <S.InfoContent>
              <S.InfoLabel>Prazo</S.InfoLabel>
              <S.InfoValue>
                {wo.dueDate ? (
                  <>
                    {formatDate(wo.dueDate)}
                    {wo.status !== 'completed' && wo.status !== 'cancelled' && (
                      overdue ? (
                        <S.OverdueWarning> (vencida)</S.OverdueWarning>
                      ) : (
                        <span> ({daysUntil(wo.dueDate)} dias)</span>
                      )
                    )}
                  </>
                ) : (
                  'Sem prazo'
                )}
              </S.InfoValue>
            </S.InfoContent>
          </S.InfoRow>

          {wo.assignedTo && (
            <S.InfoRow>
              <S.InfoIcon icon="user" size="md" />
              <S.InfoContent>
                <S.InfoLabel>Atribuido a</S.InfoLabel>
                <S.InfoValue>{wo.assignedTo.name}</S.InfoValue>
              </S.InfoContent>
            </S.InfoRow>
          )}

          <S.InfoRow>
            <S.InfoIcon icon="calendar" size="md" />
            <S.InfoContent>
              <S.InfoLabel>Criada em</S.InfoLabel>
              <S.InfoValue>{formatDate(wo.createdAt)}</S.InfoValue>
            </S.InfoContent>
          </S.InfoRow>

          {wo.startedAt && (
            <S.InfoRow>
              <S.InfoIcon icon="play" size="md" />
              <S.InfoContent>
                <S.InfoLabel>Iniciada em</S.InfoLabel>
                <S.InfoValue>{formatDate(wo.startedAt)}</S.InfoValue>
              </S.InfoContent>
            </S.InfoRow>
          )}
        </S.InfoGrid>
      </S.Section>

      {/* Completed result */}
      {wo.status === 'completed' && (
        <S.Section>
          <S.SectionTitle>Resultado</S.SectionTitle>
          <S.ResultGrid>
            {wo.finishedAt && (
              <S.ResultRow>
                <S.ResultIcon icon="check-circle" size="md" />
                <S.ResultLabel>Concluida em</S.ResultLabel>
                <S.ResultValue>{formatDate(wo.finishedAt)}</S.ResultValue>
              </S.ResultRow>
            )}
            {wo.timeSpentMin != null && wo.timeSpentMin > 0 && (
              <S.ResultRow>
                <S.ResultIcon icon="clock" size="md" />
                <S.ResultLabel>Tempo:</S.ResultLabel>
                <S.ResultValue>{formatMinutes(wo.timeSpentMin)}</S.ResultValue>
              </S.ResultRow>
            )}
            {wo.notes && (
              <S.ResultRow>
                <S.ResultIcon icon="file-text" size="md" />
                <S.ResultLabel>Notas:</S.ResultLabel>
                <S.ResultValue>{wo.notes}</S.ResultValue>
              </S.ResultRow>
            )}
          </S.ResultGrid>
        </S.Section>
      )}

      {/* Success banner */}
      {successMessage && (
        <S.SuccessBanner>{successMessage}</S.SuccessBanner>
      )}

      {/* Action area */}
      {wo.status !== 'completed' && wo.status !== 'cancelled' && (
        <S.ActionArea>
          {actionError && <S.ActionError>{actionError}</S.ActionError>}

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
                <S.Section>
                  <S.SectionTitle>Finalizar OS</S.SectionTitle>
                  <S.FinishForm>
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
                  </S.FinishForm>
                </S.Section>
              )}
            </>
          )}
        </S.ActionArea>
      )}
    </S.Wrapper>
  );
}
