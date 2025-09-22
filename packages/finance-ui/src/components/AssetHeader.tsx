import { percentFormatter, formatPrice, MarketData } from '@mtr/finance-core';

export const AssetHeader = ({
  symbol,
  name,
  price,
  change,
  currency,
  changesPercentage,
  assetType,
}: MarketData) => {
  const basis = changesPercentage ?? change ?? 0;
  const isUp = basis >= 0;

  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-semibold">{name ?? symbol}</h1>
        <span className="text-zinc-400">{symbol}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold">{formatPrice(price, { currency, assetType })}</span>
        <span className={`${isUp ? 'text-rose-500' : 'text-blue-500'} font-medium`}>
          {percentFormatter(changesPercentage)}
        </span>
      </div>
    </div>
  );
};
