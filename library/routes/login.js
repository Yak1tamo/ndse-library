const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
	const ans = { id: 1, mail: "test@mail.ru" }
	res.status(201)
	res.json(ans)
})

module.exports = router
