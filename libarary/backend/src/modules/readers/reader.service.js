const readerRepository = require('../../repositories/readerRepository');
const borrowRepository = require('../../repositories/borrowRepository');

const ALLOWED_UPDATE_FIELDS = [
  'name',
  'gender',
  'phone',
  'email',
  'department',
  'className',
  'maxBorrowCount',
  'status',
  'remark'
];

function buildReaderNo() {
  return `R${Date.now()}`;
}

function normalizePage(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function validateReaderPayload(data, mode = 'create') {
  const payload = { ...data };

  if (mode === 'create' && !String(payload.name || '').trim()) {
    throw new Error('Reader name is required.');
  }

  if (payload.phone && !/^1\d{10}$/.test(String(payload.phone).trim())) {
    throw new Error('Phone number must be 11 digits.');
  }

  if (payload.email && !/^\S+@\S+\.\S+$/.test(String(payload.email).trim())) {
    throw new Error('Email format is invalid.');
  }

  if (payload.maxBorrowCount !== undefined) {
    const maxBorrowCount = Number(payload.maxBorrowCount);
    if (!Number.isInteger(maxBorrowCount) || maxBorrowCount < 1) {
      throw new Error('maxBorrowCount must be an integer greater than 0.');
    }
    payload.maxBorrowCount = maxBorrowCount;
  }

  return payload;
}

class ReaderService {
  async createReader(readerData) {
    const payload = validateReaderPayload(readerData, 'create');
    const readerNo = String(payload.readerNo || '').trim() || buildReaderNo();

    const existing = await readerRepository.findByReaderNo(readerNo);
    if (existing) {
      throw new Error('Reader number already exists.');
    }

    return readerRepository.create({
      readerNo,
      name: String(payload.name).trim(),
      gender: payload.gender || 'UNKNOWN',
      phone: payload.phone ? String(payload.phone).trim() : null,
      email: payload.email ? String(payload.email).trim() : null,
      department: payload.department ? String(payload.department).trim() : null,
      className: payload.className ? String(payload.className).trim() : null,
      maxBorrowCount: payload.maxBorrowCount || 5,
      status: payload.status || 'ACTIVE',
      remark: payload.remark ? String(payload.remark).trim() : null
    });
  }

  getReaderById(id) {
    return readerRepository.findById(Number(id));
  }

  async getAllReaders(query = {}) {
    const page = normalizePage(query.page, 1);
    const pageSize = normalizePage(query.pageSize, 10);
    const keyword = query.keyword ? String(query.keyword).trim() : '';
    const status = query.status ? String(query.status).trim() : undefined;

    const result = await readerRepository.list({ page, pageSize, keyword, status });
    const totalPages = Math.max(1, Math.ceil(result.total / pageSize));

    return {
      data: result.rows,
      pagination: {
        page,
        pageSize,
        total: result.total,
        totalPages
      }
    };
  }

  async updateReader(id, updateData) {
    const readerId = Number(id);
    const existing = await readerRepository.findById(readerId);
    if (!existing) return null;

    const payload = validateReaderPayload(updateData, 'update');
    const filteredData = {};

    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (payload[field] !== undefined) {
        filteredData[field] = payload[field];
      }
    }

    return readerRepository.update(readerId, filteredData);
  }

  async deleteReader(id) {
    const readerId = Number(id);
    const reader = await readerRepository.findById(readerId);
    if (!reader) return false;

    const records = await borrowRepository.findBorrowRecords({
      readerId,
      status: 'BORROWED',
      page: 1,
      pageSize: 1
    });

    if (records?.total > 0) {
      throw new Error('Reader still has active borrow records and cannot be deleted.');
    }

    await readerRepository.delete(readerId);
    return true;
  }

  async getBorrowingHistory(readerId) {
    const result = await borrowRepository.findBorrowRecords({
      readerId: Number(readerId),
      page: 1,
      pageSize: 100
    });

    return result.data || [];
  }
}

module.exports = new ReaderService();
