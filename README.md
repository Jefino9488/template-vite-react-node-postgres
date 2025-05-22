# Full-Stack React + Node.js + PostgreSQL Template

A modern full-stack template using React (with Vite), Node.js (Express), and PostgreSQL, all containerized with Docker.

## Features

- **Frontend**: React 19 with Vite, TailwindCSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Containerization**: Docker and Docker Compose
- **Development Tools**: ESLint, Prettier, Jest, and more

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Git](https://git-scm.com/)

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/template-vite-react-node-postgres.git
cd template-vite-react-node-postgres

# Run the setup script
npm run setup
```

This will:
1. Install dependencies for both frontend and backend
2. Generate .env files with default values
3. Start the development environment with Docker Compose

### Manual Setup

If you prefer to set up manually:

1. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. Create .env files:
   ```bash
   # In backend directory
   cp .env.example .env
   ```

3. Start the development environment:
   ```bash
   docker-compose up
   ```

## Development

### Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000.

### Backend

```bash
cd backend
npm run dev
```

The backend API will be available at http://localhost:5000.

### Database

PostgreSQL is available at localhost:5432 with the credentials specified in your .env file.

## API Documentation

### Health Check

```
GET /api/health
```

Returns the status of the backend and database connection.

## Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test
```

## Deployment

This template includes GitHub Actions workflows for CI/CD. See the `.github/workflows` directory for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.