function toBookVO(book) {
  if (!book) return null;

  return {
    id: book.id,
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    translator: book.translator,
    categoryId: book.categoryId,
    categoryName: book.category ? book.category.name : null,
    publisherId: book.publisherId,
    publisherName: book.publisher ? book.publisher.name : null,
    publishDate: book.publishDate,
    price: book.price,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
    location: book.location,
    keywords: book.keywords,
    summary: book.summary,
    status: book.status,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt
  };
}

function toBookListVO(books) {
  return books.map(toBookVO);
}

module.exports = {
  toBookVO,
  toBookListVO
};