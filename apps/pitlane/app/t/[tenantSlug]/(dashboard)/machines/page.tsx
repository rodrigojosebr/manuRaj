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
  getMachineStatusBadgeVariant,
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
import { MACHINE_STATUS_DISPLAY } from '@manuraj/domain';
import { api } from '@manuraj/shared-utils';

interface Machine {
  _id: string;
  name: string;
  code: string;
  location?: string;
  manufacturer?: string;
  model?: string;
  status: string;
}

export default function MachinesPage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug as string;

  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ data: Machine[] }>('/api/machines');
      setMachines(response.data);
    } catch (error) {
      console.error('Error fetching machines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  return (
    <div>
      {/* Page header */}
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6' })}>
        <div>
          <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
            Máquinas
          </h1>
          <p className={css({ color: 'gray.600', marginTop: '1' })}>
            Gerencie as máquinas da sua empresa
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + Nova Máquina
        </Button>
      </div>

      {/* Machines table */}
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
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Fabricante</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.length === 0 ? (
                  <TableEmpty colSpan={5} message="Nenhuma máquina cadastrada" />
                ) : (
                  machines.map((machine) => (
                    <TableRow
                      key={machine._id}
                      onClick={() => router.push(`/t/${tenantSlug}/machines/${machine._id}`)}
                    >
                      <TableCell>
                        <span className={css({ fontWeight: 'medium', color: 'brand.600' })}>
                          {machine.code}
                        </span>
                      </TableCell>
                      <TableCell>{machine.name}</TableCell>
                      <TableCell>{machine.location || '-'}</TableCell>
                      <TableCell>{machine.manufacturer || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getMachineStatusBadgeVariant(machine.status)}>
                          {MACHINE_STATUS_DISPLAY[machine.status] || machine.status}
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

      {/* Create Machine Modal */}
      <CreateMachineModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchMachines();
        }}
      />
    </div>
  );
}

interface CreateMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateMachineModal({ isOpen, onClose, onSuccess }: CreateMachineModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [status, setStatus] = useState('operational');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/machines', {
        name,
        code,
        location: location || undefined,
        manufacturer: manufacturer || undefined,
        model: model || undefined,
        serial: serial || undefined,
        status,
      });
      onSuccess();
      // Reset form
      setName('');
      setCode('');
      setLocation('');
      setManufacturer('');
      setModel('');
      setSerial('');
      setStatus('operational');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao criar máquina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Máquina" size="lg">
      <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)' }, gap: '4' })}>
          <Input
            label="Código *"
            placeholder="EQ-001"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Input
            label="Nome *"
            placeholder="Torno CNC"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Localização"
            placeholder="Galpão A, Setor 1"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            label="Fabricante"
            placeholder="ROMI"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
          <Input
            label="Modelo"
            placeholder="D800"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <Input
            label="Número de série"
            placeholder="SN123456"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />
        </div>
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: 'operational', label: 'Operacional' },
            { value: 'maintenance', label: 'Em Manutenção' },
            { value: 'stopped', label: 'Parada' },
            { value: 'decommissioned', label: 'Desativada' },
          ]}
        />

        {error && (
          <p className={css({ color: 'danger.500', fontSize: 'sm' })}>{error}</p>
        )}

        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2', marginTop: '2' })}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading}>
            Criar Máquina
          </Button>
        </div>
      </form>
    </Modal>
  );
}
