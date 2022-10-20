const express = require('express')
const books = require('./routes/site')
const api = require('./routes/api/book')
const index = require('./routes/index')
const login = require('./routes/login')
const error404 = require('./middleware/err-404')

const app = express()

app.use('/public', express.static(__dirname+'/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use('/', index)
app.use('/api/user/login', login)
app.use('/api/books', api)
app.use('/books', books)
app.use(error404)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`PORT = ${PORT}`)
})
