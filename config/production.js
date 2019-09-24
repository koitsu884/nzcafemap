module.exports = {
    "jwtPrivateKey": process.env.JWT_KEY,
    "db": process.env.MONGODB_URI,
    "cloudinaryName": process.env.CLOUDINARY_NAME,
    "cloudinaryAPIKey": process.env.CLOUDINARY_KEY,
    "cloudinarySecret": process.env.CLOUDINARY_SECRET,
    "redisURL": process.env.REDIS_URL
}