const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('./models/user')
const error404 = require('./middleware/err-404')
const userApi = require('./routes/api/user')
const index = require('./routes/index')
const bookApi = require('./routes/api/book')
const books = require('./routes/site')

const verify = (username, password, done) => {
	User.findOne({username: username}, (err, user) => {
		if (err) {return done(err)}
		if (!user) { return done(null, false) }

		if( !(password === user.password) ) {
			return done(null, false)
		}

		return done(null, user)
	})
}
const options = {
	usernameField: "username",
	passwordField: "password",
}
passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
	cb(null, user.id)
})
passport.deserializeUser( (id, cb) => {
	User.findById(id, (err, user) => {
		if (err) { return cb(err) }
		cb(null, user)
	})
})

const app = express()
app.use('/public', express.static(__dirname+'/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.use(session({ secret: 'SECRET'}));
app.use(passport.initialize())
app.use(passport.session())

app.use('/', index)
app.use('/api/user', userApi)
app.use('/api/books', bookApi)
app.use('/books', books)
app.use(error404)

async function start(PORT, DB_HOST) {
	try {
		await mongoose.connect(DB_HOST, {
			user: process.env.DBUSERNAME || 'root',
			pass: process.env.DB_PASSWORD || 'example',
			dbName: process.env.DB_NAME || 'books_database'
		})
		app.listen(PORT, () => {
			console.log(`PORT = ${PORT}, DB_HOST = ${DB_HOST}`)
		})
	} catch(e) {
		console.log(e);
	}
}

const PORT = process.env.PORT || 3000
const DB_HOST = process.env.DB_HOST || 'mongodb://mongo:27017/'
start(PORT, DB_HOST)
