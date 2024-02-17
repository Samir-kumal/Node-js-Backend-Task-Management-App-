const express = require("express");
const cors = require("cors")
const app = express();
const authenticateToken = require("./middlewares/authenticateToken")
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/database");
connectDB();
app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.use("/", require("./routes/userRoutes"));
app.use("/",authenticateToken, require("./routes/boardRoutes"));
app.use("/",authenticateToken, require("./routes/taskRoutes"));