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
const start = async () => {
    try {
        const server = app.listen(PORT, () =>
            console.log(`[Express] Server has been started on ${PORT}`));
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("[Mongo] Connected to mongo ")
        const socketIO = require('socket.io')(server, {
            cors: {
                origin: "http://localhost:3000"
            }
        });

        //Add this before the app.get() block
        socketIO.on('connection', (socket) => {
            console.log(`⚡: ${socket.id} user just connected!`);
            socket.on('disconnect', () => {
                console.log(`🔥: ${socket.id} user just disconnected!`);
            });
        });
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
        app.use(session({
            secret: 'keyboard cat', resave: true,
            saveUninitialized: true
        }))
        app.use("/posts", postsRouter)
        app.use("/auth", authRouter)
        app.use(errorHandler)
    } catch (e) {
        console.log(e)
    }

}
start()