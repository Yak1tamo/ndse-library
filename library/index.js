const express = require('express')
const books = require('./routes/site')
const api = require('./routes/api/book')
const index = require('./routes/index')
const login = require('./routes/login')
const error404 = require('./middleware/err-404')
const mongoose = require('mongoose')

const app = express()

app.use('/public', express.static(__dirname+'/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.use('/', index)
app.use('/api/user/login', login)
app.use('/api/books', api)
app.use('/books', books)
app.use(error404)

async function start(PORT, DB_HOST) {
	try {
		await mongoose.connect(DB_HOST || 'mongodb://mongo:27017/', {
			user: process.env.DBUSERNAME || 'root',
			pass: process.env.DB_PASSWORD || 'example',
			dbName: process.env.DB_NAME || 'books_database',
			// useUnifiedTopology: true,
			// useNewUrlParser: true,
			// useCreateIndex: true
		})
		app.listen(PORT, () => {
			console.log(`PORT = ${PORT}, DB_HOST = ${DB_HOST}`)
		})
	} catch(e) {
		console.log(e);
	}
}

const PORT = process.env.PORT || 3000
const DB_HOST = process.env.DB_HOST
start(PORT, DB_HOST)
