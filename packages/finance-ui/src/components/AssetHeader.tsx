import { percentFormatter, MarketData } from '@mtr/finance-core';
import { OptimizedImage } from '@mtr/ui/client';

export type AssetHeaderProps = Omit<MarketData, 'price'> & {
  price: string;
};

export const AssetHeader = ({
  symbol,
  name,
  price,
  change,
  changePercentage,
  logo,
}: AssetHeaderProps) => {
  const basis = changePercentage ?? change ?? 0;
  const isUp = basis >= 0;

  return (
    <div className="flex mb-4 items-center gap-x-2">
      <div className="flex gap-3">
        <div className="flex">
          <OptimizedImage
            src={logo}
            alt={name ?? symbol}
            className="w-12 h-12 border border-border rounded-sm"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex gap-x-2 items-baseline">
          <h1 className="text-xl font-semibold">{name ?? symbol}</h1>
          <span className="text-zinc-400 text-sm">{symbol}</span>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex justify-start items-baseline gap-x-2">
            <span className="text-2xl font-bold">{price}</span>
            <span className={`${isUp ? 'text-rose-500' : 'text-blue-500'} text-sm`}>
              {percentFormatter(changePercentage)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
