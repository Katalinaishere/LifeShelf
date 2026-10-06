import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getProduct, deleteProduct } from '../services/productService'

import {
  createUsageLog,
  getUsageLogs,
  type UsageLog,
} from '../services/usageLogService'

import type { Product } from '../types/product'

function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([])

  const [loading, setLoading] = useState(true)
  const [usageLoading, setUsageLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)
  const [usageError, setUsageError] = useState<string | null>(null)

  const [showUsageForm, setShowUsageForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [deleting, setDeleting] = useState(false)
  const [savingUsage, setSavingUsage] = useState(false)

  const [amountUsed, setAmountUsed] = useState('')
  const [unit, setUnit] = useState('')

  const [usageDate, setUsageDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const [notes, setNotes] = useState('')

  // -----------------------------------------
  // LOAD PRODUCT
  // -----------------------------------------

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setError('Product ID is missing.')
        setLoading(false)
        return
      }

      try {
        const data = await getProduct(Number(id))
        setProduct(data)
      } catch (error) {
        console.error(error)
        setError('Could not load this product.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  // -----------------------------------------
  // LOAD USAGE LOGS
  // -----------------------------------------

  useEffect(() => {
    async function loadUsageLogs() {
      if (!id) {
        setUsageLoading(false)
        return
      }

      try {
        const logs = await getUsageLogs(Number(id))

        const sortedLogs = [...logs].sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        )

        setUsageLogs(sortedLogs)
      } catch (error) {
        console.error(error)
        setUsageError('Could not load usage history.')
      } finally {
        setUsageLoading(false)
      }
    }

    loadUsageLogs()
  }, [id])

  // -----------------------------------------
  // USAGE FORM
  // -----------------------------------------

  async function handleUsageSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!id) {
      return
    }

    if (!amountUsed || !unit.trim()) {
      setUsageError('Please enter an amount and unit.')
      return
    }

    const numericAmount = Number(amountUsed)

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setUsageError('Please enter a valid amount.')
      return
    }

    setSavingUsage(true)
    setUsageError(null)

    try {
      const newLog = await createUsageLog({
        productId: Number(id),
        date: new Date(
          `${usageDate}T12:00:00`
        ).toISOString(),
        amountUsed: numericAmount,
        unit: unit.trim(),
        notes: notes.trim() || undefined,
      })

      setUsageLogs((current) =>
        [newLog, ...current].sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        )
      )

      setAmountUsed('')
      setUnit('')
      setNotes('')

      setUsageDate(
        new Date().toISOString().split('T')[0]
      )

      setShowUsageForm(false)
    } catch (error) {
      console.error(error)
      setUsageError('Could not save usage.')
    } finally {
      setSavingUsage(false)
    }
  }

  // -----------------------------------------
  // DELETE PRODUCT
  // -----------------------------------------

  async function handleDeleteProduct() {
    if (!id) {
      return
    }

    setDeleting(true)

    try {
      await deleteProduct(Number(id))
      navigate('/products')
    } catch (error) {
      console.error(error)

      setDeleting(false)
      setShowDeleteConfirm(false)
      setError('Could not delete this product.')
    }
  }

  // -----------------------------------------
  // ANALYTICS
  // -----------------------------------------

  const analytics = useMemo(() => {
    if (usageLogs.length === 0) {
      return {
        totalUses: 0,
        totalAmount: 0,
        averageAmount: 0,
        firstUsage: null as Date | null,
        lastUsage: null as Date | null,
        daysTracked: 0,
        unit: '',
        hasSingleUnit: true,
      }
    }

    const sortedLogs = [...usageLogs].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    )

    const normalizedUnits = Array.from(
      new Set(
        usageLogs.map((log) =>
          log.unit.trim().toLowerCase()
        )
      )
    )

    const hasSingleUnit =
      normalizedUnits.length === 1

    const unit = hasSingleUnit
      ? usageLogs[0].unit
      : ''

    const totalAmount = hasSingleUnit
      ? usageLogs.reduce(
          (total, log) =>
            total + Number(log.amountUsed),
          0
        )
      : 0

    const averageAmount = hasSingleUnit
      ? totalAmount / usageLogs.length
      : 0

    const firstUsage = new Date(
      sortedLogs[0].date
    )

    const lastUsage = new Date(
      sortedLogs[sortedLogs.length - 1].date
    )

    const millisecondsPerDay =
      1000 * 60 * 60 * 24

    const daysTracked = Math.max(
      1,
      Math.ceil(
        (lastUsage.getTime() -
          firstUsage.getTime()) /
          millisecondsPerDay
      ) + 1
    )

    return {
      totalUses: usageLogs.length,
      totalAmount,
      averageAmount,
      firstUsage,
      lastUsage,
      daysTracked,
      unit,
      hasSingleUnit,
    }
  }, [usageLogs])

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#24594f]/20 border-t-[#24594f]" />

          <p className="text-sm text-[#89918c]">
            Loading product...
          </p>

        </div>
      </div>
    )
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (error || !product) {
    return (
      <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">

        <Link
          to="/products"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#89918c] transition hover:text-[#24594f]"
        >
          ← Products
        </Link>

        <div className="mt-7 border border-[#ead4cc] bg-[#fff8f5] p-6">
          <p className="text-sm font-medium text-[#b84d3a]">
            {error ?? 'Product not found.'}
          </p>
        </div>

      </div>
    )
  }

  // -----------------------------------------
  // LIFESPAN
  // -----------------------------------------

  const lifespan = getLifespanInfo(product)

  const lifespanColor =
    !lifespan
      ? '#89918c'
      : lifespan.status === 'Expired'
        ? '#d1583f'
        : lifespan.status === 'Expiring soon'
          ? '#b9783e'
          : '#24594f'

  // -----------------------------------------
  // PAGE
  // -----------------------------------------

  return (
    <div className="relative mx-auto max-w-[1180px] px-5 pb-16 pt-3 md:px-8">

      {/* ATMOSPHERE */}

      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#dce9e4]/50 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-[#f2dfb4]/20 blur-3xl" />

      <div className="relative">

        {/* BACK */}

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#89918c] transition hover:text-[#24594f]"
        >
          <span className="text-base">←</span>
          Products
        </Link>


        {/* =====================================
            PRODUCT HEADER
        ===================================== */}

        <header className="mt-7">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-3">

                <span className="border border-[#24594f]/10 bg-[#edf3f0] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#24594f]">
                  {product.category}
                </span>

                {lifespan && (
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.13em]"
                    style={{
                      color: lifespanColor,
                    }}
                  >
                    {lifespan.status}
                  </span>
                )}

              </div>

              <h1 className="mt-5 truncate text-[38px] font-medium tracking-[-0.045em] text-[#183533] md:text-[50px]">
                {product.name}
              </h1>

              <p className="mt-2 text-[15px] text-[#89918c]">
                {product.brand}
              </p>

            </div>


            {/* ACTIONS */}

            <div className="flex flex-wrap gap-2">

              <Link
                to={`/products/${product.id}/edit`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-[#24594f]
                  px-5
                  py-3
                  text-xs
                  font-semibold
                  text-white
                  shadow-[0_12px_30px_rgba(36,89,79,0.18)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#1d4c43]
                "
              >
                Edit product
                <span>→</span>
              </Link>

              <button
                type="button"
                onClick={() =>
                  setShowDeleteConfirm(true)
                }
                className="
                  border
                  border-[#ead4cc]
                  bg-white/45
                  px-5
                  py-3
                  text-xs
                  font-semibold
                  text-[#b84d3a]
                  backdrop-blur-xl
                  transition
                  hover:bg-[#fff8f5]
                "
              >
                Delete
              </button>

            </div>

          </div>

        </header>


        {/* =====================================
            LIFESPAN INTELLIGENCE
        ===================================== */}

        <section className="mt-9 overflow-hidden border border-white/80 bg-white/45 shadow-[0_25px_70px_rgba(24,53,51,0.07)] backdrop-blur-2xl">

          <div className="grid lg:grid-cols-[1fr_290px]">

            {/* MAIN TIMELINE */}

            <div className="p-6 md:p-8">

              <div className="flex items-start justify-between gap-5">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#e6a92d]" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#89918c]">
                      Product intelligence
                    </span>

                  </div>

                  <h2 className="mt-3 text-[22px] font-medium tracking-[-0.03em] text-[#183533]">
                    Lifespan
                  </h2>

                </div>

                {lifespan && (
                  <div className="text-right">

                    <p
                      className="text-3xl font-light tracking-[-0.05em]"
                      style={{
                        color: lifespanColor,
                      }}
                    >
                      {lifespan.remainingDays < 0
                        ? Math.abs(
                            lifespan.remainingDays
                          )
                        : lifespan.remainingDays}
                    </p>

                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#89918c]">
                      {lifespan.remainingDays < 0
                        ? 'days overdue'
                        : 'days remaining'}
                    </p>

                  </div>
                )}

              </div>


              {lifespan ? (

                <>

                  {/* TIMELINE */}

                  <div className="mt-9">

                    <div className="relative h-2 bg-[#dce9e4]">

                      <div
                        className="absolute left-0 top-0 h-full transition-all duration-500"
                        style={{
                          width: `${lifespan.percentage}%`,
                          backgroundColor:
                            lifespanColor,
                        }}
                      />

                      <div
                        className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-[3px] border-white shadow-md"
                        style={{
                          left: `calc(${lifespan.percentage}% - 8px)`,
                          backgroundColor:
                            lifespanColor,
                        }}
                      />

                    </div>

                    <div className="mt-3 flex justify-between gap-4">

                      <TimelineDate
                        label="Opened"
                        date={lifespan.openedDate}
                        align="left"
                      />

                      <TimelineDate
                        label="Today"
                        date={new Date()}
                        align="center"
                      />

                      <TimelineDate
                        label="Expected end"
                        date={lifespan.expirationDate}
                        align="right"
                      />

                    </div>

                  </div>


                  {/* STATUS */}

                  <div className="mt-8 flex flex-col gap-4 border-t border-[#183533]/8 pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-xs text-[#89918c]">
                        Lifespan used
                      </p>

                      <p className="mt-1 text-lg font-medium text-[#183533]">
                        {Math.round(
                          lifespan.percentage
                        )}
                        %
                      </p>

                    </div>

                    <p className="max-w-md text-xs leading-5 text-[#89918c]">
                      {lifespan.remainingDays < 0
                        ? 'The estimated lifespan has passed. Consider reviewing whether this product should remain in use.'
                        : lifespan.remainingDays <= 30
                          ? 'This product is approaching its expected end date.'
                          : 'This product is currently within its expected lifespan.'}
                    </p>

                  </div>

                </>

              ) : (

                <div className="mt-7 border border-dashed border-[#183533]/12 bg-white/25 px-5 py-7">

                  <p className="text-sm font-medium text-[#183533]">
                    Lifespan cannot be calculated yet
                  </p>

                  <p className="mt-2 max-w-lg text-xs leading-5 text-[#89918c]">
                    Add an opened date and expected duration,
                    or an expiration date, to create a
                    product timeline.
                  </p>

                </div>

              )}

            </div>


            {/* TIMELINE SUMMARY */}

            <div className="border-t border-[#183533]/8 bg-[#edf3f0]/45 p-6 lg:border-l lg:border-t-0 md:p-8">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#89918c]">
                Key dates
              </p>

              <div className="mt-6 space-y-6">

                <SideDate
                  label="Purchased"
                  date={product.purchaseDate}
                />

                <SideDate
                  label="Opened"
                  date={product.openedDate}
                />

                <SideDate
                  label="Expiration"
                  date={product.expirationDate}
                />

              </div>

            </div>

          </div>

        </section>


        {/* =====================================
            QUICK FACTS
        ===================================== */}

        <section className="mt-7 grid gap-px overflow-hidden border border-[#183533]/8 bg-[#183533]/8 sm:grid-cols-2 lg:grid-cols-4">

          <Metric
            label="Price"
            value={
              product.price !== null
                ? `€${product.price.toFixed(2)}`
                : '—'
            }
          />

          <Metric
            label="Quantity"
            value={
              product.quantity !== null
                ? `${product.quantity} ${product.unit ?? ''}`
                : '—'
            }
          />

          <Metric
            label="Expected duration"
            value={
              product.expectedDurationDays !== null
                ? `${product.expectedDurationDays} days`
                : '—'
            }
          />

          <Metric
            label="Frequency"
            value={
              product.usageFrequency || 'Not specified'
            }
          />

        </section>


        {/* =====================================
            USAGE
        ===================================== */}

        <section className="mt-9">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-[#e6a92d]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#89918c]">
                  Actual usage
                </span>

              </div>

              <h2 className="mt-3 text-[25px] font-medium tracking-[-0.035em] text-[#183533]">
                Usage history
              </h2>

              <p className="mt-2 text-sm text-[#89918c]">
                Record how you actually use this product.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowUsageForm(
                  (current) => !current
                )
              }
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                bg-[#24594f]
                px-5
                py-3
                text-xs
                font-semibold
                text-white
                shadow-[0_10px_25px_rgba(36,89,79,0.16)]
                transition
                hover:-translate-y-0.5
                hover:bg-[#1d4c43]
              "
            >
              <span className="text-base">
                {showUsageForm ? '×' : '+'}
              </span>

              {showUsageForm
                ? 'Close'
                : 'Log usage'}
            </button>

          </div>


          {/* USAGE FORM */}

          {showUsageForm && (

            <form
              onSubmit={handleUsageSubmit}
              className="mt-6 border border-[#dce9e4] bg-[#edf5f1]/60 p-5 md:p-6"
            >

              <div className="mb-5">

                <p className="text-sm font-medium text-[#183533]">
                  New usage entry
                </p>

                <p className="mt-1 text-xs text-[#89918c]">
                  Record what you used and when.
                </p>

              </div>

              <div className="grid gap-4 md:grid-cols-3">

                <UsageField label="Date">

                  <input
                    type="date"
                    value={usageDate}
                    onChange={(event) =>
                      setUsageDate(
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />

                </UsageField>

                <UsageField label="Amount used">

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amountUsed}
                    onChange={(event) =>
                      setAmountUsed(
                        event.target.value
                      )
                    }
                    placeholder="2"
                    className={inputClass}
                  />

                </UsageField>

                <UsageField label="Unit">

                  <input
                    type="text"
                    value={unit}
                    onChange={(event) =>
                      setUnit(event.target.value)
                    }
                    placeholder="ml"
                    className={inputClass}
                  />

                </UsageField>

              </div>

              <UsageField label="Notes">

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={3}
                  placeholder="Optional note..."
                  className={`${inputClass} resize-none`}
                />

              </UsageField>

              {usageError && (
                <div className="mt-4 border border-[#ead4cc] bg-[#fff8f5] px-4 py-3 text-xs text-[#b84d3a]">
                  {usageError}
                </div>
              )}

              <div className="mt-5 flex justify-end">

                <button
                  type="submit"
                  disabled={savingUsage}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    bg-[#24594f]
                    px-5
                    py-3
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#1d4c43]
                    disabled:opacity-60
                  "
                >
                  {savingUsage && (
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {savingUsage
                    ? 'Saving...'
                    : 'Save usage'}
                </button>

              </div>

            </form>

          )}


          {/* USAGE LIST */}

          <div className="mt-6">

            {usageLoading ? (

              <div className="border border-white/80 bg-white/35 p-8 text-center backdrop-blur-xl">

                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#24594f]/20 border-t-[#24594f]" />

                <p className="mt-3 text-xs text-[#89918c]">
                  Loading usage history...
                </p>

              </div>

            ) : usageLogs.length === 0 ? (

              <div className="border border-dashed border-[#183533]/12 bg-white/25 px-6 py-12 text-center">

                <div className="mx-auto grid h-12 w-12 place-items-center bg-[#edf3f0] text-[#24594f]">
                  +
                </div>

                <p className="mt-4 text-sm font-medium text-[#183533]">
                  No usage recorded yet
                </p>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#89918c]">
                  Start logging usage and LifeShelf will
                  gradually build a picture of how you use
                  this product.
                </p>

              </div>

            ) : (

              <div className="border border-white/80 bg-white/40 shadow-[0_18px_50px_rgba(24,53,51,0.04)] backdrop-blur-2xl">

                {usageLogs.map((log, index) => (

                  <div
                    key={log.id}
                    className={`flex items-center justify-between gap-5 px-5 py-4 md:px-6 ${
                      index !== usageLogs.length - 1
                        ? 'border-b border-[#183533]/8'
                        : ''
                    }`}
                  >

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="grid h-9 w-9 shrink-0 place-items-center bg-[#edf3f0] text-[10px] font-semibold text-[#24594f]">
                        {new Date(
                          log.date
                        ).getDate()}
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs font-medium text-[#183533]">
                          {new Date(
                            log.date
                          ).toLocaleDateString()}
                        </p>

                        {log.notes && (
                          <p className="mt-1 truncate text-[11px] text-[#89918c]">
                            {log.notes}
                          </p>
                        )}

                      </div>

                    </div>

                    <p className="shrink-0 text-sm font-medium text-[#24594f]">
                      {log.amountUsed} {log.unit}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>


        {/* =====================================
            ANALYTICS
        ===================================== */}

        <section className="mt-12">

          <div className="mb-6">

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-[#e6a92d]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#89918c]">
                Product intelligence
              </span>

            </div>

            <h2 className="mt-3 text-[25px] font-medium tracking-[-0.035em] text-[#183533]">
              Usage analytics
            </h2>

            <p className="mt-2 text-sm text-[#89918c]">
              Understand how you are actually using this product.
            </p>

          </div>


          {usageLogs.length === 0 ? (

            <div className="border border-dashed border-[#183533]/12 bg-white/25 px-6 py-12 text-center">

              <p className="text-sm font-medium text-[#183533]">
                Analytics will appear here
              </p>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#89918c]">
                Add your first usage entry to start seeing
                statistics and trends.
              </p>

            </div>

          ) : (

            <>

              {/* ANALYTIC NUMBERS */}

              <div className="grid gap-px overflow-hidden border border-[#183533]/8 bg-[#183533]/8 sm:grid-cols-2 lg:grid-cols-4">

                <Metric
                  label="Total uses"
                  value={analytics.totalUses.toString()}
                />

                <Metric
                  label="Total amount"
                  value={
                    analytics.hasSingleUnit
                      ? `${analytics.totalAmount.toFixed(2)} ${analytics.unit}`
                      : 'Multiple units'
                  }
                />

                <Metric
                  label="Average per use"
                  value={
                    analytics.hasSingleUnit
                      ? `${analytics.averageAmount.toFixed(2)} ${analytics.unit}`
                      : 'Multiple units'
                  }
                />

                <Metric
                  label="Days tracked"
                  value={analytics.daysTracked.toString()}
                />

              </div>


              {/* MULTIPLE UNIT WARNING */}

              {!analytics.hasSingleUnit && (

                <div className="mt-5 border border-[#eadcb7] bg-[#fff9e9] px-5 py-4">

                  <p className="text-xs font-semibold text-[#8b6e28]">
                    Multiple units detected
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#9a7b31]">
                    Your usage history contains different
                    units. Total amount and average usage
                    are not combined because ml, g, pumps,
                    and other units cannot be meaningfully
                    added together.
                  </p>

                </div>

              )}


              {/* TRACKING DATES */}

              <div className="mt-5 grid gap-px overflow-hidden border border-[#183533]/8 bg-[#183533]/8 sm:grid-cols-2">

                <Metric
                  label="First usage"
                  value={
                    analytics.firstUsage
                      ? analytics.firstUsage.toLocaleDateString()
                      : '—'
                  }
                />

                <Metric
                  label="Last usage"
                  value={
                    analytics.lastUsage
                      ? analytics.lastUsage.toLocaleDateString()
                      : '—'
                  }
                />

              </div>


              {/* CHART */}

              <div className="mt-6 border border-white/80 bg-white/40 p-5 shadow-[0_18px_50px_rgba(24,53,51,0.04)] backdrop-blur-2xl md:p-7">

                <div className="flex items-end justify-between gap-4">

                  <div>

                    <h3 className="text-sm font-medium text-[#183533]">
                      Usage over time
                    </h3>

                    <p className="mt-1 text-[11px] text-[#89918c]">
                      Amount used on each recorded day
                    </p>

                  </div>

                  {analytics.hasSingleUnit && (
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#9aa19d]">
                      {analytics.unit}
                    </span>
                  )}

                </div>

                <UsageChart logs={usageLogs} />

              </div>

            </>

          )}

        </section>


        {/* =====================================
            NOTES
        ===================================== */}

        {product.notes && (

          <section className="mt-12 border-l-2 border-[#e6a92d] bg-[#f6efe0]/55 px-6 py-6 md:px-8">

            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9a7b31]">
              Your note
            </p>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#596660]">
              {product.notes}
            </p>

          </section>

        )}

      </div>


      {/* =====================================
          DELETE MODAL
      ===================================== */}

      {showDeleteConfirm && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-[#183533]/30
            p-4
            backdrop-blur-md
          "
          role="dialog"
          aria-modal="true"
        >

          <div className="w-full max-w-md border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur-2xl md:p-7">

            <div className="grid h-11 w-11 place-items-center bg-[#fff0ec] text-[#d1583f]">
              !
            </div>

            <h2 className="mt-5 text-xl font-medium tracking-[-0.02em] text-[#183533]">
              Delete this product?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#727a75]">

              This will permanently delete{' '}

              <span className="font-medium text-[#183533]">
                {product.name}
              </span>{' '}

              and its usage history.

            </p>

            <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
                disabled={deleting}
                className="
                  border
                  border-[#183533]/10
                  bg-white
                  px-5
                  py-3
                  text-xs
                  font-semibold
                  text-[#6f7872]
                  transition
                  hover:bg-[#f7f8f7]
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="
                  bg-[#c84f3b]
                  px-5
                  py-3
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#b74331]
                  disabled:opacity-60
                "
              >
                {deleting
                  ? 'Deleting...'
                  : 'Delete product'}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}


// =========================================
// LIFESPAN CALCULATION
// =========================================

function getLifespanInfo(product: Product) {
  if (!product.openedDate) {
    return null
  }

  const openedDate =
    new Date(product.openedDate)

  let expirationDate: Date | null = null

  if (product.expirationDate) {
    expirationDate =
      new Date(product.expirationDate)
  } else if (
    product.expectedDurationDays !== null
  ) {
    expirationDate = new Date(
      openedDate.getTime() +
        product.expectedDurationDays *
          24 *
          60 *
          60 *
          1000
    )
  }

  if (!expirationDate) {
    return null
  }

  const today = new Date()

  const millisecondsPerDay =
    1000 * 60 * 60 * 24

  const totalDays = Math.max(
    1,
    Math.ceil(
      (expirationDate.getTime() -
        openedDate.getTime()) /
        millisecondsPerDay
    )
  )

  const elapsedDays = Math.ceil(
    (today.getTime() -
      openedDate.getTime()) /
      millisecondsPerDay
  )

  const remainingDays = Math.ceil(
    (expirationDate.getTime() -
      today.getTime()) /
      millisecondsPerDay
  )

  const percentage = Math.min(
    100,
    Math.max(
      0,
      (elapsedDays / totalDays) * 100
    )
  )

  let status = 'In use'

  if (remainingDays < 0) {
    status = 'Expired'
  } else if (remainingDays <= 30) {
    status = 'Expiring soon'
  }

  return {
    openedDate,
    expirationDate,
    totalDays,
    elapsedDays,
    remainingDays,
    percentage,
    status,
  }
}


// =========================================
// USAGE CHART
// =========================================

function UsageChart({
  logs,
}: {
  logs: UsageLog[]
}) {
  if (logs.length === 0) {
    return null
  }

  const units = Array.from(
    new Set(
      logs.map((log) =>
        log.unit.trim().toLowerCase()
      )
    )
  )

  if (units.length > 1) {
    return (
      <div className="mt-5 border border-[#eadcb7] bg-[#fff9e9] p-4">

        <p className="text-xs font-semibold text-[#8b6e28]">
          Chart unavailable
        </p>

        <p className="mt-1 text-xs leading-5 text-[#9a7b31]">
          Your usage entries use different units.
          Add entries using the same unit to see
          an amount-based chart.
        </p>

      </div>
    )
  }

  const dailyUsage: Record<string, number> = {}

  logs.forEach((log) => {
    const date = new Date(log.date)

    const dateKey =
      date.toISOString().split('T')[0]

    if (!dailyUsage[dateKey]) {
      dailyUsage[dateKey] = 0
    }

    dailyUsage[dateKey] += Number(
      log.amountUsed
    )
  })

  const chartData = Object.entries(
    dailyUsage
  ).sort(([dateA], [dateB]) =>
    dateA.localeCompare(dateB)
  )

  const maxAmount = Math.max(
    ...chartData.map(
      ([, amount]) => amount
    ),
    1
  )

  const unit = logs[0].unit

  return (
    <div className="mt-6">

      <div className="flex min-h-[250px] items-end gap-3 overflow-x-auto border border-[#183533]/6 bg-white/45 p-5">

        {chartData.map(
          ([date, amount]) => {

            const height =
              (amount / maxAmount) * 100

            const formattedDate =
              new Date(
                `${date}T12:00:00`
              ).toLocaleDateString(
                undefined,
                {
                  day: 'numeric',
                  month: 'short',
                }
              )

            return (
              <div
                key={date}
                className="
                  group
                  flex
                  min-h-[210px]
                  min-w-[52px]
                  flex-1
                  flex-col
                  items-center
                  justify-end
                "
              >

                <span className="mb-2 text-[10px] font-medium text-[#24594f]">
                  {amount.toFixed(1)}
                </span>

                <div
                  className="
                    w-7
                    rounded-t-[4px]
                    bg-[#4fa08f]
                    transition-all
                    duration-300
                    group-hover:bg-[#24594f]
                  "
                  style={{
                    height: `${Math.max(
                      height,
                      5
                    )}%`,
                  }}
                />

                <span className="mt-3 whitespace-nowrap text-[10px] text-[#9aa19d]">
                  {formattedDate}
                </span>

              </div>
            )
          }
        )}

      </div>

      <p className="mt-3 text-[10px] uppercase tracking-[0.1em] text-[#9aa19d]">
        Amount used ({unit}) per recorded day
      </p>

    </div>
  )
}


// =========================================
// SMALL COMPONENTS
// =========================================

interface MetricProps {
  label: string
  value: string
}

function Metric({
  label,
  value,
}: MetricProps) {
  return (
    <div className="bg-white/60 px-5 py-5 backdrop-blur-xl md:px-6">

      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9aa19d]">
        {label}
      </p>

      <p className="mt-2 break-words text-[18px] font-medium tracking-[-0.02em] text-[#183533]">
        {value}
      </p>

    </div>
  )
}


interface TimelineDateProps {
  label: string
  date: Date
  align: 'left' | 'center' | 'right'
}

function TimelineDate({
  label,
  date,
  align,
}: TimelineDateProps) {
  return (
    <div
      className={`${
        align === 'center'
          ? 'text-center'
          : align === 'right'
            ? 'text-right'
            : 'text-left'
      }`}
    >

      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#9aa19d]">
        {label}
      </p>

      <p className="mt-1 text-[11px] font-medium text-[#596660]">
        {date.toLocaleDateString()}
      </p>

    </div>
  )
}


function SideDate({
  label,
  date,
}: {
  label: string
  date: string | null
}) {
  return (
    <div>

      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9aa19d]">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-[#183533]">
        {date
          ? new Date(date).toLocaleDateString()
          : 'Not specified'}
      </p>

    </div>
  )
}


interface UsageFieldProps {
  label: string
  children: React.ReactNode
}

function UsageField({
  label,
  children,
}: UsageFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#596660]">
        {label}
      </span>

      {children}
    </label>
  )
}


// =========================================
// INPUT STYLE
// =========================================

const inputClass = `
  w-full
  border
  border-[#183533]/10
  bg-white/60
  px-4
  py-3.5
  text-sm
  text-[#183533]
  shadow-[0_5px_20px_rgba(24,53,51,0.025)]
  outline-none
  backdrop-blur-xl
  transition
  placeholder:text-[#a0a7a3]
  hover:border-[#183533]/15
  focus:border-[#7ca99d]
  focus:bg-white/80
  focus:shadow-[0_0_0_3px_rgba(79,160,143,0.10)]
`

export default ProductDetails