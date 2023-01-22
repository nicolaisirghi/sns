const express = require('express');
require("dotenv").config()
const mongoose = require("mongoose");
const bp = require("body-parser");
const cors = require("cors")
const postsRouter = require("./Routes/Posts");
const authRouter = require("./Routes/Auth")
const app = express()
const PORT = process.env.PORT || 5000
app.get('/', (req, res) => {
    res.status(200).send("Hello everyone")
})
app.use(bp.json())
app.use(bp.urlencoded({extended: true}))
app.use(cors())

app.use("/posts", postsRouter)
app.use("/auth",authRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.MongoDB, {
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