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

  async updateReader(id, updateData) {
    const reader = await Reader.findByPk(id);
    if (!reader) return null;

    // 只允许更新联系方式字段
    const allowedFields = ['phone', 'email', 'address'];
    const filteredData = {};

    // 验证手机号格式
    if (updateData.phone && !/^[0-9]{11}$/.test(updateData.phone)) {
      throw new Error('手机号码格式不正确');
    }

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    return reader.update(filteredData);
  }

  async deleteReader(id) {
    const reader = await Reader.findByPk(id);
    if (!reader) return false;

    // 先清除借阅记录（调用circulation模块）
    try {
      const circulationService = require('../circulation/circulation.service');
      await circulationService.deleteBorrowingHistoryByReaderId(id);
    } catch (error) {
      // TODO: circulation模块实现后应严格处理错误
      console.error('无法清除借阅记录:', error.message);
    }

    await reader.destroy();
    return true;
  }

  // 预留接口 - 后续与借阅模块集成
  async getBorrowingHistory(readerId) {
    try {
      const circulationService = require('../circulation/circulation.service');
      return circulationService.getBorrowingHistoryByReaderId(readerId);
    } catch (error) {
      // TODO: circulation模块实现后移除容错
      return [];
    }
  }
}

module.exports = new ReaderService();