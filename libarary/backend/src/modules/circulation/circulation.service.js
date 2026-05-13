const borrowRepository = require('../../repositories/borrowRepository');

const circulationService = {
  /**
   * 查询借阅记录列表
   * @param {Object} query - 查询参数
   * @returns {Promise<Object>} 分页结果
   */
  async getBorrowRecords(query) {
    const {
      startDate,
      endDate,
      readerId,
      bookId,
      status,
      page,
      pageSize
    } = query;

    // 参数验证
    if (page && (isNaN(page) || page < 1)) {
      throw new Error('页码必须为正整数');
    }
    if (pageSize && (isNaN(pageSize) || pageSize < 1 || pageSize > 100)) {
      throw new Error('每页数量必须在 1-100 之间');
    }

    const filters = {
      startDate,
      endDate,
      readerId: readerId ? parseInt(readerId, 10) : undefined,
      bookId: bookId ? parseInt(bookId, 10) : undefined,
      status,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 10
    };

    return borrowRepository.findBorrowRecords(filters);
  },

  /**
   * 获取借阅记录详情
   * @param {number} id - 记录 ID
   * @returns {Promise<Object>} 借阅记录
   */
  async getBorrowRecordById(id) {
    if (!id || isNaN(id)) {
      throw new Error('无效的记录 ID');
    }
    const record = await borrowRepository.findBorrowRecordById(parseInt(id, 10));
    if (!record) {
      throw new Error('借阅记录不存在');
    }
    return record;
  }
};

module.exports = circulationService;
