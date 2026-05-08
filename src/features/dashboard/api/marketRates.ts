export interface CoinConfig {
  id: string
  symbol: string
  name: string
  color: string
}

export interface CoinRate extends CoinConfig {
  price: number | null
  change24h: number | null
}

export const COINS: CoinConfig[] = [
  { id: 'bitcoin',     symbol: 'BTC', name: 'Bitcoin',  color: '#f7931a' },
  { id: 'ethereum',    symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
  { id: 'solana',      symbol: 'SOL', name: 'Solana',   color: '#9945ff' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB',      color: '#f3ba2f' },
]

export async function fetchCryptoPrices(): Promise<CoinRate[]> {
  const ids = COINS.map(c => c.id).join(',')
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
  )
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  const json = await res.json()
  return COINS.map(coin => ({
    ...coin,
    price:     json[coin.id]?.usd             ?? null,
    change24h: json[coin.id]?.usd_24h_change  ?? null,
  }))
}
