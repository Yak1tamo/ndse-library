import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local'
import { Server, Socket } from 'socket.io'
import { createServer } from 'http'

import { fileURLToPath } from 'url'
import path from 'path'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { IUser } from './interfaces/IUser.js'
import { User } from './models/user.js'
import { BookDb } from './models/bookdb.js'
import { error404 } from './middleware/err-404.js'
import { index } from './routes/index.js'
import { books } from './routes/site.js'
import { userApi } from './routes/api/user.js'
import { bookApi } from './routes/api/book.js'

const PORT = process.env.PORT || 3000
const DB_HOST = process.env.DB_HOST || 'mongodb://mongo:27017/'

const app = express()
const server = createServer(app)
const io = new Server(server)

const verify: VerifyFunction = (username, password, done) => {
	User.findOne({username: username}, (err: Error, user: IUser) => {
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
passport.serializeUser((user: any, cb) => {
	cb(null, user.id)
})
passport.deserializeUser( (id, cb) => {
	User.findById(id, (err: Error, user: IUser) => {
		if (err) { return cb(err) }
		cb(null, user)
	})
})

app.use(express.static(path.join(__dirname + '../public')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.set('views', 'views')

app.use(session({ secret: 'SECRET'}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', index)
app.use('/api/user', userApi)
app.use('/api/books', bookApi)
app.use('/books', books)
app.use(error404)

io.on('connection', (socket: Socket) => {
	const {id} = socket
	console.log(`Connection ${id}`)

	let { roomName } = socket.handshake.query
	roomName = roomName ?? ''
	console.log(`Room: ${roomName}`)
	socket.join(roomName)
	socket.on('message-to-room', async (msg) => {
	try {
		await BookDb.findByIdAndUpdate(roomName, { $push: { comments: {username: msg.username, body: msg.body} } })
	} catch (e) {
		console.log(e)
	}
		msg.type = `room: ${roomName}`
		msg.date = new Intl.DateTimeFormat().format(new Date)
		socket.to(roomName!).emit('message-to-room', msg)
		socket.emit('message-to-room', msg)
	})

	socket.on('disconnect', () => {
		console.log(`Disconnect: ${id}`)
	})
})

async function start(PORT: any, DB_HOST: string) {
	try {
		await mongoose.connect(DB_HOST, {
			user: process.env.DB_USERNAME || 'root',
			pass: process.env.DB_PASSWORD || 'example',
			dbName: process.env.DB_NAME || 'books_database'
		})
		server.listen(PORT, () => {
			console.log(`PORT = ${PORT}, DB_HOST = ${DB_HOST}`)
		})
	} catch(e) {
		console.log(e);
	}
}

start(PORT, DB_HOST)
