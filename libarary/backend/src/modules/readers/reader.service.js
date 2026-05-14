const readerRepository = require('../../repositories/readerRepository');
const borrowRepository = require('../../repositories/borrowRepository');

class ReaderService {
  async createReader(readerData) {
    // 校验证件号唯一性（使用仓库层，统一 prisma 实现）
    const existing = await readerRepository.findByIdNumber(readerData.idNumber);
    if (existing) {
      throw new Error('证件号已存在');
    }

    // 生成借阅证号
    readerData.borrowCardNumber = this.generateBorrowCardNumber();

    return readerRepository.create(readerData);
  }

  generateBorrowCardNumber() {
    return `B${Date.now()}`;
  }

  async getReaderById(id) {
    return readerRepository.findById(Number(id));
  }

  async getAllReaders(page = 1, pageSize = 10) {
    return readerRepository.list({ page, pageSize });
  }

  async updateReader(id, updateData) {
    const reader = await readerRepository.findById(Number(id));
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

    return readerRepository.update(Number(id), filteredData);
  }

  async deleteReader(id) {
    const reader = await readerRepository.findById(Number(id));
    if (!reader) return false;

    // 不允许删除存在未归还借阅记录的读者
    const records = await borrowRepository.findBorrowRecords({ readerId: Number(id), status: 'BORROWED', page: 1, pageSize: 1 });
    if (records && records.total && records.total > 0) {
      throw new Error('读者存在未归还借阅记录，无法删除');
    }

    await readerRepository.delete(Number(id));
    return true;
  }

  async getBorrowingHistory(readerId) {
    const result = await borrowRepository.findBorrowRecords({ readerId: Number(readerId), page: 1, pageSize: 100 });
    return result.data || [];
  }
}

module.exports = new ReaderService();