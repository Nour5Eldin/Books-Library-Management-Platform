import 'dotenv/config';
import { connectDB } from "./config/database";
import app from './app';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        })
    } catch (error) {
        console.error(`Failed to start server:`, error);
        process.exit(1);
    }
};

startServer();