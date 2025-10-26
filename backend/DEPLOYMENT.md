# StudioPH Backend Deployment Guide

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- MongoDB database (local or cloud)
- Cloudinary account for image storage

### Environment Variables
Create a `.env.production` file with the following variables:

```bash
# Server Configuration
NODE_ENV=production
PORT=3000

# Database
DB_CONNECTION_STRING=mongodb://localhost:27017/studioph_production
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/studioph_production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com
# For multiple frontend URLs, use comma-separated values:
# FRONTEND_URLS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Request Configuration
BODY_LIMIT=1mb
```

### Deployment Commands

#### Using Docker Compose (Recommended)
```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

#### Using Docker directly
```bash
# Build the image
docker build -t studioph-backend .

# Run the container
docker run -d \
  --name studioph-backend \
  -p 3000:3000 \
  --env-file .env.production \
  -v uploads_data:/app/uploads \
  studioph-backend
```

### Health Check
The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Production Optimizations

1. **Security**: The container runs as a non-root user
2. **Performance**: Uses Alpine Linux for smaller image size
3. **Caching**: Optimized layer caching for faster builds
4. **Health Monitoring**: Built-in health checks
5. **Volume Management**: Persistent storage for uploads

### Troubleshooting

1. **Container won't start**: Check environment variables and database connection
2. **Health check fails**: Ensure the application is listening on port 3000
3. **Upload issues**: Verify the uploads volume is properly mounted
4. **CORS errors**: Check FRONTEND_URL configuration

### Scaling
For production scaling, consider:
- Using a reverse proxy (nginx)
- Load balancing multiple container instances
- Database clustering
- CDN for static assets
