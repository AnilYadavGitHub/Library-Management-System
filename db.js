const mongoose = require('mongoose');

const Mymongodb = process.env.Local_db;

mongoose.connect(Mymongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Database connected successfully');
});

db.on('disconnected', () => {
    console.log('Database disconnected');
});

db.on('error', (err) => {
    console.error('There is something wrong:', err);
});

module.exports = db;
