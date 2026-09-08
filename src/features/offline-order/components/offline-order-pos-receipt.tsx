import type { OfflineOrderReceipt } from "../types"
import { getPaymentMethodLabel } from "../utils/order-checkout"
import { getCartItemAddonSummary } from "../utils/cart-line"
import { formatOfflineOrderAmount } from "../utils/order-totals"
import "./offline-order-pos-receipt.css"

function formatReceiptDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function formatPosAmount(amount: number) {
  return formatOfflineOrderAmount(amount).replace("₦", "")
}

function ReceiptRow({
  label,
  value,
  bold = false,
  valueNoWrap = false,
}: {
  label: string
  value: string
  bold?: boolean
  valueNoWrap?: boolean
}) {
  return (
    <div className={`receipt-detail-row${bold ? " font-bold" : ""}`}>
      <span className="detail-label">{label}</span>
      <span
        className={`detail-value${valueNoWrap ? " detail-value-nowrap" : ""}`}
      >
        {value}
      </span>
    </div>
  )
}

function ReceiptItemRow({
  name,
  quantity,
  amount,
}: {
  name: string
  quantity: number
  amount: string
}) {
  return (
    <div className="receipt-item-row">
      <span className="item-name">{name}</span>
      <span className="item-qty">x{quantity}</span>
      <span className="item-price">{amount}</span>
    </div>
  )
}

type OfflineOrderPosReceiptProps = {
  receipt: OfflineOrderReceipt
  businessName?: string
}

export function OfflineOrderPosReceipt({
  receipt,
  businessName = "Motobites",
}: OfflineOrderPosReceiptProps) {
  const customerName = receipt.customerName.trim() || "Walk-in Customer"

  return (
    <div className="pos-receipt mx-auto w-full max-w-[80mm] bg-white font-mono text-[20px] leading-[1.4] text-black print:text-[20px]">
      <div className="border border-black/15 p-4 print:border-0 print:p-0">
        <div className="text-center">
          <p className="font-bold uppercase tracking-wide">{businessName}</p>
          <p className="uppercase tracking-[0.12em]">Walk-in Order Receipt</p>
        </div>

        <div className="my-3 border-t border-dashed border-black/50" />

        <div>
          <ReceiptRow label="Order No." value={`#${receipt.orderNumber}`} />
          <ReceiptRow label="Date" value={formatReceiptDate(receipt.placedAt)} />
          <ReceiptRow label="Staff" value={receipt.takenByName || "Staff"} />
          <ReceiptRow label="Customer" value={customerName} />
          {receipt.customerPhone ? (
            <ReceiptRow label="Phone" value={receipt.customerPhone} />
          ) : null}
          <ReceiptRow
            label="Payment"
            value={getPaymentMethodLabel(receipt.paymentMethod)}
          />
        </div>

        <div className="my-3 border-t border-dashed border-black/50" />

        <div>
          <div className="receipt-item-row font-bold uppercase">
            <span className="item-name">Item</span>
            <span className="item-qty" aria-hidden="true" />
            <span className="item-price">Amt</span>
          </div>
          {receipt.items.map((item) => {
            const lineTotal = item.price * item.quantity
            const addonSummary = getCartItemAddonSummary(item.addons)
            const label = addonSummary
              ? `${item.name} (${addonSummary})`
              : item.name

            return (
              <ReceiptItemRow
                key={item.lineId}
                name={label}
                quantity={item.quantity}
                amount={formatPosAmount(lineTotal)}
              />
            )
          })}
        </div>

        <div className="my-3 border-t border-dashed border-black/50" />

        <div>
          <ReceiptRow
            label="Subtotal"
            value={formatPosAmount(receipt.subtotal)}
            valueNoWrap
          />
          <ReceiptRow
            label="Service Fee"
            value={formatPosAmount(receipt.serviceFee)}
            valueNoWrap
          />
        </div>

        <div className="my-3 border-t border-double border-black" />

        <ReceiptRow
          label="TOTAL"
          value={formatOfflineOrderAmount(receipt.total)}
          bold
          valueNoWrap
        />

        <div className="my-3 border-t border-dashed border-black/50" />

        <p className="text-center uppercase tracking-[0.08em]">
          Thank you for your order
        </p>
      </div>
    </div>
  )
}
