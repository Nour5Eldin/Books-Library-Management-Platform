import type { IncomingMessage, ServerResponse } from 'node:http';
import app from '../apps/api/src/app';
import { connectDB } from '../apps/api/src/config/database';

let databaseConnection: Promise<void> | undefined;

async function ensureDatabaseConnection(): Promise<void> {
    if (!databaseConnection) {
        databaseConnection = connectDB().catch((error: unknown) => {
            databaseConnection = undefined;
            throw error;
        });
    }

    await databaseConnection;
}

/**
 * Vercel serverless entry point. The Express app deliberately does not call
 * `listen`, allowing Vercel to own the HTTP server and reuse DB connections.
 */
export default async function handler(
    request: IncomingMessage,
    response: ServerResponse,
): Promise<void> {
    try {
        await ensureDatabaseConnection();
        app(request as never, response as never);
    } catch (error) {
        console.error('Unable to initialise the API:', error);
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ success: false, message: 'Service unavailable' }));
    }
}
