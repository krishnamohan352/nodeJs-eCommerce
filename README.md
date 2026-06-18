# 📦 Node.js E-Commerce Backend API

A scalable backend API built with **Node.js, Express, MongoDB**, featuring authentication, role-based access control (RBAC), and testing using Jest + MongoMemoryServer.

---

# 🚀 Features

- 🔐 JWT Authentication (Login/Register)
- 👥 Role-Based Access Control (Admin/User/Manager)
- 🧾 Permission management system
- 🗄 MongoDB with Mongoose
- 🧪 Unit & Integration testing (Jest + Supertest)
- 🧠 In-memory MongoDB for testing
- 📦 Modular architecture (MVC + Service layer)

# ⚙️ Setup Instructions

---

## 1. Clone Repository

git clone https://github.com/krishnamohan352/nodeJs-eCommerce.git
cd nodeJs-eCommerce

## 2. Install Dependencies

npm install

## 3. Create Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=ecommerce
JWT_SECRET=ecommerce_secret_key

## 4. Run Server

```bash
npm run dev

## 🌐 Server Information

Server runs on:

http://localhost:4000

# 📡 API Documentation

---

## 🔐 Auth APIs

### Register User
- **Method:** POST  
- **Endpoint:** `/api/auth/register`  
- **Description:** Register a new user

---

### Login User
- **Method:** POST  
- **Endpoint:** `/api/auth/login`  
- **Description:** Login user and generate JWT token

---

## 🧪 Testing Strategy

### ✔ Unit Tests
- Service layer testing
- Business logic validation
- Functions tested in isolation

---

### ✔ Integration Tests
- API endpoint testing using Supertest
- Database operations tested using MongoMemoryServer
- Full request → response flow validation

---

### ✔ End-to-End Tests (Optional)
- Complete user flow testing
- Example: Register → Login → Add to Cart → Place Order