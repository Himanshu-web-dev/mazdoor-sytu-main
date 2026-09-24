# Mazdoor Sytu — Backend REST API

Production-ready backend architecture for the **Mazdoor Sytu** Skilled Workforce & Hyperlocal Service Platform. Built with Node.js, Express, Firebase Firestore, and JWT authentication.

---

## Architecture

```
backend/
├── src/
│   ├── config/
│   │   ├── env.js                # Centralized environment loader
│   │   └── firebase.js           # Firebase Admin SDK & fallback mock store
│   ├── controllers/              # 17 Domain controllers
│   ├── middleware/               # Auth, RBAC, Rate limiter, Validators, Error handlers
│   ├── routes/                   # 17 REST API route modules
│   ├── services/                 # 13 Core business logic services
│   ├── utils/                    # Constants, responses, logger, ID generators, helpers
│   ├── validators/               # Schema and payload validation rules
│   ├── app.js                    # Express app configuration & route mounting
│   └── server.js                 # HTTP listener & graceful shutdown
├── .env.example                  # Environment configuration template
├── package.json
└── README.md
```

---

## Core Business & Financial Logic

### 1. Booking & Pricing Flow
* **₹99 Advance Booking Fee**: Paid upfront by customer to lock booking and eliminate fake requests.
* **On-Site Labour Confirmation**: Labour rate confirmed upon inspection.
* **₹99 Advance Adjusted**: The ₹99 paid in advance is deducted directly from the confirmed labour charge.
* **Materials Handled Separately**: Billed at 100% actual store cost with **0% platform markup**.
* **10% Platform Commission on Labour**: Sytu deducts strictly 10% on labour only; materials remain untouched.

### 2. 4-Tier Cancellation & Refund Policy
* **Stage 1 (Before worker acceptance)**: 100% full refund with zero deductions.
* **Stage 2 (After worker acceptance, before travel)**: 50% refund (50% compensates worker's reserved schedule).
* **Stage 3 (Worker on the way)**: 20% refund (covers worker's transit and route reservation).
* **Stage 4 (Worker arrived on site)**: 0% refund (full service fee compensates worker's completed travel and time).

---

## Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run the Server
```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

---

## API Catalog (`/api/v1`)

| Module | Route Prefix | Key Endpoints | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/v1/auth` | `POST /signup`, `POST /login`, `GET /me` | Registration, login, profile check |
| **Users** | `/api/v1/users` | `GET /profile`, `PUT /profile` | Customer account details |
| **Workers** | `/api/v1/workers` | `GET /search`, `GET /:id`, `PUT /availability` | Directory, profiles, availability |
| **Businesses** | `/api/v1/businesses`| `GET /`, `PUT /profile`, `GET /:id/requirements` | Corporate workforce management |
| **Services** | `/api/v1/services` | `GET /`, `GET /categories` | Trade catalog and standard rate cards |
| **Jobs** | `/api/v1/jobs` | `GET /`, `POST /`, `GET /:id` | Requirement postings & search |
| **Applications** | `/api/v1/applications`| `POST /`, `GET /job/:jobId`, `PUT /:id/status`| Worker applications to jobs |
| **Bookings** | `/api/v1/bookings` | `POST /`, `GET /my-bookings`, `PUT /:id/stage`, `POST /:id/cancel`, `POST /:id/complete` | Booking state machine, ₹99 advance, OTP |
| **Estimates** | `/api/v1/estimates`| `POST /`, `GET /booking/:bookingId`, `PUT /:estimateId/approval` | On-site material & labour quotes |
| **Payments** | `/api/v1/payments` | `POST /process`, `GET /:id` | Final invoice payments & UPI escrow |
| **Wallets** | `/api/v1/wallets` | `GET /my-wallet`, `POST /withdraw` | Worker earnings and bank withdrawals |
| **Messages** | `/api/v1/messages` | `POST /send`, `GET /conversation/:userId` | In-app direct messaging |
| **Reviews** | `/api/v1/reviews` | `POST /`, `GET /worker/:workerId` | Ratings, feedback, star aggregates |
| **Complaints** | `/api/v1/complaints`| `POST /`, `GET /my-complaints`, `PUT /:id/resolve` | Grievance ticketing & resolution |
| **Notifications**| `/api/v1/notifications`| `GET /`, `PUT /:id/read` | Push alert notifications feed |
| **Documents** | `/api/v1/documents`| `POST /upload`, `GET /my-documents` | Aadhaar & trade certificate KYC uploads |
| **Admin** | `/api/v1/admin` | `GET /dashboard-stats`, `PUT /kyc/:docId`, `GET /complaints` | Platform metrics & KYC approval queue |
| **Health** | `/api/health` | `GET /api/health` | System health check & uptime probe |
