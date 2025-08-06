import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';

const TotalBalanceBox = ({
  accounts = [], totalBanks, totalCurrentBalance
}: TotalBalanceBoxProps) => {
  return (
    <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl border border-green-400/20 relative overflow-hidden">
      {/* Ethiopian Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-3xl sm:text-4xl lg:text-6xl">🇪🇹</div>
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-2xl sm:text-3xl lg:text-4xl">💰</div>
      </div>

      {/* Desktop Layout */}
      <div className="relative z-10 hidden lg:flex items-center gap-8">
        <div className="total-balance-chart flex-shrink-0">
          <DoughnutChart accounts={accounts} />
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏦</span>
            <h2 className="text-xl font-bold text-white">
              Ethiopian Bank Accounts: {totalBanks}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">💎</span>
              <p className="text-green-100 font-medium text-lg">
                Total Balance (ETB)
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <span className="text-3xl">💵</span>
              <div className="text-3xl font-bold text-white flex items-center gap-2">
                <span className="text-yellow-300">ETB</span>
                <AnimatedCounter amount={totalCurrentBalance} />
              </div>
            </div>
          </div>

          {/* Ethiopian Banking Features */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
              <div className="text-xl mb-1">⚡</div>
              <div className="text-xs text-green-100">Instant Transfer</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
              <div className="text-xl mb-1">🔒</div>
              <div className="text-xs text-green-100">Bank Security</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="relative z-10 lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">🏦</span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Accounts: {totalBanks}
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-green-100 bg-white/10 px-2 py-1 rounded-full">
            Ethiopian Banking
          </div>
        </div>

        {/* Balance Display */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-yellow-300 text-lg">💎</span>
            <p className="text-green-100 font-medium text-sm sm:text-base">
              Total Balance
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg sm:text-xl">💵</span>
              <span className="text-yellow-300 text-lg sm:text-xl font-bold">ETB</span>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              <AnimatedCounter amount={totalCurrentBalance} />
            </div>
          </div>
        </div>

        {/* Chart - Smaller on Mobile */}
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 sm:w-40 sm:h-40">
            <DoughnutChart accounts={accounts} />
          </div>
        </div>

        {/* Features - Mobile Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center backdrop-blur-sm">
            <div className="text-lg sm:text-xl mb-1">⚡</div>
            <div className="text-xs text-green-100">Instant Transfer</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center backdrop-blur-sm">
            <div className="text-lg sm:text-xl mb-1">🔒</div>
            <div className="text-xs text-green-100">Bank Security</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox