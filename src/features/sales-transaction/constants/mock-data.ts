import type {
  SalesTransactionHistoryPreviewRow,
  SalesTransactionRow,
  SalesTransactionSummary,
} from "../types"

export const SALES_TRANSACTION_SUMMARY: SalesTransactionSummary = {
  todayTransactions: 34,
  todayTransactionsBadge: "+5 vs yesterday",
  todayRevenue: 98_400,
  todayRevenueBadge: "100% target",
  pendingOrders: 4,
  pendingOrdersBadge: "Needs attention",
  activeStaff: 6,
  activeStaffBadge: "On Duty",
}

export const SALES_TRANSACTION_HISTORY_PREVIEW: SalesTransactionHistoryPreviewRow[] =
  [
    {
      transactionNumber: "#TXN-0897",
      amount: 9_500,
      status: "Completed",
    },
    {
      transactionNumber: "#TXN-0896",
      amount: 2_800,
      status: "Completed",
    },
  ]

export const SALES_TRANSACTION_RECENT: SalesTransactionRow[] = [
  {
    id: "txn-0897",
    transactionNumber: "#TXN-0897",
    customerName: "Olamide Soyinka",
    source: "walk_in",
    sourceLabel: "Walk-in",
    amount: 9_500,
    timeLabel: "2 mins ago",
  },
  {
    id: "txn-0896",
    transactionNumber: "#TXN-0896",
    customerName: "Chidi Egwu",
    source: "whatsapp",
    sourceLabel: "WhatsApp",
    amount: 2_800,
    timeLabel: "15 mins ago",
  },
  {
    id: "txn-0895",
    transactionNumber: "#TXN-0895",
    customerName: "Ada Nwosu",
    source: "glovo",
    sourceLabel: "Glovo",
    amount: 12_300,
    timeLabel: "30 mins ago",
  },
  {
    id: "txn-0894",
    transactionNumber: "#TXN-0894",
    customerName: "Ibrahim Musa",
    source: "chowdeck",
    sourceLabel: "Chowdeck",
    amount: 4_100,
    timeLabel: "45 mins ago",
  },
  {
    id: "txn-0893",
    transactionNumber: "#TXN-0893",
    customerName: "Grace Okon",
    source: "web",
    sourceLabel: "Web",
    amount: 6_750,
    timeLabel: "1 hour ago",
  },
]
