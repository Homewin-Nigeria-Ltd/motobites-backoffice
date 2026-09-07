"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition } from "react"

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
  const [isPreparing, setIsPreparing] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isPendingTransition, startTransition] = useTransition()

  const mutation = useMutation({
    ...authMutations.login,
    onSuccess: (result) => {
      setIsPreparing(false)
      if (!result.success) {
        setIsRedirecting(false)
        toast.error(result.error)
        return
      }

      setIsRedirecting(true)
      toast.success("Signed in successfully")
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      startTransition(() => {
        router.push("/dashboard")
        router.refresh()
      })
    },
    onError: () => {
      setIsPreparing(false)
      setIsRedirecting(false)
      toast.error("Something went wrong. Please try again.")
    },
  })

  const login = useCallback(
    async (data: LoginInput) => {
      try {
        setIsPreparing(true)
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
      } catch {
        setIsPreparing(false)
        toast.error("Could not prepare sign in. Please try again.")
      }
    },
    [mutation, refreshLocation]
  )

  const isPending = isPreparing || mutation.isPending
  const isNavigating = isRedirecting || isPendingTransition

  return {
    login,
    isPending,
    isRedirecting: isNavigating,
    isLoading: isPending || isNavigating,
    isError: mutation.isError,
    error: mutation.error,
  }
}
