import type {
  SalesTransactionAnalyticsSummary,
  SalesTransactionPaymentMethodBreakdown,
  SalesTransactionRevenueSourceBreakdown,
  SalesTransactionRevenueTrendPoint,
  SalesTransactionTopItemRow,
} from "../types"

export const SALES_TRANSACTION_ANALYTICS_PERIOD = "Aug 1 - Aug 19, 2025"

export const SALES_TRANSACTION_ANALYTICS_SUMMARY: SalesTransactionAnalyticsSummary =
  {
    totalRevenue: 2_456_800,
    totalRevenueBadge: "+12.5% YoY",
    totalRevenueSubtitle: "Gross earnings in period",
    transactionCount: 847,
    transactionCountBadge: "+8.2% YoY",
    transactionCountSubtitle: "Orders logged in system",
    averageOrderValue: 2_901,
    averageOrderValueBadge: "+2.4% vs last week",
    averageOrderValueSubtitle: "Slightly up from last week",
    completionRate: 96.4,
    completionRateBadge: "+0.5% vs last week",
    completionRateSubtitle: "Delivered/Paid ratio",
  }

export const SALES_TRANSACTION_REVENUE_SOURCE_BREAKDOWN: SalesTransactionRevenueSourceBreakdown[] =
  [
    {
      key: "walk_in",
      label: "Walk-in",
      percent: 45,
      amount: 1_105_560,
      color: "var(--primary)",
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      percent: 28,
      amount: 687_904,
      color: "rgb(34, 197, 94)",
    },
    {
      key: "glovo",
      label: "Glovo",
      percent: 18,
      amount: 442_224,
      color: "rgb(245, 158, 11)",
    },
    {
      key: "chowdeck",
      label: "Chowdeck",
      percent: 9,
      amount: 221_112,
      color: "rgb(244, 63, 94)",
    },
  ]

export const SALES_TRANSACTION_PAYMENT_METHOD_BREAKDOWN: SalesTransactionPaymentMethodBreakdown[] =
  [
    {
      label: "Cash",
      percent: 45,
      amount: 1_105_560,
      barClassName: "bg-primary",
    },
    {
      label: "Card",
      percent: 30,
      amount: 737_040,
      barClassName: "bg-sky-500",
    },
    {
      label: "Bank Transfer",
      percent: 25,
      amount: 614_200,
      barClassName: "bg-emerald-500",
    },
  ]

export const SALES_TRANSACTION_REVENUE_TREND: SalesTransactionRevenueTrendPoint[] =
  [
    { date: "Aug 1", walk_in: 82_000, whatsapp: 38_000, glovo: 24_000, web: 31_000, chowdeck: 12_000 },
    { date: "Aug 2", walk_in: 88_000, whatsapp: 41_000, glovo: 26_000, web: 33_000, chowdeck: 13_500 },
    { date: "Aug 3", walk_in: 91_000, whatsapp: 43_000, glovo: 27_500, web: 34_000, chowdeck: 14_000 },
    { date: "Aug 4", walk_in: 86_000, whatsapp: 40_000, glovo: 25_000, web: 32_000, chowdeck: 13_000 },
    { date: "Aug 5", walk_in: 94_000, whatsapp: 44_000, glovo: 28_000, web: 35_000, chowdeck: 14_500 },
    { date: "Aug 6", walk_in: 98_000, whatsapp: 46_000, glovo: 29_000, web: 36_000, chowdeck: 15_000 },
    { date: "Aug 7", walk_in: 102_000, whatsapp: 48_000, glovo: 30_000, web: 37_000, chowdeck: 15_500 },
    { date: "Aug 8", walk_in: 96_000, whatsapp: 45_000, glovo: 28_500, web: 35_500, chowdeck: 14_800 },
    { date: "Aug 9", walk_in: 104_000, whatsapp: 49_000, glovo: 31_000, web: 38_000, chowdeck: 16_000 },
    { date: "Aug 10", walk_in: 108_000, whatsapp: 51_000, glovo: 32_000, web: 39_000, chowdeck: 16_500 },
    { date: "Aug 11", walk_in: 145_000, whatsapp: 54_000, glovo: 33_500, web: 40_500, chowdeck: 17_000 },
    { date: "Aug 12", walk_in: 112_000, whatsapp: 52_000, glovo: 32_500, web: 39_500, chowdeck: 16_800 },
    { date: "Aug 13", walk_in: 118_000, whatsapp: 55_000, glovo: 34_000, web: 41_000, chowdeck: 17_500 },
    { date: "Aug 14", walk_in: 122_000, whatsapp: 57_000, glovo: 35_000, web: 42_000, chowdeck: 18_000 },
    { date: "Aug 15", walk_in: 126_000, whatsapp: 59_000, glovo: 36_000, web: 43_000, chowdeck: 18_500 },
    { date: "Aug 16", walk_in: 130_000, whatsapp: 61_000, glovo: 37_000, web: 44_000, chowdeck: 19_000 },
    { date: "Aug 17", walk_in: 134_000, whatsapp: 63_000, glovo: 38_000, web: 45_000, chowdeck: 19_500 },
    { date: "Aug 18", walk_in: 138_000, whatsapp: 65_000, glovo: 39_000, web: 46_000, chowdeck: 20_000 },
    { date: "Aug 19", walk_in: 142_000, whatsapp: 67_000, glovo: 40_000, web: 47_000, chowdeck: 20_500 },
  ]

export const SALES_TRANSACTION_TOP_ITEMS: SalesTransactionTopItemRow[] = [
  {
    rank: 1,
    name: "Jollof Rice & Spicy Chicken Platter",
    source: "walk_in",
    sourceLabel: "Walk-in",
    unitsSold: 420,
    revenue: 1_050_000,
  },
  {
    rank: 2,
    name: "Ewa Agoyin Deluxe (Portion)",
    source: "whatsapp",
    sourceLabel: "WhatsApp",
    unitsSold: 310,
    revenue: 868_000,
  },
  {
    rank: 3,
    name: "Pounded Yam with Egusi Supreme",
    source: "glovo",
    sourceLabel: "Glovo",
    unitsSold: 215,
    revenue: 430_000,
  },
  {
    rank: 4,
    name: "Amala Special & Abula Soup Combination",
    source: "chowdeck",
    sourceLabel: "Chowdeck",
    unitsSold: 180,
    revenue: 360_000,
  },
]
