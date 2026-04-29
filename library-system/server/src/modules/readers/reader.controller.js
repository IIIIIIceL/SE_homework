import {
  cancelReader,
  createReader,
  getReaderLoans,
  queryReaders,
  updateReader
} from "./reader.service.js"

function handleError(res, error) {
  if (error === "NOT_FOUND") {
    res.status(404).json({ message: "读者不存在" })
    return
  }
  if (error === "MISSING_FIELDS") {
    res.status(400).json({ message: "请完整填写姓名、性别、证件号、联系方式和办证日期" })
    return
  }
  if (error === "DUPLICATE_ID_NUMBER") {
    res.status(409).json({ message: "证件号已存在，不能重复登记" })
    return
  }
  if (error === "HAS_UNRETURNED_BOOKS") {
    res.status(400).json({ message: "该读者存在未归还图书，无法注销" })
    return
  }
  res.status(500).json({ message: "服务异常" })
}

export function listReaders(req, res) {
  const readers = queryReaders(req.query)
  res.json({ data: readers })
}

export function addReader(req, res) {
  const result = createReader(req.body)
  if (result.error) {
    handleError(res, result.error)
    return
  }
  res.status(201).json({ data: result.data })
}

export function editReader(req, res) {
  const result = updateReader(req.params.cardNo, req.body)
  if (result.error) {
    handleError(res, result.error)
    return
  }
  res.json({ data: result.data })
}

export function removeReader(req, res) {
  const result = cancelReader(req.params.cardNo)
  if (result.error) {
    handleError(res, result.error)
    return
  }
  res.json({ data: result.data })
}

export function listReaderLoans(req, res) {
  const result = getReaderLoans(req.params.cardNo)
  if (result.error) {
    handleError(res, result.error)
    return
  }
  res.json({ data: result.data })
}
