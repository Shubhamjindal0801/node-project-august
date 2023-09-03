const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const BooksSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        required:true
    },
},
    {
        strict: false
    }
)

module.exports = Mongoose.model('books',BooksSchema)