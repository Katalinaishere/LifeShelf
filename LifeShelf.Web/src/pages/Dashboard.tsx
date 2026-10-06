import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { getProducts } from '../services/productService'
import type { Product } from '../types/product'

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error(error)
        setError('Could not load your products.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const upcomingProducts = useMemo(() => {
    const thirtyDaysFromNow = new Date(today)
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    return products
      .filter((product) => {
        if (!product.expirationDate) {
          return false
        }

        const expiration = new Date(product.expirationDate)
        expiration.setHours(0, 0, 0, 0)

        return (
          expiration >= today &&
          expiration <= thirtyDaysFromNow
        )
      })
      .sort((a, b) => {
        const dateA = new Date(a.expirationDate!).getTime()
        const dateB = new Date(b.expirationDate!).getTime()

        return dateA - dateB
      })
  }, [products, today])

  const expiredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (!product.expirationDate) {
          return false
        }

        const expiration = new Date(product.expirationDate)
        expiration.setHours(0, 0, 0, 0)

        return expiration < today
      })
      .sort((a, b) => {
        const dateA = new Date(a.expirationDate!).getTime()
        const dateB = new Date(b.expirationDate!).getTime()

        return dateA - dateB
      })
  }, [products, today])

  const recentProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0

        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0

        return dateB - dateA
      })
      .slice(0, 5)
  }, [products])

  const productsWithExpiration = useMemo(() => {
    return products.filter(
      (product) => product.expirationDate
    ).length
  }, [products])

  const getDaysUntil = (expirationDate: string) => {
    const expiration = new Date(expirationDate)
    expiration.setHours(0, 0, 0, 0)

    const difference =
      expiration.getTime() - today.getTime()

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
      }
    )
  }

  const getExpirationLabel = (product: Product) => {
    if (!product.expirationDate) {
      return 'No expiration'
    }

    const days = getDaysUntil(product.expirationDate)

    if (days < 0) {
      return 'Expired'
    }

    if (days === 0) {
      return 'Today'
    }

    if (days === 1) {
      return 'Tomorrow'
    }

    return `${days} days`
  }

  const getRelativeDate = (createdAt?: string) => {
    if (!createdAt) {
      return 'Recently added'
    }

    const created = new Date(createdAt)

    const createdDate = new Date(
      created.getFullYear(),
      created.getMonth(),
      created.getDate()
    )

    const difference =
      today.getTime() - createdDate.getTime()

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    )

    if (days <= 0) {
      return 'Today'
    }

    if (days === 1) {
      return 'Yesterday'
    }

    if (days < 7) {
      return `${days} days ago`
    }

    if (days < 30) {
      const weeks = Math.floor(days / 7)

      return `${weeks} ${
        weeks === 1 ? 'week' : 'weeks'
      } ago`
    }

    return 'Recently'
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-[#24594f]/20 border-t-[#24594f] animate-spin" />

          <p className="text-sm text-[#6f7872]">
            Preparing your shelf...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1180px] px-5 py-10">
        <div className="border border-[#ead4cc] bg-[#fff8f5] p-6">
          <p className="text-sm font-medium text-[#b84d3a]">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto max-w-[1180px] px-5 pb-16 pt-3 md:px-8">

      {/* Background atmosphere */}

      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#dce9e4]/60 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#f2dfb4]/25 blur-3xl" />

      <div className="relative">

        {/* HEADER */}

        <header className="mb-10 flex items-end justify-between gap-6">

          <div>

            <div className="mb-4 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-[#e6a92d]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6f7872]">
                LifeShelf
              </span>

            </div>

            <h1 className="text-[34px] font-medium tracking-[-0.04em] text-[#183533] md:text-[42px]">
              Good evening, Kat.
            </h1>

            <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#727a75]">
              A quiet overview of everything you're
              keeping on your shelf.
            </p>

          </div>

          <div className="flex items-center gap-2">

            {/* Search */}

            <button
              aria-label="Search"
              className="
                grid h-10 w-10 place-items-center
                border border-white/80
                bg-white/50
                text-[#49635c]
                shadow-[0_8px_30px_rgba(24,53,51,0.06)]
                backdrop-blur-xl
                transition
                hover:-translate-y-0.5
                hover:bg-white/80
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
            </button>

            {/* Notifications */}

            <button
              aria-label="Notifications"
              className="
                relative grid h-10 w-10 place-items-center
                border border-white/80
                bg-white/50
                text-[#49635c]
                shadow-[0_8px_30px_rgba(24,53,51,0.06)]
                backdrop-blur-xl
                transition
                hover:-translate-y-0.5
                hover:bg-white/80
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </svg>

              {expiredProducts.length > 0 && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d1583f]" />
              )}

            </button>

            {/* Profile */}

            <Link
              to="/profile"
              aria-label="Profile"
              className="
                grid h-10 w-10 place-items-center
                bg-[#183533]
                text-xs font-medium text-white
                shadow-[0_8px_25px_rgba(24,53,51,0.18)]
                transition
                hover:-translate-y-0.5
              "
            >
              K
            </Link>

          </div>

        </header>


        {/* SHELF STATUS */}

        <section
          className="
            mb-7
            overflow-hidden
            border border-white/80
            bg-white/45
            shadow-[0_20px_60px_rgba(24,53,51,0.07)]
            backdrop-blur-2xl
          "
        >

          <div className="grid grid-cols-3">

            {/* Total products */}

            <div className="px-5 py-6 md:px-8 md:py-7">

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#89918c]">
                On your shelf
              </p>

              <div className="mt-3 flex items-end gap-3">

                <span className="text-[38px] font-light tracking-[-0.05em] text-[#183533] md:text-[46px]">
                  {products.length}
                </span>

                <span className="mb-2 text-xs text-[#89918c]">
                  {products.length === 1
                    ? 'product'
                    : 'products'}
                </span>

              </div>

            </div>


            {/* Upcoming */}

            <div className="my-5 border-l border-[#183533]/10 px-5 py-1 md:px-8">

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#89918c]">
                Coming up
              </p>

              <div className="mt-3 flex items-end gap-3">

                <span className="text-[38px] font-light tracking-[-0.05em] text-[#24594f] md:text-[46px]">
                  {upcomingProducts.length}
                </span>

                <span className="mb-2 text-xs text-[#89918c]">
                  next 30 days
                </span>

              </div>

            </div>


            {/* Expired */}

            <div className="my-5 border-l border-[#183533]/10 px-5 py-1 md:px-8">

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#89918c]">
                Expired
              </p>

              <div className="mt-3 flex items-end gap-3">

                <span
                  className={`text-[38px] font-light tracking-[-0.05em] md:text-[46px] ${
                    expiredProducts.length > 0
                      ? 'text-[#d1583f]'
                      : 'text-[#183533]'
                  }`}
                >
                  {expiredProducts.length}
                </span>

                <span className="mb-2 text-xs text-[#89918c]">
                  needs review
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* MAIN GRID */}

        <section className="grid gap-7 lg:grid-cols-[1.55fr_1fr]">

          {/* EXPIRATION TIMELINE */}

          <div
            className="
              border border-white/80
              bg-white/45
              p-6
              shadow-[0_20px_60px_rgba(24,53,51,0.06)]
              backdrop-blur-2xl
              md:p-8
            "
          >

            <div className="mb-8 flex items-start justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#89918c]">
                  Shelf horizon
                </p>

                <h2 className="mt-2 text-xl font-medium tracking-[-0.025em] text-[#183533]">
                  Expiration timeline
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-[#7c8580]">
                  Products approaching the end of
                  their shelf life.
                </p>

              </div>

              {upcomingProducts.length > 0 && (
                <span className="text-xs text-[#89918c]">
                  Next 30 days
                </span>
              )}

            </div>


            {upcomingProducts.length === 0 ? (

              <div className="flex min-h-[220px] flex-col items-center justify-center border border-dashed border-[#183533]/10 px-6 text-center">

                <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-[#e8f1ee]">

                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-[#24594f]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 3v18" />
                    <path d="M5 12h14" />
                  </svg>

                </div>

                <p className="text-sm font-medium text-[#183533]">
                  Your shelf is looking calm.
                </p>

                <p className="mt-1.5 max-w-xs text-xs leading-5 text-[#89918c]">
                  Nothing is scheduled to expire
                  within the next 30 days.
                </p>

              </div>

            ) : (

              <div className="relative">

                <div className="absolute bottom-5 left-[7px] top-5 w-px bg-[#cbdad5]" />

                <div className="space-y-1">

                  {upcomingProducts
                    .slice(0, 6)
                    .map((product) => {

                      const days = getDaysUntil(
                        product.expirationDate!
                      )

                      return (

                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="
                            group relative
                            flex items-center gap-5
                            py-4 pl-0
                            transition
                          "
                        >

                          <div
                            className={`
                              relative z-10
                              h-[15px] w-[15px]
                              shrink-0 rounded-full
                              border-[3px]
                              border-[#f6efe0]
                              ring-1
                              ${
                                days <= 7
                                  ? 'bg-[#d1583f] ring-[#d1583f]/30'
                                  : 'bg-[#24594f] ring-[#24594f]/25'
                              }
                            `}
                          />

                          <div className="min-w-0 flex-1 border-b border-[#183533]/7 pb-4">

                            <div className="flex items-center justify-between gap-4">

                              <div className="min-w-0">

                                <h3 className="truncate text-sm font-medium text-[#183533] transition group-hover:text-[#24594f]">
                                  {product.name}
                                </h3>

                                <p className="mt-1 truncate text-[11px] text-[#89918c]">
                                  {product.brand
                                    ? `${product.brand} · `
                                    : ''}
                                  {product.category}
                                </p>

                              </div>

                              <div className="shrink-0 text-right">

                                <p
                                  className={`text-xs font-medium ${
                                    days <= 7
                                      ? 'text-[#d1583f]'
                                      : 'text-[#24594f]'
                                  }`}
                                >
                                  {getExpirationLabel(
                                    product
                                  )}
                                </p>

                                <p className="mt-1 text-[10px] text-[#a0a7a3]">
                                  {formatDate(
                                    product.expirationDate!
                                  )}
                                </p>

                              </div>

                            </div>

                          </div>

                        </Link>

                      )
                    })}

                </div>

              </div>

            )}

          </div>


          {/* COLLECTION */}

          <div
            className="
              border border-white/80
              bg-[#183533]
              p-6
              text-white
              shadow-[0_20px_60px_rgba(24,53,51,0.14)]
              md:p-8
            "
          >

            <div className="mb-8 flex items-start justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Your shelf
                </p>

                <h2 className="mt-2 text-xl font-medium tracking-[-0.025em]">
                  Your collection
                </h2>

              </div>

              <span className="text-xs text-white/45">
                {products.length}
              </span>

            </div>


            {recentProducts.length === 0 ? (

              <div className="flex min-h-[220px] flex-col justify-center">

                <p className="text-sm text-white/70">
                  Your collection is waiting.
                </p>

                <p className="mt-2 text-xs leading-5 text-white/40">
                  Add your first product to begin
                  building your shelf.
                </p>

                <Link
                  to="/products/add"
                  className="
                    mt-6 inline-flex w-fit
                    border border-white/15
                    bg-white/10
                    px-4 py-2.5
                    text-xs font-medium
                    text-white
                    transition
                    hover:bg-white/15
                  "
                >
                  Add product
                </Link>

              </div>

            ) : (

              <>

                <div className="space-y-1">

                  {recentProducts.map((product) => (

                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="
                        group
                        flex items-center gap-4
                        border-b border-white/10
                        py-4
                        transition
                        first:pt-0
                        last:border-0
                      "
                    >

                      <div
                        className="
                          grid h-10 w-10 shrink-0
                          place-items-center
                          border border-white/10
                          bg-white/8
                          text-xs
                          text-white/50
                        "
                      >
                        {product.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate text-sm font-medium text-white/90 group-hover:text-white">
                          {product.name}
                        </h3>

                        <p className="mt-1 truncate text-[10px] text-white/40">
                          {product.brand
                            ? `${product.brand} · `
                            : ''}
                          {product.category}
                        </p>

                      </div>

                      <span className="shrink-0 text-[10px] text-white/35">
                        {getRelativeDate(
                          product.createdAt
                        )}
                      </span>

                    </Link>

                  ))}

                </div>

                <Link
                  to="/products"
                  className="
                    mt-7 flex items-center
                    justify-between
                    border-t border-white/10
                    pt-5
                    text-xs
                    text-white/55
                    transition
                    hover:text-white
                  "
                >
                  <span>
                    View entire collection
                  </span>

                  <span className="text-base">
                    →
                  </span>

                </Link>

              </>

            )}

          </div>

        </section>


        {/* REVIEW */}

        {expiredProducts.length > 0 && (

          <section
            className="
              mt-7
              border border-[#ead4cc]
              bg-[#fffaf7]/75
              shadow-[0_20px_60px_rgba(24,53,51,0.04)]
              backdrop-blur-xl
            "
          >

            <div className="flex items-center justify-between border-b border-[#ead4cc] px-6 py-5 md:px-8">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b26a5b]">
                  Review
                </p>

                <h2 className="mt-2 text-xl font-medium tracking-[-0.025em] text-[#183533]">
                  Needs your attention
                </h2>

              </div>

              <span className="text-sm text-[#b26a5b]">
                {expiredProducts.length}
              </span>

            </div>


            <div className="divide-y divide-[#ead4cc]">

              {expiredProducts
                .slice(0, 5)
                .map((product) => (

                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="
                      group
                      flex items-center justify-between
                      gap-5
                      px-6 py-4
                      transition
                      hover:bg-white/50
                      md:px-8
                    "
                  >

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#d1583f]" />

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-medium text-[#183533]">
                          {product.name}
                        </h3>

                        <p className="mt-1 truncate text-[11px] text-[#89918c]">
                          {product.brand
                            ? `${product.brand} · `
                            : ''}
                          {product.category}
                        </p>

                      </div>

                    </div>

                    <div className="flex shrink-0 items-center gap-5">

                      <span className="hidden text-[11px] text-[#a0a7a3] sm:block">
                        {formatDate(
                          product.expirationDate!
                        )}
                      </span>

                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#d1583f]">
                        Expired
                      </span>

                      <span className="text-[#b7aaa5]">
                        →
                      </span>

                    </div>

                  </Link>

                ))}

            </div>

          </section>

        )}


        {/* LOWER INFORMATION */}

        <section className="mt-7 grid gap-7 md:grid-cols-2">

          {/* Shelf overview */}

          <div className="border border-white/80 bg-white/40 p-6 backdrop-blur-xl md:p-7">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#89918c]">
              Shelf overview
            </p>

            <div className="mt-6 grid grid-cols-2 gap-6">

              <div>

                <p className="text-3xl font-light tracking-[-0.04em] text-[#183533]">
                  {productsWithExpiration}
                </p>

                <p className="mt-1 text-xs text-[#89918c]">
                  with expiration dates
                </p>

              </div>

              <div>

                <p className="text-3xl font-light tracking-[-0.04em] text-[#183533]">
                  {products.length -
                    productsWithExpiration}
                </p>

                <p className="mt-1 text-xs text-[#89918c]">
                  without expiration
                </p>

              </div>

            </div>

          </div>


          {/* Quick action */}

          <div className="border border-[#d9e5e0] bg-[#eaf2ef]/65 p-6 backdrop-blur-xl md:p-7">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#69827a]">
              Keep it simple
            </p>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#36534c]">
              LifeShelf keeps the small things visible
              so you don't have to remember them.
            </p>

            <Link
              to="/products/add"
              className="
                mt-5 inline-flex items-center gap-3
                text-xs font-semibold
                text-[#24594f]
                transition
                hover:gap-4
              "
            >
              Add something new
              <span>→</span>
            </Link>

          </div>

        </section>


        {/* EMPTY SHELF */}

        {products.length === 0 && (

          <section
            className="
              mt-7
              border border-white/80
              bg-white/55
              p-10
              text-center
              shadow-[0_20px_60px_rgba(24,53,51,0.06)]
              backdrop-blur-xl
              md:p-14
            "
          >

            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e8f1ee]">

              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-[#24594f]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 3v18" />
                <path d="M5 12h14" />
              </svg>

            </div>

            <h2 className="mt-6 text-xl font-medium tracking-[-0.025em] text-[#183533]">
              Your shelf starts here.
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#89918c]">
              Keep your skincare, supplements,
              hygiene products and everyday essentials
              organized in one quiet place.
            </p>

            <Link
              to="/products/add"
              className="
                mt-7
                inline-flex
                bg-[#24594f]
                px-6 py-3
                text-xs font-semibold
                text-white
                shadow-[0_10px_25px_rgba(36,89,79,0.18)]
                transition
                hover:-translate-y-0.5
                hover:bg-[#1d4c43]
              "
            >
              Add your first product
            </Link>

          </section>

        )}

      </div>

    </div>
  )
}

export default Dashboard