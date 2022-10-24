const express = require('express')
const router = express.Router()
const Book = require('../../models/bookdb')
const fileMulter = require('../../middleware/file')
const path = require('path')

// Получить все книги
router.get('/', async (req, res) => {
	try {
		const books = await Book.find()
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
		const book = await Book.findById(id)
		res.json(book)
	} catch (e) {
		console.log(e)
		next()
	}
})

// Создать и загрузить книгу
router.post('/', fileMulter.single('file_book'), async (req, res) => {
	const { title, desc, authors, favorite, fileCover, fileName} = req.body
	//const fileBook = req.file.filename
	const newBook = new Book({
		title: title,
		desc: desc,
		authors: authors,
		favorite: favorite,
		fileCover: fileCover,
		fileName: fileName
	})
	try {
		const id = await newBook.save()
		console.log(id)
		// .then(savedDoc => {
		// 	savedDoc === doc; // true
		// })
		res.json(id)
	} catch (e) {
		console.log(e)
	}
})

// Редактировать книгу по ID
router.put('/:id', async (req, res, next) => {
	const { id } = req.params
	try {
		await Book.findByIdAndUpdate(id, req.body)
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
		await Book.deleteOne({_id: id})
		res.json('ок')
	} catch (e) {
		console.log(e)
		next()
	}
})

// Скачать книгу
router.get('/:id/download', (req, res) => {
	const { library } = stor
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)
	if (idx !== -1) {
		res.download(path.join(__dirname, '/../../../', 'public/stor/', library[idx].fileBook), library[idx].fileName)
	} else {
		next()
	}
})

module.exports = router
