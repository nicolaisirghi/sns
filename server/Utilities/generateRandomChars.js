module.exports = generateRandomChars = (size) => {
    return Math.random().toString(36).substring(7)
}