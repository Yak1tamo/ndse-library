import passport from 'passport'
import { Router } from 'express'
import { User } from '../../models/user.js'

const userApi = Router()

// Страница с формой входа / регистрации
userApi.get('/login', (req, res) => {
	res.render('user/login')
})

// Страница профиля
userApi.get('/me', (req, res, next) => {
		if (!req.isAuthenticated()) {
			return res.redirect('/login')
		}
		next()
	},
	(req, res) => {
		res.render('user/me', { user: req.user })
	}
)

// Залогиниться
userApi.post('/login',
	passport.authenticate('local', { failureRedirect: '/api/user/login' }),
	(req, res) => {
		console.log("req.user: ", req.user)
		res.redirect('/')
})

// Зарегистрироваться
userApi.post('/signup', async (req, res, next) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password
	})
	try {
		const updatedUser = await user.save()
		req.login(updatedUser, function(err) {
			if (err) { return next(err) }
			res.redirect('/')
		})
	} catch (e) {
		console.log(e)
	}
})

// Разлогиниться
userApi.get('/logout', (req, res, next) => {
	req.logout(function(err) {
		if (err) { return next(err) }
		res.redirect('/')
	})
})

export { userApi }
