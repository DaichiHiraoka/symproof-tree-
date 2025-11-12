import type { Metadata } from 'next';
import './globals.css';
import NavigationAtlaskit from '@/components/NavigationAtlaskit';
import { FlagProvider } from '@/components/FlagProvider';

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
        <FlagProvider>
          <NavigationAtlaskit />
          {children}
        </FlagProvider>
      </body>
    </html>
  );
}
