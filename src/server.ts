import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
const HOST = '0.0.0.0';
const PORT = parseInt(process.env.PORT || '3000', 10);

connectDB().then(() => app.listen({port: PORT, host: HOST}, () => console.log(`Server is running on port ${PORT}`))).catch((error) => console.log(error.message))