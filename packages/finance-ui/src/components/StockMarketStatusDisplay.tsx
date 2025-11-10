'use client';

import { StockMarketStatus } from '@mtr/finance-core';

export type StockMarketStatusDisplayProps = { status: keyof typeof StockMarketStatus };
export const StockMarketStatusDisplay = ({ status }: StockMarketStatusDisplayProps) => {
  let dotColorClass: string;

  switch (status) {
    case 'REGULAR':
    case 'PRE':
    case 'AFTER':
      dotColorClass = 'bg-green-500'; // 활성 상태 (정규, 프리, 애프터마켓)
      break;
    case 'CLOSE':
      dotColorClass = 'bg-gray-500'; // 폐장 상태
      break;
    default: // 모든 경우를 커버하기 위한 default 추가 (혹시 모를 서버의 정의되지 않은 키 대비)
      dotColorClass = 'bg-gray-400';
      break;
  }

  const displayValue = StockMarketStatus[status]; // 키를 사용하여 값을 가져옴

  return (
    <span className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${dotColorClass}`}></span>
      <span>{displayValue}</span>
    </span>
  );
};
