import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UNAD DevTrack | Plataforma de Gestión de Tareas de Ingeniería',
  description: 'Sistema modular de seguimiento de actividades de desarrollo e investigación para la UNAD con cumplimiento Ley 1581.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
