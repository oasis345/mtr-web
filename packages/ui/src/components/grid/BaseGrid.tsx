import { AllCommunityModule, GridOptions, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';

// === 주식 사이트 전용 테마들 ===

// 1. 전통적인 금융 테마 (Professional Dark)
const professionalDarkTheme = themeQuartz.withParams({
  backgroundColor: '#1a1a1a',
  foregroundColor: '#ffffff',
  headerTextColor: '#ffffff',
  headerBackgroundColor: '#2d3748',
  oddRowBackgroundColor: 'rgba(255, 255, 255, 0.02)',
  evenRowBackgroundColor: '#1a1a1a',
  borderColor: '#4a5568',
  headerColumnResizeHandleColor: '#718096',
  cellHorizontalBorder: true,
  headerHeight: 48,
  rowHeight: 40,
});

// 2. 현대적인 라이트 테마 (Modern Light)
const modernLightTheme = themeQuartz.withParams({
  backgroundColor: '#ffffff',
  foregroundColor: '#2d3748',
  headerTextColor: '#1a202c',
  headerBackgroundColor: '#f7fafc',
  oddRowBackgroundColor: '#f9fafb',
  evenRowBackgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  headerColumnResizeHandleColor: '#a0aec0',
  cellHorizontalBorder: true,
  headerHeight: 48,
  rowHeight: 40,
});

// 3. 불마켓 테마 (Bull Market Green)
const bullMarketTheme = themeQuartz.withParams({
  backgroundColor: '#0f1419',
  foregroundColor: '#e8f5e8',
  headerTextColor: '#ffffff',
  headerBackgroundColor: '#1b4332',
  oddRowBackgroundColor: 'rgba(34, 197, 94, 0.05)',
  evenRowBackgroundColor: '#0f1419',
  borderColor: '#2d5a3d',
  headerColumnResizeHandleColor: '#22c55e',
  cellHorizontalBorder: true,
  headerHeight: 48,
  rowHeight: 40,
});

// 4. 베어마켓 테마 (Bear Market Red)
const bearMarketTheme = themeQuartz.withParams({
  backgroundColor: '#1a0b0b',
  foregroundColor: '#fef2f2',
  headerTextColor: '#ffffff',
  headerBackgroundColor: '#7f1d1d',
  oddRowBackgroundColor: 'rgba(239, 68, 68, 0.05)',
  evenRowBackgroundColor: '#1a0b0b',
  borderColor: '#7c2d12',
  headerColumnResizeHandleColor: '#ef4444',
  cellHorizontalBorder: true,
  headerHeight: 48,
  rowHeight: 40,
});

// 5. 프리미엄 골드 테마 (Premium Gold)
const premiumGoldTheme = themeQuartz.withParams({
  backgroundColor: '#1c1917',
  foregroundColor: '#fbbf24',
  headerTextColor: '#ffffff',
  headerBackgroundColor: '#92400e',
  oddRowBackgroundColor: 'rgba(251, 191, 36, 0.05)',
  evenRowBackgroundColor: '#1c1917',
  borderColor: '#a16207',
  headerColumnResizeHandleColor: '#fbbf24',
  cellHorizontalBorder: true,
  headerHeight: 48,
  rowHeight: 40,
});

// 6. 블루칩 테마 (Blue Chip)
const blueChipTheme = themeQuartz.withParams({
  backgroundColor: '#0f172a',
  foregroundColor: '#e2e8f0',
  headerTextColor: '#ffffff',
  headerBackgroundColor: '#1e40af',
  oddRowBackgroundColor: 'rgba(59, 130, 246, 0.05)',
  evenRowBackgroundColor: '#0f172a',
  borderColor: '#1e3a8a',
  headerColumnResizeHandleColor: '#3b82f6',
  cellHorizontalBorder: true,
  headerHeight: 48,
  rowHeight: 40,
});

// 7. 크립토 테마 (Crypto Neon)
const cryptoNeonTheme = themeQuartz.withParams({
  backgroundColor: '#0a0a0a',
  foregroundColor: '#00d9ff',
  headerTextColor: '#ffffff',
  headerBackgroundColor: '#1a1a2e',
  oddRowBackgroundColor: 'rgba(0, 217, 255, 0.03)',
  evenRowBackgroundColor: '#0a0a0a',
  borderColor: '#16213e',
  headerColumnResizeHandleColor: '#00d9ff',
  cellHorizontalBorder: true,
  headerHeight: 48,
  rowHeight: 40,
});

// 8. 미니멀 화이트 테마 (Minimal White)
const minimalWhiteTheme = themeQuartz.withParams({
  backgroundColor: '#ffffff',
  foregroundColor: '#374151',
  headerTextColor: '#111827',
  headerBackgroundColor: '#ffffff',
  oddRowBackgroundColor: '#f9fafb',
  evenRowBackgroundColor: '#ffffff',
  borderColor: '#f3f4f6',
  headerColumnResizeHandleColor: '#9ca3af',
  cellHorizontalBorder: false,
  headerHeight: 44,
  rowHeight: 36,
});

// 테마 맵핑 객체
export const GRID_THEMES = {
  PROFESSIONAL_DARK: professionalDarkTheme,
  MODERN_LIGHT: modernLightTheme,
  BULL_MARKET: bullMarketTheme,
  BEAR_MARKET: bearMarketTheme,
  PREMIUM_GOLD: premiumGoldTheme,
  BLUE_CHIP: blueChipTheme,
  CRYPTO_NEON: cryptoNeonTheme,
  MINIMAL_WHITE: minimalWhiteTheme,
} as const;

export type GridThemeType = keyof typeof GRID_THEMES;

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface BaseGridProps {
  data: any[];
  columns: any[];
  height?: number;
  theme?: GridThemeType;
  options?: AgGridReactProps<GridOptions>;
}

export const BaseGrid = ({
  data,
  columns,
  height = 600,
  theme = 'PROFESSIONAL_DARK',
  options,
  ...rest
}: BaseGridProps) => {
  const selectedTheme = GRID_THEMES[theme];

  return (
    <div style={{ height }}>
      <AgGridReact
        rowData={data}
        columnDefs={columns}
        theme={selectedTheme}
        // 추가 그리드 옵션들
        animateRows={true}
        enableCellTextSelection={true}
        headerHeight={selectedTheme.headerHeight || 48}
        rowHeight={selectedTheme.rowHeight || 40}
        {...rest}
        {...options}
      />
    </div>
  );
};
