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
	pid : { type: String},
	region : { type: String, required:'Please fill talk region' },
	postcode:{ type: Number, required:'Please fill talk codepostale'},
	lastname: { type: String, required:'Please fill talk first name'},
	firstname: { type: String, required:'Please fill talk last name'},
	email: { type: String, required:'Please fill talk email' },
	phone: { type: Number},

	title: { type: String,default:'Location' },
	description: { type: String ,default:'Real Estate'},
	area:{ type: Number ,default:10},
	price: { type: Number ,default:800},
	photo: {type :String,default:'img.jpg'},
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