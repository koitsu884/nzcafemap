const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');

mongoose.set('useCreateIndex', true);

async function createAdminUser() {
    console.log("createAdminUser");
    let adminUser = await User.findOne({isAdmin: true});
    if(adminUser) {
        console.log("Admin user alread exists");
        return;
    }

    //MUST CHANGE PASSWORD AFTER CREATING ADMIN
    user = new User({
        displayName: 'Admin',
        email: 'kazunori.hayashi.nz@outlook.com',
        password: 'P@ss1234!!',
        isAdmin: true
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    console.log("Admin user created");
}

module.exports = function() {
    const dbConnection = config.get('db');
    console.log(dbConnection);
    mongoose.connect(dbConnection, { useNewUrlParser: true, useFindAndModify:false, useCreateIndex: true })
        .then(() => {
            const message = `Connected to ${dbConnection}...`;
            winston.info(message);
            console.log(message);

            createAdminUser();
        })
}