const statisticsRepository = require('./statistics.repository');
const {
  normalizeBorrowRecordQuery,
  normalizeBorrowTrendQuery,
  normalizePopularBooksQuery,
  normalizeInventoryQuery
} = require('./dto/statistics.dto');
const {
  toBorrowRecordListVO,
  toPopularBookListVO,
  toInventoryListVO
} = require('./vo/statistics.vo');

function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

async function queryBorrowRecords(query) {
  const params = normalizeBorrowRecordQuery(query);

  if (params.startDate && params.endDate && params.startDate > params.endDate) {
    throw createError('INVALID_DATE_RANGE', '开始日期不能晚于结束日期');
  }

  const { items, total } = await statisticsRepository.getBorrowRecords(params);

  return {
    data: toBorrowRecordListVO(items),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize)
    }
  };
}

async function getBorrowTrend(query) {
  const params = normalizeBorrowTrendQuery(query);

  if (params.startDate && params.endDate && params.startDate > params.endDate) {
    throw createError('INVALID_DATE_RANGE', '开始日期不能晚于结束日期');
  }

  let trend;
  if (params.granularity === 'MONTH') {
    trend = await statisticsRepository.getMonthlyBorrowTrend(params.startDate, params.endDate);
  } else {
    trend = await statisticsRepository.getDailyBorrowTrend(params.days, params.startDate, params.endDate);
  }

  return {
    granularity: params.granularity,
    trend
  };
}

async function getPopularBooks(query) {
  const params = normalizePopularBooksQuery(query);

  if (params.startDate && params.endDate && params.startDate > params.endDate) {
    throw createError('INVALID_DATE_RANGE', '开始日期不能晚于结束日期');
  }

  const items = await statisticsRepository.getPopularBooks(params);

  return {
    data: toPopularBookListVO(items),
    period: params.startDate ? params.startDate.toISOString() : `最近 ${params.days} 天`
  };
}

async function getInventory(query) {
  const params = normalizeInventoryQuery(query);
  const { items, total } = await statisticsRepository.getInventory(params);

  const summary = await statisticsRepository.getInventorySummary();

  return {
    data: toInventoryListVO(items),
    summary,
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize)
    }
  };
}

module.exports = {
  queryBorrowRecords,
  getBorrowTrend,
  getPopularBooks,
  getInventory
};
