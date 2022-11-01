const express = require('express')
const path = require('path')
const http = require('http')
const router = express.Router()

const BookDb = require('../models/bookdb')
const fileMulter = require('../middleware/file')

// Просмотр списка всех книг
router.get('/', async (req, res) => {
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
router.get('/create', (req, res) => {
	const title = 'Create book'
	const b = new BookDb({})
	res.render('pages/create', {
		title: title,
		book: {}
	})
})

router.post('/create', fileMulter.single('fileBook'), async (req, res) => {
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
router.get('/update/:id', async (req, res, next) => {
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

router.post('/update/:id', fileMulter.single('fileBook'), async (req, res, next) => {
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
router.post('/delete/:id', async (req, res, next) => {
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
router.get('/:id', async (req, res, next) => {
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
					res.render('pages/view', {
						title: title,
						lib: book,
						counter: counter,
						username: req.user?.username ?? 'Гость'
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

router.post('/:id', async (req, res, next) => {
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

module.exports = router
