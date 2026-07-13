import type { ApiRider } from "../types"
import {
  addRiderDefaultValues,
  riderGenderOptions,
  type RiderGender,
  type UpdateRiderFormValues,
} from "../schemas/add-rider.schema"

function splitName(name: string | null | undefined) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean)

  return {
    first: parts[0] ?? "",
    last: parts.slice(1).join(" "),
  }
}

function normalizeGender(gender: string | null | undefined): RiderGender {
  const value = gender?.toLowerCase()

  if (value && (riderGenderOptions as readonly string[]).includes(value)) {
    return value as RiderGender
  }

  return "male"
}

function normalizeDateOfBirth(dateOfBirth: string | null | undefined) {
  if (!dateOfBirth) return ""

  return dateOfBirth.slice(0, 10)
}

export function mapRiderToFormValues(rider: ApiRider): UpdateRiderFormValues {
  const guarantor = splitName(rider.profile.guarantor_name)

  return {
    ...addRiderDefaultValues,
    firstName: rider.first_name ?? "",
    lastName: rider.last_name ?? "",
    email: rider.email ?? "",
    password: "",
    gender: normalizeGender(rider.profile.gender),
    dateOfBirth: normalizeDateOfBirth(rider.profile.date_of_birth),
    phone: rider.phone ?? "",
    houseAddress: rider.profile.house_address ?? "",
    proofOfAddress: null,
    guarantorFirstName: guarantor.first,
    guarantorLastName: guarantor.last,
    guarantorEmail: rider.profile.guarantor_email ?? "",
    guarantorPhone: rider.profile.guarantor_phone ?? "",
    guarantorRelationship: rider.profile.guarantor_relationship ?? "",
    guarantorAddress: rider.profile.guarantor_address ?? "",
    guarantorProofOfAddress: null,
    nin: rider.profile.nin ?? "",
    driverLicense: null,
    bankAccountNumber: rider.profile.bank_account_number ?? "",
    bankName: rider.profile.bank_name ?? "",
    bankAccountName: rider.profile.bank_account_name ?? "",
  }
}

export function getRiderExistingFiles(rider: ApiRider) {
  return {
    proofOfAddress: rider.profile.proof_of_address_url,
    guarantorProofOfAddress: rider.profile.guarantor_proof_of_address_url,
    driverLicense: rider.profile.driver_license_url,
  }
}
