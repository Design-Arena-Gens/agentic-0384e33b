import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WorshipTools para Igreja - Planejamento e Adora??o',
  description: 'Gerencie can??es, escala, cultos, apresenta??o e equipes em um s? lugar.',
  manifest: '/manifest.webmanifest',
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <div className="min-h-screen grid grid-rows-[auto,1fr]">
          <header className="border-b bg-white">
            <div className="container-page flex items-center justify-between h-14">
              <Link href="/" className="font-semibold text-primary-700">Igreja - Adora??o</Link>
              <nav className="flex gap-4 text-sm">
                <Link className="hover:text-primary-700" href="/songs">Can??es</Link>
                <Link className="hover:text-primary-700" href="/setlists">Planos</Link>
                <Link className="hover:text-primary-700" href="/volunteers">Volunt?rios</Link>
                <Link className="hover:text-primary-700" href="/schedule">Escala</Link>
                <Link className="hover:text-primary-700" href="/present">Apresentar</Link>
                <Link className="hover:text-primary-700" href="/projector" target="_blank">Projetor</Link>
                <Link className="hover:text-primary-700" href="/settings">Configura??es</Link>
              </nav>
            </div>
          </header>
          <main className="bg-gray-50">{children}</main>
        </div>
        <script dangerouslySetInnerHTML={{__html:`if ('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{});});}`}} />
      </body>
    </html>
  );
}
