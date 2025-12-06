module.exports = function errorHandler(err, req, res, next) {
    // Log error server-side
    console.error(err && err.stack ? err.stack : err);

    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : 'Internal Server Error';

    // In production, hide stack traces
    const response = {
        success: false,
        message
    };

    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(status).json(response);
};
