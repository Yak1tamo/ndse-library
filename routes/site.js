const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const fileMulter = require('../middleware/file')
const path = require('path')
const { title } = require('process')

const stor = {
	library: [
		new Book('title1', 'desc1', 'auth1', 'favor1', 'filecover1', 'fileName1'),
		new Book('title2', 'desc2', 'auth2', 'favor2', 'filecover2', 'fileName2'),
	],
};

// Просмотр списка всех книг
router.get('/', (req, res) => {
	const title = 'Library'
	const { library } = stor
	res.render('pages/index', {
		title: title,
		lib: library,
	})
})

// Информация по конкретной книге
router.get('/:id', (req, res, next) => {
	const title = 'Book'
	const { library } = stor
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)
	if (idx !== -1) {
		res.render('pages/view', {
			title: title,
			lib: library[idx],
		})
	} else {
		next()
	}
})

// Создание книги
router.get('/create', (req, res) => {
	const title = 'Create'
	res.render('pages/create', {
		title: title,
		book: {},
	})
})

router.post('/create', fileMulter.single('fileBook'), (req, res) => {
	const { library } = stor
	const { title, desc, authors, favorite, fileCover, fileName} = req.body
	const fileBook = req.file ? req.file.path : ''
	const newBook = new Book(title, desc, authors, favorite, fileCover, fileName, fileBook)
	library.push(newBook)

	res.status(201)
	res.redirect('/books')
})

// Редактирование книги
router.get('/update/:id', (req, res, next) => {
	const title = 'Update'
	const { library } = stor
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)
	if (idx !== -1) {
		res.render('pages/update', {
			title: title,
			book: library[idx],
		})
	} else {
		next()
	}
})

router.post('/update/:id', fileMulter.single('fileBook'), (req, res, next) => {
	const { library } = stor
	const { body } = req
	const fileBook = req.file ? req.file.path : ''
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)
	if (idx !== -1) {
		library[idx] = {
			...library[idx],
			...body,
			fileBook
		}
		res.redirect('/books')
	} else {
		next()
	}
})

// Удалить кнлигу по ID
router.post('/delete/:id', (req, res, next) => {
	const { library } = stor
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)
	if (idx !== -1) {
		library.splice(idx, 1)
		res.redirect('/books')
	} else {
		next()
	}
})

module.exports = router
