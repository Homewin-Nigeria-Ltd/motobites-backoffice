"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { rolePermissionsMutations } from "../api/mutations"
import { rolePermissionsKeys } from "../api/keys"
import type { UpdateRoleInput } from "../types"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message || fallback
  }

  return fallback
}

export function useUpdateRole() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...rolePermissionsMutations.updateRole,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: rolePermissionsKeys.all })
      queryClient.invalidateQueries({
        queryKey: rolePermissionsKeys.roleDetail(variables.role),
      })
      toast.success(response.message ?? "Role updated successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update role. Please try again."))
    },
  })

  return {
    updateRole: (variables: { role: string; input: UpdateRoleInput }) =>
      mutation.mutateAsync(variables),
    isPending: mutation.isPending,
  }
}

export function useDeleteRole() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...rolePermissionsMutations.deleteRole,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: rolePermissionsKeys.all })
      toast.success(response.message ?? "Role deleted successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete role. Please try again."))
    },
  })

  return {
    deleteRole: (role: string) => mutation.mutateAsync(role),
    isPending: mutation.isPending,
  }
}
