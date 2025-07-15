# Quick Deployment Guide

## Single Command Deployment

Run this command in PowerShell from the project root:

```powershell
.\deploy.ps1
```

That's it! The script will:
1. ✅ Upload all files to EC2 instance
2. ✅ Install dependencies inside Docker container (no local node_modules needed)
3. ✅ Build Docker image
4. ✅ Start service on port 3004

## What Gets Deployed

- Application code (index.js, controllers, models, routes, etc.)
- Configuration files (package.json, Dockerfile, docker-compose.yml)
- Environment template (env.example)

**Note:** `node_modules` are NOT uploaded - they're installed fresh on the server during Docker build.

## First Time Setup

On your first deployment, you'll need to configure the `.env` file on the server:

1. After running `deploy.ps1`, SSH into the server:
```powershell
ssh -i aws-services-stage.pem ubuntu@ec2-3-96-139-52.ca-central-1.compute.amazonaws.com
```

2. Navigate to the service directory:
```bash
cd /home/ubuntu/coupon-service
```

3. Edit the `.env` file with your actual configuration:
```bash
nano .env
```

4. Update these critical values:
   - `DB_HOST` - Your database host
   - `DB_USER` - Database username
   - `DB_PASSWORD` - Database password
   - `DB_NAME` - Database name
   - `AUTH_KEY` - A secure random string (JWT secret key)
   - `ENCRYPTION_KEY` - A secure encryption key
   - `ALLOWED_ORIGINS` - Your frontend URLs

5. Restart the service:
```bash
docker-compose restart
```

## Service URL

After deployment, your service will be available at:
```
http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004
```

Test it:
```
http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/test
```

## Troubleshooting

### View logs:
```bash
ssh -i aws-services-stage.pem ubuntu@ec2-3-96-139-52.ca-central-1.compute.amazonaws.com
cd /home/ubuntu/coupon-service
docker-compose logs -f
```

### Restart service:
```bash
docker-compose restart
```

### Rebuild from scratch:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Important Notes

- ✅ Node modules install automatically on server
- ✅ Service runs on port 3004
- ✅ CORS is pre-configured
- ✅ Docker handles all dependencies
- ⚠️ Remember to configure `.env` on first deployment
- ⚠️ Keep `aws-services-stage.pem` secure and never commit it

