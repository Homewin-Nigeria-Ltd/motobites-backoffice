"use client"

import { useState } from "react"

import { RoleCombobox } from "@/features/staff/components/role-combobox"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { toast } from "@/lib/toast"

type InviteMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteMemberDialog({
  open,
  onOpenChange,
}: InviteMemberDialogProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setRole("")
  }

  const handleInvite = () => {
    if (!fullName.trim() || !email.trim() || !role) {
      toast.error("Please fill in all fields")
      return
    }
    toast.success(`Invitation sent to ${email.trim()}`)
    resetForm()
    onOpenChange(false)
  }

  return (
    <BaseModal
      title="Invite Team Member"
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          resetForm()
        }
        onOpenChange(next)
      }}
      headerIcon={<Icons.account size={28} className="text-primary" />}
    >
      <div className="space-y-2">
        <Label htmlFor="invite-full-name">Full Name</Label>
        <Input
          id="invite-full-name"
          placeholder="Enter Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          icon={{ name: "account", position: "left" }}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-email">Email Address</Label>
        <Input
          id="invite-email"
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={{ name: "mail", position: "left" }}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-role">Choose Role</Label>
        <RoleCombobox id="invite-role" value={role} onChange={setRole} />
      </div>

      <Button
        type="button"
        size="lg"
        className="mt-2 h-11 w-full"
        onClick={handleInvite}
      >
        Invite Member
      </Button>
    </BaseModal>
  )
}
