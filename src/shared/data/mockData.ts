export interface Transaction {
  id: string
  company: string
  amount: string
  wallet: string
  walletFull: string
  network: string
  networkFee: string
  status: 'completed' | 'pending' | 'failed'
  date: string
}

export interface Exporter {
  id: number
  company: string
  country: string
  transactions: number
  volume: string
  volumeRaw: number
}

export interface KYBItem {
  id: number
  company: string
  submitted: string
  daysPending: number
  urgency: 'High' | 'Medium' | 'Low'
}

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'exporters', label: 'Exporters', icon: 'exporters' },
  { id: 'transactions', label: 'Transactions', icon: 'transactions' },
  { id: 'kyb', label: 'KYB Reviews', icon: 'kyb' },
  { id: 'wallets', label: 'Wallets', icon: 'wallets' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

export const statCards = [
  {
    id: 'volume',
    title: 'Total Transaction Volume',
    value: '$1.28M',
    trend: '+12.4% from last month',
    trendDirection: 'up',
    icon: 'currency',
  },
  {
    id: 'exporters',
    title: 'Active Exporters',
    value: '248',
    trend: '+3 new this week',
    trendDirection: 'up',
    icon: 'users',
  },
  {
    id: 'kyb',
    title: 'Pending KYB Reviews',
    value: '17',
    trend: '5 require urgent action',
    trendDirection: 'down',
    icon: 'shield',
  },
]

export const transactions = [
  {
    id: 'TXN-8821',
    company: 'Meridian Exports Ltd',
    amount: '$84,200.00',
    wallet: '0x4F3c...e9A1',
    walletFull: '0x4F3cA8B12d6E2Cc1F7094bB3E5A9c2d01ef7e9A1',
    network: 'ethereum',
    networkFee: '$2.40',
    status: 'completed',
    date: 'May 07, 2026',
  },
  {
    id: 'TXN-8820',
    company: 'Goldcrest Trading Co.',
    amount: '$210,500.00',
    wallet: '0xA91d...3Fc2',
    walletFull: '0xA91dB4C3e82F17a09D5c64E3Fb2891A00cd43Fc2',
    network: 'polygon',
    networkFee: '$0.02',
    status: 'completed',
    date: 'May 06, 2026',
  },
  {
    id: 'TXN-8819',
    company: 'Pinnacle Agro Exports',
    amount: '$37,850.00',
    wallet: '0x7bE1...0DA4',
    walletFull: '0x7bE1F2C94A3d8B056e1Dc7F3a9200B4E6cf70DA4',
    network: 'bnb',
    networkFee: '$0.15',
    status: 'pending',
    date: 'May 06, 2026',
  },
  {
    id: 'TXN-8818',
    company: 'Harborline Freight',
    amount: '$126,000.00',
    wallet: '0x2cD8...F5b9',
    walletFull: '0x2cD8E1A4b9F37C20d6B891Ec4A35f7D002a4F5b9',
    network: 'ethereum',
    networkFee: '$2.40',
    status: 'failed',
    date: 'May 05, 2026',
  },
  {
    id: 'TXN-8817',
    company: 'NovaTex Industries',
    amount: '$58,400.00',
    wallet: '0x9eF0...7Ac3',
    walletFull: '0x9eF0C2B1d5A84E37f0c9D682Ba4310F7e2b87Ac3',
    network: 'solana',
    networkFee: '$0.001',
    status: 'pending',
    date: 'May 05, 2026',
  },
  {
    id: 'TXN-8816',
    company: 'Evergreen Commodities',
    amount: '$305,000.00',
    wallet: '0x1aB5...D2e6',
    walletFull: '0x1aB5F9C3e2D8B47A0d6E1C4b8F23a91E05c3D2e6',
    network: 'bnb',
    networkFee: '$0.15',
    status: 'completed',
    date: 'May 04, 2026',
  },
  {
    id: 'TXN-8815',
    company: 'Summit Trade Partners',
    amount: '$92,750.00',
    wallet: '0x6Ff2...88Cd',
    walletFull: '0x6Ff2A1B8c3D4E07f9b2C5d8E3a61F49B0e7488Cd',
    network: 'polygon',
    networkFee: '$0.02',
    status: 'completed',
    date: 'May 04, 2026',
  },
]

export const topExporters = [
  { id: 1, company: 'Pacific Rim Trading Co.', country: 'Singapore', transactions: 42, volume: '$842K', volumeRaw: 842000 },
  { id: 2, company: 'Gulf Commodities Ltd',    country: 'UAE',        transactions: 37, volume: '$718K', volumeRaw: 718000 },
  { id: 3, company: 'Meridian Export Group',   country: 'Malaysia',   transactions: 29, volume: '$534K', volumeRaw: 534000 },
  { id: 4, company: 'Nordic Freight AB',       country: 'Sweden',     transactions: 21, volume: '$391K', volumeRaw: 391000 },
  { id: 5, company: 'Andean Trade Partners',   country: 'Chile',      transactions: 14, volume: '$203K', volumeRaw: 203000 },
]

export const kybQueue = [
  { id: 1, company: 'Horizon Logistics Pte',   submitted: 'Apr 28, 2026', daysPending: 10, urgency: 'High'   },
  { id: 2, company: 'Atlas Cargo Solutions',   submitted: 'May 1, 2026',  daysPending: 7,  urgency: 'High'   },
  { id: 3, company: 'Coastal Minerals Corp',   submitted: 'May 3, 2026',  daysPending: 5,  urgency: 'Medium' },
  { id: 4, company: 'Sunrise Exports Sdn Bhd', submitted: 'May 5, 2026',  daysPending: 3,  urgency: 'Medium' },
  { id: 5, company: 'Delta Commodities Inc',   submitted: 'May 6, 2026',  daysPending: 2,  urgency: 'Low'    },
]
