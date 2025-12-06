const express = require('express');
const { testConnection } = require('../db/connect');

const router = express.Router();

router.get('/health', async (req, res) => {
    const result = await testConnection();
    res.status(result.success ? 200 : 500).json(result);
});

module.exports = router;