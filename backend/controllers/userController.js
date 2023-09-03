const UserSchema = require('../models/User')
const BooksSchema = require('../models/Books')
const bcrypt = require('bcrypt')
require('dotenv').config()
const Joi = require('joi')
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const { emailCheck } = require('../utils/emailCheck')
const { usernameCheck } = require('../utils/usernameCheck')


const registerUser = async (req, res) => {

    const isValid = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().min(4).max(15).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(10).max(10).required(),
        password: Joi.string().min(6).max(15).required()
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: 'Invalid Input',
            data: isValid.error
        })
    }

    const isEmailExist = await emailCheck(req.body.email)
    const isUsernameExist = await usernameCheck(req.body.username)

    if (isUsernameExist === 'U') {
        return res.status(200).send({
            status: 200,
            message: 'Username already exist.'
        })
    } else if (isEmailExist === 'E') {
        return res.status(200).send({
            status: 200,
            message: 'Email already exist.'
        })
    }

    const hashPass = await bcrypt.hash(req.body.password, SALT_ROUNDS)

    const userObj = new UserSchema({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: hashPass,
    })

    try {
        userObj.save()
        res.status(201).send({
            status: 201,
            message: 'User created succesfully!',
            data: userObj
        })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "DB Error",
            data: err
        })
    }
}

const loginUser = async (req, res) => {

    const { loginId, password } = req.body
    let userData
    const isValid = Joi.object({
        loginId: Joi.string().email().required()
    }).validate(loginId)

    try {
        if (isValid.err) {
            userData = await UserSchema.findOne({ username: loginId })
        } else {
            userData = await UserSchema.findOne({ email: loginId })
        }

        if (!userData) {
            return res.status(400).send({
                status: 401,
                message: 'No user found!'
            })
        }
        req.session.isAuth = true
        req.session.user = {
            name: userData.name,
            username: userData.username,
            email: userData.email,
            userId: userData._id
        }
        const isSamePass = await bcrypt.compare(password, userData.password)
        if (isSamePass) {
            return res.status(200).send({
                status: 200,
                message: `Welcome back ${userData.name}.`,
                data: req.session.user,
            })
        }
        else {
            return res.status(404).send({
                status: 404,
                message: 'Incorrect password. Please try again!'
            })
        }
    }
    catch (err) {
        res.status(400).send({
            status: 400,
            message: "DB Error",
            data: err
        })
    }
}

const booksDashboard = async (req, res) => {
    const userId = req.params.userId

    const isValid = Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        price: Joi.string().required(),
        category: Joi.string().required()
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: 'Invalid Data Format',
            data: isValid.error
        })
    }

    const userData = await UserSchema.find({ _id: userId })
    // console.log(userData[0].name)
    if (!userData) {
        return res.status(400).send({
            status: 400,
            message: 'Invalid User'
        })
    }

    const booksObj = new BooksSchema({
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        category: req.body.category,
        userId: userId.toString()
    })

    try {
        await booksObj.save()
        return res.status(201).send({
            status: 201,
            message: 'Book Created Successfully',
            data: booksObj
        })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Book creation failed',
            data: err
        })
    }

}

const editBook = async (req, res) => {
    const { bookId, title, author, price, category, userId } = req.body

    try {
        const bookData = await BooksSchema.findById(bookId)

        if (!(bookData.userId).toString() === (userId).toString()) {
            return res.status(400).send({
                status: 400,
                message: 'Not allowed to edit, Authorizzation failed!'
            })
        }

        if (title.trim().length == 0 || author.trim().length == 0 || price.trim().length == 0 || category.trim().length == 0) {
            return res.status(401).send({
                status: 401,
                message: 'Please fill all the fields first!'
            })
        }
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Unable to edit the blog',
            data: err.message
        })
    }

    try {
        const newBookData = {
            title,
            author,
            price,
            category
        }

        await BooksSchema.findByIdAndUpdate({ _id: bookId }, newBookData)
        res.status(200).send({
            status: 200,
            message: 'Blog edited successfully'
        })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Unable to edit the blog',
            data: err.message
        })
    }
}

const allBooks = async (req, res) => {
    const userId = req.params.userId

    try {
        const myBookData = await BooksSchema.find({
            userId: userId,
        })
        console.log(userId)

        if (myBookData) {
            res.status(200).send({
                status: 200,
                message: 'Requested Books',
                data: myBookData
            })
        } else {
            res.status(400).send({
                status: 400,
                message: `No books found with this user id: ${userId} `
            })
        }
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Failed to get books',
            data: err
        })
    }
}
const deleteBook = async (req, res) => {
    const bookId = req.params.bookId

    try {
        await BooksSchema.findByIdAndDelete(
            {
                _id: bookId,
            }
        )

        res.status(200).send({
            status: 200,
            message: 'Book deleted succesfully'
        })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Unable to delete the book!',
            data: err
        })
    }
}

module.exports = { registerUser, loginUser, booksDashboard, editBook, allBooks, deleteBook }