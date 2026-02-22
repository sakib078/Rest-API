# 🚀 REST API — Node.js Express Server

A full-stack REST API built with **Node.js**, **Express**, **React**, **MongoDB**, and **Socket.io**. Designed with a decoupled client-server architecture for efficient data handling and real-time communication.

***

## 📐 Architecture

```markdown
![Architecture]((https://github.com/sakib078/Rest-API/blob/main/REST_API.png))
```

***

## ✨ Features

- **Decoupled Architecture** — Client and server are fully separated, enabling independent development, testing, and deployment. 
- **RESTful API** — Clean, well-structured routes and controllers following REST conventions.
- **JWT Authentication** — Secure authentication via `is-auth` middleware and dedicated Auth Controller. 
- **MongoDB Integration** — Persistent data storage with Mongoose models (`User`, `Post`).
- **Real-time Communication** — Socket.io integration for live, bidirectional data streaming.
- **Modular Codebase** — Organized into routes, controllers, models, middleware, and views for scalability.

***

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (App.js, Components, Pages) |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + is-auth Middleware |
| Real-time | Socket.io |

***

## 📁 Project Structure

Based on the architecture diagram, the recommended folder layout is:

```
├── client/                     # Frontend React App
│   ├── src/
│   │   ├── App.js              # Main application entry
│   │   ├── components/         # Reusable UI components
│   │   └── pages/              # Page-level views
│   └── package.json
│
├── server/                     # Backend Node.js Express API
│   ├── config/                 # Database & environment config
│   ├── controllers/
│   │   └── authController.js   # Authentication logic
│   ├── middleware/
│   │   └── is-auth.js          # JWT verification middleware
│   ├── models/
│   │   ├── User.js             # User data model
│   │   └── Post.js             # Post data model
│   ├── routes/                 # API route definitions
│   ├── socket/
│   │   ├── socket.js           # Socket.io setup
│   │   └── views/              # Socket.io view handlers
│   └── server.js               # Express server entry point
│
├── REST_API.jpg                # Architecture diagram
├── package.json
└── README.md
```

This follows the standard MERN stack project structure with clear separation of concerns. [github](https://github.com/UFWebApps/MERN-Template/blob/master/README.md)

***

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rest-api.git
   cd rest-api
   ```
2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```
3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```
4. **Set up environment variables** — Create a `.env` file in `server/`:
   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/rest-api
   JWT_SECRET=your_jwt_secret_key
   ```
5. **Run the application**
   ```bash
   # Terminal 1 — Backend
   cd server && npm start

   # Terminal 2 — Frontend
   cd client && npm start
   ```
   The React app runs on `http://localhost:3000` and the API on `http://localhost:8080`.

***

## 🔗 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| POST | `/auth/signup` | Register a new user | ❌ |
| POST | `/auth/login` | Authenticate & get token | ❌ |
| GET | `/feed/posts` | Fetch all posts | ✅ |
| POST | `/feed/post` | Create a new post | ✅ |
| GET | `/feed/post/:id` | Get a single post | ✅ |
| PUT | `/feed/post/:id` | Update a post | ✅ |
| DELETE | `/feed/post/:id` | Delete a post | ✅ |

***

## 🔐 Authentication Flow

1. User signs up or logs in via the Auth Controller.
2. Server generates a **JSON Web Token (JWT)** upon successful authentication.
3. Client stores the token and sends it in the `Authorization` header for subsequent requests.
4. The `is-auth` middleware verifies the token before granting access to protected routes.

***

## 🌐 Real-time Communication

Socket.io is configured alongside the Express server to enable: 

- **Live updates** — New posts and data changes are broadcast to connected clients instantly.
- **Bidirectional communication** — Both client and server can emit and listen for events.
- **Socket.io Views** — Dedicated handlers manage WebSocket event logic separately from REST routes.

***
