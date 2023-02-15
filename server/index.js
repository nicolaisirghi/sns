import "dotenv/config"
import mongoose from 'mongoose'
import { createSocketConnection } from "./Connection/socket.js"
import { checkUsersOnline } from "./Global/usersOnline.js"
import { app } from './Middleware/index.js'
import { logger } from './Utils/Logger/logger.js'
const PORT = process.env.PORT || 5000
const start = async () => {
    try {
        const server = app.listen(PORT, () =>
            logger.info((`[Express] Server has been started on ${PORT}`)));
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        logger.info("[Mongo] Connected to mongo ")
        global.usersOnline = await checkUsersOnline()
        const socketIO = createSocketConnection(server)
    } catch (e) {
        logger.error(e)
    }
}
start()