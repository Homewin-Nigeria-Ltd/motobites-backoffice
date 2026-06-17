export const accountSettingsEndpoints = {
  updatePassword: "/api/proxy/admin/settings/account/password",
  updatePersonal: "/api/proxy/admin/settings/account/personal",
  devices: "/api/proxy/admin/settings/account/devices",
  device: (tokenId: number | string) =>
    `/api/proxy/admin/settings/account/devices/${tokenId}`,
  twoFactor: "/api/proxy/admin/settings/account/two-factor",
} as const
