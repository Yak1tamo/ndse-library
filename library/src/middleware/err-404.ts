import { Request, Response } from 'express'

export const error404 = (req: Request, res: Response) => {
	res.status(404)
	//res.json('404 | страница не найдена')
	res.render('errors/404', {
		title: '404',
	})
}
