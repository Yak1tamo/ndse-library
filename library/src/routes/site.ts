import http from 'http'
import { Router } from 'express'
import { BookDb } from '../models/bookdb.js'
import { fileMulter } from '../middleware/file.js'

const books = Router()

// Просмотр списка всех книг
books.get('/', async (req, res, next) => {
	const title = 'Library'
	try {
		const books = await BookDb.find()
		res.render('pages/index', {
			title: title,
			lib: books,
		})
	} catch (e) {
		console.log(e)
		next()
	}
})

// Создание книги
books.get('/create', (req, res) => {
	const title = 'Create book'
	const b = new BookDb({})
	res.render('pages/create', {
		title: title,
		book: {}
	})
})

books.post('/create', fileMulter.single('fileBook'), async (req, res) => {
	const { body } = req
	const fileBook = req.file ? req.file.path : ''
	const newBook = new BookDb({
		...body, fileBook
	})
	try {
		await newBook.save()
		res.status(201)
		res.redirect('/books')
	} catch (e) {
		console.log(e)
	}
})

// Редактирование книги
books.get('/update/:id', async (req, res, next) => {
	const title = 'Update'
	const { id } = req.params
	try {
		const book = await BookDb.findById(id)
		if(book) {
			res.render('pages/update', {
				title: title,
				book: book
			})
		} else {
			next()
		}
	} catch (e) {
		console.log(e)
		next()
	}
})

books.post('/update/:id', fileMulter.single('fileBook'), async (req, res, next) => {
	const { id } = req.params
	const { body } = req
	const fileBook = req.file ? req.file.path : ''
	try {
		await BookDb.findByIdAndUpdate(id, {...body, fileBook})
		res.redirect('/books')
	} catch (e) {
		console.log(e)
		next()
	}
})

// Удалить кнлигу по ID
books.post('/delete/:id', async (req, res, next) => {
	const { id } = req.params
	try {
		await BookDb.deleteOne({_id: id})
		res.redirect('/books')
	} catch (e) {
		console.log(e)
		next()
	}
})

// Информация по конкретной книге
books.get('/:id', async (req, res, next) => {
	const title = 'Book'
	const { id } = req.params
	const optionsInc = {
		host: 'counter',
		path: `/counter/${id}/incr`,
		port: 3001,
		method: 'POST',
	}
	const options = {
		host: 'counter',
		path: `/counter/${id}`,
		port: 3001,
	}

	try {
		const book = await BookDb.findById(id)
		if (book) {
			const r = http.request(optionsInc, (res) => {})
			r.end()
				http.get(options, (response) => {
				let str = ''
				response.on('data', (chunk) => {
					str += chunk
				})
				response.on('end', () => {
					let counter = JSON.parse(str).count ?? 0
					// let username = req.user?.username ?? 'Гость'
					res.render('pages/view', {
						title: title,
						lib: book,
						counter: counter,
						username: 'Гость'
					})
				})
			})
		} else {
			next()
		}
	} catch (e) {
		console.log(e)
		next()
	}
})

books.post('/:id', async (req, res, next) => {
	const { id } = req.params
	const { username, body } = req.body
	try {
		await BookDb.findByIdAndUpdate(id, { $push: { comments: {username: username, body: body} } })
		res.redirect(`/books/${id}`)
	} catch (e) {
		console.log(e)
		next()
	}
})

export { books }
