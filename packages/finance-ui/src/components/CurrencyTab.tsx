'use client';
import { Currency } from '@mtr/finance-core';
import { BaseTab } from '@mtr/ui/client';
import { CURRENCY_MAP } from '../const';

type CurrencyTabProps = {
  currency: Currency;
  onValueChange?: (value: Currency) => void;
};

export const CurrencyTab = (props: CurrencyTabProps) => {
  return (
    <BaseTab
      data={CURRENCY_MAP}
      defaultValue={props.currency}
      onValueChange={(value: Currency) => {
        props.onValueChange?.(value);
      }}
    />
  );
};
