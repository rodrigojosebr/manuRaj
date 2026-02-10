'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heading, Text, SelectField, TextareaField, Button } from '@pitkit';
import { WORK_ORDER_PRIORITY_DISPLAY } from '@manuraj/domain';
import { createWorkOrderAction } from './actions';
import * as S from './page.styles';

interface SerializedMachine {
  _id: string;
  name: string;
  code: string;
  location: string;
  status: string;
}

interface NovaSolicitacaoClientProps {
  machines: SerializedMachine[];
  tenantSlug: string;
}

const PRIORITY_OPTIONS = Object.entries(WORK_ORDER_PRIORITY_DISPLAY).map(
  ([value, label]) => ({ value, label })
);

export function NovaSolicitacaoClient({ machines, tenantSlug }: NovaSolicitacaoClientProps) {
  const router = useRouter();

  const [machineId, setMachineId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const machineOptions = machines.map((m) => ({
    value: m._id,
    label: `${m.name} (${m.code})`,
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!machineId) {
      setError('Selecione uma maquina.');
      return;
    }
    if (!description.trim()) {
      setError('Descreva o problema.');
      return;
    }

    setLoading(true);

    try {
      const result = await createWorkOrderAction({
        machineId,
        priority,
        description: description.trim(),
      });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Erro ao criar solicitacao.');
      }
    } catch {
      setError('Erro de conexao. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setMachineId('');
    setPriority('medium');
    setDescription('');
    setError('');
    setSuccess(false);
  }

  if (success) {
    return (
      <div className={S.wrapper}>
        <div className={S.successCard}>
          <span className={S.successIcon}>&#x2705;</span>
          <Heading as="h2">Solicitacao Enviada</Heading>
          <Text size="sm" color="muted">
            Sua solicitacao foi registrada e sera analisada pela equipe de manutencao.
          </Text>
          <div className={S.successActions}>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => router.push(`/t/${tenantSlug}/minhas-os`)}
            >
              Ver Minhas OS
            </Button>
            <Button fullWidth onClick={handleReset}>
              Nova Solicitacao
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={S.wrapper}>
      <div className={S.pageHeader}>
        <Heading as="h1">Nova Solicitacao</Heading>
        <Text size="sm" className={S.subtitle}>
          Descreva o problema para a equipe de manutencao
        </Text>
      </div>

      <form onSubmit={handleSubmit} className={S.form}>
        <SelectField
          label="Maquina"
          required
          options={machineOptions}
          placeholder="Selecione a maquina"
          value={machineId}
          onChange={(e) => setMachineId(e.target.value)}
        />

        <SelectField
          label="Prioridade"
          required
          options={PRIORITY_OPTIONS}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />

        <TextareaField
          label="Descricao do Problema"
          required
          placeholder="Descreva o problema observado na maquina..."
          rows={5}
          maxLength={2000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <div className={S.errorBox}>{error}</div>}

        <div className={S.submitArea}>
          <Button type="submit" fullWidth isLoading={loading}>
            Enviar Solicitacao
          </Button>
        </div>
      </form>
    </div>
  );
}
