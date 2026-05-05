const readerService = require('./reader.service');

class ReaderController {
  async createReader(req, res) {
    try {
      const reader = await readerService.createReader(req.body);
      res.status(201).json(reader);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getReader(req, res) {
    try {
      const reader = await readerService.getReaderById(req.params.id);
      if (!reader) {
        return res.status(404).json({ error: '读者不存在' });
      }
      res.json(reader);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllReaders(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const result = await readerService.getAllReaders(parseInt(page), parseInt(pageSize));
      res.json({
        data: result.rows,
        total: result.count,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateReader(req, res) {
    try {
      const reader = await readerService.updateReader(req.params.id, req.body);
      if (!reader) {
        return res.status(404).json({ error: '读者不存在' });
      }
      res.json(reader);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteReader(req, res) {
    try {
      const success = await readerService.deleteReader(req.params.id);
      if (!success) {
        return res.status(404).json({ error: '读者不存在' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReaderController();