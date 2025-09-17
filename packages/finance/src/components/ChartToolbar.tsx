'use client';

import { BaseTab, Button } from '@mtr/ui/client';

type Interval = '1m' | '1h' | '1d' | '1w';
type ToolbarProps = {
  interval: Interval;
  onIntervalChange: (v: Interval) => void;
  showMA: boolean;
  showVolume: boolean;
  onToggleMA: () => void;
  onToggleVolume: () => void;
};

export const ChartToolbar = ({
  interval,
  onIntervalChange,
  showMA,
  showVolume,
  onToggleMA,
  onToggleVolume,
}: ToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <BaseTab
        data={[
          { label: '차트', value: 'chart' },
          { label: '종목 정보', value: 'info' },
          { label: '뉴스', value: 'news' },
          { label: '커뮤니티', value: 'community' },
        ]}
        defaultValue={interval}
        onValueChange={v => onIntervalChange(v as Interval)}
      />
      {/* <div className="flex items-center gap-2">
        <Button onClick={onToggleMA} aria-pressed={showMA}>
          이동평균
        </Button>
        <Button onClick={onToggleVolume} aria-pressed={showVolume}>
          거래량
        </Button>
      </div> */}
    </div>
  );
};
