import { logger } from "../utils/logger.js"
export const errorHandler = (err, req, res, _) => {
    logger.error(`An error happened  : ${err} `)
    res.status(400).json({errors: err.message})
}