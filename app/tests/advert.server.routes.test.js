'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Advert = mongoose.model('Advert'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, advert;

/**
 * Advert routes tests
 */
describe('Advert CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Advert
		user.save(function() {
			advert = {
				name: 'Advert Name'
			};

			done();
		});
	});

	it('should be able to save Advert instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Advert
				agent.post('/adverts')
					.send(advert)
					.expect(200)
					.end(function(advertSaveErr, advertSaveRes) {
						// Handle Advert save error
						if (advertSaveErr) done(advertSaveErr);

						// Get a list of Adverts
						agent.get('/adverts')
							.end(function(advertsGetErr, advertsGetRes) {
								// Handle Advert save error
								if (advertsGetErr) done(advertsGetErr);

								// Get Adverts list
								var adverts = advertsGetRes.body;

								// Set assertions
								(adverts[0].user._id).should.equal(userId);
								(adverts[0].name).should.match('Advert Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Advert instance if not logged in', function(done) {
		agent.post('/adverts')
			.send(advert)
			.expect(401)
			.end(function(advertSaveErr, advertSaveRes) {
				// Call the assertion callback
				done(advertSaveErr);
			});
	});

	it('should not be able to save Advert instance if no name is provided', function(done) {
		// Invalidate name field
		advert.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Advert
				agent.post('/adverts')
					.send(advert)
					.expect(400)
					.end(function(advertSaveErr, advertSaveRes) {
						// Set message assertion
						(advertSaveRes.body.message).should.match('Please fill Advert name');
						
						// Handle Advert save error
						done(advertSaveErr);
					});
			});
	});

	it('should be able to update Advert instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Advert
				agent.post('/adverts')
					.send(advert)
					.expect(200)
					.end(function(advertSaveErr, advertSaveRes) {
						// Handle Advert save error
						if (advertSaveErr) done(advertSaveErr);

						// Update Advert name
						advert.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Advert
						agent.put('/adverts/' + advertSaveRes.body._id)
							.send(advert)
							.expect(200)
							.end(function(advertUpdateErr, advertUpdateRes) {
								// Handle Advert update error
								if (advertUpdateErr) done(advertUpdateErr);

								// Set assertions
								(advertUpdateRes.body._id).should.equal(advertSaveRes.body._id);
								(advertUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Adverts if not signed in', function(done) {
		// Create new Advert model instance
		var advertObj = new Advert(advert);

		// Save the Advert
		advertObj.save(function() {
			// Request Adverts
			request(app).get('/adverts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Advert if not signed in', function(done) {
		// Create new Advert model instance
		var advertObj = new Advert(advert);

		// Save the Advert
		advertObj.save(function() {
			request(app).get('/adverts/' + advertObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', advert.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Advert instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Advert
				agent.post('/adverts')
					.send(advert)
					.expect(200)
					.end(function(advertSaveErr, advertSaveRes) {
						// Handle Advert save error
						if (advertSaveErr) done(advertSaveErr);

						// Delete existing Advert
						agent.delete('/adverts/' + advertSaveRes.body._id)
							.send(advert)
							.expect(200)
							.end(function(advertDeleteErr, advertDeleteRes) {
								// Handle Advert error error
								if (advertDeleteErr) done(advertDeleteErr);

								// Set assertions
								(advertDeleteRes.body._id).should.equal(advertSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Advert instance if not signed in', function(done) {
		// Set Advert user 
		advert.user = user;

		// Create new Advert model instance
		var advertObj = new Advert(advert);

		// Save the Advert
		advertObj.save(function() {
			// Try deleting Advert
			request(app).delete('/adverts/' + advertObj._id)
			.expect(401)
			.end(function(advertDeleteErr, advertDeleteRes) {
				// Set message assertion
				(advertDeleteRes.body.message).should.match('User is not logged in');

				// Handle Advert error error
				done(advertDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Advert.remove().exec();
		done();
	});
});