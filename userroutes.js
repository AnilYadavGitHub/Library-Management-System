const express = require('express');
const router = express.Router();

const User = require('./user');
const Book = require('./book');
const { jwtAuthMiddleware, generateToken } = require('./jwt');

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        
        const payload = {
            id: response._id,
            gmail: response.gmail,
        };

        const token = generateToken(payload);
        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { gmail, password } = req.body;

        if (!gmail || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const foundUser = await User.findOne({ gmail: gmail });
        
        if (!foundUser) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await foundUser.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const payload = {
            id: foundUser._id,
            gmail: foundUser.gmail,
        };
        
        const token = generateToken(payload);
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const userData = await User.findById(id);

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: userData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id/:bookname', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.params.id; 
        const { bookname } = req.params; 

        if (!bookname) {
            return res.status(400).json({ error: 'Book name is required' });
        }

        const foundBook = await Book.findOne({ bookname });
        if (!foundBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

     
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { bookid: foundBook._id }, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Book added to user', user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const deldata = await User.findByIdAndDelete(id);

        if (!deldata) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
