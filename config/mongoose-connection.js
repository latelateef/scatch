const mongoose = require('mongoose');

const dbgr = require('debug')("development:mongoose");
require('dotenv').config();  // Load environment variables

const MONGO_URI = process.env.MONGODB_URI;

mongoose
.connect(`${MONGO_URI}/scatch`)
.then(() => {
    dbgr("connected");
}).catch((err) => {
    dbgr(err);
});

module.exports = mongoose.connection;