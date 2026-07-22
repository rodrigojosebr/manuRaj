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
    <S.Wrapper>
      {/* Page header */}
      <S.PageHeader>
        <Heading as="h1">Configuracoes</Heading>
      </S.PageHeader>

      {/* Profile card */}
      <S.Section>
        <Card variant="filled" colorScheme="brand" padding="md">
          <CardContent>
            <S.ProfileInfo>
              <S.ProfileName>{user.name}</S.ProfileName>
              <S.ProfileEmail>{user.email}</S.ProfileEmail>
              <Badge variant="default">
                {ROLE_DISPLAY_NAMES[user.role as UserRole] || user.role}
              </Badge>
              {user.createdAt && (
                <S.ProfileMeta>
                  Membro desde {formatDate(user.createdAt)}
                </S.ProfileMeta>
              )}
            </S.ProfileInfo>
          </CardContent>
        </Card>
      </S.Section>

      {/* Edit profile form */}
      <S.Section>
        <S.SectionTitle>Editar Perfil</S.SectionTitle>
        <Card padding="md">
          <CardContent>
            <form onSubmit={handleProfileSubmit}>
              <S.FormFields>
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
                  <S.SuccessMessage>{profileSuccess}</S.SuccessMessage>
                )}
                {profileError && (
                  <S.ErrorMessage>{profileError}</S.ErrorMessage>
                )}

                <S.SubmitArea>
                  <Button type="submit" fullWidth isLoading={isSubmittingProfile}>
                    Salvar Alteracoes
                  </Button>
                </S.SubmitArea>
              </S.FormFields>
            </form>
          </CardContent>
        </Card>
      </S.Section>

      {/* Change password form */}
      <S.Section>
        <S.SectionTitle>Alterar Senha</S.SectionTitle>
        <Card padding="md">
          <CardContent>
            <form onSubmit={handlePasswordSubmit}>
              <S.FormFields>
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
                  <S.SuccessMessage>{passwordSuccess}</S.SuccessMessage>
                )}
                {passwordError && (
                  <S.ErrorMessage>{passwordError}</S.ErrorMessage>
                )}

                <S.SubmitArea>
                  <Button type="submit" fullWidth isLoading={isSubmittingPassword}>
                    Alterar Senha
                  </Button>
                </S.SubmitArea>
              </S.FormFields>
            </form>
          </CardContent>
        </Card>
      </S.Section>

      {/* Logout */}
      <S.LogoutSection>
        <Button variant="danger" fullWidth onClick={handleLogout}>
          Sair da Conta
        </Button>
      </S.LogoutSection>
    </S.Wrapper>
  );
}
