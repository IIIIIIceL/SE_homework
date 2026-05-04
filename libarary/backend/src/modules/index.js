const bookRoutes = require('./books/book.routes');

function registerModules(app) {
  app.use('/api/books', bookRoutes);
}

module.exports = {
  registerModules
};