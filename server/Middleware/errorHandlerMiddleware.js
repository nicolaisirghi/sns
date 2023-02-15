import { logger } from "../Utils/Logger/logger.js"
export const errorHandler = (err, req, res, _) => {
    logger.error(`An error happened  : ${err} `)
    logger.silly("Errors : ",err)
    res.status(400).json({errors: err.message})
}
