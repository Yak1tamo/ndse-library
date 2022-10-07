const express = require('express')
const login = require('./routes/login')
const books = require('./routes/books')
const error404 = require('./middleware/err-404')

const app = express()
app.use(express.json())

app.use('/public', express.static(__dirname+'/public'))
app.use('/api/user/login', login)
app.use('/api/books', books)
app.use(error404)

const PORT = process.env.PORT || 3000
app.listen(PORT)
