require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db');

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const userroute = require('./userroutes');
const bookroute = require('./bookroutes');


app.use('/book', bookroute);

app.use('/user', userroute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Port is listening ${PORT}`);
});
