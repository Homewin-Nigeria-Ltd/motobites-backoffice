"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { rolePermissionsMutations } from "../api/mutations"
import { rolePermissionsKeys } from "../api/keys"
import type { CreateRoleInput } from "../types"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useCreateRole() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...rolePermissionsMutations.createRole,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: rolePermissionsKeys.all })
      toast.success(response.message ?? "Role saved and published")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to create role. Please try again."
      toast.error(message)
    },
  })

  return {
    createRole: (input: CreateRoleInput) => mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
