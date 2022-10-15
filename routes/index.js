const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	const title = 'Главная страница'
	res.render('index', {
		title: title,
	})
})

module.exports = router