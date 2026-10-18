
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/productService'
import type { Product } from '../types/product'
import {
  getUsageLogs,
  type UsageLog,
} from '../services/usageLogService'

function parseLocalDate(value: string | null | undefined): Date | null {
  if (!value) return null

  const datePart = value.slice(0, 10)
  const parts = datePart.split('-').map(Number)

  if (parts.length !== 3 || parts.some(Number.isNaN)) return null

  const [year, month, day] = parts
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatDate(value: string | null | undefined): string {
  const date = parseLocalDate(value)
  if (!date) return 'No date recorded'

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getDaysUntil(dateValue: string | null | undefined): number | null {
  const date = parseLocalDate(dateValue)
  if (!date) return null

  const today = startOfDay(new Date())
  return Math.round((startOfDay(date).getTime() - today.getTime()) / 86400000)
}

function greeting(): string {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value)
}

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usageLoading, setUsageLoading] = useState(false)
  const [usageError, setUsageError] = useState<string | null>(null)

  async function loadProducts() {
    setLoading(true)
    setError(null)

    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load your products. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  useEffect(() => {
    let active = true

    async function loadUsageLogs() {
      if (products.length === 0) {
        setUsageLogs([])
        setUsageError(null)
        setUsageLoading(false)
        return
      }

      setUsageLoading(true)
      setUsageError(null)

      try {
        const logsByProduct = await Promise.all(
          products.map((product) => getUsageLogs(product.id)),
        )

        if (active) {
          setUsageLogs(logsByProduct.flat())
        }
      } catch (err) {
        if (active) {
          setUsageError(
            err instanceof Error
              ? err.message
              : 'Usage insights are temporarily unavailable.',
          )
        }
      } finally {
        if (active) setUsageLoading(false)
      }
    }

    void loadUsageLogs()

    return () => {
      active = false
    }
  }, [products])

  const today = startOfDay(new Date())

  const upcomingProducts = useMemo(
    () =>
      products
        .filter((product) => {
          const days = getDaysUntil(product.expirationDate)
          return days !== null && days >= 0 && days <= 30
        })
        .sort(
          (a, b) =>
            (getDaysUntil(a.expirationDate) ?? 9999) -
            (getDaysUntil(b.expirationDate) ?? 9999),
        ),
    [products],
  )

  const expiredProducts = useMemo(
    () =>
      products
        .filter((product) => {
          const days = getDaysUntil(product.expirationDate)
          return days !== null && days < 0
        })
        .sort(
          (a, b) =>
            (getDaysUntil(a.expirationDate) ?? 0) -
            (getDaysUntil(b.expirationDate) ?? 0),
        ),
    [products],
  )

  const recentProducts = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        )
        .slice(0, 4),
    [products],
  )

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return products

    return products.filter((product) =>
      [
        product.name,
        product.brand,
        product.category,
        product.subcategory ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [products, search])

  const recordedValue = products.reduce(
    (total, product) => total + (product.price ?? 0),
    0,
  )

  const productsWithExpiry = products.filter(
    (product) => Boolean(product.expirationDate),
  ).length

  const recentUsageLogs = useMemo(
    () =>
      [...usageLogs]
        .filter((log) => products.some((product) => product.id === log.productId))
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        .slice(0, 5),
    [usageLogs, products],
  )

  const productNames = useMemo(
    () => new Map(products.map((product) => [product.id, product.name])),
    [products],
  )

  const categoryCount = new Set(products.map((product) => product.category)).size

  const greetingText = greeting()

  return (
    <main className="min-h-screen bg-[#f5f5ef] px-4 py-6 text-[#183533] sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8c9a8c]">
              Your personal care space
            </p>
            <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
              {greetingText}.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#7d8980]">
              A little overview of your shelf, your products, and what needs
              your attention.
            </p>
          </div>

          <Link
            to="/add-product"
            className="inline-flex w-fit items-center gap-2 bg-[#244d43] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#183b33]"
          >
            <span className="text-lg leading-none">+</span>
            Add a product
          </Link>
        </header>

        {/* Search and shortcuts */}
        <section className="flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 items-center gap-3 border border-[#e4e7df] bg-white/80 px-4 py-3">
            <span className="text-[#819087]" aria-hidden="true">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product, brand, or category..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#a1aaa1]"
              aria-label="Search products"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs text-[#718077] hover:text-[#183533]"
              >
                Clear
              </button>
            )}
          </label>

          <Link
            to="/expiring"
            className="border border-[#e4e7df] bg-white/80 px-5 py-3 text-center text-sm text-[#49645a] transition hover:bg-white"
          >
            Review expiration dates →
          </Link>
        </section>

        {/* Loading and error */}
        {loading && (
          <div className="border border-[#e4e7df] bg-white/70 p-8 text-sm text-[#718077]">
            Loading your shelf...
          </div>
        )}

        {!loading && error && (
          <div className="border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-800">{error}</p>
            <button
              type="button"
              onClick={() => void loadProducts()}
              className="mt-3 text-sm font-medium text-red-900 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Summary cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Products on your shelf"
                value={products.length.toString()}
                detail={`${categoryCount} ${
                  categoryCount === 1 ? 'category' : 'categories'
                }`}
                accent="sage"
              />
              <SummaryCard
                label="Expiring soon"
                value={upcomingProducts.length.toString()}
                detail="Within the next 30 days"
                accent="gold"
              />
              <SummaryCard
                label="Past expiration"
                value={expiredProducts.length.toString()}
                detail="Products to review"
                accent="rose"
              />
              <SummaryCard
                label="Recorded value"
                value={formatCurrency(recordedValue)}
                detail="Sum of entered product prices"
                accent="cream"
              />
            </section>

            {/* Empty state */}
            {products.length === 0 ? (
              <section className="border border-[#e4e7df] bg-white/75 px-6 py-16 text-center sm:px-12">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7eee7] text-2xl text-[#416c5c]">
                  ✳
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#89978b]">
                  A fresh start
                </p>
                <h2 className="mt-3 text-2xl font-light">
                  Your shelf is waiting.
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#7d8980]">
                  Add your first skincare, wellness, or household product to
                  start keeping track of expiration dates and usage.
                </p>
                <Link
                  to="/add-product"
                  className="mt-6 inline-flex bg-[#244d43] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#183b33]"
                >
                  Add your first product
                </Link>
              </section>
            ) : (
              <>
                {/* Expiration timeline */}
                <section className="border border-[#e4e7df] bg-white/75 p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#89978b]">
                        Stay ahead
                      </p>
                      <h2 className="mt-2 text-xl font-medium">
                        Expiration timeline
                      </h2>
                      <p className="mt-2 text-sm text-[#89978b]">
                        Products that may need attention soon.
                      </p>
                    </div>
                    <Link
                      to="/expiring"
                      className="text-sm text-[#496c5c] hover:underline"
                    >
                      View all →
                    </Link>
                  </div>

                  {upcomingProducts.length === 0 ? (
                    <p className="mt-6 bg-[#f1f5ef] p-5 text-sm text-[#718077]">
                      Nothing is expiring within the next 30 days based on
                      your recorded dates.
                    </p>
                  ) : (
                    <div className="mt-6 divide-y divide-[#e8ebe4]">
                      {upcomingProducts.slice(0, 5).map((product) => {
                        const days = getDaysUntil(product.expirationDate) ?? 0

                        return (
                          <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {product.name}
                              </p>
                              <p className="mt-1 text-xs text-[#89978b]">
                                {product.brand || product.category}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-sm font-medium ${
                                  days <= 7 ? 'text-[#ad7043]' : 'text-[#496c5c]'
                                }`}
                              >
                                {days === 0
                                  ? 'Expires today'
                                  : days === 1
                                    ? '1 day left'
                                    : `${days} days left`}
                              </p>
                              <p className="mt-1 text-xs text-[#89978b]">
                                {formatDate(product.expirationDate)}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </section>

                {/* Product collection */}
                <section className="border border-[#244d43] bg-[#244d43] p-6 text-white sm:p-8">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#bdcfc1]">
                        Your collection
                      </p>
                      <h2 className="mt-2 text-xl font-medium">
                        {search ? 'Search results' : 'On your shelf'}
                      </h2>
                      <p className="mt-2 text-sm text-[#d0ded3]">
                        {search
                          ? `${filteredProducts.length} matching ${
                              filteredProducts.length === 1 ? 'product' : 'products'
                            }`
                          : 'Your recently added products'}
                      </p>
                    </div>
                    <Link
                      to="/products"
                      className="text-sm text-white/90 hover:underline"
                    >
                      View collection →
                    </Link>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="mt-6 border border-white/20 p-6 text-sm text-[#d0ded3]">
                      No products match that search. Try another name, brand,
                      or category.
                    </div>
                  ) : (
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {(search ? filteredProducts : recentProducts).map(
                        (product) => (
                          <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="group bg-white/[0.08] p-5 transition hover:bg-white/[0.14]"
                          >
                            <p className="text-[10px] uppercase tracking-[0.16em] text-[#bdcfc1]">
                              {product.category}
                            </p>
                            <h3 className="mt-3 line-clamp-2 text-base font-medium">
                              {product.name}
                            </h3>
                            <p className="mt-1 truncate text-sm text-[#d0ded3]">
                              {product.brand || 'Brand not specified'}
                            </p>
                            <div className="mt-5 border-t border-white/15 pt-3">
                              <p className="text-xs text-[#d0ded3]">
                                {product.expirationDate
                                  ? `Expires ${formatDate(product.expirationDate)}`
                                  : 'No expiration date'}
                              </p>
                              <p className="mt-3 text-xs text-white/90 group-hover:underline">
                                View product →
                              </p>
                            </div>
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </section>

                {/* Shelf overview */}
                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="border border-[#e4e7df] bg-white/75 p-6 sm:p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#89978b]">
                      Collection overview
                    </p>
                    <h2 className="mt-2 text-xl font-medium">Shelf overview</h2>

                    <div className="mt-6 space-y-5">
                      <div>
                        <div className="flex justify-between gap-3 text-sm">
                          <span className="text-[#718077]">With expiration dates</span>
                          <span className="font-medium">
                            {productsWithExpiry} / {products.length}
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden bg-[#e8ece5]">
                          <div
                            className="h-full bg-[#638b72]"
                            style={{
                              width: `${
                                products.length
                                  ? (productsWithExpiry / products.length) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between gap-3 text-sm">
                          <span className="text-[#718077]">Products to review</span>
                          <span className="font-medium">
                            {upcomingProducts.length + expiredProducts.length}
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden bg-[#e8ece5]">
                          <div
                            className="h-full bg-[#c6a66b]"
                            style={{
                              width: `${
                                products.length
                                  ? Math.min(
                                      100,
                                      ((upcomingProducts.length +
                                        expiredProducts.length) /
                                        products.length) *
                                        100,
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="mt-6 text-xs leading-5 text-[#89978b]">
                      Keep expiration dates updated to make these summaries
                      more useful.
                    </p>
                  </div>

                  <div className="flex flex-col justify-between border border-[#e4e7df] bg-[#e9eee5] p-6 sm:p-8">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]">
                        Keep things current
                      </p>
                      <h2 className="mt-2 text-xl font-medium">
                        A little shelf care goes a long way.
                      </h2>
                      <p className="mt-3 max-w-md text-sm leading-6 text-[#718077]">
                        Add new purchases, update opened dates, and review
                        products approaching expiration.
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to="/add-product"
                        className="bg-[#244d43] px-4 py-3 text-sm font-medium text-white hover:bg-[#183b33]"
                      >
                        Add product
                      </Link>
                      <Link
                        to="/settings"
                        className="border border-[#cbd7ca] px-4 py-3 text-sm text-[#244d43] hover:bg-white/60"
                      >
                        Settings
                      </Link>
                    </div>
                  </div>
                </section>

                {/* Expired products */}
                {expiredProducts.length > 0 && (
                  <section className="border border-[#eadbd0] bg-[#fffaf6] p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b37b5b]">
                          Shelf check
                        </p>
                        <h2 className="mt-2 text-xl font-medium">
                          Products to review
                        </h2>
                        <p className="mt-2 text-sm text-[#927d70]">
                          These recorded expiration dates are in the past.
                        </p>
                      </div>
                      <span className="bg-[#f3e5da] px-3 py-2 text-xs text-[#9c674a]">
                        {expiredProducts.length} to review
                      </span>
                    </div>

                    <div className="mt-5 divide-y divide-[#efe2d8]">
                      {expiredProducts.slice(0, 5).map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                        >
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="mt-1 text-xs text-[#927d70]">
                              {product.brand || product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[#a65f42]">
                              {Math.abs(
                                getDaysUntil(product.expirationDate) ?? 0,
                              )}{' '}
                              days past date
                            </p>
                            <p className="mt-1 text-xs text-[#927d70]">
                              {formatDate(product.expirationDate)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Usage insights */}
            <section className="border border-[#e4e7df] bg-white/75 p-6 shadow-[0_20px_60px_rgba(24,53,51,0.04)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#89978b]">
                    Your routine
                  </p>
                  <h2 className="mt-2 text-xl font-medium">Usage insights</h2>
                  <p className="mt-2 text-sm text-[#89978b]">
                    Your most recent recorded product activity.
                  </p>
                </div>

                <div className="bg-[#e8f1ee] px-5 py-3">
                  <p className="text-2xl font-light text-[#24594f]">
                    {usageLogs.length}
                  </p>
                  <p className="mt-1 text-xs text-[#69827a]">
                    Usage entries
                  </p>
                </div>
              </div>

              {usageLoading ? (
                <p className="mt-6 text-sm text-[#89978b]">
                  Loading your usage history...
                </p>
              ) : usageError ? (
                <div className="mt-6 bg-[#fff5f0] p-5">
                  <p className="text-sm text-[#a65f42]">{usageError}</p>
                  <p className="mt-2 text-xs leading-5 text-[#927d70]">
                    Your products are still available above. Check your login
                    session and API if this continues.
                  </p>
                </div>
              ) : recentUsageLogs.length === 0 ? (
                <div className="mt-6 border border-dashed border-[#183533]/15 p-7 text-center">
                  <p className="text-sm font-medium text-[#183533]">
                    No usage activity yet.
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#89978b]">
                    Open a product's details page and record its usage. Your
                    latest entries will appear here.
                  </p>
                  {products.length > 0 && (
                    <Link
                      to="/products"
                      className="mt-4 inline-block text-sm text-[#496c5c] hover:underline"
                    >
                      Browse products →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="mt-5 divide-y divide-[#e8ebe4]">
                  {recentUsageLogs.map((log) => (
                    <Link
                      key={log.id}
                      to={`/products/${log.productId}`}
                      className="flex items-center justify-between gap-4 py-4 transition hover:bg-[#f7f8f3]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#183533]">
                          {productNames.get(log.productId) ?? 'Product'}
                        </p>
                        <p className="mt-1 text-xs text-[#89978b]">
                          {formatDate(log.date)}
                        </p>
                        {log.notes && (
                          <p className="mt-1 truncate text-xs text-[#89978b]">
                            {log.notes}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-sm font-medium text-[#24594f]">
                        {log.amountUsed} {log.unit}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  )
}

function SummaryCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string
  value: string
  detail: string
  accent: 'sage' | 'gold' | 'rose' | 'cream'
}) {
  const accents = {
    sage: 'bg-[#e8efe6]',
    gold: 'bg-[#f3eddf]',
    rose: 'bg-[#f5e9e2]',
    cream: 'bg-[#eeeee6]',
  }

  return (
    <article className="border border-[#e4e7df] bg-white/75 p-5 sm:p-6">
      <div className={`mb-5 h-1 w-10 ${accents[accent]}`} />
      <p className="text-xs text-[#89978b]">{label}</p>
      <p className="mt-3 break-words text-3xl font-light tracking-tight text-[#183533]">
        {value}
      </p>
      <p className="mt-2 text-xs text-[#89978b]">{detail}</p>
    </article>
  )
}

export default Dashboard
