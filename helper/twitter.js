var Twitter = require('twitter');
const config = require('config');

var client = new Twitter({
    consumer_key:  config.get('twitterConsumerKey'),
    consumer_secret:  config.get('twitterConsumerSecret'),
    access_token_key:  config.get('twitterAccessTokenKey'),
    access_token_secret:  config.get('twitterAccessTokenSecret'),
})

module.exports.postTweet = async function(status, mediaIds=null){
    try{
        const res = await client.post('statuses/update', {status: status, media_ids: mediaIds});
        return res.text;
    }
    catch(error){
        console.log(error);
    }
}

module.exports.postImage = async function(imageString) {
    try {
        const res = await client.post('media/upload', {
            media_data: imageString
        })
        return res.media_id_string;
    } catch(error){
        console.log(error);
    }
}