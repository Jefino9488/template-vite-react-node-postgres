const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION || 'postgresql://postgres:postgres@postgres:5432/postgres';

const pool = new Pool({
    connectionString,
    max: parseInt(process.env.PG_POOL_MAX || '10', 10),
    idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT || '5000', 10),
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
});

pool.on('error', (err) => {
    console.error('Unexpected PG client error', err);
});

const testConnection = async () => {
    try {
        const client = await pool.connect();
        client.release();
        return { success: true, message: 'Database connection successful' };
    } catch (error) {
        console.error('Database connection failed', error);
        return { success: false, message: 'Database connection failed', error: error.message };
    }
};

module.exports = { pool, testConnection };
