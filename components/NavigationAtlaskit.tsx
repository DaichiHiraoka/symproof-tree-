/**
 * ナビゲーションコンポーネント (Atlaskit版)
 * アプリケーション全体のナビゲーションバー
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Tabs, { Tab, TabList } from '@atlaskit/tabs';
import { Box, xcss } from '@atlaskit/primitives';
import HomeIcon from '@atlaskit/icon/glyph/home';
import ClockIcon from '@atlaskit/icon/glyph/recent';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import GraphIcon from '@atlaskit/icon/glyph/graph-line';

const navContainerStyles = xcss({
  backgroundColor: 'elevation.surface',
  borderBottomStyle: 'solid',
  borderBottomWidth: 'border.width',
  borderBottomColor: 'color.border',
  boxShadow: 'elevation.shadow.raised',
});

const navInnerStyles = xcss({
  maxWidth: '1400px',
  marginInline: 'auto',
  paddingInline: 'space.300',
  paddingBlock: 'space.100',
});

const brandStyles = xcss({
  font: 'font.heading.medium',
  fontWeight: 'font.weight.bold',
  color: 'color.text.brand',
  paddingBlockEnd: 'space.100',
});

export default function NavigationAtlaskit() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'ホーム', icon: HomeIcon },
    { href: '/pending', label: '保留中', icon: ClockIcon },
    { href: '/verified', label: '確定済み', icon: CheckCircleIcon },
    { href: '/verify', label: '検証', icon: SearchIcon },
    { href: '/tree', label: '学習ツリー', icon: GraphIcon },
  ];

  const getSelectedIndex = () => {
    const index = navItems.findIndex(item => item.href === pathname);
    return index >= 0 ? index : 0;
  };

  return (
    <Box xcss={navContainerStyles}>
      <Box xcss={navInnerStyles}>
        {/* Brand */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box xcss={brandStyles}>
            SymProof Tree
          </Box>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'none' }} className="desktop-menu">
          <Tabs
            selected={getSelectedIndex()}
            id="navigation-tabs"
          >
            <TabList>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Tab key={item.href}>
                    <Link
                      href={item.href}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <IconComponent label={item.label} size="small" />
                      {item.label}
                    </Link>
                  </Tab>
                );
              })}
            </TabList>
          </Tabs>
        </div>

        {/* Mobile Navigation */}
        <div style={{ display: 'block' }} className="mobile-menu">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: isActive ? 'var(--ds-text-selected, #0052CC)' : 'var(--ds-text, #172B4D)',
                    backgroundColor: isActive ? 'var(--ds-background-selected, #DEEBFF)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '14px',
                  }}
                >
                  <IconComponent label={item.label} size="small" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </Box>

      {/* CSS for responsive behavior */}
      <style jsx>{`
        @media (min-width: 640px) {
          .desktop-menu {
            display: block !important;
          }
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </Box>
  );
}
