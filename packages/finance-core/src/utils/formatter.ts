import { _ } from '@mtr/utils';
import { AssetType, Currency } from '../types';

// --- KRW 포매터 ---
// 1-1. 일반적인 원화 포매터 (소수점 없음)
const standardKrwFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0, // 1원 미만은 반올림되므로, 정수 표시에 사용
});

// [신규] 암호화폐를 위한 고정밀 원화 포매터 (소수점 2~4자리)
const cryptoKrwFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4, // 4자리까지 정밀도 지원
});

// --- USD 포매터 ---
// 2-1. 일반적인 달러 포매터 (소수점 2자리)
const standardUsdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// 2-2. 1센트 미만의 값을 위한 고정밀 달러 포매터 (유효숫자 4자리)
const preciseUsdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 4,
});

export const volumeFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'decimal',
  notation: 'compact',
  maximumFractionDigits: 2,
});

const percentIntl = new Intl.NumberFormat('ko-KR', {
  style: 'percent',
  signDisplay: 'exceptZero',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const percentFormatter = (value: number | null | undefined): string => {
  if (value == null) return '-';
  return percentIntl.format(value);
};

export const convertCurrency = (
  price: number,
  opts: { from: Currency; to: Currency; exchangeRate: number },
): number => {
  const { from, to, exchangeRate } = opts;

  // 변환할 필요가 없는 경우
  if (from === to) {
    return price;
  }

  // KRW -> USD 변환
  if (from === 'KRW' && to === 'USD') {
    return price / exchangeRate;
  }

  // USD -> KRW 변환
  if (from === 'USD' && to === 'KRW') {
    return price * exchangeRate;
  }

  // 지원하지 않는 변환의 경우, 원본 가격을 그대로 반환 (혹은 에러 처리)
  console.warn(`Unsupported currency conversion from ${from} to ${to}`);
  return price;
};

export const formatPrice = (
  price: number | null | undefined,
  opts: { currency: Currency; assetType: AssetType }, // 옵션 객체로 변경
): string => {
  if (price == null) return '-';

  const { currency, assetType } = opts; // 구조 분해 할당으로 옵션 사용

  // --- 원화(KRW) 포매팅 로직 ---
  if (currency === 'KRW') {
    // [핵심] assetType이 'stock'이면 무조건 표준 포매터(정수) 사용
    if (assetType === AssetType.STOCKS) {
      return standardKrwFormatter.format(price);
    }

    // assetType이 'crypto'인 경우, 소수부 존재 여부로 분기 처리
    if (assetType === 'crypto') {
      const hasDecimal = price !== Math.floor(price);
      if (price !== 0 && hasDecimal) {
        return cryptoKrwFormatter.format(price); // 암호화폐용 고정밀 포매터 사용
      }
      return standardKrwFormatter.format(price); // 소수부가 없는 암호화폐 가격
    }
  }

  // --- 달러(USD) 포매팅 로직 ---
  // (달러는 주식/코인 모두 소수점 2자리가 표준이므로 기존 로직 유지 가능)
  if (currency === 'USD') {
    if (price > 0 && price < 0.01) {
      return preciseUsdFormatter.format(price);
    }
    return standardUsdFormatter.format(price);
  }

  return price.toLocaleString();
};
