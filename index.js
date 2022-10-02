const express = require('express')
const { v4: uuid } = require('uuid')

class Book {
	constructor(title = '', desc = '', authors = '', favorite = '', fileCover = '', fileName = '', id = uuid()) {
		this.title = title
		this.desc = desc
		this.authors = authors
		this.favorite = favorite
		this.fileCover = fileCover
		this.fileName = fileName
		this.id = id
	}
}

const stor = {
	library: [
		new Book(),
		new Book(),
	],
};

const app = express()
app.use(express.json())

app.post('/api/user/login', (req, res) => {
	const ans = { id: 1, mail: "test@mail.ru" }
	res.status(201)
	res.json(ans)
})

app.get('/api/books', (req, res) => {
	const { library } = stor
	res.json(library)
})

app.get('/api/books/:id', (req, res) => {
	const { library } = stor
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)

	if (idx !== -1) {
		res.json(library[idx])
	} else {
		res.status(404)
		res.json('404 | страница не найдена')
	}
})

app.post('/api/books', (req, res) => {
	const { library } = stor
	const { title, desc, authors, favorite, fileCover, fileName} = req.body

	const newBook = new Book(title, desc, authors, favorite, fileCover, fileName)
	library.push(newBook)

	res.status(201)
	res.json(newBook)
})

app.put('/api/books/:id', (req, res) => {
	const { library } = stor
	const { title, desc, authors, favorite, fileCover, fileName} = req.body
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)

	if (idx !== -1) {
		library[idx] = {
			...library[idx],
			title,
			desc,
			authors,
			favorite,
			fileCover,
			fileName
		}

		res.json(library[idx])
	} else {
		res.status(404)
		res.json('404 | страница не найдена')
	}
})

app.delete('/api/books/:id', (req, res) => {
	const { library } = stor
	const { id } = req.params
	const idx = library.findIndex(el => el.id === id)

	if (idx !== -1) {
		library.splice(idx, 1)
		res.json(true)
	} else {
		res.status(404)
		res.json('404 | страница не найдена')
	}
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
