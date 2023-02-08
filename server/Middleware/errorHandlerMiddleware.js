import { logger } from "../utils/logger.js"
export const errorHandler = (err, req, res, _) => {
    logger.error("An error happened on : ", err.message)
    res.status(400).json({errors: err.message})
}
