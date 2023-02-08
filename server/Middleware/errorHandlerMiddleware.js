const errorHandler = (err, req, res, _) => {
    console.log("An error happened on : ", err.message)
    res.status(400).json({errors: err.message})
}
module.exports = errorHandler