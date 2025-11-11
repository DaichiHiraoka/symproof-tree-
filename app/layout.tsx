import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'SymProof Tree - 学習証明システム',
  description: 'Symbolブロックチェーンを使用した学習記録の証明・管理システム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
