const {
  queryBorrowRecords,
  getBorrowTrend,
  getPopularBooks,
  getInventory
} = require('./statistics.service');

function handleError(res, error) {
  const message = error && error.message ? error.message : '服务异常';

  switch (error && error.code) {
    case 'INVALID_DATE_RANGE':
    case 'INVALID_ID':
      return res.status(400).json({ message });
    default:
      return res.status(500).json({ message: '服务异常' });
  }
}

async function handleBorrowRecords(req, res) {
  try {
    const result = await queryBorrowRecords(req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function handleBorrowTrend(req, res) {
  try {
    const result = await getBorrowTrend(req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function handlePopularBooks(req, res) {
  try {
    const result = await getPopularBooks(req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function handleInventory(req, res) {
  try {
    const result = await getInventory(req.query);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  handleBorrowRecords,
  handleBorrowTrend,
  handlePopularBooks,
  handleInventory
};
