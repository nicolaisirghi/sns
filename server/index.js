const express = require('express');
require("dotenv").config()
const mongoose = require("mongoose");
const bp = require("body-parser");
const cors = require("cors")
const postsRouter = require("./Routes/Posts");
const authRouter = require("./Routes/Auth")
const accessMiddleware = require("./Middleware/authMiddleware")
const app = express()
const session = require("express-session")
const errorHandler = require("./Middleware/errorHandlerMiddleware")
const PORT = process.env.PORT || 5000
app.get('/', (_, res) => {
    res.status(200).json({
        name: 'BrainWaveAPI',
        version: "1.0.0",
        message: "This is the API for the web-application BrainWave",
        author: "Sirghi Nicolae",
    })
})
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors())
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))
app.use("/posts", postsRouter)
app.use("/auth", authRouter)
app.use(errorHandler)
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to mongo ")
    } catch (e) {
        console.log(e)
    }
    app.listen(PORT, () =>
        console.log(`Server has been started on ${PORT}`));
}
start()