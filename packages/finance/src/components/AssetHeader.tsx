import { percentFormatter, formatPrice } from '../utils';
import { MarketData } from '../types';

export const AssetHeader = ({
  symbol,
  name,
  price,
  change,
  currency,
  changesPercentage,
}: Pick<MarketData, 'symbol' | 'name' | 'price' | 'change' | 'changesPercentage' | 'currency'>) => {
  // 등락 판단 기준: changesPercentage 우선, 없으면 change
  const basis = changesPercentage ?? change ?? 0;
  const isUp = basis >= 0;

  // 서버에서 퍼센트(예: 155.99)가 오므로 안전하게 포맷
  const percentText = percentFormatter(changesPercentage ?? 0);

  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-semibold">{name ?? symbol}</h1>
        <span className="text-zinc-400">{symbol}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold">{formatPrice(price, currency)}</span>
        <span className={`${isUp ? 'text-rose-500' : 'text-blue-500'} font-medium`}>
          {percentText}
        </span>
      </div>
    </div>
  );
};
