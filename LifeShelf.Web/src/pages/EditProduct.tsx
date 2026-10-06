import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  getProduct,
  updateProduct,
} from '../services/productService'

import type { CreateProduct } from '../services/productService'

const categories = [
  'Skincare',
  'Supplements',
  'Medication',
  'Cleaning',
  'Hygiene',
  'Healthcare',
  'Household',
]

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState<CreateProduct>({
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    price: undefined,
    quantity: undefined,
    unit: '',
    purchaseDate: '',
    openedDate: '',
    expirationDate: '',
    expectedDurationDays: undefined,
    usageFrequency: '',
    notes: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setError('Product ID is missing.')
        setLoading(false)
        return
      }

      try {
        const product = await getProduct(Number(id))

        setForm({
          name: product.name,
          brand: product.brand,
          category: product.category,
          subcategory: product.subcategory ?? '',
          price: product.price ?? undefined,
          quantity: product.quantity ?? undefined,
          unit: product.unit ?? '',
          purchaseDate: product.purchaseDate
            ? product.purchaseDate.slice(0, 10)
            : '',
          openedDate: product.openedDate
            ? product.openedDate.slice(0, 10)
            : '',
          expirationDate: product.expirationDate
            ? product.expirationDate.slice(0, 10)
            : '',
          expectedDurationDays:
            product.expectedDurationDays ?? undefined,
          usageFrequency:
            product.usageFrequency ?? '',
          notes: product.notes ?? '',
        })
      } catch (error) {
        console.error(error)
        setError('Could not load product.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  function handleChange(
    field: keyof CreateProduct,
    value: string | number | undefined
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!id) {
      setError('Product ID is missing.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await updateProduct(Number(id), form)

      navigate(`/products/${id}`)
    } catch (error) {
      console.error(error)
      setError('Could not update product.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6efe0] px-5 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-[#dce9e4]" />

            <div className="mt-8 h-10 w-72 rounded bg-[#dce9e4]" />

            <div className="mt-3 h-5 w-96 max-w-full rounded bg-[#e4eee9]" />

            <div className="mt-10 h-[700px] rounded-[2rem] bg-white/60" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f6efe0] px-5 pb-16 pt-8 sm:px-8 lg:px-10">

      {/* AMBIENT BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#dce9e4]/70 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#e6a92d]/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#d1583f]/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">

        {/* HEADER */}

        <header className="mb-10">

          <Link
            to={`/products/${id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#55706b] transition hover:text-[#183533]"
          >
            <span className="text-base">←</span>
            Back to product
          </Link>

          <div className="mt-7 max-w-3xl">

            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#e6a92d]" />

              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7b918b]">
                Product settings
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-[#183533] sm:text-5xl">
              Edit product
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#55706b]">
              Keep your shelf accurate by updating the information,
              lifecycle and usage details for this product.
            </p>

          </div>

        </header>

        {/* ERROR */}

        {error && (
          <div className="mb-7 flex items-start gap-3 border border-red-200 bg-red-50/80 px-5 py-4 text-sm text-red-700 shadow-sm backdrop-blur">
            <span className="mt-0.5 font-bold">!</span>

            <div>
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 text-red-600">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit}>

          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 shadow-[0_25px_70px_rgba(24,53,51,0.08)] backdrop-blur-xl">

            {/* FORM INTRO */}

            <div className="border-b border-[#dce7e3]/80 px-6 py-7 sm:px-9">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b918b]">
                    Editing
                  </p>

                  <p className="mt-1 text-lg font-medium text-[#183533]">
                    {form.name || 'Your product'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#55706b]">
                  <span className="h-2 w-2 rounded-full bg-[#7fa79c]" />
                  Changes are saved to your shelf
                </div>

              </div>

            </div>

            {/* BASIC INFORMATION */}

            <FormSection
              eyebrow="01"
              title="Basic information"
              description="Identify the product and organize it within your collection."
            >

              <div className="grid gap-6 md:grid-cols-2">

                <Field
                  label="Product name"
                  required
                  value={form.name}
                  onChange={(value) =>
                    handleChange('name', value)
                  }
                />

                <Field
                  label="Brand"
                  required
                  value={form.brand}
                  onChange={(value) =>
                    handleChange('brand', value)
                  }
                />

                <SelectField
                  label="Category"
                  required
                  value={form.category}
                  onChange={(value) =>
                    handleChange('category', value)
                  }
                  options={categories}
                  placeholder="Select category"
                />

                <Field
                  label="Subcategory"
                  value={form.subcategory ?? ''}
                  placeholder="e.g. Cleanser"
                  onChange={(value) =>
                    handleChange('subcategory', value)
                  }
                />

              </div>

            </FormSection>

            {/* PRODUCT DETAILS */}

            <FormSection
              eyebrow="02"
              title="Product details"
              description="Record the quantity and purchase value so LifeShelf can track the product accurately."
            >

              <div className="grid gap-6 md:grid-cols-3">

                <NumberField
                  label="Price"
                  suffix="€"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(value) =>
                    handleChange('price', value)
                  }
                />

                <NumberField
                  label="Quantity"
                  min="0"
                  step="0.01"
                  value={form.quantity}
                  onChange={(value) =>
                    handleChange('quantity', value)
                  }
                />

                <Field
                  label="Unit"
                  value={form.unit ?? ''}
                  placeholder="ml, g, tablets..."
                  onChange={(value) =>
                    handleChange('unit', value)
                  }
                />

              </div>

            </FormSection>

            {/* LIFECYCLE */}

            <FormSection
              eyebrow="03"
              title="Dates & lifecycle"
              description="These dates help LifeShelf understand how long the product has been in use."
            >

              <div className="grid gap-6 md:grid-cols-2">

                <DateField
                  label="Purchase date"
                  value={form.purchaseDate ?? ''}
                  onChange={(value) =>
                    handleChange('purchaseDate', value)
                  }
                />

                <DateField
                  label="Opened date"
                  value={form.openedDate ?? ''}
                  onChange={(value) =>
                    handleChange('openedDate', value)
                  }
                />

                <DateField
                  label="Expiration date"
                  value={form.expirationDate ?? ''}
                  onChange={(value) =>
                    handleChange('expirationDate', value)
                  }
                />

                <NumberField
                  label="Expected duration"
                  suffix="days"
                  min="1"
                  value={form.expectedDurationDays}
                  placeholder="90"
                  onChange={(value) =>
                    handleChange(
                      'expectedDurationDays',
                      value
                    )
                  }
                />

              </div>

              <div className="mt-7 border-l-2 border-[#e6a92d] bg-[#f6efe0]/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b918b]">
                  Tip
                </p>

                <p className="mt-1 text-sm leading-6 text-[#55706b]">
                  If you don't have a specific expiration date,
                  expected duration can help LifeShelf estimate when
                  the product may need attention.
                </p>
              </div>

            </FormSection>

            {/* USAGE */}

            <FormSection
              eyebrow="04"
              title="Usage"
              description="Describe how you normally use this product."
            >

              <Field
                label="Usage frequency"
                value={form.usageFrequency ?? ''}
                placeholder="Daily, twice daily, weekly..."
                onChange={(value) =>
                  handleChange('usageFrequency', value)
                }
              />

            </FormSection>

            {/* NOTES */}

            <FormSection
              eyebrow="05"
              title="Notes"
              description="Keep any extra information you want to remember about this product."
            >

              <label className="block">

                <span className="mb-2 block text-sm font-medium text-[#36534e]">
                  Product notes
                </span>

                <textarea
                  value={form.notes ?? ''}
                  onChange={(event) =>
                    handleChange(
                      'notes',
                      event.target.value
                    )
                  }
                  rows={6}
                  placeholder="Anything you want to remember about this product..."
                  className="w-full resize-none border border-[#d7e3df] bg-white/75 px-4 py-3.5 text-sm text-[#183533] outline-none transition placeholder:text-[#9aaba6] focus:border-[#7fa79c] focus:bg-white focus:ring-4 focus:ring-[#8eaaa2]/10"
                />

              </label>

            </FormSection>

            {/* ACTIONS */}

            <div className="border-t border-[#dce7e3] bg-white/30 px-6 py-6 sm:px-9">

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

                <Link
                  to={`/products/${id}`}
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-[#55706b] transition hover:bg-[#edf4f1]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-3 bg-[#183533] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#183533]/10 transition hover:bg-[#24594f] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      Save changes
                      <span className="text-base">→</span>
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </form>

      </div>

    </main>
  )
}

/* ------------------------------------------------ */
/* FORM SECTION */
/* ------------------------------------------------ */

function FormSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-[#dce7e3]/80 px-6 py-8 sm:px-9 sm:py-10">

      <div className="mb-7 grid gap-3 md:grid-cols-[180px_1fr] md:gap-8">

        <div>
          <span className="text-xs font-semibold tracking-[0.16em] text-[#e6a92d]">
            {eyebrow}
          </span>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#183533]">
            {title}
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-6 text-[#718580]">
          {description}
        </p>

      </div>

      {children}

    </section>
  )
}

/* ------------------------------------------------ */
/* TEXT FIELD */
/* ------------------------------------------------ */

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-sm font-medium text-[#36534e]">
        {label}

        {required && (
          <span className="ml-1 text-[#d1583f]">
            *
          </span>
        )}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required={required}
        placeholder={placeholder}
        className="w-full border border-[#d7e3df] bg-white/75 px-4 py-3.5 text-sm text-[#183533] outline-none transition placeholder:text-[#a0afab] focus:border-[#7fa79c] focus:bg-white focus:ring-4 focus:ring-[#8eaaa2]/10"
      />

    </label>
  )
}

/* ------------------------------------------------ */
/* SELECT FIELD */
/* ------------------------------------------------ */

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-sm font-medium text-[#36534e]">
        {label}

        {required && (
          <span className="ml-1 text-[#d1583f]">
            *
          </span>
        )}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required={required}
        className="w-full appearance-none border border-[#d7e3df] bg-white/75 px-4 py-3.5 text-sm text-[#183533] outline-none transition focus:border-[#7fa79c] focus:bg-white focus:ring-4 focus:ring-[#8eaaa2]/10"
      >
        <option value="">
          {placeholder ?? 'Select'}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </label>
  )
}

/* ------------------------------------------------ */
/* NUMBER FIELD */
/* ------------------------------------------------ */

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  min,
  step,
  suffix,
}: {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  placeholder?: string
  min?: string
  step?: string
  suffix?: string
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-sm font-medium text-[#36534e]">
        {label}
      </span>

      <div className="relative">

        <input
          type="number"
          min={min}
          step={step}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              event.target.value
                ? Number(event.target.value)
                : undefined
            )
          }
          className={`w-full border border-[#d7e3df] bg-white/75 px-4 py-3.5 text-sm text-[#183533] outline-none transition placeholder:text-[#a0afab] focus:border-[#7fa79c] focus:bg-white focus:ring-4 focus:ring-[#8eaaa2]/10 ${
            suffix ? 'pr-14' : ''
          }`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#7b918b]">
            {suffix}
          </span>
        )}

      </div>

    </label>
  )
}

/* ------------------------------------------------ */
/* DATE FIELD */
/* ------------------------------------------------ */

function DateField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-sm font-medium text-[#36534e]">
        {label}
      </span>

      <input
        type="date"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-[#d7e3df] bg-white/75 px-4 py-3.5 text-sm text-[#183533] outline-none transition focus:border-[#7fa79c] focus:bg-white focus:ring-4 focus:ring-[#8eaaa2]/10"
      />

    </label>
  )
}

export default EditProduct