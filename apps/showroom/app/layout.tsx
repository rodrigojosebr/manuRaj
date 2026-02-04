import './global.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'manuRaj - Gestão de Manutenção Industrial',
  description: 'Sistema completo de gestão de manutenção industrial (CMMS). Gerencie máquinas, ordens de serviço e equipes de manutenção.',
  keywords: ['manutenção', 'industrial', 'gestão', 'CMMS', 'manutenção preventiva', 'ordem de serviço'],
  openGraph: {
    title: 'manuRaj - Gestão de Manutenção Industrial',
    description: 'Sistema completo de gestão de manutenção industrial',
    type: 'website',
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
