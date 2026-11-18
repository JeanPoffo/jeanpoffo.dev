import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 py-8 dark:border-gray-800">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3 flex items-center gap-3 text-xl font-medium tracking-tight">
              <span aria-hidden className="inline-block h-3 w-3 bg-primary-400" />
              {siteMetadata.headerTitle}
            </div>
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hidden font-mono text-xs uppercase tracking-wider text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 sm:block"
            >
              {link.title}
            </Link>
          ))}
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
