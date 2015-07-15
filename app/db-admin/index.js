var syncAdminUsers = require('./syncAdminUsers');
var formage = require('formage');
// var admin = Common.module.admin;
var models = require('./models');
var conf = require('../conf');
var mid = require('../express-middleware');


exports = module.exports = function (app) {


// app.use('/panel', mid.restrictTo('dashboard-administrators'));

var registry = formage.init(app, models, {
  title: 'OpenMRS ID Management',
  root: '/panel',
  default_section: 'OpenMRS ID',
  // username: conf.mongo.username,
  // password: conf.mongo.password,
  // admin_users_gui: false,
  // no_users: false
});

// syncAdminUsers(registry.models.formage_users_.model, models.user);


};



// admin.addModulePage('Data Management (Formage)', '/panel');

