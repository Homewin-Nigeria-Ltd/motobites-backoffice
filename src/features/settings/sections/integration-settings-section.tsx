"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function IntegrationSettingsSection() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <div className="max-w-xl space-y-1">
          <h1 className="text-lg font-semibold text-foreground">
            Integration Setting
          </h1>
          <p className="text-sm text-muted-foreground">
            API settings for developers to integrate custom functionalities.
          </p>
        </div>

        <div className="mt-8 grid max-w-xl gap-4">
          <div className="space-y-2">
            <Label htmlFor="integration-api-key">API key</Label>
            <Input
              id="integration-api-key"
              type="password"
              placeholder="Enter your API key"
              className="h-11"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Use this key to connect Motobites with external services and custom
            integrations.
          </p>
        </div>
      </div>
    </div>
  )
}
