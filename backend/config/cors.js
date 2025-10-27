const normalizeOrigin = (value) => {
  if (!value) return value;
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`;
  } catch (_e) {
    return value.replace(/\/$/, '');
  }
};

const getCorsOptions = () => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://studioph.netlify.app',
    'https://studiobackend-wf68me8p.b4a.run'
  ];

  if (process.env.FRONTEND_URL) {
    const envOrigins = process.env.FRONTEND_URL
      .split(',')
      .map(s => normalizeOrigin(s.trim()))
      .filter(Boolean);
    allowedOrigins.push(...envOrigins);
  }

  return {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      const normalizedOrigin = normalizeOrigin(origin);
      
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      
      console.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Total-Count']
  };
};

module.exports = getCorsOptions();
