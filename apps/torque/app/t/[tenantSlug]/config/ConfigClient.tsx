'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Heading, Badge, Card, CardContent, TextField, Button } from '@pitkit';
import { ROLE_DISPLAY_NAMES } from '@manuraj/domain';
import type { UserRole } from '@manuraj/domain';
import { formatDate } from '@manuraj/shared-utils';
import { updateProfileAction, changePasswordAction } from './actions';
import * as S from './page.styles';

interface SerializedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ConfigClientProps {
  user: SerializedUser;
  tenantSlug: string;
}

export function ConfigClient({ user, tenantSlug }: ConfigClientProps) {
  // Profile form
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setIsSubmittingProfile(true);

    try {
      const result = await updateProfileAction({ name: name.trim(), email: email.trim() });

      if (result.success) {
        setProfileSuccess('Perfil atualizado com sucesso.');
        setTimeout(() => setProfileSuccess(''), 3000);
      } else {
        setProfileError(result.error || 'Erro ao atualizar perfil.');
      }
    } catch {
      setProfileError('Erro de conexao. Tente novamente.');
    } finally {
      setIsSubmittingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas nao coincidem.');
      return;
    }

    setIsSubmittingPassword(true);

    try {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (result.success) {
        setPasswordSuccess('Senha alterada com sucesso.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 3000);
      } else {
        setPasswordError(result.error || 'Erro ao alterar senha.');
      }
    } catch {
      setPasswordError('Erro de conexao. Tente novamente.');
    } finally {
      setIsSubmittingPassword(false);
    }
  }

  async function handleLogout() {
    await signOut({ callbackUrl: '/login' });
  }

  return (
    <div className={S.wrapper}>
      {/* Page header */}
      <div className={S.pageHeader}>
        <Heading as="h1">Configuracoes</Heading>
      </div>

      {/* Profile card */}
      <div className={S.section}>
        <Card variant="filled" colorScheme="brand" padding="md">
          <CardContent>
            <div className={S.profileInfo}>
              <span className={S.profileName}>{user.name}</span>
              <span className={S.profileEmail}>{user.email}</span>
              <Badge variant="default">
                {ROLE_DISPLAY_NAMES[user.role as UserRole] || user.role}
              </Badge>
              {user.createdAt && (
                <span className={S.profileMeta}>
                  Membro desde {formatDate(user.createdAt)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit profile form */}
      <div className={S.section}>
        <p className={S.sectionTitle}>Editar Perfil</p>
        <Card padding="md">
          <CardContent>
            <form onSubmit={handleProfileSubmit}>
              <div className={S.formFields}>
                <TextField
                  label="Nome"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {profileSuccess && (
                  <div className={S.successMessage}>{profileSuccess}</div>
                )}
                {profileError && (
                  <div className={S.errorMessage}>{profileError}</div>
                )}

                <div className={S.submitArea}>
                  <Button type="submit" fullWidth isLoading={isSubmittingProfile}>
                    Salvar Alteracoes
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Change password form */}
      <div className={S.section}>
        <p className={S.sectionTitle}>Alterar Senha</p>
        <Card padding="md">
          <CardContent>
            <form onSubmit={handlePasswordSubmit}>
              <div className={S.formFields}>
                <TextField
                  label="Senha Atual"
                  required
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <TextField
                  label="Nova Senha"
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText="Minimo 8 caracteres"
                />
                <TextField
                  label="Confirmar Nova Senha"
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {passwordSuccess && (
                  <div className={S.successMessage}>{passwordSuccess}</div>
                )}
                {passwordError && (
                  <div className={S.errorMessage}>{passwordError}</div>
                )}

                <div className={S.submitArea}>
                  <Button type="submit" fullWidth isLoading={isSubmittingPassword}>
                    Alterar Senha
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Logout */}
      <div className={S.logoutSection}>
        <Button variant="danger" fullWidth onClick={handleLogout}>
          Sair da Conta
        </Button>
      </div>
    </div>
  );
}
