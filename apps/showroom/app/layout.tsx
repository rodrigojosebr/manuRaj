import './global.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'manuRaj - Gestão de Manutenção Industrial',
  description:
    'Sistema completo de gestão de manutenção industrial (CMMS). Gerencie máquinas, ordens de serviço e equipes. Comece grátis.',
  keywords: [
    'manutenção industrial',
    'CMMS',
    'gestão de manutenção',
    'manutenção preventiva',
    'ordem de serviço',
    'gestão de máquinas',
    'manutenção corretiva',
    'SaaS industrial',
  ],
  openGraph: {
    title: 'manuRaj - Gestão de Manutenção Industrial',
    description:
      'Sistema completo de gestão de manutenção industrial. Gerencie máquinas, ordens de serviço e equipes. Comece grátis.',
    type: 'website',
    siteName: 'manuRaj',
  },
  other: {
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
