import { Schema, model } from 'mongoose'

const books = new Schema({
	title: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
	authors: {
		type: String,
		required: true
	},
	favorite: {
		type: String,
		required: true
	},
	fileCover: {
		type: String,
		required: true
	},
	fileName: {
		type: String,
		required: true
	},
	fileBook: {
		type: String,
		required: false
	},
	comments: [
		{
			username: String,
			body: String,
			date: {
				type: String,
				default: new Intl.DateTimeFormat().format(new Date)
			}
		}
	]
})

export const BookDb = model('Books', books)
