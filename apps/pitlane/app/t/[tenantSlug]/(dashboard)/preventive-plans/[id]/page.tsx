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
  Modal,
  Skeleton,
} from '@manuraj/ui';
import { api, formatDate, daysUntil } from '@manuraj/shared-utils';

interface PreventivePlan {
  _id: string;
  name: string;
  machineId: { _id: string; name: string; code: string };
  periodicityDays: number;
  checklistItems: { label: string; required: boolean }[];
  nextDueDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Machine {
  _id: string;
  name: string;
  code: string;
}

export default function PreventivePlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug as string;
  const planId = params.id as string;

  const [plan, setPlan] = useState<PreventivePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGenerateOSModal, setShowGenerateOSModal] = useState(false);

  const fetchPlan = async () => {
    try {
      const response = await api.get<{ data: PreventivePlan }>(`/api/preventive-plans/${planId}`);
      setPlan(response.data);
    } catch (error) {
      console.error('Error fetching plan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/preventive-plans/${planId}`);
      router.push(`/t/${tenantSlug}/preventive-plans`);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleToggleActive = async () => {
    if (!plan) return;
    try {
      await api.put(`/api/preventive-plans/${planId}`, { active: !plan.active });
      fetchPlan();
    } catch (error) {
      console.error('Error toggling plan:', error);
    }
  };

  const handleGenerateOS = async () => {
    if (!plan) return;
    try {
      // Create a preventive work order based on this plan
      await api.post('/api/work-orders', {
        machineId: plan.machineId._id,
        type: 'preventive',
        priority: 'medium',
        description: `Manutenção preventiva: ${plan.name}\n\nChecklist:\n${plan.checklistItems.map((item) => `- ${item.label}${item.required ? ' (obrigatório)' : ''}`).join('\n')}`,
      });

      // Update the plan's nextDueDate
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + plan.periodicityDays);
      await api.put(`/api/preventive-plans/${planId}`, {
        nextDueDate: nextDate.toISOString(),
      });

      setShowGenerateOSModal(false);
      router.push(`/t/${tenantSlug}/work-orders`);
    } catch (error) {
      console.error('Error generating OS:', error);
    }
  };

  const getDueBadgeVariant = (nextDueDate: string) => {
    const days = daysUntil(nextDueDate);
    if (days < 0) return 'danger';
    if (days <= 7) return 'warning';
    return 'success';
  };

  const getDueText = (nextDueDate: string) => {
    const days = daysUntil(nextDueDate);
    if (days < 0) return `${Math.abs(days)} dias atrasado`;
    if (days === 0) return 'Vence hoje';
    if (days === 1) return 'Vence amanhã';
    return `Em ${days} dias`;
  };

  if (loading) {
    return (
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
        <Skeleton height="40px" width="300px" />
        <Card>
          <CardContent>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="24px" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className={css({ textAlign: 'center', padding: '12' })}>
        <p className={css({ color: 'gray.500' })}>Plano não encontrado</p>
        <Link href={`/t/${tenantSlug}/preventive-plans`}>
          <Button variant="link" className={css({ marginTop: '4' })}>
            Voltar para planos preventivos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
      {/* Header */}
      <div className={css({ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' })}>
        <div>
          <div className={css({ display: 'flex', alignItems: 'center', gap: '3', marginBottom: '2' })}>
            <Link href={`/t/${tenantSlug}/preventive-plans`} className={css({ color: 'gray.500', _hover: { color: 'gray.700' } })}>
              Planos Preventivos
            </Link>
            <span className={css({ color: 'gray.400' })}>/</span>
            <Badge variant={plan.active ? 'success' : 'default'}>
              {plan.active ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
            {plan.name}
          </h1>
        </div>
        <div className={css({ display: 'flex', gap: '2' })}>
          <Button variant="secondary" onClick={() => setShowEditModal(true)}>
            Editar
          </Button>
          <Button onClick={() => setShowGenerateOSModal(true)}>
            Gerar OS
          </Button>
        </div>
      </div>

      <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', lg: '2fr 1fr' }, gap: '6' })}>
        {/* Main Content */}
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
          {/* Machine */}
          <Card>
            <CardHeader>
              <CardTitle>Máquina</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/t/${tenantSlug}/machines/${plan.machineId._id}`}
                className={css({ display: 'flex', alignItems: 'center', gap: '3', padding: '3', borderRadius: 'md', backgroundColor: 'gray.50', _hover: { backgroundColor: 'gray.100' } })}
              >
                <div className={css({ width: '48px', height: '48px', borderRadius: 'md', backgroundColor: 'brand.100', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'brand.600', fontWeight: 'bold' })}>
                  {plan.machineId.code.substring(0, 3)}
                </div>
                <div>
                  <p className={css({ fontWeight: 'medium', color: 'gray.900' })}>{plan.machineId.code}</p>
                  <p className={css({ fontSize: 'sm', color: 'gray.500' })}>{plan.machineId.name}</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist ({plan.checklistItems.length} itens)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
                {plan.checklistItems.map((item, index) => (
                  <div
                    key={index}
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3',
                      padding: '3',
                      borderRadius: 'md',
                      backgroundColor: 'gray.50',
                    })}
                  >
                    <div className={css({ width: '24px', height: '24px', borderRadius: 'md', border: '2px solid', borderColor: 'gray.300', display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
                      <span className={css({ fontSize: 'xs', color: 'gray.500' })}>{index + 1}</span>
                    </div>
                    <span className={css({ flex: 1, color: 'gray.700' })}>{item.label}</span>
                    {item.required && (
                      <Badge variant="warning" >Obrigatório</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Próximo Vencimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={css({ textAlign: 'center', padding: '4' })}>
                <p className={css({ fontSize: '3xl', fontWeight: 'bold', color: 'gray.900' })}>
                  {formatDate(plan.nextDueDate)}
                </p>
                <Badge variant={getDueBadgeVariant(plan.nextDueDate)} className={css({ marginTop: '2' })}>
                  {getDueText(plan.nextDueDate)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
                <InfoItem label="Periodicidade" value={`A cada ${plan.periodicityDays} dias`} />
                <InfoItem label="Criado em" value={formatDate(plan.createdAt)} />
                <InfoItem label="Atualizado em" value={formatDate(plan.updatedAt)} />
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
                <Button variant="secondary"  onClick={handleToggleActive}>
                  {plan.active ? 'Desativar Plano' : 'Ativar Plano'}
                </Button>
                <Button variant="danger"  onClick={() => setShowDeleteModal(true)}>
                  Excluir Plano
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <EditPlanModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        plan={plan}
        onSuccess={() => {
          setShowEditModal(false);
          fetchPlan();
        }}
      />

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Excluir Plano" >
        <p className={css({ color: 'gray.600', marginBottom: '4' })}>
          Tem certeza que deseja excluir o plano <strong>{plan.name}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2' })}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Excluir</Button>
        </div>
      </Modal>

      {/* Generate OS Modal */}
      <Modal isOpen={showGenerateOSModal} onClose={() => setShowGenerateOSModal(false)} title="Gerar Ordem de Serviço" >
        <p className={css({ color: 'gray.600', marginBottom: '4' })}>
          Deseja gerar uma ordem de serviço preventiva para a máquina <strong>{plan.machineId.code}</strong>?
          O próximo vencimento será atualizado para daqui a {plan.periodicityDays} dias.
        </p>
        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2' })}>
          <Button variant="secondary" onClick={() => setShowGenerateOSModal(false)}>Cancelar</Button>
          <Button onClick={handleGenerateOS}>Gerar OS</Button>
        </div>
      </Modal>
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

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PreventivePlan;
  onSuccess: () => void;
}

function EditPlanModal({ isOpen, onClose, plan, onSuccess }: EditPlanModalProps) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [name, setName] = useState(plan.name);
  const [machineId, setMachineId] = useState(plan.machineId._id);
  const [periodicityDays, setPeriodicityDays] = useState(String(plan.periodicityDays));
  const [checklistItems, setChecklistItems] = useState(plan.checklistItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get<{ data: Machine[] }>('/api/machines').then((response) => {
        setMachines(response.data);
      });
      setName(plan.name);
      setMachineId(plan.machineId._id);
      setPeriodicityDays(String(plan.periodicityDays));
      setChecklistItems([...plan.checklistItems]);
    }
  }, [isOpen, plan]);

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

    const validItems = checklistItems.filter((item) => item.label.trim() !== '');
    if (validItems.length === 0) {
      setError('Adicione pelo menos um item ao checklist');
      setLoading(false);
      return;
    }

    try {
      await api.put(`/api/preventive-plans/${plan._id}`, {
        name,
        machineId,
        periodicityDays: parseInt(periodicityDays, 10),
        checklistItems: validItems,
      });
      onSuccess();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao atualizar plano');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Plano Preventivo" size="lg">
      <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Input
          label="Nome do Plano *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4' })}>
          <Select
            label="Máquina *"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
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

        {/* Checklist */}
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
                  className={css({
                    flex: 1,
                    padding: '2',
                    fontSize: 'sm',
                    border: '1px solid',
                    borderColor: 'gray.300',
                    borderRadius: 'md',
                  })}
                />
                <label className={css({ display: 'flex', alignItems: 'center', gap: '1', fontSize: 'sm', whiteSpace: 'nowrap' })}>
                  <input
                    type="checkbox"
                    checked={item.required}
                    onChange={(e) => updateChecklistItem(index, 'required', e.target.checked)}
                  />
                  Obrig.
                </label>
                {checklistItems.length > 1 && (
                  <Button type="button" variant="ghost"  onClick={() => removeChecklistItem(index)}>
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button type="button" variant="ghost"  onClick={addChecklistItem} className={css({ marginTop: '2' })}>
            + Adicionar Item
          </Button>
        </div>

        {error && <p className={css({ color: 'danger.500', fontSize: 'sm' })}>{error}</p>}

        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2', marginTop: '2' })}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={loading}>Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
