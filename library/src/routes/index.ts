import { Router } from 'express'

const index = Router()

index.get('/', (req, res) => {
	const title = 'Главная страница'
	res.render('index', {
		title: title,
		user: req.user
	})
})

export { index }
