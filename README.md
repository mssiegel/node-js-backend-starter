# Nodejs Backend Starter API

> Nodejs backend API starter. Includes express, mongodb/mongoose, prettier, eslint, and docker.

## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own

## Install Dependencies

```bash
npm install
```

## Run App

```bash
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with resources from the "\_data" folder, run

```bash
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

## Docker Setup

```bash
# For local development
docker-compose up -d

# For production:
# 1) Build image
docker build -t image-name .
# 2) Launch container from image
docker container run -p 3030:5000 image-name
```

## Demo

Extensive documentation with examples [here](https://documenter.getpostman.com/view/8923145/SVtVVTzd?version=latest) as well as in "public/index.html"

- Version: 1.0.0
- License: MIT
