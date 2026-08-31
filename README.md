# Azaria-SW

A full-stack personal portfolio website with a Linux-inspired interface, dynamic content, admin management, secure authentication, cloud file storage, and automated deployment.

> **Note:** The backend is hosted on Render's free tier, which may suspend the service after inactivity. The first request after a period of inactivity can therefore take a few seconds while the service wakes up. **This is a hosting limitation, not an application performance issue**.

## Stack

- Frontend: React, Vite, React Query
- Backend: Node.js, Express
- Database: PostgreSQL, Prisma
- File storage: Cloudinary
- Deployment: Vercel, Render, Neon
- CI/CD: GitHub Actions
- Containers: Docker

## Features

- Responsive Linux-inspired portfolio UI
- Profile, skills, projects, experience, education, certificates and github
- Project image galleries
- Resume and CV downloads
- Contact form with admin message management
- Protected admin dashboard
- JWT-based admin authentication
- Search, filtering, sorting, and pagination
- Cloudinary image and document storage
- Automatic cleanup of replaced and deleted files
- GitHub activity integration with caching
- API validation, rate limiting, security headers, logging, and error handling
- Dockerized frontend and backend
- Automated CI validation and deployment on pushes to master

## Architecture

```text
azaria-sw/
|-- apps/
|   |-- client/       # React frontend
|   `-- server/       # Express backend
|-- docs/             # Project documentation
`-- .github/
    `-- workflows/    # CI/CD
```

## Deployment

```text
Browser
   |
   v
Vercel (React)
   |
   v
Render (Express API)
   |
   +----> Neon (PostgreSQL)
   |
   +----> Cloudinary (Files)
   |
   +----> GitHub API (Activity)
```

## Development

### Requirements

- Node.js 22+
- npm
- Docker (optional)
- PostgreSQL or a PostgreSQL-compatible database

### Install

```bash
git clone https://github.com/AzariaSW/azaria-sw.git
cd azaria-sw
npm ci
```

### Environment

Configure the required environment variables for the client and server, including database, authentication, Cloudinary, GitHub, and frontend/API URLs.

### Run

```bash
npm run dev
```

Refer to the project documentation for environment-specific commands and configuration.

## CI/CD

GitHub Actions validates:

- Prisma schema
- Prisma Client generation
- Frontend linting
- Frontend production build
- Backend Docker image
- Frontend Docker image

After successful validation on master, the workflow triggers deployment to Render and Vercel.

## API

The backend exposes a versioned REST API under:

```text
/api/v1
```

Detailed endpoint documentation is available in docs/.

## License

This project is personal portfolio software by Azaria Abenet Fitta.
