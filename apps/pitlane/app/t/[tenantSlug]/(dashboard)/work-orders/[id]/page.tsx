'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { css } from '../../../../../../../../styled-system/css';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  Badge,
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
  Modal,
  Skeleton,
} from '@pitkit';
import {
  WORK_ORDER_STATUS_DISPLAY,
  WORK_ORDER_TYPE_DISPLAY,
  WORK_ORDER_PRIORITY_DISPLAY,
} from '@manuraj/domain';
import { api, formatDate, formatDateTime } from '@manuraj/shared-utils';

interface WorkOrder {
  _id: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  machineId: { _id: string; name: string; code: string };
  assignedTo?: { _id: string; name: string };
  dueDate?: string;
  startedAt?: string;
  finishedAt?: string;
  timeSpentMin?: number;
  partsUsed?: { name: string; qty: number; unit?: string }[];
  notes?: string;
  createdBy: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  role: string;
}

export default function WorkOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug as string;
  const workOrderId = params.id as string;

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWorkOrder = async () => {
    try {
      const response = await api.get<{ data: WorkOrder }>(`/api/work-orders/${workOrderId}`);
      setWorkOrder(response.data);
    } catch (error) {
      console.error('Error fetching work order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrder();
  }, [workOrderId]);

  const handleStart = async () => {
    setActionLoading(true);
    try {
      await api.post(`/api/work-orders/${workOrderId}/start`, {});
      fetchWorkOrder();
    } catch (error) {
      console.error('Error starting work order:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/work-orders/${workOrderId}`);
      router.push(`/t/${tenantSlug}/work-orders`);
    } catch (error) {
      console.error('Error deleting work order:', error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return `${hours}h ${mins}min`;
  };

  if (loading) {
    return (
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
        <Skeleton height="40px" width="300px" />
        <Card>
          <CardContent>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height="24px" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className={css({ textAlign: 'center', padding: '12' })}>
        <p className={css({ color: 'gray.500' })}>Ordem de serviço não encontrada</p>
        <Link href={`/t/${tenantSlug}/work-orders`}>
          <Button variant="link" className={css({ marginTop: '4' })}>
            Voltar para ordens de serviço
          </Button>
        </Link>
      </div>
    );
  }

  const canStart = workOrder.status === 'assigned';
  const canFinish = workOrder.status === 'in_progress';
  const canAssign = workOrder.status === 'open' || workOrder.status === 'assigned';

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
      {/* Header */}
      <div className={css({ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' })}>
        <div>
          <div className={css({ display: 'flex', alignItems: 'center', gap: '3', marginBottom: '2' })}>
            <Link href={`/t/${tenantSlug}/work-orders`} className={css({ color: 'gray.500', _hover: { color: 'gray.700' } })}>
              Ordens de Serviço
            </Link>
            <span className={css({ color: 'gray.400' })}>/</span>
            <Badge variant="default">
              {WORK_ORDER_TYPE_DISPLAY[workOrder.type]}
            </Badge>
            <Badge variant={getStatusBadgeVariant(workOrder.status)}>
              {WORK_ORDER_STATUS_DISPLAY[workOrder.status]}
            </Badge>
            <Badge variant={getPriorityBadgeVariant(workOrder.priority)}>
              {WORK_ORDER_PRIORITY_DISPLAY[workOrder.priority]}
            </Badge>
          </div>
          <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
            OS #{workOrder._id.slice(-6).toUpperCase()}
          </h1>
        </div>
        <div className={css({ display: 'flex', gap: '2' })}>
          {canAssign && (
            <Button variant="secondary" onClick={() => setShowAssignModal(true)}>
              Atribuir
            </Button>
          )}
          {canStart && (
            <Button onClick={handleStart} isLoading={actionLoading}>
              Iniciar
            </Button>
          )}
          {canFinish && (
            <Button onClick={() => setShowFinishModal(true)}>
              Finalizar
            </Button>
          )}
        </div>
      </div>

      <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', lg: '2fr 1fr' }, gap: '6' })}>
        {/* Main Info */}
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={css({ color: 'gray.700', whiteSpace: 'pre-wrap' })}>
                {workOrder.description}
              </p>
            </CardContent>
          </Card>

          {/* Machine Info */}
          <Card>
            <CardHeader>
              <CardTitle>Máquina</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/t/${tenantSlug}/machines/${workOrder.machineId._id}`}
                className={css({ display: 'flex', alignItems: 'center', gap: '3', padding: '3', borderRadius: 'md', backgroundColor: 'gray.50', _hover: { backgroundColor: 'gray.100' } })}
              >
                <div className={css({ width: '48px', height: '48px', borderRadius: 'md', backgroundColor: 'brand.100', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'brand.600', fontWeight: 'bold' })}>
                  {workOrder.machineId.code.substring(0, 3)}
                </div>
                <div>
                  <p className={css({ fontWeight: 'medium', color: 'gray.900' })}>{workOrder.machineId.code}</p>
                  <p className={css({ fontSize: 'sm', color: 'gray.500' })}>{workOrder.machineId.name}</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Notes */}
          {workOrder.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={css({ color: 'gray.700', whiteSpace: 'pre-wrap' })}>
                  {workOrder.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Parts Used */}
          {workOrder.partsUsed && workOrder.partsUsed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Peças Utilizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
                  {workOrder.partsUsed.map((part, index) => (
                    <div key={index} className={css({ display: 'flex', justifyContent: 'space-between', padding: '2', borderRadius: 'md', backgroundColor: 'gray.50' })}>
                      <span className={css({ color: 'gray.700' })}>{part.name}</span>
                      <span className={css({ fontWeight: 'medium', color: 'gray.900' })}>
                        {part.qty} {part.unit || 'un'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
                <InfoItem label="Criado por" value={workOrder.createdBy?.name || '-'} />
                <InfoItem label="Atribuído para" value={workOrder.assignedTo?.name || 'Não atribuído'} />
                <InfoItem label="Prazo" value={workOrder.dueDate ? formatDate(workOrder.dueDate) : 'Sem prazo'} />
                <InfoItem label="Criado em" value={formatDateTime(workOrder.createdAt)} />
                {workOrder.startedAt && (
                  <InfoItem label="Iniciado em" value={formatDateTime(workOrder.startedAt)} />
                )}
                {workOrder.finishedAt && (
                  <InfoItem label="Finalizado em" value={formatDateTime(workOrder.finishedAt)} />
                )}
                {workOrder.timeSpentMin !== undefined && (
                  <InfoItem label="Tempo gasto" value={formatDuration(workOrder.timeSpentMin)} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
                <Button variant="secondary" size="sm" onClick={() => router.push(`/t/${tenantSlug}/work-orders`)}>
                  Voltar para lista
                </Button>
                {workOrder.status !== 'completed' && workOrder.status !== 'cancelled' && (
                  <Button variant="danger" size="sm" onClick={handleDelete}>
                    Cancelar OS
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Modal */}
      <AssignModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        workOrderId={workOrderId}
        onSuccess={() => {
          setShowAssignModal(false);
          fetchWorkOrder();
        }}
      />

      {/* Finish Modal */}
      <FinishModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        workOrderId={workOrderId}
        onSuccess={() => {
          setShowFinishModal(false);
          fetchWorkOrder();
        }}
      />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
      <dt className={css({ fontSize: 'sm', color: 'gray.500' })}>{label}</dt>
      <dd className={css({ fontWeight: 'medium', color: 'gray.900', textAlign: 'right' })}>{value}</dd>
    </div>
  );
}

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSuccess: () => void;
}

function AssignModal({ isOpen, onClose, workOrderId, onSuccess }: AssignModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get<{ data: User[] }>('/api/users').then((response) => {
        // Filter only maintainers and supervisors
        const eligibleUsers = response.data.filter(
          (u) => u.role === 'maintainer' || u.role === 'maintenance_supervisor' || u.role === 'general_supervisor'
        );
        setUsers(eligibleUsers);
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post(`/api/work-orders/${workOrderId}/assign`, { assignedTo });
      onSuccess();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao atribuir');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Atribuir Ordem de Serviço" size="sm">
      <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Select
          label="Atribuir para *"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Selecione um usuário"
          options={users.map((u) => ({ value: u._id, label: u.name }))}
          required
        />
        {error && <p className={css({ color: 'danger.500', fontSize: 'sm' })}>{error}</p>}
        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2' })}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={loading}>Atribuir</Button>
        </div>
      </form>
    </Modal>
  );
}

interface FinishModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSuccess: () => void;
}

function FinishModal({ isOpen, onClose, workOrderId, onSuccess }: FinishModalProps) {
  const [timeSpentMin, setTimeSpentMin] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post(`/api/work-orders/${workOrderId}/finish`, {
        timeSpentMin: timeSpentMin ? parseInt(timeSpentMin, 10) : undefined,
        notes: notes || undefined,
      });
      onSuccess();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao finalizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Finalizar Ordem de Serviço" size="md">
      <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Input
          label="Tempo gasto (minutos)"
          type="number"
          placeholder="Ex: 120"
          value={timeSpentMin}
          onChange={(e) => setTimeSpentMin(e.target.value)}
        />
        <div>
          <label className={css({ display: 'block', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700', marginBottom: '1' })}>
            Observações finais
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Descreva o que foi feito..."
            className={css({
              width: '100%',
              minHeight: '100px',
              padding: '3',
              fontSize: 'sm',
              borderRadius: 'md',
              border: '1px solid',
              borderColor: 'gray.300',
              resize: 'vertical',
              _focus: {
                outline: 'none',
                borderColor: 'brand.500',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              },
            })}
          />
        </div>
        {error && <p className={css({ color: 'danger.500', fontSize: 'sm' })}>{error}</p>}
        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2' })}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={loading}>Finalizar</Button>
        </div>
      </form>
    </Modal>
  );
}
