import type {
  AddRiderFormValues,
  UpdateRiderFormValues,
} from "../schemas/add-rider.schema"

function appendOptionalFile(
  formData: FormData,
  key: string,
  file: File | null | undefined
) {
  if (file instanceof File) {
    formData.append(key, file)
    return
  }

  formData.append(key, "")
}

export function buildRiderFormData(
  values: AddRiderFormValues | UpdateRiderFormValues
) {
  const formData = new FormData()

  formData.append("first_name", values.firstName)
  formData.append("last_name", values.lastName)
  formData.append("email", values.email)
  formData.append("phone", values.phone)
  formData.append("gender", values.gender)
  formData.append("date_of_birth", values.dateOfBirth ?? "")
  formData.append("house_address", values.houseAddress)
  formData.append("nin", values.nin)

  appendOptionalFile(formData, "proof_of_address", values.proofOfAddress)

  formData.append("guarantor_first_name", values.guarantorFirstName)
  formData.append("guarantor_last_name", values.guarantorLastName)
  formData.append("guarantor_email", values.guarantorEmail ?? "")
  formData.append("guarantor_phone", values.guarantorPhone)
  formData.append("guarantor_relationship", values.guarantorRelationship)
  formData.append("guarantor_address", values.guarantorAddress ?? "")

  appendOptionalFile(
    formData,
    "guarantor_proof_of_address",
    values.guarantorProofOfAddress
  )

  appendOptionalFile(formData, "driver_license", values.driverLicense)

  formData.append("bank_account_number", values.bankAccountNumber ?? "")
  formData.append("bank_name", values.bankName ?? "")
  formData.append("bank_account_name", values.bankAccountName ?? "")

  if (values.branchId) {
    formData.append("fulfillment_branch_id", values.branchId)
  }

  if (values.password) {
    formData.append("password", values.password)
  }

  return formData
}
