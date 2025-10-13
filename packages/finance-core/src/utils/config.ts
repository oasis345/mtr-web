import { AssetType, ChartLongTimeframe, ChartShortTimeframe, ChartTimeframe } from '../types';

/**
 * 각 차트 타임프레임에 따라 API 요청 시 사용할 기본 limit(데이터 개수)을 반환합니다.
 * @param timeframe - 차트 타임프레임 (e.g., '1T', '1D', '1M')
 * @returns {number} 해당 타임프레임에 권장되는 데이터 개수
 */
export const getLimitByTimeframe = (assetType: AssetType, timeframe: ChartTimeframe): number => {
  if (assetType === AssetType.CRYPTO) return 200;

  switch (timeframe) {
    // 단기 (Intraday): 최근 몇 시간의 데이터를 보여주기에 충분한 양
    case ChartShortTimeframe.ONE_MINUTE:
    case ChartShortTimeframe.THREE_MINUTES:
    case ChartShortTimeframe.FIVE_MINUTES:
    case ChartShortTimeframe.TEN_MINUTES:
    case ChartShortTimeframe.THIRTY_MINUTES:
    case ChartShortTimeframe.ONE_HOUR:
      return 300;

    // 중기 (Daily/Weekly): 1-2년 간의 추세를 보여주기에 충분한 양
    case ChartLongTimeframe.ONE_DAY:
    case ChartLongTimeframe.ONE_WEEK:
      return 300;

    // 장기 (Monthly/Yearly): 수십 년의 장기 역사를 보여주기 위한 많은 양
    case ChartLongTimeframe.ONE_MONTH:
    case ChartLongTimeframe.ONE_YEAR:
      return 500;

    // 예외적인 경우를 위한 기본값
    default:
      return 200;
  }
};
