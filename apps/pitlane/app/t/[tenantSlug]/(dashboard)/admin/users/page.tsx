'use client';

import { useState, useEffect } from 'react';
import { css } from '../../../../../../../../styled-system/css';
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
import { ROLE_DISPLAY_NAMES } from '@manuraj/domain';
import { api, formatDate } from '@manuraj/shared-utils';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ data: User[] }>('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (user: User) => {
    try {
      await api.put(`/api/users/${user._id}`, { active: !user.active });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user:', error);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'general_supervisor':
      case 'super_admin':
        return 'success';
      case 'maintenance_supervisor':
        return 'warning';
      case 'maintainer':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6' })}>
        <div>
          <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
            Usuários
          </h1>
          <p className={css({ color: 'gray.600', marginTop: '1' })}>
            Gerencie os usuários da sua empresa
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + Novo Usuário
        </Button>
      </div>

      {/* Users table */}
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
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableEmpty colSpan={6} message="Nenhum usuário cadastrado" />
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <span className={css({ fontWeight: 'medium', color: 'gray.900' })}>
                          {user.name}
                        </span>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {ROLE_DISPLAY_NAMES[user.role as keyof typeof ROLE_DISPLAY_NAMES] || user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.active ? 'success' : 'danger'}>
                          {user.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className={css({ display: 'flex', gap: '2' })}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(user)}
                          >
                            {user.active ? 'Desativar' : 'Ativar'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchUsers();
        }}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSuccess={() => {
            setEditingUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('operator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/users', {
        name,
        email,
        password,
        role,
      });
      onSuccess();
      setName('');
      setEmail('');
      setPassword('');
      setRole('operator');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Usuário" size="md">
      <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Input
          label="Nome *"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email *"
          type="email"
          placeholder="email@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha *"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Select
          label="Cargo *"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { value: 'operator', label: 'Operador' },
            { value: 'maintainer', label: 'Manutentor' },
            { value: 'maintenance_supervisor', label: 'Supervisor de Manutenção' },
            { value: 'general_supervisor', label: 'Supervisor Geral' },
          ]}
        />

        {error && <p className={css({ color: 'danger.500', fontSize: 'sm' })}>{error}</p>}

        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2', marginTop: '2' })}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading}>
            Criar Usuário
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}

function EditUserModal({ isOpen, onClose, user, onSuccess }: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setNewPassword('');
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.put(`/api/users/${user._id}`, {
        name,
        email,
        role,
        ...(newPassword ? { password: newPassword } : {}),
      });
      onSuccess();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuário" size="md">
      <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Input
          label="Nome *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Select
          label="Cargo *"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { value: 'operator', label: 'Operador' },
            { value: 'maintainer', label: 'Manutentor' },
            { value: 'maintenance_supervisor', label: 'Supervisor de Manutenção' },
            { value: 'general_supervisor', label: 'Supervisor Geral' },
          ]}
        />
        <Input
          label="Nova Senha (deixe em branco para manter)"
          type="password"
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {error && <p className={css({ color: 'danger.500', fontSize: 'sm' })}>{error}</p>}

        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2', marginTop: '2' })}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
