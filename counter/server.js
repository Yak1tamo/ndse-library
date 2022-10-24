const fs = require('fs')
const path = require('path')
const express = require('express')
const { json } = require('express')
const app = express()

const PORT = process.env.PORT || 3000
const stor = {}

app.post('/counter/:bookId/incr', (req, res) => {
	const { bookId } = req.params
	fs.readFile(
		path.join(__dirname, 'data', 'data.json'),
		'utf-8',
		(err, content) => {
			if(err) {
				console.log(err)
			} else{
				const book = JSON.parse(content)
				book[bookId] = bookId in book ? book[bookId] + 1 : 1
				fs.writeFileSync(
					path.join(__dirname, 'data', 'data.json'),
					JSON.stringify(book),
					(err) => {
						if(err) throw err
					}
				)
			}
		}
	)
})

app.get('/counter/:bookId', (req, res) => {
	const { bookId } = req.params
	fs.readFile(
		path.join(__dirname, 'data', 'data.json'),
		'utf-8',
		(err, content) => {
			if(err) {
				console.log(err)
			} else{
				const book = JSON.parse(content)
				bookId in book ? res.json({ "count": book[bookId] }) : res.status(404).json({ "count": 0})
			}
		}
	)
})

// function parseJSON(json) {
// 	return new Promise((res, rej) => {
// 		fs.readFile(
// 			path.join(__dirname, 'data', 'data.json'),
// 			'utf-8',
// 			(err, content) => {
// 				if(err) {
// 					rej(err)
// 				} else{
// 					res(JSON.parse(content))
// 				}
// 			}
// 		)
// 	})
// }

app.listen(PORT, () => {
	console.log(`PORT = ${PORT}`)
})
