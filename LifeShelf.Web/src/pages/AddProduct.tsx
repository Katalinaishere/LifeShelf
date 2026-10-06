import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  createProduct,
  type CreateProduct,
} from '../services/productService'

const categories = [
  'Skincare',
  'Supplements',
  'Medication',
  'Cleaning',
  'Hygiene',
  'Healthcare',
  'Household',
]

function AddProduct() {
  const navigate = useNavigate()

  const [form, setForm] = useState<CreateProduct>({
    name: '',
    brand: '',
    category: 'Skincare',
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

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField(
    field: keyof CreateProduct,
    value: string | number | undefined
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setError(null)

    try {
      const createdProduct = await createProduct({
        ...form,

        price:
          form.price === undefined
            ? undefined
            : Number(form.price),

        quantity:
          form.quantity === undefined
            ? undefined
            : Number(form.quantity),

        expectedDurationDays:
          form.expectedDurationDays === undefined
            ? undefined
            : Number(form.expectedDurationDays),
      })

      navigate(`/products/${createdProduct.id}`)
    } catch (error) {
      console.error(error)
      setError('Could not save the product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative mx-auto max-w-[1180px] px-5 pb-16 pt-3 md:px-8">

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#dce9e4]/50 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-[#f2dfb4]/25 blur-3xl" />

      <div className="relative">

        {/* HEADER */}
        <header className="mb-9">

          <button
            type="button"
            onClick={() => navigate('/products')}
            className="
              mb-7
              inline-flex
              items-center
              gap-2
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[#89918c]
              transition
              hover:text-[#24594f]
            "
          >
            <span className="text-base">←</span>
            Products
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-4 flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-[#e6a92d]" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6f7872]">
                  Your shelf
                </span>

              </div>

              <h1 className="text-[36px] font-medium tracking-[-0.04em] text-[#183533] md:text-[46px]">
                Add a product
              </h1>

              <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#727a75]">
                Add something new to your LifeShelf and start
                keeping track of how you use it.
              </p>

            </div>

            {/* Small preview */}
            <div className="hidden min-w-[230px] border border-white/80 bg-white/40 px-5 py-4 shadow-[0_15px_45px_rgba(24,53,51,0.05)] backdrop-blur-2xl lg:block">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9aa19d]">
                Preview
              </p>

              <div className="mt-3 flex items-center gap-3">

                <div className="grid h-10 w-10 shrink-0 place-items-center border border-[#183533]/8 bg-[#edf3f0] text-sm font-medium text-[#24594f]">
                  {form.name
                    ? form.name.charAt(0).toUpperCase()
                    : '+'}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-medium text-[#183533]">
                    {form.name || 'New product'}
                  </p>

                  <p className="mt-1 truncate text-[11px] text-[#89918c]">
                    {form.brand || 'Brand'}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </header>


        {/* MAIN LAYOUT */}
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_250px]">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="
              overflow-hidden
              border
              border-white/80
              bg-white/45
              shadow-[0_25px_70px_rgba(24,53,51,0.07)]
              backdrop-blur-2xl
            "
          >

            {/* BASIC INFORMATION */}
            <section className="p-6 md:p-8">

              <SectionHeading
                number="01"
                title="Basic information"
                description="Start with the essentials."
              />

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                <Field
                  label="Product name"
                  required
                >
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        'name',
                        event.target.value
                      )
                    }
                    placeholder="e.g. Hydrating Cleanser"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Brand"
                  required
                >
                  <input
                    required
                    value={form.brand}
                    onChange={(event) =>
                      updateField(
                        'brand',
                        event.target.value
                      )
                    }
                    placeholder="e.g. CeraVe"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Category"
                  required
                >
                  <select
                    required
                    value={form.category}
                    onChange={(event) =>
                      updateField(
                        'category',
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Subcategory">
                  <input
                    value={form.subcategory}
                    onChange={(event) =>
                      updateField(
                        'subcategory',
                        event.target.value
                      )
                    }
                    placeholder="e.g. Cleanser"
                    className={inputClass}
                  />
                </Field>

              </div>

            </section>


            <Divider />


            {/* QUANTITY */}
            <section className="p-6 md:p-8">

              <SectionHeading
                number="02"
                title="Quantity & price"
                description="Keep the basic product economics nearby."
              />

              <div className="mt-7 grid gap-5 md:grid-cols-3">

                <Field label="Price (€)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price ?? ''}
                    onChange={(event) =>
                      updateField(
                        'price',
                        event.target.value === ''
                          ? undefined
                          : Number(event.target.value)
                      )
                    }
                    placeholder="12.99"
                    className={inputClass}
                  />
                </Field>

                <Field label="Quantity">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.quantity ?? ''}
                    onChange={(event) =>
                      updateField(
                        'quantity',
                        event.target.value === ''
                          ? undefined
                          : Number(event.target.value)
                      )
                    }
                    placeholder="236"
                    className={inputClass}
                  />
                </Field>

                <Field label="Unit">
                  <input
                    value={form.unit}
                    onChange={(event) =>
                      updateField(
                        'unit',
                        event.target.value
                      )
                    }
                    placeholder="ml, g, capsules..."
                    className={inputClass}
                  />
                </Field>

              </div>

            </section>


            <Divider />


            {/* DATES */}
            <section className="p-6 md:p-8">

              <SectionHeading
                number="03"
                title="Important dates"
                description="These dates help LifeShelf understand your product's timeline."
              />

              <div className="mt-7 grid gap-5 md:grid-cols-3">

                <Field label="Purchase date">
                  <input
                    type="date"
                    value={form.purchaseDate}
                    onChange={(event) =>
                      updateField(
                        'purchaseDate',
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Opened date">
                  <input
                    type="date"
                    value={form.openedDate}
                    onChange={(event) =>
                      updateField(
                        'openedDate',
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Expiration date">
                  <input
                    type="date"
                    value={form.expirationDate}
                    onChange={(event) =>
                      updateField(
                        'expirationDate',
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

              </div>

              <div className="mt-5 flex items-start gap-3 border border-[#dce9e4] bg-[#f3f8f5]/70 px-4 py-3.5">

                <span className="mt-0.5 text-sm text-[#24594f]">
                  ⓘ
                </span>

                <p className="text-[11px] leading-5 text-[#727a75]">
                  Adding an opened date and expiration date
                  lets LifeShelf give you more useful timeline
                  information later.
                </p>

              </div>

            </section>


            <Divider />


            {/* EXPECTED USAGE */}
            <section className="p-6 md:p-8">

              <SectionHeading
                number="04"
                title="Expected usage"
                description="Tell LifeShelf how you expect to use this product."
              />

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                <Field label="Expected duration (days)">
                  <input
                    type="number"
                    min="1"
                    value={
                      form.expectedDurationDays ?? ''
                    }
                    onChange={(event) =>
                      updateField(
                        'expectedDurationDays',
                        event.target.value === ''
                          ? undefined
                          : Number(event.target.value)
                      )
                    }
                    placeholder="90"
                    className={inputClass}
                  />

                  <p className="mt-2 text-[10px] text-[#9aa19d]">
                    How long you expect the product to last.
                  </p>
                </Field>

                <Field label="Usage frequency">
                  <input
                    value={form.usageFrequency}
                    onChange={(event) =>
                      updateField(
                        'usageFrequency',
                        event.target.value
                      )
                    }
                    placeholder="e.g. Twice daily"
                    className={inputClass}
                  />

                  <p className="mt-2 text-[10px] text-[#9aa19d]">
                    Example: once daily, twice daily, weekly.
                  </p>
                </Field>

              </div>

            </section>


            <Divider />


            {/* NOTES */}
            <section className="p-6 md:p-8">

              <SectionHeading
                number="05"
                title="Notes"
                description="Anything useful you want to remember."
              />

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField(
                    'notes',
                    event.target.value
                  )
                }
                placeholder="Anything you want to remember..."
                rows={5}
                className={`${inputClass} mt-7 resize-none`}
              />

            </section>


            {/* ERROR */}
            {error && (
              <div className="mx-6 mb-6 border border-[#ead4cc] bg-[#fff8f5] px-4 py-3.5 md:mx-8">

                <div className="flex items-start gap-3">

                  <span className="text-[#d1583f]">
                    !
                  </span>

                  <p className="text-sm text-[#b84d3a]">
                    {error}
                  </p>

                </div>

              </div>
            )}


            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#183533]/10 bg-white/25 p-6 sm:flex-row sm:items-center sm:justify-between md:px-8">

              <button
                type="button"
                onClick={() => navigate('/products')}
                className="
                  w-full
                  border
                  border-[#183533]/10
                  bg-white/30
                  px-5
                  py-3
                  text-xs
                  font-semibold
                  text-[#6f7872]
                  transition
                  hover:bg-white/60
                  hover:text-[#183533]
                  sm:w-auto
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  group
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  bg-[#24594f]
                  px-7
                  py-3.5
                  text-xs
                  font-semibold
                  text-white
                  shadow-[0_12px_30px_rgba(36,89,79,0.2)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#1d4c43]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-auto
                "
              >
                {saving ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save product
                    <span className="text-base transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </>
                )}
              </button>

            </div>

          </form>


          {/* SIDE INFORMATION */}
          <aside className="hidden lg:block">

            <div className="sticky top-8 space-y-4">

              {/* Progress */}
              <div className="border border-white/80 bg-white/40 p-5 shadow-[0_18px_50px_rgba(24,53,51,0.05)] backdrop-blur-2xl">

                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9aa19d]">
                  LifeShelf setup
                </p>

                <p className="mt-3 text-lg font-light tracking-[-0.03em] text-[#183533]">
                  Build your product record
                </p>

                <div className="mt-5 h-1 overflow-hidden bg-[#dce9e4]">

                  <div
                    className="h-full bg-[#24594f] transition-all duration-500"
                    style={{
                      width: `${
                        [
                          form.name,
                          form.brand,
                          form.subcategory,
                          form.price !== undefined
                            ? String(form.price)
                            : '',
                          form.quantity !== undefined
                            ? String(form.quantity)
                            : '',
                          form.purchaseDate,
                          form.openedDate,
                          form.expirationDate,
                          form.expectedDurationDays !==
                          undefined
                            ? String(
                                form.expectedDurationDays
                              )
                            : '',
                          form.usageFrequency,
                          form.notes,
                        ].filter(Boolean).length * 8
                      }%`,
                    }}
                  />

                </div>

                <p className="mt-3 text-[10px] leading-5 text-[#89918c]">
                  Add as much information as you have.
                  You can always edit the product later.
                </p>

              </div>


              {/* Tip */}
              <div className="border border-[#dce9e4] bg-[#edf5f1]/70 p-5">

                <div className="flex items-center gap-2">

                  <span className="text-sm">
                    ✦
                  </span>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#24594f]">
                    Small tip
                  </p>

                </div>

                <p className="mt-3 text-xs leading-5 text-[#6f7872]">
                  The more dates and usage information you
                  add, the more useful LifeShelf's lifespan
                  tracking becomes.
                </p>

              </div>


              {/* Category */}
              <div className="border border-white/70 bg-white/30 p-5 backdrop-blur-xl">

                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9aa19d]">
                  Category
                </p>

                <div className="mt-3 flex items-center gap-3">

                  <span className="grid h-9 w-9 place-items-center bg-[#e8f1ee] text-xs text-[#24594f]">
                    {form.category.charAt(0)}
                  </span>

                  <div>

                    <p className="text-xs font-medium text-[#183533]">
                      {form.category}
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#9aa19d]">
                      Product type
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>
    </div>
  )
}


/* --------------------------------------------------
   Reusable UI
-------------------------------------------------- */

const inputClass = `
  w-full
  border
  border-[#183533]/10
  bg-white/55
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
  focus:bg-white/75
  focus:shadow-[0_0_0_3px_rgba(79,160,143,0.10)]
`

const selectClass = `
  ${inputClass}
  appearance-none
  cursor-pointer
`

interface FieldProps {
  label: string
  required?: boolean
  children: ReactNode
}

function Field({
  label,
  required,
  children,
}: FieldProps) {
  return (
    <label className="block">

      <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#596660]">

        {label}

        {required && (
          <span className="ml-1 text-[#d1583f]">
            *
          </span>
        )}

      </span>

      {children}

    </label>
  )
}

interface SectionHeadingProps {
  number: string
  title: string
  description: string
}

function SectionHeading({
  number,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="flex gap-4">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#24594f]/15 bg-[#edf3f0] text-[9px] font-semibold text-[#24594f]">
        {number}
      </div>

      <div>

        <h2 className="text-[17px] font-medium tracking-[-0.02em] text-[#183533]">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-[#89918c]">
          {description}
        </p>

      </div>

    </div>
  )
}

function Divider() {
  return (
    <div className="mx-6 h-px bg-[#183533]/8 md:mx-8" />
  )
}

export default AddProduct