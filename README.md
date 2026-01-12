# API Throttling by User Tier – Backend

This repository contains the **backend implementation** for user-tier–based API throttling.

The system enforces **rate limits per authenticated user**, based on their subscription tier, using **Redis**.

---

## 🚀 Features

- Node.js + TypeScript + Express
- JWT Authentication (Access & Refresh tokens)
- MongoDB for persistent user data
- Redis for rate limiting
- User tiers:
  - FREE → 20 requests / minute
  - PREMIUM → 100 requests / minute
- Rate limiting enforced per **user ID** (not IP)
- Immediate tier change using JWT re-issuance
- Rate-limit headers included in API responses

---

## 🧱 Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB
- Redis
- JWT
- Zod (validation)

---

## 📁 Project Structure

```txt
src/
├── app.ts
├── server.ts
├── config/
├── modules/
├── middlewares/
├── utils/
├── constants/
└── types/
``` 
## 🔐 Environment Variables

Create a `.env` file in the root of the backend project and add the following:

```env
PORT=8000
FRONTEND_URL=http://localhost:5173

MONGO_URI=mongodb://localhost:27017/rate-limit-demo
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_jwt_secret
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```


  ## ▶️ Running the Backend Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB & Redis
Make sure both **MongoDB** and **Redis** services are running locally.

### 3. Start the Server (Development)
```bash
npm run dev
```

Server will start at:

```
http://localhost:8000
```

---

## 🔁 Important API Endpoints

### 🔐 Authentication

| Method | Endpoint |
|--------|----------|
| POST   | /api/auth/signup |
| POST   | /api/auth/login |
| POST   | /api/auth/refresh-token |
| POST   | /api/auth/logout |

---

### 🚦 Rate Limit Test

| Method | Endpoint |
|--------|----------|
| GET    | /api/test-rate-limit |

> Requires authentication

---

### 👤 User Tier Toggle (Testing / Demo)

| Method | Endpoint |
|--------|----------|
| PATCH  | /api/users/tier |

#### Request Body
```json
{
  "tier": "FREE" | "PREMIUM"
}
```

⚠️ **Tier toggle is for testing/demo purposes only.**

---

## 📊 Rate Limit Headers

Each rate-limited response includes the following headers:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`


