import { StockMarketStatus } from '@mtr/finance-core';
import { useQuery } from '@tanstack/react-query';

export interface UseStockMarketStatusParams {
  country: string;
  fetcher: (country: string) => Promise<keyof typeof StockMarketStatus>;
}

export const useStockMarketStatus = ({ country, fetcher }: UseStockMarketStatusParams) => {
  const response = useQuery<keyof typeof StockMarketStatus>({
    queryKey: [country],
    queryFn: () => fetcher(country),
    gcTime: 0,
    staleTime: 0,
  });

  return { ...response };
};
