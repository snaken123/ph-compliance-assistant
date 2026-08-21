import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'FlowForceRM — Philippine Sole Proprietorship Registration & Compliance Assistant',
  description: 'Specialized Philippine legal compliance assistant, tax simulator, registration roadmap, and document vault for home-based SaaS sole proprietors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <Navigation />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FlowForceRM Compliance Assistant — Philippine Legal & Government Regulatory Matrix</p>
          <p className="mt-1 text-slate-600">Cross-referenced against DTI Act 3883, RA 7160 Local Government Code, BIR TRAIN Act (RA 10963), EOPT Act (RA 11976), and Data Privacy Act (RA 10173).</p>
        </footer>
      </body>
    </html>
  );
}
