import express from 'express'
import "dotenv/config"
import mongoose from 'mongoose'
import bp from 'body-parser'
import cors from 'cors'
import path, { dirname } from 'path'
import { router as postRouter } from './Routes/Posts.js'
import { router as authRouter } from './Routes/Auth.js'
import { Server } from 'socket.io'
import session from 'express-session'
import morgan from 'morgan'
import { errorHandler } from './Middleware/errorHandlerMiddleware.js'
import { logger } from './utils/Logger/logger.js'
import { fileURLToPath } from 'url'
const app = express()
const PORT = process.env.PORT || 5000

const start = async () => {
    try {
        const server = app.listen(PORT, () =>
            logger.info((`[Express] Server has been started on ${PORT}`)));

        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        logger.info("[Mongo] Connected to mongo ")
        const socketIO = new Server(server, {
            cors: {
                origin: "http://localhost:3000"
            }
        });
        socketIO.on('connection', (socket) => {
            logger.silly(`⚡: ${socket.id} user just connected!`);
            socket.on('disconnect', () => {
                logger.error(`🔥: ${socket.id} user just disconnected!`);
            });
        });
        app.use(morgan('dev'))
        app.use(function (req, _, next) {
            req.io = socketIO;
            next();
        })
        app.get('/', (_, res) => {
            const __filename = fileURLToPath(import.meta.url)
            const __dirname = dirname(__filename)
            const options = {
                root: path.join(__dirname)
            };
            res.sendFile('index.html',options)
        })
        app.use(bp.json())
        app.use(bp.urlencoded({ extended: true }))
        app.use(cors())
        app.use(session({
            secret: 'keyboard cat', resave: false,
            cookie: { maxAge: 1000*60*60*24 },
            saveUninitialized: true
        }))
        // app.use(captchaMiddleware)
        app.use("/posts", postRouter)
        app.use("/auth", authRouter)
        app.use(errorHandler)
    } catch (e) {
        logger.error(e)
    }

}
start()