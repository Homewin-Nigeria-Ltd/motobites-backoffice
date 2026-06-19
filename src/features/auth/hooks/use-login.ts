"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

import { authMutations } from "../api/mutations"
import { authKeys } from "../api/keys"
import type { LoginInput, LoginPayload } from "../schemas/login.schema"
import {
  getNavigatorDeviceName,
  useNavigator,
} from "@/hooks/use-navigator"
import { toast } from "@/lib/toast"

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { refreshLocation } = useNavigator()

  const mutation = useMutation({
    ...authMutations.login,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Signed in successfully")
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      router.push("/dashboard")
      router.refresh()
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.")
    },
  })

  const login = useCallback(
    async (data: LoginInput) => {
      const [resolvedDeviceName, coordinates] = await Promise.all([
        getNavigatorDeviceName(),
        refreshLocation(),
      ])

      const payload: LoginPayload = {
        ...data,
        device_name: resolvedDeviceName,
        ...(coordinates
          ? {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            }
          : {}),
      }

      mutation.mutate(payload)
    },
    [mutation, refreshLocation]
  )

  return {
    login,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
