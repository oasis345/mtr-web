'use client';

import { BaseTab, Button } from '@mtr/ui/client';

export const ChartToolbar = () => {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <BaseTab
        data={[
          { label: '차트', value: 'chart' },
          { label: '종목 정보', value: 'info' },
          { label: '뉴스', value: 'news' },
          { label: '커뮤니티', value: 'community' },
        ]}
        defaultValue="chart"
        onValueChange={() => {}}
        variant="underline"
      />
    </div>
  );
};
