// store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getCryptos, fetchCurrentCryptoPrice } from "./services/CryptoServices";
import type { CryptoCurrency, CryptoPrice, Pair } from "./types";

// Estado inicial del resultado
const initialResult: CryptoPrice = {
  IMAGEURL: "",
  PRICE: "",
  HIGHDAY: "",
  CHANGEPCT24HOUR: "",
  LOWDAY: "",
  LASTUPDATE: "",
};

loading: false

type CryptoStore = {
  cryptocurrencies: CryptoCurrency[];
  result: CryptoPrice;
  loading: boolean
  fetchCryptos: () => Promise<void>;
  fetchData: (pair: Pair) => Promise<void>;
};

export const useCryptoStore = create<CryptoStore>()(
  devtools((set) => ({
    cryptocurrencies: [],
    result: initialResult,

    fetchCryptos: async () => {
      const cryptocurrencies = await getCryptos();
      if (cryptocurrencies) {
        set({ cryptocurrencies }, false, "fetchCryptos");
      }
    },

    fetchData: async (pair) => {
       set(() => ({ loading: true }))
  
  const result = await fetchCurrentCryptoPrice(pair);
  if (result) {
    set(() => ({ result, loading: false }))
  }
}

  }))
);
