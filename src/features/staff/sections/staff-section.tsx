"use client"

import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { staffColumns } from "@/features/staff/columns"
import { InviteMemberDialog } from "@/features/staff/components/invite-member-dialog"
import { StaffToolbar } from "@/features/staff/components/staff-toolbar"
import { useStaffList } from "@/features/staff"

import { DataTable } from "@/components/data-table"

const DEFAULT_PAGE_SIZE = 8

export function StaffManagementSection() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const { data, isPending, isFetching } = useStaffList({
    search,
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
  })

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((current) => ({
      ...current,
      pageIndex: page - 1,
    }))
  }

  const items = data?.items ?? []
  const totalPages = data?.meta.last_page ?? 1
  const currentPage = data?.meta.current_page ?? pagination.pageIndex + 1

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <DataTable
        columns={staffColumns}
        data={items}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isPending || (isFetching && items.length === 0)}
        toolbar={
          <StaffToolbar
            search={search}
            onSearchChange={handleSearchChange}
            onInviteClick={() => setInviteOpen(true)}
          />
        }
      />

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
