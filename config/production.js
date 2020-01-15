module.exports = {
    "jwtPrivateKey": process.env.JWT_KEY,
    "db": process.env.MONGODB_URI,
    "cloudinaryName": process.env.CLOUDINARY_NAME,
    "cloudinaryAPIKey": process.env.CLOUDINARY_KEY,
    "cloudinarySecret": process.env.CLOUDINARY_SECRET,
    "mailUser": process.env.MAIL_USER,
    "mailPass": process.env.MAIL_PASS,
    "redisURL": process.env.REDIS_URL,
    "sessionSecret": process.env.SESSION_SECRET,
    "twitterConsumerKey": process.env.TWITTER_CONSUMER_KEY,
    "twitterConsumerSecret": process.env.TWITTER_CONSUMER_SECRET,
    "twitterAccessTokenKey": process.env.TWITTER_ACCESS_TOKEN_KEY,
    "twitterAccessTokenSecret": process.env.TWITTER_ACCESS_TOKEN_SECRET,
    "clientUrl": "https://www.nzcafemap.com/"
}