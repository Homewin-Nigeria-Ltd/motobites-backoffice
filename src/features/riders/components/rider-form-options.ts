import { nigerianBanks } from "../constants/banks"
import { riderGenderOptions, type RiderGender } from "../schemas/add-rider.schema"

export const riderGenderLabels: Record<RiderGender, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
}

export const riderGenderOptionsList = riderGenderOptions.map((value) => ({
  value,
  label: riderGenderLabels[value],
}))

export const riderBankOptions = nigerianBanks.map((bank) => ({
  value: bank,
  label: bank,
}))

export type RiderExistingFiles = {
  proofOfAddress?: string | null
  guarantorProofOfAddress?: string | null
  driverLicense?: string | null
}
