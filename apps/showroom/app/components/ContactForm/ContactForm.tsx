'use client';

import { useState } from 'react';
import { TextField, TextareaField, Button } from '@pitkit';

import * as S from './ContactForm.styles';

const PITLANE_URL = process.env.NEXT_PUBLIC_PITLANE_URL || 'http://localhost:3000';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${PITLANE_URL}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, company, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erro ao enviar. Tente novamente.');
        return;
      }

      setSent(true);
    } catch {
      setError('Erro ao enviar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <S.Card>
        <S.SuccessWrap>
          <S.SuccessIcon>✅</S.SuccessIcon>
          <S.SuccessTitle>Contato recebido!</S.SuccessTitle>
          <S.SuccessText>Obrigado pelo interesse. Nossa equipe retornará em breve.</S.SuccessText>
        </S.SuccessWrap>
      </S.Card>
    );
  }

  return (
    <S.Card>
      <S.Form onSubmit={handleSubmit}>
        <S.Row>
          <TextField
            label="Nome"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </S.Row>
        <S.Row>
          <TextField
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            label="Empresa"
            placeholder="Nome da empresa"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </S.Row>
        <TextareaField
          label="Mensagem"
          placeholder="Como podemos ajudar?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />

        {error && <S.ErrorText>{error}</S.ErrorText>}

        <Button type="submit" fullWidth isLoading={isLoading}>
          Enviar mensagem
        </Button>
      </S.Form>
    </S.Card>
  );
}
