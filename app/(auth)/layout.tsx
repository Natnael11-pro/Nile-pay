import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {children}
      <div className="auth-asset relative overflow-hidden">
        {/* Ethiopian Flag Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-1/3 bg-gradient-to-r from-green-600 to-green-400"></div>
          <div className="h-1/3 bg-gradient-to-r from-yellow-400 to-yellow-300"></div>
          <div className="h-1/3 bg-gradient-to-r from-red-500 to-red-400"></div>
        </div>

        {/* Ethiopian Cultural Elements */}
        <div className="absolute top-8 right-8 text-6xl opacity-20">
          🇪🇹
        </div>

        <div className="relative z-10 flex items-center justify-center h-full p-8">
          <div className="text-center space-y-6">
            <div className="text-4xl font-bold text-black">
              Welcome to Nile Pay
            </div>
            <div className="text-lg text-gray-600 max-w-md">
              Ethiopia's most trusted digital payment platform. Send money, pay bills, and manage your finances with ease.
            </div>

            {/* Ethiopian Features */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="text-center p-4 bg-white/80 rounded-xl backdrop-blur-sm">
                <div className="text-2xl mb-2">🏦</div>
                <div className="text-sm font-semibold text-gray-700">All Ethiopian Banks</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-xl backdrop-blur-sm">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-semibold text-gray-700">Instant Transfers</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-xl backdrop-blur-sm">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-sm font-semibold text-gray-700">Bank-Level Security</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-xl backdrop-blur-sm">
                <div className="text-2xl mb-2">📱</div>
                <div className="text-sm font-semibold text-gray-700">Mobile First</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
