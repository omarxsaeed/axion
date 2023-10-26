# School Management API

This is a school management application built with Express.js, MongoDB, and Redis for caching.

## Table of Contents

- [Getting Started](#getting-started)

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/omarxsaeed/axion.git
   cd axion
   ```

2. **Install Dependencies:**

   Install the project's dependencies using npm:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   ```bash
   cp .env.example .env
   ```

   Then, open `.env` and fill in the environment variables.

4. **Connect to Redis:**

   You have two options to run Redis:

   a. **Run Redis Locally using Command-Line:**

   If you have Redis installed on your local machine, you can start it using the following command:

   ```bash
   redis-server
   ```

   Make sure Redis is configured properly, and you can access it at `redis://localhost:6379`.

   b. **Run Redis via Docker:**

   To start the Redis container, use Docker Compose:

   ```bash
   docker-compose up
   ```

   The Redis server will be accessible at `redis://localhost:6379`.

5. **Run the Application:**

   To start the application, use npm:

   ```bash
   npm start
   ```

   The application will be accessible at http://localhost:5111. (Assuming you didn't provide the `USER_PORT` environment variable)
