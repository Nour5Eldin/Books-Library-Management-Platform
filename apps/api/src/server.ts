import 'dotenv/config';
import express from 'express';
import path from 'path';
import { connectDB } from "./config/database";
import app from './app';

const PORT = process.env.PORT || 5000;
const clientDistPath = path.resolve(
    __dirname,
    '../../web/dist/client/browser',
);

const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        app.use(express.static(clientDistPath));
        app.get('/{*splat}', (_req, res) => {
            res.sendFile(path.join(clientDistPath, 'index.html'));
        });
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        })
    } catch (error) {
        console.error(`Failed to start server:`, error);
        process.exit(1);
    }
};

startServer();
