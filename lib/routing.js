// module.exports = function(app, connection, models) {
//   var users_routes = require('../routes/users')(connection, models);
//   app.use('/users', users_routes);

//   var app_routes = require('../routes/index')(connection, models);
//   app.use('/', app_routes);
// }

module.exports = function(app) {
  var users_routes = require('../routes/users');
  app.use('/users', users_routes);

  var app_routes = require('../routes/index');
  app.use('/', app_routes);
}
