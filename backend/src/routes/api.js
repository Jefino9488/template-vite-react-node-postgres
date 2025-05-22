import express from 'express';
import { testConnection } from '../db/connect.js';

const router = express.Router();

router.get('/health', async (req, res) => {
    const result = await testConnection();
    res.status(result.success ? 200 : 500).json(result);
});

export default router;