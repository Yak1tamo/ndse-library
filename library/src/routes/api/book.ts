// import  path from 'path'
import { Router } from 'express'
import { BookDb } from '../../models/bookdb.js'
import { fileMulter } from '../../middleware/file.js'
const bookApi = Router()

// Получить все книги
bookApi.get('/', async (req, res, next) => {
	try {
		const books = await BookDb.find()
		res.json(books)
	} catch (e) {
		console.log(e)
		next()
	}
})

// Получить книгу по ID
bookApi.get('/:id', async (req, res, next) => {
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
bookApi.post('/', fileMulter.single('fileBook'), async (req, res) => {
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
bookApi.put('/:id', fileMulter.single('fileBook'), async (req, res, next) => {
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
bookApi.delete('/:id', async (req, res, next) => {
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
// bookApi.get('/:id/download', async (req, res, next) => {
// 	const { id } = req.params
// 	try {
// 		const book = await BookDb.findById(id)
// 		res.download(path.join('/app', book.fileBook), book.fileName)
// 	} catch (e) {
// 		console.log(e)
// 		next()
// 	}
// })

export { bookApi }
