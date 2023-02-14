import express from 'express'
import "dotenv/config"
import mongoose from 'mongoose'
import bp from 'body-parser'
import cors from 'cors'
import path, { dirname } from 'path'
import { router as postRouter } from './Routes/Posts.js'
import { router as authRouter } from './Routes/Auth.js'
import { router as messageRouter } from "./Routes/Messages.js"
import { router as groupRouter } from "./Routes/Groups.js"
import { Server } from 'socket.io'
import session from 'express-session'
import morgan from 'morgan'
import { errorHandler } from './Middleware/errorHandlerMiddleware.js'
import { logger } from './utils/Logger/logger.js'
import { fileURLToPath } from 'url'
import Users from "./Models/Users.js";
const app = express()


const PORT = process.env.PORT || 5000
const sessionMiddleware = session({
    secret: 'keyboard cat', resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: true,
    socketClients: {}
})
const start = async () => {
    try {

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
            res.sendFile('index.html', options)
        })
        app.use(bp.json())
        app.use(bp.urlencoded({ extended: true }))
        app.use(cors({
            credentials: true,
            origin: "http://localhost:3000",
        }));
        app.use(sessionMiddleware)
        app.use(function (req, _, next) {
            req.user = "63e3f6889d700f51fe8531b7";
            console.log("User: ", req.user)
            next()
        })
        app.use("/posts", postRouter)
        app.use("/auth", authRouter)
        app.use("/messages", messageRouter)
        app.use("/groups", groupRouter)
        app.use(errorHandler)
        const server = app.listen(PORT, () =>
            logger.info((`[Express] Server has been started on ${PORT}`)));

        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        logger.info("[Mongo] Connected to mongo ")
        const users = await Users.find();
        const usersID = users.map(user=>[user.id,null])
        const usersOnline =  Object.fromEntries(usersID)
        //global variables
        global.usersOnline = usersOnline;
        const socketIO = new Server(server, {
            cors: {
                origin: "http://localhost:3000",credentials:true
            }
        });

        socketIO.use((socket, next) => {
            sessionMiddleware(socket.request, {}, next);
        });
        socketIO.on('connection', (socket) => {
            //need to be fixes
            const {id} = socket.handshake.query
            usersOnline[id] = socket.id;
            socket.onAny((event, ...args) => {
                console.log("Data from client : ")
                console.log(event, args);
            });
            logger.info(`⚡: ${socket.id} user just connected!`);
            socket.on('disconnect', () => {
                usersOnline[id] = null;
                logger.info(`🔥: ${socket.id} user just disconnected!`);
            });
        });
    } catch (e) {
        logger.error(e)
    }

}
start()