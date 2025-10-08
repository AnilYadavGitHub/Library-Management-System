const express = require('express');
const router = express.Router();

const book = require('./book');

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newBook = new book(data); 
        const response = await newBook.save();

        console.log({ response });
        res.status(201).json({ message: 'Book added successfully', data: response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const Id = req.params.id;
        const data = await book.findById(Id);

        if (!data) return res.status(404).json({ message: 'Book not found' });

        res.status(200).json({ book: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal server error' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully', data: deletedBook });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
