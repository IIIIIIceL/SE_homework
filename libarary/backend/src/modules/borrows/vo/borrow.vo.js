/**
 * 借阅记录视图对象(VO)
 */

function toBorrowVO(record) {
  if (!record) return null;

  return {
    id: record.id,
    borrowNo: record.borrowNo,
    reader: record.reader ? {
      id: record.reader.id,
      readerNo: record.reader.readerNo,
      name: record.reader.name,
      status: record.reader.status
    } : null,
    book: record.book ? {
      id: record.book.id,
      isbn: record.book.isbn,
      title: record.book.title,
      author: record.book.author,
      status: record.book.status
    } : null,
    borrowDate: record.borrowDate,
    dueDate: record.dueDate,
    returnDate: record.returnDate,
    renewCount: record.renewCount,
    status: record.status,
    fineAmount: record.fineAmount,
    borrowOperator: record.borrowOperator ? {
      id: record.borrowOperator.id,
      username: record.borrowOperator.username,
      fullName: record.borrowOperator.fullName
    } : null,
    returnOperator: record.returnOperator ? {
      id: record.returnOperator.id,
      username: record.returnOperator.username,
      fullName: record.returnOperator.fullName
    } : null,
    remark: record.remark,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function toBorrowListVO(records) {
  if (!Array.isArray(records)) {
    return [];
  }
  return records.map(toBorrowVO);
}

module.exports = {
  toBorrowVO,
  toBorrowListVO
};
