import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OROMAXI - Marketplace de Oro y Relojería',
  description: 'Invierte Responsablemente. Plataforma de confianza para compra, venta y recompra de joyas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-dark-bg text-white">
        {children}
      </body>
    </html>
  );
}
