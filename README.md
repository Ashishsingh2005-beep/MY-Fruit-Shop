# 🍎 Ajay Fruit Mart — Full-Stack MERN Application

> **Final Year Project** | Full-Stack E-Commerce with AI/ML Integration

[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-5.0-blue)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-18-cyan)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-lime)](https://nodejs.org)

---

## 🏗️ Project Architecture

```
MERN Stack
├── client/                    ← React.js Frontend (Vite)
│   ├── src/
│   │   ├── pages/             ← Home, Products, Cart, Checkout, Profile, Admin
│   │   ├── components/        ← Navbar, ProductCard, LoginModal, AIChat
│   │   ├── context/           ← AuthContext, CartContext (State Management)
│   │   └── services/api.js    ← Axios API Service Layer
└── server/                    ← Node.js + Express Backend
    ├── config/db.js            ← MongoDB Connection
    ├── models/                 ← Mongoose Schemas (User, Product, Order)
    ├── routes/                 ← auth, products, orders, admin, ai
    ├── middleware/auth.js      ← JWT Middleware
    └── data/products.js       ← Seed Data (50+ products)
```

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | UI Framework |
| Routing | React Router v6 | Client-side routing |
| State | Context API | Auth + Cart state |
| Styling | Vanilla CSS | Premium dark theme |
| HTTP | Axios | API calls |
| Charts | Chart.js + react-chartjs-2 | Analytics |
| Backend | Node.js + Express.js | REST API |
| Database | MongoDB + Mongoose | Data storage |
| Auth | JWT + OTP (Fast2SMS) | Authentication |
| AI Chat | Google Gemini API | AI Assistant |
| Notifications | react-hot-toast | Toast messages |

## ✨ Key Features

### 👤 User Features
- 📱 **OTP Authentication** (Fast2SMS/Twilio)
- 🛒 **Smart Cart** with coupon system
- 📦 **Live Order Tracking** with progress bar
- 💳 **Multiple Payments**: COD, UPI
- 🤖 **AI Chatbot** (Gemini 2.0 Flash)
- 📜 **Order History** with complaint filing
- ✏️ **Profile Management**

### 👨‍💼 Admin Features
- 📊 **Real-time Dashboard** with Chart.js
- 📈 **Revenue Analytics** (7-day trend)
- 🍩 **Order Status** distribution chart
- 🏆 **Top Products** by revenue
- 🔮 **AI Demand Forecast** (next 7 days)
- 👥 **RFM Customer Segmentation**
- 🚫 **User Ban/Unban**
- 📢 **Complaint Resolution**

### 🧠 ML/AI Features
- **Collaborative Filtering** (user recommendations)
- **Dynamic Pricing** (time + season based)
- **Demand Forecasting** (weighted moving average)
- **RFM Analysis** (customer segmentation)
- **AI Freshness Detection**

## 🛠️ How to Run

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Step 1: Start MongoDB
```bash
# Local MongoDB
mongod
# OR use MongoDB Atlas (update MONGO_URI in server/.env)
```

### Step 2: Configure Environment
```bash
# Edit server/.env
MONGO_URI=mongodb://localhost:27017/ajay_fruit_mart
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key    # Optional for AI chat
FAST2SMS_API_KEY=your_key         # Optional for real SMS
```

### Step 3: Start Backend
```bash
cd server
npm run dev
# Server: http://localhost:5000
```

### Step 4: Start Frontend
```bash
cd client
npm run dev
# Frontend: http://localhost:5173
```

### Step 5: Access
| URL | Purpose |
|-----|---------|
| http://localhost:5173 | Main Shop |
| http://localhost:5173/admin | Admin Dashboard (password: admin123) |
| http://localhost:5000/api/health | Backend Health Check |

## 📊 API Endpoints

```
POST  /api/auth/send-otp          Send OTP
POST  /api/auth/verify-otp        Verify OTP & Login
GET   /api/auth/me                Get current user
PUT   /api/auth/profile           Update profile

GET   /api/products               Get products (with filters)
GET   /api/products/:id           Get single product
POST  /api/products/:id/rate      Rate a product

POST  /api/orders                 Place order
GET   /api/orders/my              Get my orders
GET   /api/orders/:id             Get order detail
POST  /api/orders/:id/cancel      Cancel order
POST  /api/orders/:id/complaint   File complaint

POST  /api/admin/login            Admin login
GET   /api/admin/stats            Dashboard stats
GET   /api/admin/analytics        Charts data
GET   /api/admin/orders           All orders
GET   /api/admin/users            All users (RFM)
GET   /api/admin/demand-forecast  AI Forecast

POST  /api/ai/chat                AI Chatbot
GET   /api/ai/recommendations     Personalized recs
```
