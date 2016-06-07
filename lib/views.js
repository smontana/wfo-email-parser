var path = require('path');

module.exports = function(app) {
  app.set('views', './views');
  app.set('view engine', 'jade');
}
