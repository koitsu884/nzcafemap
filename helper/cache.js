const redis = require('redis');
const util = require('util');
const config = require('config');

const redisUrl = config.get('redisURL');
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

module.exports = {
    cacheRecord(hashKey, key, data) {
        client.hset(JSON.stringify(hashKey), JSON.stringify(key), JSON.stringify(data));
    },

    async getRecordFromCache(hashKey, key){
        return await client.hget(JSON.stringify(hashKey), JSON.stringify(key));
    },

    clearHash( hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}