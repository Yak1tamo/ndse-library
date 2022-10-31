const express = require('express')
const router = express.Router()
const BookDb = require('../../models/bookdb')
const fileMulter = require('../../middleware/file')
const path = require('path')

// Получить все книги
router.get('/', async (req, res) => {
	try {
		const books = await BookDb.find()
		res.json(books)
	} catch (e) {
		console.log(e)
		next()
	}
})

// Получить книгу по ID
router.get('/:id', async (req, res, next) => {
	const { id } = req.params
	try {
		const book = await BookDb.findById(id)
		res.json(book)
	} catch (e) {
		console.log(e)
		next()
	}
})

// Создать и загрузить книгу
router.post('/', fileMulter.single('fileBook'), async (req, res) => {
	const { body } = req
	const fileBook = req.file ? req.file.path : ''
	const newBook = new BookDb({...body, fileBook})
	try {
		const id = await newBook.save()
		console.log(id)
		res.json(id)
	} catch (e) {
		console.log(e)
	}
})

// Редактировать книгу по ID
router.put('/:id', fileMulter.single('fileBook'), async (req, res, next) => {
	const { id } = req.params
	const { body } = req
	const fileBook = req.file ? req.file.path : ''
	try {
		await BookDb.findByIdAndUpdate(id, {...body, fileBook})
		res.redirect('/api/books')
	} catch (e) {
		console.log(e)
		next()
	}
})

// Удалить кнлигу по ID
router.delete('/:id', async (req, res, next) => {
	const { id } = req.params
	try {
		await BookDb.deleteOne({_id: id})
		res.json('ок')
	} catch (e) {
		console.log(e)
		next()
	}
})

// Скачать книгу
router.get('/:id/download', async (req, res) => {
	const { id } = req.params
	try {
		const book = await BookDb.findById(id)
		res.download(path.join('/app', book.fileBook), book.fileName)
	} catch (e) {
		console.log(e)
		next()
	}
})

module.exports = router
