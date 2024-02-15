# School Management API

This is a school management application built with Express.js, MongoDB, and Redis for caching.

## Table of Contents

- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)

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

## API Documentation

Below is the link to the API documentation for the School Management System on Postman. the documentation contains the endpoints, request and response examples, and the expected status codes.

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/28492673-9a6ef128-5d1d-41d7-8fd7-68be9b88732e?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D28492673-9a6ef128-5d1d-41d7-8fd7-68be9b88732e%26entityType%3Dcollection%26workspaceId%3D926bf79c-8187-45f8-b2b6-3f869d417cdc)
