export interface MarketDataEvent {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  timestamp: number;
}
