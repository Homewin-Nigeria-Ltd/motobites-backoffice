export const accountSettingsKeys = {
  all: ["account-settings"] as const,
  devices: () => [...accountSettingsKeys.all, "devices"] as const,
  twoFactor: () => [...accountSettingsKeys.all, "two-factor"] as const,
}
