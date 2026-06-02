"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { authMutations } from "../api/mutations"
import { authKeys } from "../api/keys"
import type { LoginInput } from "../schemas/login.schema"
import { toast } from "@/lib/toast"

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

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

  return {
    login: (data: LoginInput) => mutation.mutate(data),
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
