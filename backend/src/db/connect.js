import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function testConnection() {
    try {
        console.log('Attempting to connect with DATABASE_URL:', process.env.DATABASE_URL);
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('Database connection successful');
        return { success: true, message: 'Database connection successful' };
    } catch (error) {
        console.error('Database connection error:', error);
        return { success: false, message: `Database connection failed: ${error.message}` };
    }
}

export default pool;