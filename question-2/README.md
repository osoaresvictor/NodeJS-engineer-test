
# Customer CRUD API  - Fastify Project

## Table of Contents
- [Customer CRUD API  - Fastify Project](#customer-crud-api----fastify-project)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [API Endpoints](#api-endpoints)
    - [Create a Customer](#create-a-customer)
    - [Get All Customers](#get-all-customers)
    - [Get Customer by ID](#get-customer-by-id)
    - [Update Customer by ID](#update-customer-by-id)
    - [Delete Customer by ID](#delete-customer-by-id)
  - [Setup and Running](#setup-and-running)
    - [Using Docker](#using-docker)
    - [Running Locally](#running-locally)
  - [Testing](#testing)

## Project Overview
The project is a CRUD (Create, Read, Update, Delete) REST API for managing customer information (Note: when registering a new customer, his address is fetched using his ZIP code via this API `https://cep.awesomeapi.com.br/json/:cep`). The API is built using Fastify, a fast and low-overhead web framework for Node.js.

## Technologies Used
- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Fastify**: Web framework for Node.js.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Jest**: JavaScript testing framework.
- **Docker**: Platform for developing, shipping, and running applications in containers.
- **Docker Compose**: Tool for defining and running multi-container Docker applications.
- **ESLint**: Tool for identifying and fixing problems in JavaScript code.
- **Prettier**: Code formatter.
- **Swagger**: API Documentation.

## Project Structure
- **/src**: Contains the application source code.
  - **/api-clients**: Clients for interacting with external APIs.
  - **/config**: Application configuration files.
  - **/controllers**: Controllers managing HTTP requests.
  - **/exceptions**: Custom exceptions used in the application.
  - **/models**: Data models.
  - **/repositories**: Data access repositories.
  - **/routes**: Application route definitions.
  - **/schemas**: Data validation schemas.
  - **/services**: Business logic.
  - **/utils**: Utility functions.
- **/test**: Contains unit and integration tests.
  - **/integration**: Integration tests.
  - **/unit**: Unit tests.

## API Endpoints
### Create a Customer
- **POST /customers**
  ```bash
  curl -X POST http://localhost:3000/customers -H "Content-Type: application/json" -d '{"name": "Victor Test", "email": "victor-soares@example.com", "zipCode": "01001001"}'
  ```

### Get All Customers
- **GET /customers**
  ```bash
  curl -X GET http://localhost:3000/customers
  ```

### Get Customer by ID
- **GET /customers/:id**
  ```bash
  curl -X GET http://localhost:3000/customers/1
  ```

### Update Customer by ID
- **PUT /customers/:id**
  ```bash
  curl -X PUT http://localhost:3000/customers/1 -H "Content-Type: application/json" -d '{"name": "Jane Doe", "email": "jane@example.com", "zipCode": "01310200"}'
  ```

### Delete Customer by ID
- **DELETE /customers/:id**
  ```bash
  curl -X DELETE http://localhost:3000/customers/1
  ```

## Setup and Running
### Using Docker
1. Ensure Docker and Docker Compose are installed.
2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

### Running Locally
1. Install dependencies:
   ```bash
   yarn install
   ```
2. Start the application:
   ```bash
   yarn dev
   ```

## Testing
To run the tests, use:
```bash
yarn test
```
