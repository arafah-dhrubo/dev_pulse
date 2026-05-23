import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20,
    min: 0,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
})

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        client.release();
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed", error);
    }
}