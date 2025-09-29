exports.errorMiddleware = (err, req, res, next) => {
    const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
    if (!isProd) {
        console.error(err.stack);
    } else {
        console.error(err.message);
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: isProd ? 'Something went wrong' : (err.message || 'Internal Server Error'),
    });
};

