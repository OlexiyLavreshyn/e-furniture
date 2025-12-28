Full-Stack Web Application

Vite + React + Node.js + MySQL (Docker-ready)

This is a full-stack web application built with Vite + React on the frontend and Node.js (Express) on the backend.
The project follows a service-based structure and uses environment variables for configuration.

Tech Stack
Frontend

React

Vite

JavaScript (ES6+)

Axios

Backend

Node.js

Express

MySQL

bcrypt (password hashing)

JSON Web Tokens (JWT)

dotenv

DevOps / Tooling

Docker & Docker Compose

Git & GitHub

Environment variables (.env)

Running with Docker

If using Docker Compose:

docker-compose up --build

Notes

node_modules and .env are intentionally excluded from Git.

MySQL connection uses pooling, not a single connection.

Designed with scalability and clean separation in mind.
