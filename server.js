const express = require('express');
require("dotenv").config();
const connectDB = require("./src/db/db");
const userRouter = require("./src/routes/user.routes");
const userRoutes = require("./src/routes/user.routes");
const app = express();
app.use(express.json());
app.use("/api/users",userRouter);
app.listen(3000 ,()=>{
    console.log("Server is running on port 3000");
})

connectDB();