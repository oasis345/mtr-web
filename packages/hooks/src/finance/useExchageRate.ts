import { ExchangeRate, FinancialService } from '@mtr/finance-core'; // ExchangeRate 임포트
import { useQuery } from '@tanstack/react-query';

interface UseExchangeRateParams {
  fetcher: FinancialService['getExchangeRates'];
}

export const useExchangeRate = ({ fetcher }: UseExchangeRateParams) => {
  const response = useQuery<ExchangeRate, Error, number>({
    // 최종 반환되는 data가 number가 되도록 제네릭 수정
    queryKey: ['exchangeRate'],
    queryFn: fetcher,
    refetchInterval: 10000,
    staleTime: 10000,
    select: (data: ExchangeRate) => {
      return data.krw;
    },
  });

  return { ...response };
};
