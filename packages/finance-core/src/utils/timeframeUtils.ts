import { dayjs } from '@mtr/utils';
import { ChartLongTimeframe, ChartShortTimeframe, ChartTimeframe } from '../types';

/**
 * 주어진 타임프레임에 따라 타임스탬프를 정규화된 시작 시간으로 변환합니다.
 * 예를 들어, 1분봉의 경우 해당 분의 시작 시간으로 밀리초를 절삭합니다.
 * @param timestamp ISO 8601 형식의 UTC 타임스탬프 문자열 또는 유닉스 타임스탬프(초).
 * @param timeframe 차트 타임프레임 (예: '1m', '5m', '1h', '1D').
 * @returns 정규화된 시작 시간의 ISO 8601 문자열.
 */
export const normalizeCandleTimestamp = (timestamp: string | number, timeframe: ChartTimeframe): string => {
  let date: dayjs.Dayjs;

  if (typeof timestamp === 'number') {
    // lightweight-charts에서 오는 time은 유닉스 타임스탬프(초)이므로 밀리초로 변환
    date = dayjs.unix(timestamp).utc();
  } else {
    // API에서 오는 timestamp는 ISO 문자열
    date = dayjs.utc(timestamp);
  }

  let normalizedTimestampMs: number; // 밀리초 단위의 정규화된 타임스탬프

  switch (timeframe) {
    case ChartShortTimeframe.ONE_MINUTE:
      normalizedTimestampMs = date.startOf('minute').valueOf();
      break;
    case ChartShortTimeframe.THREE_MINUTES:
      // 3분봉은 3분 단위로 끊어지는 시작 시간 (밀리초)
      const currentMinute3 = date.minute();
      const normalizedMinute3 = Math.floor(currentMinute3 / 3) * 3;
      normalizedTimestampMs = date.minute(normalizedMinute3).startOf('minute').valueOf();
      break;
    case ChartShortTimeframe.FIVE_MINUTES:
      // 5분봉은 5분 단위로 끊어지는 시작 시간 (밀리초)
      const currentMinute5 = date.minute();
      const normalizedMinute5 = Math.floor(currentMinute5 / 5) * 5;
      normalizedTimestampMs = date.minute(normalizedMinute5).startOf('minute').valueOf();
      break;
    case ChartShortTimeframe.TEN_MINUTES:
      // 10분봉은 10분 단위로 끊어지는 시작 시간 (밀리초)
      const currentMinute10 = date.minute();
      const normalizedMinute10 = Math.floor(currentMinute10 / 10) * 10;
      normalizedTimestampMs = date.minute(normalizedMinute10).startOf('minute').valueOf();
      break;
    case ChartShortTimeframe.THIRTY_MINUTES:
      // 30분봉은 30분 단위로 끊어지는 시작 시간 (밀리초)
      const currentMinute30 = date.minute();
      const normalizedMinute30 = Math.floor(currentMinute30 / 30) * 30;
      normalizedTimestampMs = date.minute(normalizedMinute30).startOf('minute').valueOf();
      break;
    case ChartShortTimeframe.ONE_HOUR: // 60분봉
      normalizedTimestampMs = date.startOf('hour').valueOf();
      break;
    case ChartLongTimeframe.ONE_DAY:
      normalizedTimestampMs = date.startOf('day').valueOf();
      break;
    case ChartLongTimeframe.ONE_WEEK:
      // ISO 주 시작은 월요일이므로 startOf('week')는 월요일 00:00:00으로 정규화
      normalizedTimestampMs = date.startOf('week').valueOf();
      break;
    case ChartLongTimeframe.ONE_MONTH:
      normalizedTimestampMs = date.startOf('month').valueOf();
      break;
    case ChartLongTimeframe.ONE_YEAR:
      normalizedTimestampMs = date.startOf('year').valueOf();
      break;
    default:
      normalizedTimestampMs = date.startOf('minute').valueOf(); // 기본값
      break;
  }

  return dayjs.utc(normalizedTimestampMs).toISOString(); // 정규화된 밀리초로 다시 dayjs 객체 생성 후 ISO String 반환
};
