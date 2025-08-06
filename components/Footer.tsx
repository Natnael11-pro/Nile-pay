import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  const router = useRouter();

  const handleLogOut = async () => {
    const loggedOut = await logoutAccount();

    if(loggedOut) router.push('/sign-in')
  }

  return (
    <footer className="footer bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border border-green-100 dark:border-green-800 rounded-xl p-3 shadow-sm max-w-full overflow-hidden">
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
          <p className="text-sm font-bold text-white">
            {user?.firstName?.[0] || 'U'}
          </p>
        </div>
      </div>

      <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email min-w-0 flex-1'}>
          <h1 className="text-xs truncate text-gray-800 dark:text-gray-200 font-semibold">
            {user?.firstName || 'User'}
          </h1>
          <p className="text-xs truncate font-normal text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
      </div>

      <button
        type="button"
        className="footer_image bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/50 rounded-lg p-2 transition-colors duration-200 group flex-shrink-0"
        onClick={handleLogOut}
        title="Logout"
      >
        <div className="w-4 h-4 relative">
          <Image src="/icons/logout.svg" fill alt="logout" className="group-hover:scale-110 transition-transform duration-200" />
        </div>
      </button>
    </footer>
  )
}

export default Footer