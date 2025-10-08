const mongoose = require('mongoose');
const { type } = require('os');

const bookSchema = new mongoose.Schema({
     
    bookname:{
        type : String,
        required : true,
    },
    author:{
        type : String,
        required : true,
    },
     publisher:{
        type : String,
        required : true,
    },
    publishDate: {
         type : Date,
         required : true
    }
})

const book = mongoose.model('book' , bookSchema);

module.exports = book;
