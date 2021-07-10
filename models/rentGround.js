const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentGroundSchema = new Schema({
	title:String,
	price:Number,
	description:String,
	location:String,
	image: String

});


module.exports = 
	mongoose.model('Ground', rentGroundSchema);
