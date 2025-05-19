import { create } from "zustand";
import { useEffect } from "react";
import socket from "@/lib/socket";

type TickerData = {
  baseToken: string;
  quoteToken: string;
  tradePrice: number;
  changeRate: number;
  volume: number;
};

type MarketState = {
  tickers: TickerData[];
  updateTicker: (ticker: TickerData) => void;
};

export const useMarketStore = create<MarketState>((set) => ({
  tickers: [],
  updateTicker: (ticker) =>
    set((state) => ({
      tickers: {
        ...state.tickers,
      },
    })),
}));

export const useMarketSocket = () => {
  const updateTicker = useMarketStore((state) => state.updateTicker);

  useEffect(() => {
    try {
      socket.on("ticker", (data) => {
        debugger;
        updateTicker(data);
      });

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.error("MarketSocket Failed to initialize:", error);
    }
  }, [updateTicker]);
};
