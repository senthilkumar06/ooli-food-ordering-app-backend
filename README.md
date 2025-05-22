# Oolio Food Ordering App - Backend API

This project is a backend API built with **TypeScript**, **Express**, and **Sequelize**, designed for light-weight food ordering app.

## 📦 Features

-   List products
-   Add product to cart
-   Checkout
    -   Place order
    -   Optionally apply coupon
-   View orders
-   Additional Enhancements
    -   Login/Signup
    -   Guest user access
    -   Containerization
    -   Global Error Handling
    -   Linting

## 🛠 Tech Stack

-   Node.js + Express
-   TypeScript
-   PostgreSQL
-   Sequelize ORM
-   Jest (unit tests)

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm run dev
```

### 🐳 Run with Docker

```bash
docker-compose up --build
```

### 🧪 Running Tests

```bash
npm run test
```

### 🧪 Running Test Coverage

```bash
npm run test:coverage
```

### 📁 Project Structure

```bash
src/
├── modules/        # Feature modules (jobs, contracts, admin, balances.)
├── database/       # Sequelize models and config
├── routes/         # Express route files
├── utils/          # Helpers like cache
├── middlewares/    # Auth.
└── server.ts       # Entry point
```
