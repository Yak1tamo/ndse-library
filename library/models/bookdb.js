const {Schema,model} = require('mongoose')

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
	}
})

module.exports = model('Books', books)
