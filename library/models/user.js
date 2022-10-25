const {Schema, model} = require('mongoose')

const user = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	// email: {
	// 	type: String,
	// 	unique: true,
	// 	required: true
	// }
})

module.exports = model('User', user)
