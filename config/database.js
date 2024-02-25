const mongoose = require("mongoose");
const MAX_RETRIES = 3; // Maximum number of retry attempts
const connectDB =async (retryCount =0) => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(` Connected with database: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Connection attempt ${retryCount + 1} failed:`, error);
        if (retryCount < MAX_RETRIES) {
            // If retry count is less than maximum retries, attempt to reconnect
            const nextRetryCount = retryCount + 1;
            const delay = 2000; // Retry after 2 seconds 
            console.log(`Retrying connection in ${delay / 1000} seconds...`);
            setTimeout(() => connectDB(nextRetryCount), delay);
        } else {
            console.log(`Maximum retry attempts (${MAX_RETRIES}) reached. Exiting...`);
            process.exit(1); // Exit the process after reaching maximum retries
        }
    }
};

module.exports = connectDB;
