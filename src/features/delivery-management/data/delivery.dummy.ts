import type {
  DeliveryOrderFrequency,
  DeliverySummaryKpi,
} from "../types"

export const DELIVERY_SUMMARY_KPIS: DeliverySummaryKpi[] = [
  {
    key: "ongoing_delivery",
    label: "Ongoing Delivery",
    formatted_value: "60,460",
    change_percent: 0.56,
    trend: "up",
  },
  {
    key: "total_delivery",
    label: "Total Delivery",
    formatted_value: "60,460",
    change_percent: 0.56,
    trend: "up",
  },
  {
    key: "active_riders",
    label: "Active Riders",
    formatted_value: 57,
    change_percent: 0.56,
    trend: "up",
  },
]

export const DELIVERY_ORDER_FREQUENCY: DeliveryOrderFrequency = {
  total_orders: 60460,
  change_percent: 0.56,
  trend: "up",
  series: [
    { label: "12am", value: 1200 },
    { label: "2am", value: 800 },
    { label: "4am", value: 600 },
    { label: "6am", value: 2400 },
    { label: "8am", value: 5200 },
    { label: "10am", value: 7800 },
    { label: "12pm", value: 9200 },
  ],
}

export const DELIVERY_ZONE_LOCATIONS = [
  { id: "1", name: "Ikoyi", latitude: 6.4541, longitude: 3.4316 },
  { id: "2", name: "Lekki", latitude: 6.4474, longitude: 3.5562 },
  { id: "3", name: "Victoria Island", latitude: 6.4281, longitude: 3.4219 },
  { id: "4", name: "Yaba", latitude: 6.5095, longitude: 3.3711 },
  { id: "5", name: "Surulere", latitude: 6.4969, longitude: 3.355 },
]
