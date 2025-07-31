import axios from "axios"
import { CryptoCurrenciesResponseSchema, CryptoPriceSchema } from "../schema/crypto-schema"
import type { CryptoCurrency, Pair } from "../types"

// Función que obtiene los datos desde la API
export async function getCryptos(): Promise<CryptoCurrency[] | undefined> {
  const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'
  const { data: { Data } } = await axios(url)
  const result = CryptoCurrenciesResponseSchema.safeParse(Data)
  if (result.success) {
    return result.data
  }
}

export async function fetchCurrentCryptoPrice(pair:Pair) {
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${pair.criptocurrency}&tsyms=${pair.currency}`
  const {data : { DISPLAY}} = await axios(url)
  console.log(DISPLAY [pair.criptocurrency][pair.currency])
  const result = CryptoPriceSchema.safeParse(DISPLAY[pair.criptocurrency][pair.currency])

  if(result.success) {
    return result.data
  }
}