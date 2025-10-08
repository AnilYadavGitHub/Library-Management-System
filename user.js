const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userschema = new mongoose.Schema({
    gmail: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bookid :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'book',
            // required: true,       
    }

});


userschema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt); 
        user.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});


userschema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};

const user = mongoose.model('user', userschema); 
module.exports = user;
