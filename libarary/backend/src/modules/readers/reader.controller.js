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
        return res.status(404).json({ error: 'Reader not found.' });
      }

      res.json(reader);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMe(req, res) {
    try {
      const reader = await readerService.getReaderByAccount(req.user);
      if (!reader) {
        return res.status(404).json({ error: '当前账号未关联读者档案。' });
      }

      res.json(reader);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateMyContact(req, res) {
    try {
      const reader = await readerService.updateOwnContact(req.user, req.body);
      if (!reader) {
        return res.status(404).json({ error: '当前账号未关联读者档案。' });
      }

      res.json(reader);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllReaders(req, res) {
    try {
      const result = await readerService.getAllReaders(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBorrowingHistory(req, res) {
    try {
      const history = await readerService.getBorrowingHistory(req.params.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMyBorrowingHistory(req, res) {
    try {
      const reader = await readerService.getReaderByAccount(req.user);
      if (!reader) {
        return res.status(404).json({ error: '当前账号未关联读者档案。' });
      }

      const history = await readerService.getBorrowingHistory(reader.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateReader(req, res) {
    try {
      const reader = await readerService.updateReader(req.params.id, req.body);
      if (!reader) {
        return res.status(404).json({ error: 'Reader not found.' });
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
        return res.status(404).json({ error: 'Reader not found.' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ReaderController();
