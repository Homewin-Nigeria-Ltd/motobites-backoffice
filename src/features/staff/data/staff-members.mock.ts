import type { StaffListParams, StaffListResponse, StaffMember } from "../types"

const staffMembersMock: StaffMember[] = [
  {
    id: "1",
    name: "Oluwanifemi Osunsanya",
    email: "oluwanifemi@motobite.com",
    role: "Super Admin",
    joinedAt: "2024-02-02T09:32:00",
    status: "active",
  },
  {
    id: "2",
    name: "Michael Adeyemi",
    email: "michael@motobite.com",
    role: "Admin",
    joinedAt: "2024-01-15T14:20:00",
    status: "away",
  },
  {
    id: "3",
    name: "Oluwanifemi Osunsanya",
    email: "oluwanifemi@motobite.com",
    role: "Order Manager",
    joinedAt: "2024-02-02T09:32:00",
    status: "active",
  },
  {
    id: "4",
    name: "Michael Okonkwo",
    email: "m.okonkwo@motobite.com",
    role: "Kitchen Manager",
    joinedAt: "2023-11-08T11:00:00",
    status: "inactive",
  },
  {
    id: "5",
    name: "Oluwanifemi Osunsanya",
    email: "oluwanifemi@motobite.com",
    role: "Customer Care Rep",
    joinedAt: "2024-02-02T09:32:00",
    status: "active",
  },
  {
    id: "6",
    name: "Oluwanifemi Osunsanya",
    email: "oluwanifemi@motobite.com",
    role: "Rider",
    joinedAt: "2024-02-02T09:32:00",
    status: "away",
  },
  {
    id: "7",
    name: "Oluwanifemi Osunsanya",
    email: "oluwanifemi@motobite.com",
    role: "Chef",
    joinedAt: "2024-02-02T09:32:00",
    status: "active",
  },
  {
    id: "8",
    name: "Oluwanifemi Osunsanya",
    email: "oluwanifemi@motobite.com",
    role: "Inventory Manager",
    joinedAt: "2024-02-02T09:32:00",
    status: "inactive",
  },
  {
    id: "9",
    name: "Sarah Michael",
    email: "sarah.michael@motobite.com",
    role: "Admin",
    joinedAt: "2024-03-10T08:15:00",
    status: "active",
  },
  {
    id: "10",
    name: "David Chen",
    email: "david@motobite.com",
    role: "Rider",
    joinedAt: "2024-04-01T16:45:00",
    status: "active",
  },
  {
    id: "11",
    name: "Amaka Nwosu",
    email: "amaka@motobite.com",
    role: "Chef",
    joinedAt: "2023-12-20T10:30:00",
    status: "away",
  },
  {
    id: "12",
    name: "Michael Bello",
    email: "m.bello@motobite.com",
    role: "Order Manager",
    joinedAt: "2024-05-18T13:00:00",
    status: "active",
  },
]

export function getStaffListMock(params: StaffListParams): StaffListResponse {
  const perPage = params.per_page ?? 8
  const page = Math.max(1, params.page)
  const search = params.search?.trim().toLowerCase() ?? ""

  let rows = [...staffMembersMock]

  if (search) {
    rows = rows.filter(
      (member) =>
        member.name.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.role.toLowerCase().includes(search)
    )
  }

  const total = rows.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(page, lastPage)
  const start = (safePage - 1) * perPage

  return {
    items: rows.slice(start, start + perPage),
    meta: {
      current_page: safePage,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  }
}
