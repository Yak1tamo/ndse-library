import { Schema, model } from 'mongoose'

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

export const User = model('User', user)
