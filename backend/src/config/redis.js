import { createClient } from 'redis';
import { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } from './env.js';
import { AppError } from "../utils/appError.js";

const client = createClient({
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
})

client.on('error', (err) => {
    throw new AppError('Dont found Redis database', 500)
})

export default client