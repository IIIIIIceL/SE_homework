const { Reader } = require('../../models');

class ReaderService {
  async createReader(readerData) {
    // 校验证件号唯一性
    const existing = await Reader.findOne({ where: { idNumber: readerData.idNumber } });
    if (existing) {
      throw new Error('证件号已存在');
    }

    // 生成借阅证号
    readerData.borrowCardNumber = this.generateBorrowCardNumber();

    return Reader.create(readerData);
  }

  generateBorrowCardNumber() {
    // 生成借阅证号：B + 时间戳
    return `B${Date.now()}`;
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