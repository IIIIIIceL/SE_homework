function toNumber(value, fallback = null) {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeBorrowRecordQuery(query = {}) {
  return {
    startDate: toDate(query.startDate),
    endDate: toDate(query.endDate),
    readerId: toNumber(query.readerId),
    bookId: toNumber(query.bookId),
    status: String(query.status || 'ALL').trim().toUpperCase(),
    keyword: String(query.keyword || '').trim(),
    page: Math.max(1, toNumber(query.page, 1)),
    pageSize: Math.max(1, Math.min(100, toNumber(query.pageSize, 10)))
  };
}

function normalizeBorrowTrendQuery(query = {}) {
  const granularity = String(query.granularity || 'DAY').trim().toUpperCase();
  return {
    granularity: granularity === 'MONTH' ? 'MONTH' : 'DAY',
    startDate: toDate(query.startDate),
    endDate: toDate(query.endDate),
    days: Math.max(1, Math.min(90, toNumber(query.days, 30)))
  };
}

function normalizePopularBooksQuery(query = {}) {
  return {
    startDate: toDate(query.startDate),
    endDate: toDate(query.endDate),
    days: Math.max(1, Math.min(90, toNumber(query.days, 30))),
    limit: Math.max(1, Math.min(50, toNumber(query.limit, 10)))
  };
}

function normalizeInventoryQuery(query = {}) {
  return {
    status: String(query.status || 'ALL').trim().toUpperCase(),
    keyword: String(query.keyword || '').trim(),
    categoryId: toNumber(query.categoryId),
    page: Math.max(1, toNumber(query.page, 1)),
    pageSize: Math.max(1, Math.min(100, toNumber(query.pageSize, 20)))
  };
}

module.exports = {
  normalizeBorrowRecordQuery,
  normalizeBorrowTrendQuery,
  normalizePopularBooksQuery,
  normalizeInventoryQuery
};
