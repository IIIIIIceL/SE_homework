const {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
  updateBookStatus
} = require('./book.service');

function handleError(res, error) {
  const message = error && error.message ? error.message : '服务异常';

  switch (error && error.code) {
    case 'INVALID_ID':
      return res.status(400).json({ message });
    case 'MISSING_FIELDS':
    case 'INVALID_STATUS':
    case 'INVALID_COPIES':
    case 'CATEGORY_NOT_FOUND':
    case 'PUBLISHER_NOT_FOUND':
      return res.status(400).json({ message });
    case 'DUPLICATE_ISBN':
      return res.status(409).json({ message });
    case 'NOT_FOUND':
      return res.status(404).json({ message });
    default:
      return res.status(500).json({ message: '服务异常' });
  }
}

async function getBooks(req, res) {
  try {
    const result = await listBooks(req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function getBookById(req, res) {
  try {
    const result = await getBook(req.params.bookId);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function postBook(req, res) {
  try {
    const result = await createBook(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function putBook(req, res) {
  try {
    const result = await updateBook(req.params.bookId, req.body);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function deleteBookById(req, res) {
  try {
    const result = await deleteBook(req.params.bookId);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

async function patchBookStatus(req, res) {
  try {
    const result = await updateBookStatus(req.params.bookId, req.body.status);
    res.json({ data: result });
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  getBooks,
  getBookById,
  postBook,
  putBook,
  deleteBookById,
  patchBookStatus
};