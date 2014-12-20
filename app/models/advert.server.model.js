'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Advert Schema
 */
var AdvertSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Advert name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Advert', AdvertSchema);