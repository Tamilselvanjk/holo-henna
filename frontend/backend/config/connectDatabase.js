const mongoose = require('mongoose');

const connectDatabase = () => {
    // Connect to MongoDB without deprecated options
    mongoose.connect(process.env.DB_URL)
        .then((con) => {
            console.log('MongoDB connected to host: ' + con.connection.host);
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error.message);
        });
};

module.exports = connectDatabase;
