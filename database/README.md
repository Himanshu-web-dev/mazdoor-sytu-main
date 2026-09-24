# Mazdoor Sytu — Database Architecture & Schema Specification

Centralized database schemas, Firebase Firestore security rules, Cloud Storage structure, and seed datasets for the **Mazdoor Sytu** platform.

---

## Architecture

```
database/
├── firestore/
│   ├── collections/              # 16 Production JSON Schemas
│   │   ├── users.schema.json
│   │   ├── workers.schema.json
│   │   ├── businesses.schema.json
│   │   ├── services.schema.json
│   │   ├── jobs.schema.json
│   │   ├── applications.schema.json
│   │   ├── bookings.schema.json
│   │   ├── estimates.schema.json
│   │   ├── messages.schema.json
│   │   ├── payments.schema.json
│   │   ├── wallets.schema.json
│   │   ├── reviews.schema.json
│   │   ├── complaints.schema.json
│   │   ├── notifications.schema.json
│   │   ├── documents.schema.json
│   │   └── adminLogs.schema.json
│   │
│   ├── seed/
│   │   ├── services.json         # 8 Standard trade catalog items & rate cards
│   │   └── admin.json            # Default platform administrator credentials
│   │
│   └── indexes.json              # Composite index query configurations
│
├── storage/
│   └── folders.md                # Cloud Storage bucket layout & upload constraints
│
├── rules/
│   ├── firestore.rules           # Strict role-based Firestore access controls
│   └── storage.rules             # File upload type & size access policies
│
├── firebase.json                 # Firebase CLI deployment configuration
├── firestore.indexes.json        # Root composite index mapping for Firebase CLI
└── README.md                     # Documentation
```

---

## 16 Core Collections & Data Flow

```
[ users ] (Customer / Worker / Business / Admin)
    │
    ├── 1:1 ──► [ workers ] (Trade skills, location, live availability, rating)
    │
    ├── 1:1 ──► [ businesses ] (GSTIN, company verification, active requirements)
    │
    ├── 1:N ──► [ bookings ] (Doorstep requests with ₹99 advance)
    │               │
    │               ├── 1:1 ──► [ estimates ] (On-site labour quote + materials at actuals)
    │               │
    │               └── 1:1 ──► [ payments ] (Final invoice, ₹99 adjusted, 10% commission)
    │                               │
    │                               └── 1:1 ──► [ wallets ] (Worker earnings & withdrawal ledger)
    │
    ├── 1:N ──► [ jobs ] (Posted workforce requirements)
    │               │
    │               └── 1:N ──► [ applications ] (Worker applications to job postings)
    │
    ├── 1:N ──► [ messages ] (Direct customer ↔ worker chat)
    ├── 1:N ──► [ reviews ] (Post-completion ratings & feedback)
    ├── 1:N ──► [ complaints ] (Grievance tickets & dispute resolution)
    ├── 1:N ──► [ notifications ] (Push alert feeds)
    ├── 1:N ──► [ documents ] (Aadhaar & vocational trade KYC)
    └── 1:N ──► [ adminLogs ] (Immutable security audit trail)
```

---

## Collection Directory Reference

| Collection | Schema File | Purpose |
| :--- | :--- | :--- |
| **`users`** | `users.schema.json` | Core account authentication and role classification |
| **`workers`** | `workers.schema.json` | Detailed artisan profile, availability toggle, and ratings |
| **`businesses`** | `businesses.schema.json` | Enterprise contracting profile and GST status |
| **`services`** | `services.schema.json` | Catalog of verified trades (Electrician, Plumber, etc.) |
| **`jobs`** | `jobs.schema.json` | Business bulk requirement postings and daily wage cards |
| **`applications`** | `applications.schema.json` | Worker applications and candidate hiring stages |
| **`bookings`** | `bookings.schema.json` | Full doorstep service lifecycle with ₹99 advance & OTP |
| **`estimates`** | `estimates.schema.json` | On-site diagnostics, material list, and customer approval |
| **`messages`** | `messages.schema.json` | Real-time chat messages between parties |
| **`payments`** | `payments.schema.json` | Financial transactions, 10% commission, and invoice logs |
| **`wallets`** | `wallets.schema.json` | Worker balance, earnings history, and bank payouts |
| **`reviews`** | `reviews.schema.json` | Star ratings and customer workmanship feedback |
| **`complaints`** | `complaints.schema.json` | Customer/worker disputes and resolution notes |
| **`notifications`**| `notifications.schema.json` | Real-time alert messages and status updates |
| **`documents`** | `documents.schema.json` | Worker Aadhaar, ITI diploma, and police verification |
| **`adminLogs`** | `adminLogs.schema.json` | Immutable audit log of administrative decisions |

---

## Deploying to Firebase

To deploy these rules and indexes directly to your Firebase project:

```bash
# Login to Firebase
firebase login

# Select or switch project
firebase use mazdoor-setu

# Deploy Firestore rules & indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage
```
