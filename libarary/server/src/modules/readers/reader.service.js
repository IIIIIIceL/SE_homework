const { Reader } = require('../../models');

class ReaderService {
  async createReader(readerData) {
    return Reader.create(readerData);
  }

  async getReaderById(id) {
    return Reader.findByPk(id);
  }

  async getAllReaders(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    return Reader.findAndCountAll({
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']]
    });
  }

  async updateReader(id, readerData) {
    const reader = await Reader.findByPk(id);
    if (!reader) return null;
    return reader.update(readerData);
  }

  async deleteReader(id) {
    const reader = await Reader.findByPk(id);
    if (!reader) return false;
    await reader.destroy();
    return true;
  }

  // 预留接口 - 后续与借阅模块集成
  async getBorrowingHistory(readerId) {
    // TODO: 与circulation模块集成
    throw new Error('Not implemented yet - will integrate with circulation module');
  }
}

module.exports = new ReaderService();