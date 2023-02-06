const errorHandler = (err, req, res, _) => {
    console.log("An error happened on : ", err)
    res.status(400).json({errors: err})
}
module.exports = errorHandler