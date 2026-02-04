'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { css } from '../../../../../styled-system/css';

interface Stats {
  minhasOsAbertas: number;
  minhasOsAndamento: number;
  osVencidas: number;
}

export default function AppHomePage() {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;
  const [stats, setStats] = useState<Stats>({
    minhasOsAbertas: 0,
    minhasOsAndamento: 0,
    osVencidas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      minhasOsAbertas: 3,
      minhasOsAndamento: 1,
      osVencidas: 1,
    });
    setLoading(false);
  }, []);

  return (
    <div className={css({ padding: '4' })}>
      {/* Header */}
      <div className={css({ marginBottom: '6' })}>
        <p className={css({ color: 'gray.500', fontSize: 'sm' })}>Bem-vindo</p>
        <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
          Olá, Usuário
        </h1>
      </div>

      {/* Quick Stats */}
      <div className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '3',
        marginBottom: '6',
      })}>
        <StatCard
          label="Minhas OS Abertas"
          value={stats.minhasOsAbertas}
          color="brand"
          loading={loading}
        />
        <StatCard
          label="Em Andamento"
          value={stats.minhasOsAndamento}
          color="warning"
          loading={loading}
        />
        <StatCard
          label="Vencidas"
          value={stats.osVencidas}
          color="danger"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <h2 className={css({
        fontSize: 'lg',
        fontWeight: 'semibold',
        color: 'gray.900',
        marginBottom: '3',
      })}>
        Ações Rápidas
      </h2>

      <div className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
        <QuickActionCard
          href={`/t/${tenantSlug}/minhas-os`}
          title="Ver Minhas OS"
          description="Ordens de serviço atribuídas a você"
          icon="📋"
        />
        <QuickActionCard
          href={`/t/${tenantSlug}/nova-solicitacao`}
          title="Abrir Solicitação"
          description="Reportar problema em máquina"
          icon="➕"
        />
        <QuickActionCard
          href={`/t/${tenantSlug}/maquinas`}
          title="Consultar Máquinas"
          description="Ver lista de equipamentos"
          icon="⚙️"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: 'brand' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}

function StatCard({ label, value, color, loading }: StatCardProps) {
  const colorMap = {
    brand: { bg: 'brand.50', text: 'brand.700' },
    success: { bg: 'green.50', text: 'green.700' },
    warning: { bg: 'orange.50', text: 'orange.700' },
    danger: { bg: 'red.50', text: 'red.700' },
  };

  const colors = colorMap[color];

  return (
    <div className={css({
      backgroundColor: colors.bg,
      borderRadius: 'xl',
      padding: '4',
    })}>
      {loading ? (
        <div className={css({
          height: '8',
          width: '12',
          backgroundColor: 'gray.200',
          borderRadius: 'md',
          animation: 'pulse',
        })} />
      ) : (
        <p className={css({
          fontSize: '2xl',
          fontWeight: 'bold',
          color: colors.text,
        })}>
          {value}
        </p>
      )}
      <p className={css({
        fontSize: 'sm',
        color: 'gray.600',
        marginTop: '1',
      })}>
        {label}
      </p>
    </div>
  );
}

interface QuickActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
}

function QuickActionCard({ href, title, description, icon }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={css({
        display: 'flex',
        alignItems: 'center',
        gap: '4',
        padding: '4',
        backgroundColor: 'white',
        borderRadius: 'xl',
        boxShadow: 'sm',
        textDecoration: 'none',
        transition: 'box-shadow 0.2s',
        _hover: { boxShadow: 'md' },
        _active: { transform: 'scale(0.98)' },
      })}
    >
      <span className={css({ fontSize: '2xl' })}>{icon}</span>
      <div>
        <p className={css({ fontWeight: 'semibold', color: 'gray.900' })}>{title}</p>
        <p className={css({ fontSize: 'sm', color: 'gray.500' })}>{description}</p>
      </div>
    </Link>
  );
}
