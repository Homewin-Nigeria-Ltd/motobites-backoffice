"use client"

import { useEffect, useRef, useState } from "react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import {
  useGooglePlaces,
  type GooglePlaceOption,
} from "@/hooks/use-google-places"

export type AddressComboboxProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  id?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  countryCode?: string
  "aria-invalid"?: boolean
}

const MIN_QUERY_LENGTH = 3
const DEBOUNCE_MS = 300

export function AddressCombobox({
  value,
  onChange,
  onBlur,
  id,
  placeholder = "Search address",
  className,
  disabled,
  countryCode = "ng",
  "aria-invalid": ariaInvalid,
}: AddressComboboxProps) {
  const { hasApiKey, isLoaded, autocompleteRef, placesRef } = useGooglePlaces()
  const [draft, setDraft] = useState<string | null>(null)
  const inputValue = draft ?? value
  const [selected, setSelected] = useState<GooglePlaceOption | null>(null)
  const [predictions, setPredictions] = useState<GooglePlaceOption[]>([])
  const [loading, setLoading] = useState(false)
  const detailsRequestRef = useRef(0)

  const query = inputValue.trim()
  const canSearch =
    isLoaded && hasApiKey && !disabled && query.length >= MIN_QUERY_LENGTH
  const visiblePredictions = canSearch ? predictions : []
  const showLoading = canSearch && loading

  useEffect(() => {
    if (!canSearch) {
      return
    }

    let active = true

    const timer = window.setTimeout(() => {
      setLoading(true)

      autocompleteRef.current?.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: countryCode },
          types: ["address"],
        },
        (results) => {
          if (!active) {
            return
          }

          setLoading(false)
          setPredictions(
            (results ?? []).map((result) => ({
              placeId: result.place_id,
              label: result.description,
            }))
          )
        }
      )
    }, DEBOUNCE_MS)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [canSearch, countryCode, query])

  const handleInputChange = (nextValue: string) => {
    setDraft(nextValue)
    setSelected(null)
  }

  const handleSelect = (option: GooglePlaceOption | null) => {
    if (!option) {
      return
    }

    setSelected(option)

    const requestId = ++detailsRequestRef.current

    placesRef.current?.getDetails(
      { placeId: option.placeId, fields: ["formatted_address"] },
      (place) => {
        if (requestId !== detailsRequestRef.current) {
          return
        }

        const address = place?.formatted_address ?? option.label
        setDraft(null)
        onChange(address)
      }
    )
  }

  const handleBlur = () => {
    if (draft !== null) {
      onChange(draft.trim())
      setDraft(null)
    }

    onBlur?.()
  }

  if (!hasApiKey) {
    return (
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        aria-invalid={ariaInvalid}
      />
    )
  }

  return (
    <Combobox
      items={visiblePredictions}
      value={selected}
      onValueChange={handleSelect}
      inputValue={inputValue}
      onInputValueChange={handleInputChange}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.placeId}
      isItemEqualToValue={(a, b) => a.placeId === b.placeId}
      disabled={disabled}
      filter={() => true}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        className={className}
        showTrigger={false}
        showClear={false}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        onBlur={handleBlur}
      />
      {(canSearch || showLoading) && (
        <ComboboxContent>
          {showLoading ? (
            <ComboboxEmpty>Searching...</ComboboxEmpty>
          ) : (
            <ComboboxEmpty>No addresses found.</ComboboxEmpty>
          )}
          <ComboboxList>
            <ComboboxCollection>
              {(option: GooglePlaceOption) => (
                <ComboboxItem key={option.placeId} value={option}>
                  {option.label}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  )
}
