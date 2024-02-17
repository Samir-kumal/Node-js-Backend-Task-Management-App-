const mongoose = require("mongoose");
const connectDB =async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(` Connected with database: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;
