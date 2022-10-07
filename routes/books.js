const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const fileMulter = require('../middleware/file')
const path = require('path')

const stor = {
	library: [
		new Book(),
		new Book(),
	],
};

// Получить все книги
router.get('/', (req, res) => {
	const { library } = stor
	res.json(library)
})

// Получить книгу по ID
router.get('/:id', (req, res, next) => {
	const { library } = stor
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)
	if (idx !== -1) {
		res.json(library[idx])
	} else {
		next()
	}
})

// Создать и загрузить книгу
router.post('/', fileMulter.single('file_book'), (req, res) => {
	const { library } = stor
	const { title, desc, authors, favorite, fileCover, fileName} = req.body
	const fileBook = req.file.filename

	const newBook = new Book(title, desc, authors, favorite, fileCover, fileName, fileBook)
	library.push(newBook)

	res.status(201)
	res.json(newBook)
})

// Редактировать книгу по ID
router.put('/:id', (req, res, next) => {
	const { library } = stor
	const { body } = req
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)
	if (idx !== -1) {
		library[idx] = {
			...library[idx],
			...body
		}
		res.json(library[idx])
	} else {
		next()
	}
})

// Удалить кнлигу по ID
router.delete('/:id', (req, res, next) => {
	const { library } = stor
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)
	if (idx !== -1) {
		library.splice(idx, 1)
		res.json(true)
	} else {
		next()
	}
})

// Скачать книгу
router.get('/:id/download', (req, res) => {
	const { library } = stor
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)
	if (idx !== -1) {
		res.download(path.join(__dirname, '/../', 'public/stor/', library[idx].fileBook))
	} else {
		next()
	}
})

module.exports = router
