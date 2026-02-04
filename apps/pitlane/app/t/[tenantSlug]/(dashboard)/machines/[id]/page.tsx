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
  getMachineStatusBadgeVariant,
  Modal,
  Skeleton,
} from '@manuraj/ui';
import { MACHINE_STATUS_DISPLAY, DOCUMENT_TYPE_DISPLAY } from '@manuraj/domain';
import { api, formatDate } from '@manuraj/shared-utils';

interface Machine {
  _id: string;
  name: string;
  code: string;
  location?: string;
  manufacturer?: string;
  model?: string;
  serial?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MachineDocument {
  _id: string;
  title: string;
  type: string;
  contentType: string;
  size: number;
  createdAt: string;
}

export default function MachineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug as string;
  const machineId = params.id as string;

  const [machine, setMachine] = useState<Machine | null>(null);
  const [documents, setDocuments] = useState<MachineDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchMachine = async () => {
    try {
      const response = await api.get<{ data: Machine }>(`/api/machines/${machineId}`);
      setMachine(response.data);
    } catch (error) {
      console.error('Error fetching machine:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await api.get<{ data: MachineDocument[] }>(`/api/machines/${machineId}/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchMachine(), fetchDocuments()]).finally(() => setLoading(false));
  }, [machineId]);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/machines/${machineId}`);
      router.push(`/t/${tenantSlug}/machines`);
    } catch (error) {
      console.error('Error deleting machine:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
        <Skeleton height="40px" width="300px" />
        <Card>
          <CardContent>
            <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4' })}>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} height="60px" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className={css({ textAlign: 'center', padding: '12' })}>
        <p className={css({ color: 'gray.500' })}>Máquina não encontrada</p>
        <Link href={`/t/${tenantSlug}/machines`}>
          <Button variant="link" className={css({ marginTop: '4' })}>
            Voltar para máquinas
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
      {/* Header */}
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
        <div>
          <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
            <Link href={`/t/${tenantSlug}/machines`} className={css({ color: 'gray.500', _hover: { color: 'gray.700' } })}>
              Máquinas
            </Link>
            <span className={css({ color: 'gray.400' })}>/</span>
            <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
              {machine.code}
            </h1>
            <Badge variant={getMachineStatusBadgeVariant(machine.status)}>
              {MACHINE_STATUS_DISPLAY[machine.status]}
            </Badge>
          </div>
          <p className={css({ color: 'gray.600', marginTop: '1' })}>{machine.name}</p>
        </div>
        <div className={css({ display: 'flex', gap: '2' })}>
          <Button variant="secondary" onClick={() => setShowEditModal(true)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Excluir
          </Button>
        </div>
      </div>

      {/* Machine Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Máquina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: '6' })}>
            <InfoItem label="Código" value={machine.code} />
            <InfoItem label="Nome" value={machine.name} />
            <InfoItem label="Localização" value={machine.location || '-'} />
            <InfoItem label="Fabricante" value={machine.manufacturer || '-'} />
            <InfoItem label="Modelo" value={machine.model || '-'} />
            <InfoItem label="Número de Série" value={machine.serial || '-'} />
            <InfoItem label="Criado em" value={formatDate(machine.createdAt)} />
            <InfoItem label="Atualizado em" value={formatDate(machine.updatedAt)} />
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
          <CardTitle>Documentos</CardTitle>
          <Button size="sm" onClick={() => setShowUploadModal(true)}>
            + Upload
          </Button>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className={css({ color: 'gray.500', textAlign: 'center', padding: '8' })}>
              Nenhum documento anexado
            </p>
          ) : (
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '3',
                    borderRadius: 'md',
                    backgroundColor: 'gray.50',
                    _hover: { backgroundColor: 'gray.100' },
                  })}
                >
                  <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
                    <div className={css({ width: '40px', height: '40px', borderRadius: 'md', backgroundColor: 'brand.100', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'brand.600', fontWeight: 'bold', fontSize: 'xs' })}>
                      {doc.contentType.split('/')[1]?.substring(0, 3).toUpperCase() || 'DOC'}
                    </div>
                    <div>
                      <p className={css({ fontWeight: 'medium', color: 'gray.900' })}>{doc.title}</p>
                      <p className={css({ fontSize: 'sm', color: 'gray.500' })}>
                        {DOCUMENT_TYPE_DISPLAY[doc.type] || doc.type} • {formatFileSize(doc.size)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditMachineModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        machine={machine}
        onSuccess={() => {
          setShowEditModal(false);
          fetchMachine();
        }}
      />

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Excluir Máquina" size="sm">
        <p className={css({ color: 'gray.600', marginBottom: '4' })}>
          Tem certeza que deseja excluir a máquina <strong>{machine.code}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2' })}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Excluir
          </Button>
        </div>
      </Modal>

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        machineId={machineId}
        onSuccess={() => {
          setShowUploadModal(false);
          fetchDocuments();
        }}
      />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={css({ fontSize: 'sm', color: 'gray.500', marginBottom: '1' })}>{label}</dt>
      <dd className={css({ fontWeight: 'medium', color: 'gray.900' })}>{value}</dd>
    </div>
  );
}

interface EditMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  machine: Machine;
  onSuccess: () => void;
}

function EditMachineModal({ isOpen, onClose, machine, onSuccess }: EditMachineModalProps) {
  const [name, setName] = useState(machine.name);
  const [code, setCode] = useState(machine.code);
  const [location, setLocation] = useState(machine.location || '');
  const [manufacturer, setManufacturer] = useState(machine.manufacturer || '');
  const [model, setModel] = useState(machine.model || '');
  const [serial, setSerial] = useState(machine.serial || '');
  const [status, setStatus] = useState(machine.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(machine.name);
      setCode(machine.code);
      setLocation(machine.location || '');
      setManufacturer(machine.manufacturer || '');
      setModel(machine.model || '');
      setSerial(machine.serial || '');
      setStatus(machine.status);
    }
  }, [isOpen, machine]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.put(`/api/machines/${machine._id}`, {
        name,
        code,
        location: location || undefined,
        manufacturer: manufacturer || undefined,
        model: model || undefined,
        serial: serial || undefined,
        status,
      });
      onSuccess();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao atualizar máquina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Máquina" size="lg">
      <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)' }, gap: '4' })}>
          <Input label="Código *" value={code} onChange={(e) => setCode(e.target.value)} required />
          <Input label="Nome *" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Localização" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Input label="Fabricante" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
          <Input label="Modelo" value={model} onChange={(e) => setModel(e.target.value)} />
          <Input label="Número de Série" value={serial} onChange={(e) => setSerial(e.target.value)} />
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
        {error && <p className={css({ color: 'danger.500', fontSize: 'sm' })}>{error}</p>}
        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2', marginTop: '2' })}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={loading}>Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineId: string;
  onSuccess: () => void;
}

function UploadDocumentModal({ isOpen, onClose, machineId, onSuccess }: UploadDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setError('');
    setLoading(true);
    setProgress(0);

    try {
      // Step 1: Get presigned URL
      const prepareResponse = await api.post<{
        data: { uploadUrl: string; s3Key: string };
      }>(`/api/machines/${machineId}/documents/prepare-upload`, {
        filename: file.name,
        contentType: file.type,
        size: file.size,
      });

      const { uploadUrl, s3Key } = prepareResponse.data;
      setProgress(25);

      // Step 2: Upload to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Erro ao fazer upload do arquivo');
      }
      setProgress(75);

      // Step 3: Confirm upload
      await api.post(`/api/machines/${machineId}/documents/confirm-upload`, {
        s3Key,
        title: title || file.name,
        type,
        contentType: file.type,
        size: file.size,
      });
      setProgress(100);

      onSuccess();
      setFile(null);
      setTitle('');
      setType('manual');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao fazer upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload de Documento" size="md">
      <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <div>
          <label className={css({ display: 'block', fontSize: 'sm', fontWeight: 'medium', color: 'gray.700', marginBottom: '1' })}>
            Arquivo *
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className={css({
              width: '100%',
              padding: '2',
              fontSize: 'sm',
              border: '1px solid',
              borderColor: 'gray.300',
              borderRadius: 'md',
            })}
          />
        </div>
        <Input
          label="Título"
          placeholder="Nome do documento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select
          label="Tipo"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: 'manual', label: 'Manual' },
            { value: 'drawing', label: 'Desenho' },
            { value: 'certificate', label: 'Certificado' },
            { value: 'photo', label: 'Foto' },
            { value: 'other', label: 'Outro' },
          ]}
        />

        {loading && (
          <div className={css({ width: '100%', height: '8px', backgroundColor: 'gray.200', borderRadius: 'full', overflow: 'hidden' })}>
            <div
              className={css({ height: '100%', backgroundColor: 'brand.500', transition: 'width 0.3s' })}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {error && <p className={css({ color: 'danger.500', fontSize: 'sm' })}>{error}</p>}

        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2', marginTop: '2' })}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={loading} disabled={!file}>Upload</Button>
        </div>
      </form>
    </Modal>
  );
}
