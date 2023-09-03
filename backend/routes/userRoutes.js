const express = require('express')
const { registerUser, loginUser, booksDashboard, editBook, allBooks, deleteBook } = require('../controllers/userController')
const router = express()

router.post('/registration', registerUser)
router.post('/login', loginUser)
router.post('/create-book/:userId', booksDashboard)
router.get('/all-books/:userId', allBooks)
router.put('/edit-book', editBook)
router.delete('/delete-book/:bookId', deleteBook)

module.exports = router