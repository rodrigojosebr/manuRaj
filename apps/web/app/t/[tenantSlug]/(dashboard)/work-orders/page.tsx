'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { css } from '../../../../../../../styled-system/css';
import {
  Card,
  CardContent,
  Button,
  Input,
  Select,
  Badge,
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  SkeletonTable,
  Modal,
} from '@manuraj/ui';
import {
  WORK_ORDER_STATUS_DISPLAY,
  WORK_ORDER_TYPE_DISPLAY,
  WORK_ORDER_PRIORITY_DISPLAY,
} from '@manuraj/domain';
import { api, buildQueryString } from '@manuraj/shared-utils';
import { formatDate } from '@manuraj/shared-utils';

interface WorkOrder {
  _id: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  machineId: { _id: string; name: string; code: string } | string;
  assignedTo?: { _id: string; name: string } | string;
  dueDate?: string;
  createdAt: string;
}

interface Machine {
  _id: string;
  name: string;
  code: string;
}

export default function WorkOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantSlug = params.tenantSlug as string;

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const status = searchParams.get('status') || '';
  const type = searchParams.get('type') || '';

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const query = buildQueryString({ status, type });
      const response = await api.get<{ data: WorkOrder[] }>(`/api/work-orders${query}`);
      setWorkOrders(response.data);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [status, type]);

  return (
    <div>
      {/* Page header */}
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6' })}>
        <div>
          <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
            Ordens de Serviço
          </h1>
          <p className={css({ color: 'gray.600', marginTop: '1' })}>
            Gerencie as ordens de serviço
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + Nova OS
        </Button>
      </div>

      {/* Filters */}
      <Card className={css({ marginBottom: '4' })}>
        <CardContent>
          <div className={css({ display: 'flex', gap: '4', flexWrap: 'wrap' })}>
            <Select
              options={[
                { value: '', label: 'Todos os status' },
                { value: 'open', label: 'Aberta' },
                { value: 'assigned', label: 'Atribuída' },
                { value: 'in_progress', label: 'Em Andamento' },
                { value: 'completed', label: 'Concluída' },
                { value: 'cancelled', label: 'Cancelada' },
              ]}
              value={status}
              onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value) {
                  url.searchParams.set('status', e.target.value);
                } else {
                  url.searchParams.delete('status');
                }
                router.push(url.pathname + url.search);
              }}
            />
            <Select
              options={[
                { value: '', label: 'Todos os tipos' },
                { value: 'corrective', label: 'Corretiva' },
                { value: 'preventive', label: 'Preventiva' },
                { value: 'request', label: 'Solicitação' },
              ]}
              value={type}
              onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value) {
                  url.searchParams.set('type', e.target.value);
                } else {
                  url.searchParams.delete('type');
                }
                router.push(url.pathname + url.search);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Work orders table */}
      <Card padding="none">
        <CardContent className={css({ padding: 0 })}>
          {loading ? (
            <div className={css({ padding: '4' })}>
              <SkeletonTable rows={5} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Máquina</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prazo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.length === 0 ? (
                  <TableEmpty colSpan={6} message="Nenhuma ordem de serviço encontrada" />
                ) : (
                  workOrders.map((wo) => (
                    <TableRow
                      key={wo._id}
                      onClick={() => router.push(`/t/${tenantSlug}/work-orders/${wo._id}`)}
                    >
                      <TableCell>
                        <Badge variant="default">
                          {WORK_ORDER_TYPE_DISPLAY[wo.type] || wo.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={css({ display: 'block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>
                          {wo.description}
                        </span>
                      </TableCell>
                      <TableCell>
                        {typeof wo.machineId === 'object' && wo.machineId.code
                          ? `${wo.machineId.code} - ${wo.machineId.name}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(wo.priority)}>
                          {WORK_ORDER_PRIORITY_DISPLAY[wo.priority] || wo.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(wo.status)}>
                          {WORK_ORDER_STATUS_DISPLAY[wo.status] || wo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{wo.dueDate ? formatDate(wo.dueDate) : '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Work Order Modal */}
      <CreateWorkOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchWorkOrders();
        }}
      />
    </div>
  );
}

interface CreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateWorkOrderModal({ isOpen, onClose, onSuccess }: CreateWorkOrderModalProps) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [machineId, setMachineId] = useState('');
  const [type, setType] = useState('corrective');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get<{ data: Machine[] }>('/api/machines').then((response) => {
        setMachines(response.data);
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/work-orders', {
        machineId,
        type,
        priority,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      onSuccess();
      // Reset form
      setMachineId('');
      setType('corrective');
      setPriority('medium');
      setDescription('');
      setDueDate('');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao criar ordem de serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Ordem de Serviço" size="lg">
      <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Select
          label="Máquina *"
          value={machineId}
          onChange={(e) => setMachineId(e.target.value)}
          placeholder="Selecione uma máquina"
          options={machines.map((m) => ({
            value: m._id,
            label: `${m.code} - ${m.name}`,
          }))}
          required
        />
        <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4' })}>
          <Select
            label="Tipo *"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'corrective', label: 'Corretiva' },
              { value: 'preventive', label: 'Preventiva' },
              { value: 'request', label: 'Solicitação' },
            ]}
          />
          <Select
            label="Prioridade *"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' },
              { value: 'critical', label: 'Crítica' },
            ]}
          />
        </div>
        <Input
          label="Prazo"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div>
          <label className={css({ display: 'block', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700', marginBottom: '1' })}>
            Descrição *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o problema ou serviço necessário..."
            required
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

        {error && (
          <p className={css({ color: 'danger.500', fontSize: 'sm' })}>{error}</p>
        )}

        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2', marginTop: '2' })}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading}>
            Criar OS
          </Button>
        </div>
      </form>
    </Modal>
  );
}
