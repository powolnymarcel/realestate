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
	region : { type: String,default:'', required:'Please fill talk region' },
	codepostale:{ type: Number, default:'', required:'Please fill talk codepostale'},

	nom: { type: String,default:'', required:'Please fill talk first name'},
	prenom: { type: String ,default:'', required:'Please fill talk last name'},
	email: { type: String,default:'', required:'Please fill talk email' },
	tel: { type: Number ,default:''},


	titre: { type: String,default:'Location' },
	description: { type: String ,default:'Real Estate'},
	surface:{ type: Number ,default:10},
	prix: { type: Number ,default:800},
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