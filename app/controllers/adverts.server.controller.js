'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Advert = mongoose.model('Advert'),
	_ = require('lodash'),
	fs = require('fs');

/**
 * Create a Advert
 */
exports.create = function(req, res) {
	var advert = new Advert(req.body);
	advert.user = req.user;

	advert.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(advert);
		}
	});
};

/**
 * Show the current Advert
 */
exports.read = function(req, res) {
	res.jsonp(req.advert);
};

/**
 * Update a Advert
 */
exports.update = function(req, res) {
	var advert = req.advert ;

	advert = _.extend(advert , req.body);

	advert.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(advert);
		}
	});
};

/**
 * Delete an Advert
 */
exports.delete = function(req, res) {
	var advert = req.advert ;

	advert.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(advert);
		}
	});
};

/**
 * List of Adverts
 */
exports.list = function(req, res) { 
	Advert.find().sort('-created').populate('user', 'displayName').exec(function(err, adverts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(adverts);
		}
	});
};

/**
 * Advert middleware
 */
exports.advertByID = function(req, res, next, id) { 
	Advert.findById(id).populate('user', 'displayName').exec(function(err, advert) {
		if (err) return next(err);
		if (! advert) return next(new Error('Failed to load Advert ' + id));
		req.advert = advert ;
		next();
	});
};

exports.advertByPID = function(req, res, next, id) { 
	Advert.findOne({'pid' : id}).populate('user', 'displayName').exec(function(err, advert) {
		if (err) return next(err);
		if (! advert) return next(new Error('Failed to load Realestate ' + id));
		req.advert = advert ;
		next();
	});
};
/**
 * Advert authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.advert.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

// we need the fs module for moving the uploaded files
exports.fileUpload = function(req, res) {
	console.log('I am fileUpload function and I receive well your request');
    // get the temporary location of the file
    var tmp_path = req.files.thumbnail.path;
    //set where the file should actually exists 
    //in this case it is in the "images" directory
    var target_path = '/public/modules/adverts/img/' + req.files.thumbnail.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary 
        //upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
        });
    });
};





