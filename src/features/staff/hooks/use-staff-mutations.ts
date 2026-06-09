"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffKeys } from "../api/keys"
import { staffMutations } from "../api/mutations"
import type { InviteStaffInput, UpdateStaffInput } from "../types"
import { downloadStaffCsv } from "../utils/export-staff-csv"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message || fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export function useInviteStaff() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...staffMutations.invite,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: staffKeys.all })
      toast.success(result.message ?? "Invitation sent successfully")
    },
    onError: () => {
      toast.error("Failed to invite team member")
    },
  })

  return {
    inviteStaff: (input: InviteStaffInput) => mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useUpdateStaff() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...staffMutations.update,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: staffKeys.all })
      toast.success(result.message ?? "Team member updated")
    },
    onError: () => {
      toast.error("Failed to update team member")
    },
  })

  return {
    updateStaff: (input: UpdateStaffInput) => mutation.mutateAsync(input),
    isPending: mutation.isPending,
    pendingMemberId: mutation.isPending
      ? String(mutation.variables?.id ?? "")
      : null,
  }
}

export function useToggleStaffFavorite() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...staffMutations.toggleFavorite,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: staffKeys.all })
      toast.success(
        result.data?.is_favorited
          ? "Added to favorites"
          : "Removed from favorites"
      )
    },
    onError: () => {
      toast.error("Failed to update favorite")
    },
  })

  return {
    toggleFavorite: (id: string) => mutation.mutateAsync(id),
    isPending: mutation.isPending,
    pendingMemberId: mutation.isPending
      ? String(mutation.variables ?? "")
      : null,
  }
}

export function useRemoveStaff() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...staffMutations.remove,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: staffKeys.all })
      toast.success(result.message ?? "Team member removed")
    },
    onError: () => {
      toast.error("Failed to remove team member")
    },
  })

  return {
    removeStaff: (id: string) => mutation.mutateAsync(id),
    isPending: mutation.isPending,
    pendingMemberId: mutation.isPending
      ? String(mutation.variables ?? "")
      : null,
  }
}

export function useExportStaffCsv() {
  const mutation = useMutation({
    mutationFn: () => downloadStaffCsv(),
    onSuccess: () => {
      toast.success("Staff CSV exported")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to export staff CSV"))
    },
  })

  return {
    exportStaffCsv: () => mutation.mutate(),
    isPending: mutation.isPending,
  }
}
