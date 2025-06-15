# Frontend Technical Test - 2025

This repository contains a multi-step registration form application built with Vue 3 and Node.js, dockerized for easy setup and deployment.

## Project Structure

- `front-vue/` - Vue 3 frontend application
- `back-node/` - Node.js/Express backend API
- `docker-compose.yml` - Docker configuration for both services

## Features

- Multi-step registration form with email verification
- Subscription plan selection
- Email verification system
- Responsive design
- Containerized development environment

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- Node.js v16+ (for local development)
- npm or yarn (for local development)

## Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 2025_Frontend
    ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)

## Local Development Setup
### Prerequisites
- Clone the repository:
   ```bash
   git clone <repository-url>
   cd 2025_Frontend
   ```
- Copy the `.env.example` file to `.env` in both `front-vue` and `back-node` directories and update the environment variables as needed.
    ```	bash
   cp front-vue/.env.example front-vue/.env
    cp back-node/.env.example back-node/.env
    ```
### Frontend (Vue 3)
1. Navigate to the frontend directory:
   ```bash
   cd front-vue
   ```
2. Install dependencies:
   ```bash
    npm install
    ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the frontend at [http://localhost:5173](http://localhost:5173)
### Backend (Node.js)
1. Navigate to the backend directory:
   ```bash
   cd back-node
   ```
2. Install dependencies:
   ```bash
    npm install
    ```
3. Start the backend server:
    ```bash
    npm run dev
    ```
4. Access the backend API at [http://localhost:3000](http://localhost:3000)