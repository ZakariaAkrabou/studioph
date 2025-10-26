# Backend Deployment Guide

## Environment Variables Required

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_CONNECTION_STRING=mongodb://localhost:27017/studioph

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173,https://yourdomain.com

# Upload Configuration
MAX_UPLOAD_SIZE_BYTES=5242880

# Server Configuration
PORT=3000
NODE_ENV=production
BODY_LIMIT=1mb
```

## Docker Deployment

### Option 1: Using Docker Compose (Recommended)

1. Copy the environment variables to a `.env` file
2. Run the following commands:

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Option 2: Using Docker directly

```bash
# Build the image
docker build -t studioph-backend .

# Run the container
docker run -d \
  --name studioph-backend \
  -p 3000:3000 \
  --env-file .env \
  studioph-backend

# View logs
docker logs -f studioph-backend

# Stop the container
docker stop studioph-backend
docker rm studioph-backend
```

## Health Check

The application includes a health check endpoint at `/health` that returns:
- Status: OK
- Timestamp
- Uptime

## Production Considerations

1. **Security**: The container runs as a non-root user (`appuser`)
2. **Health Checks**: Built-in health checks for container orchestration
3. **File Uploads**: Uploads are stored in a Docker volume for persistence
4. **Environment Variables**: All sensitive data should be passed via environment variables
5. **CORS**: Configure `FRONTEND_URLS` for your production frontend domains

## Troubleshooting

1. **Container won't start**: Check environment variables are set correctly
2. **Database connection issues**: Verify `DB_CONNECTION_STRING` is correct
3. **File upload issues**: Check Cloudinary credentials and upload limits
4. **CORS errors**: Update `FRONTEND_URLS` with your frontend domain

## Monitoring

- Health check endpoint: `GET /health`
- Container logs: `docker logs studioph-backend`
- Container status: `docker ps`
