import './global.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'manuRaj - Gestão de Manutenção Industrial',
  description: 'Sistema de gestão de manutenção industrial multi-empresa',
  keywords: ['manutenção', 'industrial', 'gestão', 'CMMS', 'manutenção preventiva'],
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
