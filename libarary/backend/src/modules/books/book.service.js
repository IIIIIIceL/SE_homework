const { prisma } = require('../../config/database');
const bookRepository = require('../../repositories/bookRepository');
const { normalizeBookInput, normalizeBookQuery } = require('../../DTO/book.dto');
const { toBookListVO, toBookVO } = require('../../VO/book.vo');

const BOOK_STATUSES = new Set(['AVAILABLE', 'OFF_SHELF']);

function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

async function ensureCategoryExists(categoryId) {
  if (categoryId === null) return;
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw createError('CATEGORY_NOT_FOUND', '图书分类不存在');
  }
}

async function ensurePublisherExists(publisherId) {
  if (publisherId === null) return;
  const publisher = await prisma.publisher.findUnique({ where: { id: publisherId } });
  if (!publisher) {
    throw createError('PUBLISHER_NOT_FOUND', '出版社不存在');
  }
}

function validateBookPayload(data) {
  if (!data.isbn || !data.title || !data.author) {
    throw createError('MISSING_FIELDS', '图书关键字段缺失');
  }

  if (!BOOK_STATUSES.has(data.status)) {
    throw createError('INVALID_STATUS', '图书状态不合法');
  }

  if (data.totalCopies < 0 || (data.availableCopies !== null && data.availableCopies < 0)) {
    throw createError('INVALID_COPIES', '册数不能为负数');
  }
}

function resolveAvailableCopies(data) {
  if (data.availableCopies !== null) {
    return data.availableCopies;
  }
  return data.totalCopies;
}

async function listBooks(query) {
  const params = normalizeBookQuery(query);
  const [items, total] = await Promise.all([
    bookRepository.list(params),
    bookRepository.count(params)
  ]);

  return {
    data: toBookListVO(items),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize)
    }
  };
}

async function getBook(bookId) {
  const id = Number(bookId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '图书编号不合法');
  }

  const book = await bookRepository.findById(id);
  if (!book) {
    throw createError('NOT_FOUND', '图书不存在');
  }

  return toBookVO(book);
}

async function createBook(payload) {
  const data = normalizeBookInput(payload);
  validateBookPayload(data);

  const existedBook = await bookRepository.findByIsbn(data.isbn);
  if (existedBook) {
    throw createError('DUPLICATE_ISBN', 'ISBN 已存在');
  }

  await ensureCategoryExists(data.categoryId);
  await ensurePublisherExists(data.publisherId);

  const book = await bookRepository.create({
    ...data,
    availableCopies: resolveAvailableCopies(data)
  });

  return toBookVO(book);
}

async function updateBook(bookId, payload) {
  const id = Number(bookId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '图书编号不合法');
  }

  const currentBook = await bookRepository.findById(id);
  if (!currentBook) {
    throw createError('NOT_FOUND', '图书不存在');
  }

  const data = normalizeBookInput(payload);
  validateBookPayload(data);

  const existedBook = await bookRepository.findByIsbn(data.isbn);
  if (existedBook && existedBook.id !== id) {
    throw createError('DUPLICATE_ISBN', 'ISBN 已存在');
  }

  await ensureCategoryExists(data.categoryId);
  await ensurePublisherExists(data.publisherId);

  const updatedBook = await bookRepository.update(id, {
    ...data,
    availableCopies: resolveAvailableCopies(data)
  });

  return toBookVO(updatedBook);
}

async function deleteBook(bookId) {
  const id = Number(bookId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '图书编号不合法');
  }

  const book = await bookRepository.findById(id);
  if (!book) {
    throw createError('NOT_FOUND', '图书不存在');
  }

  return toBookVO(await bookRepository.remove(id));
}

async function updateBookStatus(bookId, status) {
  const id = Number(bookId);
  if (Number.isNaN(id)) {
    throw createError('INVALID_ID', '图书编号不合法');
  }

  const normalizedStatus = String(status || '').trim().toUpperCase();
  if (!BOOK_STATUSES.has(normalizedStatus)) {
    throw createError('INVALID_STATUS', '图书状态不合法');
  }

  const book = await bookRepository.findById(id);
  if (!book) {
    throw createError('NOT_FOUND', '图书不存在');
  }

  return toBookVO(await bookRepository.setStatus(id, normalizedStatus));
}

module.exports = {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  updateBookStatus
};