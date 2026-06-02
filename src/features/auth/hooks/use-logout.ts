"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { authMutations } from "../api/mutations"
import { authKeys } from "../api/keys"
import { toast } from "@/lib/toast"

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...authMutations.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all })
      router.push("/login")
      router.refresh()
    },
    onError: () => {
      toast.error("Could not log out. Please try again.")
    },
  })

  return {
    logout: () => mutation.mutate(),
    isPending: mutation.isPending,
  }
}
