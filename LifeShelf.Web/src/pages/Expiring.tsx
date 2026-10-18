import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/productService'
import type { Product } from '../types/product'

type ExpirationStatus =
  | 'expired'
  | 'soon'
  | 'later'
  | 'unknown'

interface ProductExpiration {
  product: Product
  expirationDate: Date | null
  status: ExpirationStatus
  daysRemaining: number | null
}

const SOON_WINDOW_DAYS = 30

function getExpirationDate(product: Product): Date | null {
  if (product.expirationDate) {
    const date = new Date(product.expirationDate)

    if (!Number.isNaN(date.getTime())) {
      return date
    }
  }

  if (
    product.openedDate &&
    product.expectedDurationDays !== null &&
    product.expectedDurationDays !== undefined
  ) {
    const openedDate = new Date(product.openedDate)

    if (!Number.isNaN(openedDate.getTime())) {
      const expirationDate = new Date(openedDate)

      expirationDate.setDate(
        expirationDate.getDate() + product.expectedDurationDays
      )

      return expirationDate
    }
  }

  return null
}

function getDaysRemaining(expirationDate: Date): number {
  const today = new Date()

  today.setHours(0, 0, 0, 0)

  const expiration = new Date(expirationDate)
  expiration.setHours(0, 0, 0, 0)

  const difference =
    expiration.getTime() - today.getTime()

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  )
}

function getExpirationStatus(
  daysRemaining: number
): ExpirationStatus {
  if (daysRemaining < 0) {
    return 'expired'
  }

  if (daysRemaining <= SOON_WINDOW_DAYS) {
    return 'soon'
  }

  return 'later'
}

function formatDate(date: Date | null): string {
  if (!date) {
    return 'No expiration date'
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getDaysLabel(days: number | null): string {
  if (days === null) {
    return 'No date'
  }

  if (days < 0) {
    const absoluteDays = Math.abs(days)

    return absoluteDays === 1
      ? 'Expired 1 day ago'
      : `Expired ${absoluteDays} days ago`
  }

  if (days === 0) {
    return 'Expires today'
  }

  if (days === 1) {
    return '1 day left'
  }

  return `${days} days left`
}

function statusLabel(status: ExpirationStatus): string {
  switch (status) {
    case 'expired':
      return 'Expired'

    case 'soon':
      return 'Expiring soon'

    case 'later':
      return 'Coming later'

    default:
      return 'No expiration'
  }
}

function ProductRow({
  item,
}: {
  item: ProductExpiration
}) {
  const { product, expirationDate, status, daysRemaining } =
    item

  return (
    <Link
      to={`/products/${product.id}`}
      className="
        group
        flex items-center justify-between gap-5
        rounded-[20px]
        border border-white/70
        bg-white/45
        px-5 py-4
        shadow-[0_8px_28px_rgba(24,53,51,0.045)]
        backdrop-blur-xl
        transition-all duration-200
        hover:-translate-y-0.5
        hover:bg-white/65
        hover:shadow-[0_12px_34px_rgba(24,53,51,0.08)]
      "
    >
      <div className="flex min-w-0 items-center gap-4">
        <div
          className={`
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-[15px]
            ${
              status === 'expired'
                ? 'bg-[#d1583f]/10 text-[#d1583f]'
                : status === 'soon'
                  ? 'bg-[#e6a92d]/12 text-[#b47b08]'
                  : 'bg-[#dce9e4]/75 text-[#24594f]'
            }
          `}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[19px] w-[19px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="8" />
            <path d="M12 7.5v5l3 2" />
          </svg>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[14px] font-semibold text-[#183533]">
              {product.name}
            </h3>

            {product.brand && (
              <span className="truncate text-[11px] text-[#87948f]">
                {product.brand}
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#71817d]">
            <span>{product.category}</span>

            <span className="text-[#b8c2be]">•</span>

            <span>
              {formatDate(expirationDate)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="hidden text-right sm:block">
          <p
            className={`
              text-[12px] font-medium
              ${
                status === 'expired'
                  ? 'text-[#d1583f]'
                  : status === 'soon'
                    ? 'text-[#b47b08]'
                    : 'text-[#24594f]'
              }
            `}
          >
            {getDaysLabel(daysRemaining)}
          </p>

          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#9aa6a2]">
            {statusLabel(status)}
          </p>
        </div>

        <svg
          viewBox="0 0 24 24"
          className="
            h-4 w-4
            text-[#9aa6a2]
            transition-transform duration-200
            group-hover:translate-x-0.5
            group-hover:text-[#24594f]
          "
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="m9 5 7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

function Section({
  title,
  description,
  items,
  emptyMessage,
}: {
  title: string
  description: string
  items: ProductExpiration[]
  emptyMessage: string
}) {
  return (
    <section>
      <div className="mb-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[15px] font-semibold text-[#183533]">
            {title}
          </h2>

          <span className="text-[11px] font-medium text-[#8a9792]">
            {items.length}
          </span>
        </div>

        <p className="mt-1 text-[11px] text-[#87948f]">
          {description}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="space-y-2.5">
          {items.map((item) => (
            <ProductRow
              key={item.product.id}
              item={item}
            />
          ))}
        </div>
      ) : (
        <div
          className="
            rounded-[20px]
            border border-white/65
            bg-white/30
            px-5 py-7
            text-center
          "
        >
          <p className="text-[12px] text-[#8a9792]">
            {emptyMessage}
          </p>
        </div>
      )}
    </section>
  )
}

function Expiring() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const data = await getProducts()

        setProducts(data)
      } catch {
        setError(
          'We could not load your products. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const expirationData = useMemo<ProductExpiration[]>(() => {
    return products
      .map((product) => {
        const expirationDate =
          getExpirationDate(product)

        if (!expirationDate) {
          return {
            product,
            expirationDate: null,
            status: 'unknown' as const,
            daysRemaining: null,
          }
        }

        const daysRemaining =
          getDaysRemaining(expirationDate)

        return {
          product,
          expirationDate,
          status: getExpirationStatus(daysRemaining),
          daysRemaining,
        }
      })
      .sort((a, b) => {
        if (
          a.daysRemaining === null &&
          b.daysRemaining === null
        ) {
          return 0
        }

        if (a.daysRemaining === null) {
          return 1
        }

        if (b.daysRemaining === null) {
          return -1
        }

        return a.daysRemaining - b.daysRemaining
      })
  }, [products])

  const expired = expirationData.filter(
    (item) => item.status === 'expired'
  )

  const expiringSoon = expirationData.filter(
    (item) => item.status === 'soon'
  )

  const comingLater = expirationData.filter(
    (item) => item.status === 'later'
  )

  const unknown = expirationData.filter(
    (item) => item.status === 'unknown'
  )

  const attentionCount =
    expired.length + expiringSoon.length

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-10">
          <div className="h-3 w-20 animate-pulse rounded-full bg-[#dce9e4]" />

          <div className="mt-4 h-10 w-64 animate-pulse rounded-xl bg-white/60" />

          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-white/45" />
        </div>

        <div className="space-y-3">
          <div className="h-20 animate-pulse rounded-[20px] bg-white/45" />
          <div className="h-20 animate-pulse rounded-[20px] bg-white/45" />
          <div className="h-20 animate-pulse rounded-[20px] bg-white/45" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <div
          className="
            rounded-[24px]
            border border-[#d1583f]/10
            bg-[#d1583f]/[0.05]
            px-6 py-8
            text-center
          "
        >
          <p className="text-sm font-medium text-[#d1583f]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              mt-4
              rounded-[12px]
              border border-[#24594f]/15
              bg-white/60
              px-4 py-2
              text-[11px] font-medium
              text-[#24594f]
              transition
              hover:bg-white
            "
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-16">
      {/* Header */}
      <header className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#71817d]">
          Shelf intelligence
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.035em] text-[#183533]">
              Expiration
            </h1>

            <p className="mt-2 max-w-[560px] text-[13px] leading-6 text-[#71817d]">
              Keep an eye on what is leaving your shelf
              next, before it becomes waste.
            </p>
          </div>

          <Link
            to="/products"
            className="
              inline-flex
              w-fit items-center gap-2
              rounded-[12px]
              border border-white/75
              bg-white/50
              px-4 py-2.5
              text-[11px] font-medium
              text-[#24594f]
              shadow-[0_6px_20px_rgba(24,53,51,0.04)]
              backdrop-blur-xl
              transition
              hover:bg-white/70
            "
          >
            View all products

            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="m9 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Overview */}
      <section
        className="
          mb-12
          grid gap-3
          sm:grid-cols-3
        "
      >
        <div
          className="
            rounded-[22px]
            border border-white/70
            bg-white/45
            p-5
            shadow-[0_10px_30px_rgba(24,53,51,0.045)]
            backdrop-blur-xl
          "
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a9792]">
            Needs attention
          </p>

          <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#183533]">
            {attentionCount}
          </p>

          <p className="mt-1 text-[11px] text-[#87948f]">
            expired or expiring within 30 days
          </p>
        </div>

        <div
          className="
            rounded-[22px]
            border border-white/70
            bg-white/45
            p-5
            shadow-[0_10px_30px_rgba(24,53,51,0.045)]
            backdrop-blur-xl
          "
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a9792]">
            Expiring soon
          </p>

          <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#b47b08]">
            {expiringSoon.length}
          </p>

          <p className="mt-1 text-[11px] text-[#87948f]">
            within the next 30 days
          </p>
        </div>

        <div
          className="
            rounded-[22px]
            border border-white/70
            bg-white/45
            p-5
            shadow-[0_10px_30px_rgba(24,53,51,0.045)]
            backdrop-blur-xl
          "
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a9792]">
            Shelf tracked
          </p>

          <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#24594f]">
            {products.length}
          </p>

          <p className="mt-1 text-[11px] text-[#87948f]">
            products in your collection
          </p>
        </div>
      </section>

      {products.length === 0 ? (
        <div
          className="
            rounded-[28px]
            border border-white/70
            bg-white/45
            px-6 py-16
            text-center
            shadow-[0_12px_40px_rgba(24,53,51,0.05)]
            backdrop-blur-xl
          "
        >
          <div
            className="
              mx-auto flex h-14 w-14
              items-center justify-center
              rounded-[18px]
              bg-[#dce9e4]/80
              text-[#24594f]
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M5 7.5h14v12H5z" />
              <path d="M8 7.5V5h8v2.5" />
            </svg>
          </div>

          <h2 className="mt-5 text-lg font-semibold text-[#183533]">
            Your shelf is empty
          </h2>

          <p className="mx-auto mt-2 max-w-[400px] text-[12px] leading-5 text-[#87948f]">
            Add your first product and LifeShelf will
            start tracking its lifespan and expiration.
          </p>

          <Link
            to="/add-product"
            className="
              mt-6
              inline-flex
              rounded-[12px]
              bg-[#24594f]
              px-5 py-2.5
              text-[11px] font-medium
              text-white
              shadow-[0_8px_20px_rgba(36,89,79,0.12)]
              transition
              hover:bg-[#183f38]
            "
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          <Section
            title="Expired"
            description="These products have passed their tracked expiration date."
            items={expired}
            emptyMessage="Nothing has expired. Your shelf is looking good."
          />

          <Section
            title="Expiring soon"
            description="Products reaching their expiration within the next 30 days."
            items={expiringSoon}
            emptyMessage="Nothing is expiring within the next 30 days."
          />

          <Section
            title="Coming later"
            description="Products with more than 30 days remaining."
            items={comingLater}
            emptyMessage="No later expirations to show."
          />

          <Section
            title="No expiration data"
            description="These products need an expiration date or lifespan to be tracked."
            items={unknown}
            emptyMessage="Every product has expiration information."
          />
        </div>
      )}
    </div>
  )
}

export default Expiring