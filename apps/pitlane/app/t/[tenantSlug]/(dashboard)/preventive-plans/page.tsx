'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { css } from '../../../../../../../styled-system/css';
import {
  Card,
  CardContent,
  Button,
  Input,
  Select,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  SkeletonTable,
  Modal,
} from '@pitkit';
import { api, formatDate } from '@manuraj/shared-utils';

interface PreventivePlan {
  _id: string;
  name: string;
  machineId: { _id: string; name: string; code: string };
  periodicityDays: number;
  checklistItems: { label: string; required: boolean }[];
  nextDueDate: string;
  active: boolean;
  createdAt: string;
}

interface Machine {
  _id: string;
  name: string;
  code: string;
}

export default function PreventivePlansPage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug as string;

  const [plans, setPlans] = useState<PreventivePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ data: PreventivePlan[] }>('/api/preventive-plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const getDueBadgeVariant = (nextDueDate: string) => {
    const due = new Date(nextDueDate);
    const today = new Date();
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'danger';
    if (diffDays <= 7) return 'warning';
    return 'success';
  };

  const getDueText = (nextDueDate: string) => {
    const due = new Date(nextDueDate);
    const today = new Date();
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrasado`;
    if (diffDays === 0) return 'Vence hoje';
    if (diffDays === 1) return 'Vence amanhã';
    return `Em ${diffDays} dias`;
  };

  return (
    <div>
      {/* Page header */}
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6' })}>
        <div>
          <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
            Planos Preventivos
          </h1>
          <p className={css({ color: 'gray.600', marginTop: '1' })}>
            Gerencie os planos de manutenção preventiva
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + Novo Plano
        </Button>
      </div>

      {/* Plans table */}
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Máquina</TableHead>
                  <TableHead>Periodicidade</TableHead>
                  <TableHead>Próximo Vencimento</TableHead>
                  <TableHead>Checklist</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length === 0 ? (
                  <TableEmpty colSpan={6} message="Nenhum plano preventivo cadastrado" />
                ) : (
                  plans.map((plan) => (
                    <TableRow
                      key={plan._id}
                      onClick={() => router.push(`/t/${tenantSlug}/preventive-plans/${plan._id}`)}
                    >
                      <TableCell>
                        <span className={css({ fontWeight: 'medium', color: 'gray.900' })}>
                          {plan.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        {plan.machineId?.code} - {plan.machineId?.name}
                      </TableCell>
                      <TableCell>
                        A cada {plan.periodicityDays} dias
                      </TableCell>
                      <TableCell>
                        <div className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}>
                          <span>{formatDate(plan.nextDueDate)}</span>
                          <Badge variant={getDueBadgeVariant(plan.nextDueDate)}>
                            {getDueText(plan.nextDueDate)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.checklistItems.length} itens
                      </TableCell>
                      <TableCell>
                        <Badge variant={plan.active ? 'success' : 'default'}>
                          {plan.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Plan Modal */}
      <CreatePlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchPlans();
        }}
      />
    </div>
  );
}

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreatePlanModal({ isOpen, onClose, onSuccess }: CreatePlanModalProps) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [name, setName] = useState('');
  const [machineId, setMachineId] = useState('');
  const [periodicityDays, setPeriodicityDays] = useState('30');
  const [checklistItems, setChecklistItems] = useState<{ label: string; required: boolean }[]>([
    { label: '', required: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get<{ data: Machine[] }>('/api/machines').then((response) => {
        setMachines(response.data);
      });
    }
  }, [isOpen]);

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, { label: '', required: false }]);
  };

  const updateChecklistItem = (index: number, field: 'label' | 'required', value: string | boolean) => {
    const updated = [...checklistItems];
    updated[index] = { ...updated[index], [field]: value };
    setChecklistItems(updated);
  };

  const removeChecklistItem = (index: number) => {
    if (checklistItems.length > 1) {
      setChecklistItems(checklistItems.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Filter out empty checklist items
    const validItems = checklistItems.filter((item) => item.label.trim() !== '');
    if (validItems.length === 0) {
      setError('Adicione pelo menos um item ao checklist');
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/preventive-plans', {
        name,
        machineId,
        periodicityDays: parseInt(periodicityDays, 10),
        checklistItems: validItems,
      });
      onSuccess();
      // Reset form
      setName('');
      setMachineId('');
      setPeriodicityDays('30');
      setChecklistItems([{ label: '', required: false }]);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao criar plano');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Plano Preventivo" size="lg">
      <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Input
          label="Nome do Plano *"
          placeholder="Ex: Lubrificação Mensal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4' })}>
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
          <Input
            label="Periodicidade (dias) *"
            type="number"
            min="1"
            value={periodicityDays}
            onChange={(e) => setPeriodicityDays(e.target.value)}
            required
          />
        </div>

        {/* Checklist Items */}
        <div>
          <label className={css({ display: 'block', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700', marginBottom: '2' })}>
            Itens do Checklist *
          </label>
          <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
            {checklistItems.map((item, index) => (
              <div key={index} className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateChecklistItem(index, 'label', e.target.value)}
                  placeholder={`Item ${index + 1}`}
                  className={css({
                    flex: 1,
                    padding: '2',
                    fontSize: 'sm',
                    border: '1px solid',
                    borderColor: 'gray.300',
                    borderRadius: 'md',
                    _focus: {
                      outline: 'none',
                      borderColor: 'brand.500',
                    },
                  })}
                />
                <label className={css({ display: 'flex', alignItems: 'center', gap: '1', fontSize: 'sm', color: 'gray.600', whiteSpace: 'nowrap' })}>
                  <input
                    type="checkbox"
                    checked={item.required}
                    onChange={(e) => updateChecklistItem(index, 'required', e.target.checked)}
                  />
                  Obrigatório
                </label>
                {checklistItems.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                                        onClick={() => removeChecklistItem(index)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
                        onClick={addChecklistItem}
            className={css({ marginTop: '2' })}
          >
            + Adicionar Item
          </Button>
        </div>

        {error && <p className={css({ color: 'danger.500', fontSize: 'sm' })}>{error}</p>}

        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2', marginTop: '2' })}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading}>
            Criar Plano
          </Button>
        </div>
      </form>
    </Modal>
  );
}
