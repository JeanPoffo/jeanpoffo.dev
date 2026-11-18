import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="space-x-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-6xl font-medium leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:border-r-2 md:px-6 md:text-8xl md:leading-14">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-medium leading-normal md:text-2xl">
          Não conseguimos encontrar a página solicitada.
        </p>
        <p className="mb-8">Você pode encontrar vários posts interessantes na página inicial.</p>
        <Link
          href="/"
          className="inline border border-transparent bg-primary-500 px-4 py-2 font-mono text-xs uppercase tracking-wider text-gray-50 transition-colors duration-150 hover:bg-primary-600 focus:outline-none"
        >
          Voltar a página inicial
        </Link>
      </div>
    </div>
  )
}
