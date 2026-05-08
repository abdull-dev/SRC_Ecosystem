import { motion } from 'framer-motion'
import StatCard from '../../shared/components/ui/StatCard'
import TransactionTable from '../../shared/components/ui/TransactionTable'
import TopExporters from './components/TopExporters'
import KYBQueue from './components/KYBQueue'
import MarketRatesWidget from './components/MarketRatesWidget'
import { statCards, transactions, topExporters, kybQueue } from '../../shared/data/mockData'

const cardGridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

export default function DashboardPage() {
  return (
    <>
      <motion.div
        variants={cardGridVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"
      >
        {statCards.map(card => (
          <StatCard key={card.id} {...card} />
        ))}
      </motion.div>

      <TransactionTable transactions={transactions} />

      <div className="mt-5">
        <MarketRatesWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <TopExporters exporters={topExporters} />
        <KYBQueue items={kybQueue} />
      </div>
    </>
  )
}
