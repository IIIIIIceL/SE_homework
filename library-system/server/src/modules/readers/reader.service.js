import db from "../shared/store.js"

const CARD_PREFIX = "LIB"

function nextCardNo() {
  const max = db.readers.reduce((acc, reader) => {
    const parsed = Number(reader.cardNo.replace(CARD_PREFIX, ""))
    return Number.isNaN(parsed) ? acc : Math.max(acc, parsed)
  }, 0)
  return `${CARD_PREFIX}${String(max + 1).padStart(6, "0")}`
}

function normalizePayload(payload) {
  return {
    name: (payload.name || "").trim(),
    gender: (payload.gender || "").trim(),
    idNumber: (payload.idNumber || "").trim(),
    contact: (payload.contact || "").trim(),
    issueDate: (payload.issueDate || "").trim()
  }
}

function validateRequiredFields(payload) {
  return Boolean(
    payload.name &&
      payload.gender &&
      payload.idNumber &&
      payload.contact &&
      payload.issueDate
  )
}

function hasDuplicateIdNumber(idNumber, cardNoToExclude = null) {
  return db.readers.some(
    (reader) => reader.idNumber === idNumber && reader.cardNo !== cardNoToExclude
  )
}

export function queryReaders({ keyword = "", status = "all" }) {
  const normalizedKeyword = keyword.trim().toLowerCase()
  return db.readers.filter((reader) => {
    const keywordMatched =
      !normalizedKeyword ||
      reader.name.toLowerCase().includes(normalizedKeyword) ||
      reader.idNumber.toLowerCase().includes(normalizedKeyword) ||
      reader.cardNo.toLowerCase().includes(normalizedKeyword) ||
      reader.contact.toLowerCase().includes(normalizedKeyword)
    const statusMatched =
      status === "all" ||
      (status === "active" && reader.status === "active") ||
      (status === "cancelled" && reader.status === "cancelled")
    return keywordMatched && statusMatched
  })
}

export function createReader(payload) {
  const normalized = normalizePayload(payload)

  if (!validateRequiredFields(normalized)) {
    return { error: "MISSING_FIELDS" }
  }
  if (hasDuplicateIdNumber(normalized.idNumber)) {
    return { error: "DUPLICATE_ID_NUMBER" }
  }

  const reader = {
    cardNo: nextCardNo(),
    ...normalized,
    status: "active"
  }
  db.readers.push(reader)
  return { data: reader }
}

export function updateReader(cardNo, payload) {
  const index = db.readers.findIndex((reader) => reader.cardNo === cardNo)
  if (index < 0) {
    return { error: "NOT_FOUND" }
  }

  const normalized = normalizePayload(payload)
  if (!validateRequiredFields(normalized)) {
    return { error: "MISSING_FIELDS" }
  }
  if (hasDuplicateIdNumber(normalized.idNumber, cardNo)) {
    return { error: "DUPLICATE_ID_NUMBER" }
  }

  db.readers[index] = { ...db.readers[index], ...normalized }
  return { data: db.readers[index] }
}

export function cancelReader(cardNo) {
  const reader = db.readers.find((item) => item.cardNo === cardNo)
  if (!reader) {
    return { error: "NOT_FOUND" }
  }

  const hasUnreturnedBooks = db.loans.some(
    (loan) => loan.cardNo === cardNo && !loan.returnDate
  )
  if (hasUnreturnedBooks) {
    return { error: "HAS_UNRETURNED_BOOKS" }
  }

  reader.status = "cancelled"
  return { data: reader }
}

export function getReaderLoans(cardNo) {
  const reader = db.readers.find((item) => item.cardNo === cardNo)
  if (!reader) {
    return { error: "NOT_FOUND" }
  }
  return { data: db.loans.filter((loan) => loan.cardNo === cardNo) }
}
