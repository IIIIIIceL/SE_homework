function toBorrowRecordVO(record) {
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
      availableCopies: record.book.availableCopies,
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
    remark: record.remark
  };
}

function toBorrowRecordListVO(records) {
  if (!Array.isArray(records)) return [];
  return records.map(toBorrowRecordVO);
}

function toPopularBookVO(item) {
  if (!item) return null;

  return {
    rank: item.rank,
    borrowCount: item.borrowCount,
    book: item.book ? {
      id: item.book.id,
      isbn: item.book.isbn,
      title: item.book.title,
      author: item.book.author,
      totalCopies: item.book.totalCopies,
      availableCopies: item.book.availableCopies,
      category: item.book.category ? item.book.category.name : null,
      publisher: item.book.publisher ? item.book.publisher.name : null
    } : null
  };
}

function toPopularBookListVO(items) {
  if (!Array.isArray(items)) return [];
  return items.map(toPopularBookVO);
}

function toInventoryItemVO(book) {
  if (!book) return null;

  return {
    id: book.id,
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    categoryId: book.categoryId,
    category: book.category ? book.category.name : null,
    publisher: book.publisher ? book.publisher.name : null,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
    borrowedCopies: book.totalCopies - book.availableCopies,
    location: book.location,
    status: book.status,
    price: book.price
  };
}

function toInventoryListVO(items) {
  if (!Array.isArray(items)) return [];
  return items.map(toInventoryItemVO);
}

module.exports = {
  toBorrowRecordVO,
  toBorrowRecordListVO,
  toPopularBookVO,
  toPopularBookListVO,
  toInventoryItemVO,
  toInventoryListVO
};
