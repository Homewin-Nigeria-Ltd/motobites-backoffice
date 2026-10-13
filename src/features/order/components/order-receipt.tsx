import { ASSETS } from "@/constants/assets"

import type { ApiOrderDetailData } from "@/features/order/types"
import { formatKoboAmount, formatNairaAmount } from "@/features/order/utils/currency"
import { formatDate } from "@/features/order/utils/date"
import { getOrderItemAddons } from "@/features/order/utils/order-detail"
import "@/features/offline-order/components/offline-order-pos-receipt.css"

function stripNaira(value: string) {
  return value.replace("₦", "").trim()
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className={`receipt-detail-row${bold ? " font-bold" : ""}`}>
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  )
}

export function OrderReceipt({ order }: { order: ApiOrderDetailData }) {
  const currency = order.payment_breakdown?.currency ?? "NGN"
  const charges = order.payment_breakdown?.charges
  const reductions = order.payment_breakdown?.reductions
  const kobo = (value?: number) =>
    typeof value === "number" ? stripNaira(formatKoboAmount(value, currency)) : null

  const details: Array<[string, string | null | undefined]> = [
    ["Order No.", order.order_number],
    ["Date", order.created_at ? formatDate(order.created_at) : null],
    ["Customer", order.customer?.name ?? order.customer_name],
    ["Phone", order.customer?.phone],
    ["Payment", order.payment.method],
    ["Branch", order.fulfillment_branch?.name],
    ["Address", order.delivery_address],
    ["Promo", order.promo_code?.code],
    ["Gift", order.is_gift || order.gift ? "Yes" : null],
  ]

  const totals: Array<[string, string | null]> = [
    ["Subtotal", kobo(charges?.items_subtotal_kobo)],
    ["Delivery Fee", kobo(charges?.delivery_fee_kobo ?? 0)],
    ["Service Fee", kobo(charges?.service_fee_kobo ?? 0)],
    ["Rider Tip", (charges?.rider_tip_kobo ?? 0) > 0 ? kobo(charges?.rider_tip_kobo) : null],
    [
      "Discount",
      (reductions?.total_reductions_kobo ?? 0) > 0
        ? `-${kobo(reductions?.total_reductions_kobo)}`
        : null,
    ],
  ]

  const total =
    typeof order.payment_breakdown?.amount_due_kobo === "number"
      ? formatKoboAmount(order.payment_breakdown.amount_due_kobo, currency)
      : order.amount_paid_formatted

  return (
    <div className="pos-receipt mx-auto w-full max-w-[80mm] bg-white font-mono text-[20px] leading-[1.4] text-black print:text-[20px]">
      <div className="border border-black/15 p-4 print:border-0 print:p-0">
        <div className="text-center">
          <img
            src={ASSETS.brand.logo}
            alt="Motobites"
            width={240}
            height={240}
            className="receipt-logo"
          />
          <p className="uppercase tracking-[0.12em]">Order Receipt</p>
        </div>

        <div className="my-3 border-t border-dashed border-black/50" />
        {details.map(([label, value]) =>
          value ? <Row key={label} label={label} value={value} /> : null
        )}

        <div className="my-3 border-t border-dashed border-black/50" />
        <div className="receipt-item-row font-bold uppercase">
          <span className="item-name">Item</span>
          <span className="item-qty" aria-hidden="true" />
          <span className="item-price">Amt</span>
        </div>
        {(order.items ?? []).map((item) => (
          <div key={item.id}>
            <div className="receipt-item-row">
              <span className="item-name">{item.name}</span>
              <span className="item-qty">x{item.quantity}</span>
              <span className="item-price">{stripNaira(formatNairaAmount(item.subtotal))}</span>
            </div>
            {getOrderItemAddons(item).map((addon) => (
              <div key={String(addon.id)} className="receipt-item-row">
                <span className="item-name item-addon">{addon.name}</span>
                <span className="item-qty">x{addon.quantity ?? 1}</span>
                <span className="item-price">
                  {typeof addon.price === "number"
                    ? `+${stripNaira(formatNairaAmount(addon.price))}`
                    : ""}
                </span>
              </div>
            ))}
          </div>
        ))}

        <div className="my-3 border-t border-dashed border-black/50" />
        {totals.map(([label, value]) =>
          value ? <Row key={label} label={label} value={value} /> : null
        )}

        <div className="my-3 border-t border-double border-black" />
        <Row label="TOTAL" value={total} bold />
        <div className="my-3 border-t border-dashed border-black/50" />
        <p className="text-center uppercase tracking-[0.08em]">Thank you for your order</p>
      </div>
    </div>
  )
}
