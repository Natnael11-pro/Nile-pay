const HeaderBox = ({ type = "title", title, subtext, user }: HeaderBoxProps) => {
  return (
    <div className="header-box bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border border-green-100 dark:border-green-800 rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
        {title}
        {type === 'greeting' && user && (
          <span className="text-black dark:text-white font-semibold">
            ,&nbsp;{user}
          </span>
        )}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">{subtext}</p>
      {type === 'greeting' && (
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-green-500">🏦</span>
            <span>Ethiopian Banking</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⚡</span>
            <span>Instant Transfers</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-500">🔒</span>
            <span>Secure</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeaderBox