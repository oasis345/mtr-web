'use client';

import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { MarketData } from '@mtr/finance-core';
import { OptimizedImage } from '@mtr/ui/client'; // 또는 SmartImage

export interface SymbolCellProps extends ICellRendererParams<MarketData> {
  data: MarketData;
}

export const SymbolCell: React.FC<SymbolCellProps> = ({ data }) => {
  if (!data) return null;

  const logoFallback = (
    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-semibold text-muted-foreground">
      {data.symbol.charAt(0)}
    </div>
  );

  return (
    <div className="flex items-center gap-3 h-full py-1">
      <div className="flex-shrink-0">
        {data.logo ? (
          <OptimizedImage
            src={data.logo}
            alt={`${data.symbol} logo`}
            className="w-8 h-8 rounded-full object-cover border border-border"
            fallback={logoFallback}
          />
        ) : (
          logoFallback
        )}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className="font-semibold text-foreground text-sm truncate">{data.symbol}</span>
        {data.name && <span className="text-xs text-muted-foreground truncate">{data.name}</span>}
      </div>
    </div>
  );
};
