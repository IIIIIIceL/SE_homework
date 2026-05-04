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

function normalizeBookInput(payload = {}) {
  return {
    isbn: String(payload.isbn || '').trim(),
    title: String(payload.title || '').trim(),
    author: String(payload.author || '').trim(),
    translator: String(payload.translator || '').trim() || null,
    categoryId: toNumber(payload.categoryId),
    publisherId: toNumber(payload.publisherId),
    publishDate: toDate(payload.publishDate),
    price: toNumber(payload.price, null),
    totalCopies: toNumber(payload.totalCopies, 0),
    availableCopies: toNumber(payload.availableCopies, null),
    location: String(payload.location || '').trim() || null,
    keywords: String(payload.keywords || '').trim() || null,
    summary: String(payload.summary || '').trim() || null,
    status: String(payload.status || 'AVAILABLE').trim() || 'AVAILABLE'
  };
}

function normalizeBookQuery(query = {}) {
  return {
    keyword: String(query.keyword || '').trim(),
    status: String(query.status || 'ALL').trim().toUpperCase(),
    page: Math.max(1, toNumber(query.page, 1)),
    pageSize: Math.max(1, Math.min(100, toNumber(query.pageSize, 10)))
  };
}

module.exports = {
  normalizeBookInput,
  normalizeBookQuery,
  toNumber,
  toDate
};