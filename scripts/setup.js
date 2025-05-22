#!/usr/bin/env node

/**
 * Project setup script
 * 
 * This script automates the setup process for the template-vite-react-node-postgres project:
 * 1. Installs dependencies for both frontend and backend
 * 2. Generates .env files with default values
 * 3. Creates a Dockerfile for the frontend (if missing)
 * 4. Provides feedback to the user about the setup process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

// Helper function to log with colors
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Helper function to execute shell commands
function executeCommand(command, cwd = process.cwd()) {
  try {
    log(`Executing: ${command}`, colors.blue);
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Error executing command: ${command}`, colors.red);
    log(error.message, colors.red);
    return false;
  }
}

// Helper function to create a file if it doesn't exist
function createFileIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, content);
      log(`Created ${filePath}`, colors.green);
      return true;
    } catch (error) {
      log(`Error creating ${filePath}`, colors.red);
      log(error.message, colors.red);
      return false;
    }
  } else {
    log(`File already exists: ${filePath}`, colors.yellow);
    return true;
  }
}

// Main setup function
async function setup() {
  log('Starting project setup...', colors.bright + colors.green);
  
  // 1. Install dependencies
  log('\n📦 Installing dependencies...', colors.bright);
  
  // Install root dependencies
  executeCommand('npm install');
  
  // Install frontend dependencies
  executeCommand('npm install', path.join(process.cwd(), 'frontend'));
  
  // Install backend dependencies
  executeCommand('npm install', path.join(process.cwd(), 'backend'));
  
  // 2. Generate .env files
  log('\n🔧 Generating environment files...', colors.bright);
  
  // Backend .env
  const backendEnvPath = path.join(process.cwd(), 'backend', '.env');
  const backendEnvContent = 
`DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
PORT=5000`;
  
  createFileIfNotExists(backendEnvPath, backendEnvContent);
  
  // 3. Create a frontend Dockerfile if missing
  log('\n🐳 Setting up Docker files...', colors.bright);
  
  const frontendDockerfilePath = path.join(process.cwd(), 'frontend', 'Dockerfile');
  const frontendDockerfileContent = 
`FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]`;
  
  createFileIfNotExists(frontendDockerfilePath, frontendDockerfileContent);
  
  // Create nginx.conf for frontend
  const nginxConfPath = path.join(process.cwd(), 'frontend', 'nginx.conf');
  const nginxConfContent = 
`server {
    listen 3000;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`;
  
  createFileIfNotExists(nginxConfPath, nginxConfContent);
  
  // 4. Add ESLint to the backend if missing
  log('\n🧹 Setting up linting...', colors.bright);
  
  // Check if the backend has ESLint
  const backendPackageJsonPath = path.join(process.cwd(), 'backend', 'package.json');
  let backendPackageJson;
  
  try {
    backendPackageJson = JSON.parse(fs.readFileSync(backendPackageJsonPath, 'utf8'));
    
    // Add lint script if it doesn't exist
    if (!backendPackageJson.scripts.lint) {
      backendPackageJson.scripts.lint = "eslint .";
      fs.writeFileSync(backendPackageJsonPath, JSON.stringify(backendPackageJson, null, 2));
      log('Added lint script to backend package.json', colors.green);
      
      // Install ESLint in backend
      executeCommand('npm install --save-dev eslint', path.join(process.cwd(), 'backend'));
      
      // Create ESLint config
      const eslintConfigPath = path.join(process.cwd(), 'backend', 'eslint.config.js');
      const eslintConfigContent = 
`export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];`;
      
      createFileIfNotExists(eslintConfigPath, eslintConfigContent);
    }
  } catch (error) {
    log('Error updating backend package.json', colors.red);
    log(error.message, colors.red);
  }
  
  // 5. Setup complete
  log('\n✅ Setup complete!', colors.bright + colors.green);
  log('\nNext steps:', colors.bright);
  log('1. Start the development environment:', colors.yellow);
  log('   npm run start:dev');
  log('\n2. Or start with Docker:', colors.yellow);
  log('   npm run start');
  log('\nHappy coding! 🚀', colors.bright + colors.green);
}

// Run the setup
setup().catch(error => {
  log('Setup failed with an error:', colors.red);
  log(error.message, colors.red);
  process.exit(1);
});