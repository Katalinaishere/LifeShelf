import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { getProducts } from '../services/productService'
import type { Product } from '../types/product'

function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('recent')
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

  const categories = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(products.map((product) => product.category))
      ),
    ]
  }, [products])

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.brand.toLowerCase().includes(searchValue)

      const matchesCategory =
        category === 'All' ||
        product.category === category

      return matchesSearch && matchesCategory
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }

      if (sortBy === 'category') {
        return a.category.localeCompare(b.category)
      }

      if (sortBy === 'expiration') {
        if (!a.expirationDate) return 1
        if (!b.expirationDate) return -1

        return (
          new Date(a.expirationDate).getTime() -
          new Date(b.expirationDate).getTime()
        )
      }

      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0

      return dateB - dateA
    })
  }, [products, search, category, sortBy])

  const getDaysUntil = (expirationDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const expiration = new Date(expirationDate)
    expiration.setHours(0, 0, 0, 0)

    return Math.ceil(
      (expiration.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  }

  const getExpirationStatus = (product: Product) => {
    if (!product.expirationDate) {
      return {
        label: 'No expiry',
        detail: '',
        type: 'neutral',
      }
    }

    const days = getDaysUntil(product.expirationDate)

    if (days < 0) {
      return {
        label: 'Expired',
        detail: `${Math.abs(days)} ${
          Math.abs(days) === 1 ? 'day' : 'days'
        } ago`,
        type: 'expired',
      }
    }

    if (days === 0) {
      return {
        label: 'Expires today',
        detail: '',
        type: 'urgent',
      }
    }

    if (days === 1) {
      return {
        label: 'Tomorrow',
        detail: '1 day remaining',
        type: 'urgent',
      }
    }

    if (days <= 7) {
      return {
        label: `${days} days`,
        detail: 'Expiring soon',
        type: 'urgent',
      }
    }

    if (days <= 30) {
      return {
        label: `${days} days`,
        detail: 'Remaining',
        type: 'soon',
      }
    }

    return {
      label: `${days} days`,
      detail: 'Remaining',
      type: 'healthy',
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-[#24594f]/20 border-t-[#24594f] animate-spin" />

          <p className="text-sm text-[#6f7872]">
            Loading your collection...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
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

      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#dce9e4]/50 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#f2dfb4]/20 blur-3xl" />

      <div className="relative">

        {/* HEADER */}

        <header className="mb-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-4 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-[#e6a92d]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6f7872]">
                Your shelf
              </span>

            </div>

            <h1 className="text-[36px] font-medium tracking-[-0.04em] text-[#183533] md:text-[44px]">
              Products
            </h1>

            <p className="mt-3 max-w-lg text-[14px] leading-6 text-[#727a75]">
              Everything you currently own, all in one
              place.
            </p>

          </div>

          <Link
            to="/add-product"
            className="
              inline-flex w-fit items-center gap-3
              bg-[#24594f]
              px-5 py-3
              text-xs font-semibold
              text-white
              shadow-[0_10px_25px_rgba(36,89,79,0.18)]
              transition
              hover:-translate-y-0.5
              hover:bg-[#1d4c43]
            "
          >
            <span className="text-base leading-none">
              +
            </span>

            Add product
          </Link>

        </header>


        {/* COLLECTION SUMMARY */}

        <section className="mb-7 border border-white/80 bg-white/45 px-6 py-5 shadow-[0_20px_60px_rgba(24,53,51,0.05)] backdrop-blur-2xl md:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-8">

              <div>

                <p className="text-2xl font-light tracking-[-0.04em] text-[#183533]">
                  {products.length}
                </p>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#89918c]">
                  Total products
                </p>

              </div>

              <div className="h-9 w-px bg-[#183533]/10" />

              <div>

                <p className="text-2xl font-light tracking-[-0.04em] text-[#24594f]">
                  {categories.length - 1}
                </p>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#89918c]">
                  Categories
                </p>

              </div>

            </div>

            <p className="text-xs text-[#89918c]">
              Showing {filteredProducts.length} of{' '}
              {products.length}
            </p>

          </div>

        </section>


        {/* SEARCH + FILTERS */}

        <section className="mb-7 border-b border-[#183533]/10 pb-6">

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#89918c]">

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

              </div>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products or brands..."
                className="
                  w-full
                  border border-white/80
                  bg-white/50
                  py-3.5
                  pl-11
                  pr-4
                  text-sm
                  text-[#183533]
                  shadow-[0_8px_30px_rgba(24,53,51,0.04)]
                  outline-none
                  backdrop-blur-xl
                  transition
                  placeholder:text-[#a0a7a3]
                  focus:border-[#7ca99d]
                  focus:bg-white/70
                "
              />

            </div>


            {/* Category */}

            <div className="relative">

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="
                  w-full
                  appearance-none
                  border border-white/80
                  bg-white/50
                  px-4
                  py-3.5
                  pr-10
                  text-sm
                  text-[#183533]
                  shadow-[0_8px_30px_rgba(24,53,51,0.04)]
                  outline-none
                  backdrop-blur-xl
                  transition
                  focus:border-[#7ca99d]
                  sm:w-[190px]
                "
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#89918c]">
                ↓
              </span>

            </div>


            {/* Sort */}

            <div className="relative">

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="
                  w-full
                  appearance-none
                  border border-white/80
                  bg-white/50
                  px-4
                  py-3.5
                  pr-10
                  text-sm
                  text-[#183533]
                  shadow-[0_8px_30px_rgba(24,53,51,0.04)]
                  outline-none
                  backdrop-blur-xl
                  transition
                  focus:border-[#7ca99d]
                  sm:w-[190px]
                "
              >
                <option value="recent">
                  Recently added
                </option>

                <option value="name">
                  Name
                </option>

                <option value="category">
                  Category
                </option>

                <option value="expiration">
                  Expiration
                </option>
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#89918c]">
                ↓
              </span>

            </div>

          </div>

        </section>


        {/* EMPTY SEARCH STATE */}

        {filteredProducts.length === 0 ? (

          <div className="border border-dashed border-[#183533]/15 bg-white/30 px-6 py-20 text-center backdrop-blur-xl">

            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f1ee]">

              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-[#24594f]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>

            </div>

            <h2 className="mt-5 text-lg font-medium text-[#183533]">
              No products found
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#89918c]">
              Try changing your search or category
              filter.
            </p>

            {(search || category !== 'All') && (
              <button
                onClick={() => {
                  setSearch('')
                  setCategory('All')
                }}
                className="
                  mt-5
                  text-xs
                  font-semibold
                  text-[#24594f]
                  underline
                  underline-offset-4
                "
              >
                Clear filters
              </button>
            )}

          </div>

        ) : (

          /* PRODUCT LIST */

          <section className="overflow-hidden border border-white/80 bg-white/45 shadow-[0_20px_60px_rgba(24,53,51,0.06)] backdrop-blur-2xl">

            {/* Desktop heading */}

            <div className="hidden grid-cols-[minmax(260px,1.8fr)_1fr_1fr_1fr_24px] gap-6 border-b border-[#183533]/10 px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9aa19d] md:grid md:px-8">

              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Expiration</span>
              <span />

            </div>


            <div className="divide-y divide-[#183533]/8">

              {filteredProducts.map((product) => {

                const expiration =
                  getExpirationStatus(product)

                return (

                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="
                      group
                      block
                      px-6 py-5
                      transition
                      hover:bg-white/55
                      md:px-8
                    "
                  >

                    {/* DESKTOP */}

                    <div className="hidden grid-cols-[minmax(260px,1.8fr)_1fr_1fr_1fr_24px] items-center gap-6 md:grid">

                      {/* Product */}

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="grid h-11 w-11 shrink-0 place-items-center border border-[#183533]/8 bg-[#edf3f0] text-sm font-medium text-[#24594f]">
                          {product.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <h2 className="truncate text-sm font-medium text-[#183533] transition group-hover:text-[#24594f]">
                            {product.name}
                          </h2>

                          <p className="mt-1 truncate text-[11px] text-[#89918c]">
                            {product.brand || 'No brand'}
                          </p>

                        </div>

                      </div>


                      {/* Category */}

                      <div>

                        <span className="text-xs text-[#6f7872]">
                          {product.category}
                        </span>

                      </div>


                      {/* Price */}

                      <div>

                        <span className="text-xs font-medium text-[#183533]">
                          {product.price !== null
                            ? `€${product.price.toFixed(2)}`
                            : '—'}
                        </span>

                      </div>


                      {/* Expiration */}

                      <div>

                        <p
                          className={`text-xs font-medium ${
                            expiration.type ===
                            'expired'
                              ? 'text-[#d1583f]'
                              : expiration.type ===
                                'urgent'
                              ? 'text-[#c76b45]'
                              : expiration.type ===
                                'soon'
                              ? 'text-[#8b7a3d]'
                              : expiration.type ===
                                'healthy'
                              ? 'text-[#24594f]'
                              : 'text-[#89918c]'
                          }`}
                        >
                          {expiration.label}
                        </p>

                        {expiration.detail && (
                          <p className="mt-1 text-[10px] text-[#a0a7a3]">
                            {expiration.detail}
                          </p>
                        )}

                      </div>


                      {/* Arrow */}

                      <div className="text-right text-[#a0a7a3] transition group-hover:translate-x-1 group-hover:text-[#24594f]">
                        →
                      </div>

                    </div>


                    {/* MOBILE */}

                    <div className="md:hidden">

                      <div className="flex items-start gap-4">

                        <div className="grid h-11 w-11 shrink-0 place-items-center border border-[#183533]/8 bg-[#edf3f0] text-sm font-medium text-[#24594f]">
                          {product.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <h2 className="truncate text-sm font-medium text-[#183533]">
                                {product.name}
                              </h2>

                              <p className="mt-1 truncate text-[11px] text-[#89918c]">
                                {product.brand ||
                                  'No brand'}
                              </p>

                            </div>

                            <span className="text-[#a0a7a3]">
                              →
                            </span>

                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">

                            <span className="text-[10px] uppercase tracking-[0.1em] text-[#89918c]">
                              {product.category}
                            </span>

                            <span className="text-xs font-medium text-[#183533]">
                              {product.price !== null
                                ? `€${product.price.toFixed(2)}`
                                : 'No price'}
                            </span>

                            <span
                              className={`text-xs font-medium ${
                                expiration.type ===
                                'expired'
                                  ? 'text-[#d1583f]'
                                  : expiration.type ===
                                    'urgent'
                                  ? 'text-[#c76b45]'
                                  : expiration.type ===
                                    'soon'
                                  ? 'text-[#8b7a3d]'
                                  : expiration.type ===
                                    'healthy'
                                  ? 'text-[#24594f]'
                                  : 'text-[#89918c]'
                              }`}
                            >
                              {expiration.label}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  </Link>

                )
              })}

            </div>

          </section>

        )}


        {/* FOOTER INFORMATION */}

        {filteredProducts.length > 0 && (

          <div className="mt-5 flex flex-col gap-2 text-[11px] text-[#9aa19d] sm:flex-row sm:items-center sm:justify-between">

            <span>
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1
                ? 'product'
                : 'products'}{' '}
              displayed
            </span>

            <span>
              Select a product to view its details
            </span>

          </div>

        )}

      </div>

    </div>
  )
}

export default Products