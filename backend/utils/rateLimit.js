const rateLimit = require('express-rate-limit');

const createRateLimiter = (options) => {
  const limiter = rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100, 
    message: options.message || "Too many requests, please try again later.",
  });
    return limiter;


}

const LoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: "Too many login attempts from this IP, please try again after 15 minutes."
});


const registreLmiter = rateLimit({


    windowMs: 60 * 60 * 1000,
    max: 5,
    message: "Too many accounts created from this IP, please try again after an hour."
})

const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many password reset requests from this IP, please try again after 15 minutes."
})

const verifyEmailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many email verification requests from this IP, please try again after 15 minutes."
})

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many password reset requests from this IP, please try again after 15 minutes."
})
module.exports = { createRateLimiter, LoginLimiter, registreLmiter, resetPasswordLimiter, verifyEmailLimiter, forgotPasswordLimiter };