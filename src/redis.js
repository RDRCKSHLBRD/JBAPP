//redis.js

const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
    throw new Error('REDIS_URL is not set in the environment variables.');
}

// Initialize Redis client
const redisClient = createClient({
    url: REDIS_URL,
});

// Handle Redis client errors
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected successfully!');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        process.exit(1);
    }
})();

module.exports = redisClient;
