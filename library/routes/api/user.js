const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const router = express.Router()
const User = require('../../models/user')

// Страница с формой входа / регистрации
router.get('/login', (req, res) => {
	res.render('user/login')
})

// Страница профиля
router.get('/me', (req, res, next) => {
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
router.post('/login',
	passport.authenticate('local', { failureRedirect: '/api/user/login' }),
	(req, res) => {
		console.log("req.user: ", req.user)
		res.redirect('/')
})

// Зарегистрироваться
router.post('/signup', async (req, res, next) => {
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
router.get('/logout', (req, res, next) => {
	req.logout(function(err) {
    if (err) { return next(err) }
    res.redirect('/')
  })
})

module.exports = router
