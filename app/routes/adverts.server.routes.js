'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var adverts = require('../../app/controllers/adverts.server.controller');

	// Adverts Routes
	app.route('/adverts')
		.get(adverts.list)
		.post(users.requiresLogin, adverts.create);

	app.route('/adverts/:advertId')
		.get(adverts.read)
		.put(users.requiresLogin, adverts.hasAuthorization, adverts.update)
		.delete(users.requiresLogin, adverts.hasAuthorization, adverts.delete);

	app.route('/adverts/pidroute/:advertPID')
		.get(adverts.read);

	app.route('/adverts/upload')
		.post(users.requiresLogin, adverts.fileUpload);

	// Finish by binding the Advert middleware
	app.param('advertId', adverts.advertByID);
	app.param('advertPID', adverts.advertByPID);
};
