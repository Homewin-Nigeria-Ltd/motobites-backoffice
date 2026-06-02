"use client"

import { useMemo, useState } from "react"

import { OrderDetailsModal } from "@/features/order/components/order-details-modal"
import { OrderFilterTabs } from "@/features/order/components/order-filter-tabs"
import { OrderHubSection } from "@/features/order/components/order-hub-section"
import { orderTabCounts, useOrderHubs } from "@/features/order"
import type { Order, OrderTab } from "@/features/order/types"
import { PaginationControls } from "@/components/pagination-controls"
import { AppLoader } from "@/components/ui/app-loader"
import { Input } from "@/components/ui/input"

const HUBS_PER_PAGE = 2

export function OrderManagementSection() {
  const [activeTab, setActiveTab] = useState<OrderTab>("pending")
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data: orderHubs = [], isPending } = useOrderHubs()

  const visibleHubs = useMemo(() => {
    if (activeTab === "performance") {
      return []
    }

    return orderHubs
      .map((hub) => ({
        ...hub,
        orders: hub.orders.filter((order) => order.tab === activeTab),
      }))
      .filter((hub) => hub.orders.length > 0)
  }, [activeTab, orderHubs])

  const totalVisibleOrders = visibleHubs.reduce(
    (sum, hub) => sum + hub.orders.length,
    0
  )

  const totalPages = Math.max(1, Math.ceil(visibleHubs.length / HUBS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)

  const paginatedHubs = useMemo(
    () =>
      visibleHubs.slice(
        (currentPage - 1) * HUBS_PER_PAGE,
        currentPage * HUBS_PER_PAGE
      ),
    [currentPage, visibleHubs]
  )

  const handleTabChange = (tab: OrderTab) => {
    setActiveTab(tab)
    setPage(1)
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <OrderFilterTabs
            value={activeTab}
            onChange={handleTabChange}
            counts={orderTabCounts}
          />
          <div className="w-full max-w-xs shrink-0 sm:w-64">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search order using order number"
              className="h-10"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-4 md:p-6">
          {isPending ? (
            <AppLoader className="min-h-48 flex-1 rounded-2xl border border-border bg-background" />
          ) : activeTab === "performance" ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
              <p className="max-w-md text-sm text-muted-foreground">
                Performance insights for your order operations will appear here.
              </p>
            </div>
          ) : totalVisibleOrders === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
              <p className="text-sm text-muted-foreground">
                No orders found for this filter.
              </p>
            </div>
          ) : (
            paginatedHubs.map((hub) => (
              <OrderHubSection
                key={hub.id}
                hub={hub}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>

        {totalVisibleOrders > 0 && activeTab !== "performance" ? (
          <div className="flex shrink-0 justify-center border-t border-border/60 bg-background px-4 py-4 md:px-6">
            <PaginationControls
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      <OrderDetailsModal
        key={selectedOrder?.id ?? "closed"}
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) {
            setSelectedOrder(null)
          }
        }}
      />
    </div>
  )
}
