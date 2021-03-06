const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentGroundSchema = new Schema({
	title:String,
	price:Number,
	description:String,
	location:String,
	image: String,
	author:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews:[
		{
			type: Schema.Types.ObjectId,
			ref: "Review"
		}

	]

});


module.exports =
	mongoose.model('Ground', rentGroundSchema);
