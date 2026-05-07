/**
 * 规范化和验证借阅请求数据
 */

function normalizeBorrowInput(data = {}) {
  return {
    readerId: data.readerId ? Number(data.readerId) : null,
    bookId: data.bookId ? Number(data.bookId) : null,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    operatorBorrowId: data.operatorBorrowId ? Number(data.operatorBorrowId) : null,
    remark: data.remark || null
  };
}

function normalizeReturnInput(data = {}) {
  return {
    operatorReturnId: data.operatorReturnId ? Number(data.operatorReturnId) : null,
    fineAmount: data.fineAmount ? parseFloat(data.fineAmount) : 0,
    remark: data.remark || null
  };
}

function normalizeRenewInput(data = {}) {
  return {
    newDueDate: data.newDueDate ? new Date(data.newDueDate) : null,
    remark: data.remark || null
  };
}

function normalizeBorrowQuery(query = {}) {
  return {
    readerId: query.readerId ? Number(query.readerId) : null,
    bookId: query.bookId ? Number(query.bookId) : null,
    status: query.status || 'ALL',
    keyword: query.keyword || null,
    overdueOnly: query.overdueOnly === 'true' || query.overdueOnly === true,
    page: query.page ? Math.max(1, Number(query.page)) : 1,
    pageSize: query.pageSize ? Math.min(100, Math.max(1, Number(query.pageSize))) : 10
  };
}

module.exports = {
  normalizeBorrowInput,
  normalizeReturnInput,
  normalizeRenewInput,
  normalizeBorrowQuery
};
