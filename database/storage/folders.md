# Mazdoor Sytu — Firebase Cloud Storage Folder Architecture

This document defines the storage bucket structure, security access policies, and file format requirements for all binary and media assets in Mazdoor Sytu.

---

## Storage Bucket Layout

```
gs://<mazdoor-sytu-storage-bucket>/
│
├── avatars/
│   ├── customers/{userId}.webp           # Customer profile pictures (Max 2MB)
│   ├── workers/{workerId}.webp           # Worker profile headshots (Max 2MB)
│   └── businesses/{businessId}.webp      # Corporate logos & branding (Max 2MB)
│
├── kyc/
│   ├── aadhaar/
│   │   ├── {workerId}_front.{ext}        # Aadhaar card front (Encrypted read, admin/owner only)
│   │   └── {workerId}_back.{ext}         # Aadhaar card back (Encrypted read, admin/owner only)
│   │
│   ├── certificates/
│   │   └── {workerId}_{certId}.pdf       # ITI trade diplomas & UP Skill Dev certificates
│   │
│   └── police_verification/
│       └── {workerId}_pcc.pdf            # Police clearance certificate
│
├── estimates/
│   └── receipts/{bookingId}/             # Hardware store actual receipts uploaded by worker
│       └── {receiptId}.jpg               # 0% markup verification proof
│
├── complaints/
│   └── evidence/{complaintId}/           # Site damage photos or dispute evidence
│       └── {imageId}.jpg
│
└── invoices/
    └── generated/{year}/{month}/         # Automated tax invoices (PDF)
        └── INV-{bookingId}.pdf
```

---

## File Upload Constraints & Policies

| Category | Allowed MIME Types | Max Size | Access Tier |
| :--- | :--- | :--- | :--- |
| **Profile Avatars** | `image/jpeg`, `image/png`, `image/webp` | 2 MB | Public read, Owner write |
| **KYC Aadhaar & IDs** | `image/jpeg`, `image/png`, `application/pdf` | 5 MB | Admin read/write, Owner write only |
| **Trade Certificates**| `application/pdf`, `image/jpeg` | 5 MB | Admin read/write, Owner write |
| **Material Receipts** | `image/jpeg`, `image/png` | 4 MB | Customer & Worker on Booking read, Worker write |
| **Dispute Photos** | `image/jpeg`, `image/png` | 5 MB | Complainant & Admin read/write |
| **Tax Invoices** | `application/pdf` | 2 MB | Customer, Worker, Admin read |
