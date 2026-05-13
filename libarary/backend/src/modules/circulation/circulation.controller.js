const circulationService = require('./circulation.service');

/**
 * 获取借阅记录列表
 * GET /api/circulation/borrow-records?startDate=&endDate=&readerId=&bookId=&status=&page=&pageSize=
 */
async function getBorrowRecords(req, res) {
  try {
    const result = await circulationService.getBorrowRecords(req.query);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * 获取借阅记录详情
 * GET /api/circulation/borrow-records/:id
 */
async function getBorrowRecordById(req, res) {
  try {
    const result = await circulationService.getBorrowRecordById(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === '借阅记录不存在' || error.message === '无效的记录 ID') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = {
  getBorrowRecords,
  getBorrowRecordById
};
