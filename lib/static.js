// var favicon = require('serve-favicon');
var _static = require('express').static;

module.exports = function(app) {
  // uncomment after placing your favicon in /public
  // app.use(favicon('./public/favicon.ico'));
  app.use(_static('./public'));
}
