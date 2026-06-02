# SkillSphere — Intelligent Hyperlocal Freelance Ecosystem

> Full-stack MERN platform by Nayoda | Project Review: June 3, 2026

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # runs on :5000
```

### Frontend
```bash
cd frontend
npm install
npm start              # runs on :3000
```

---

## Project Structure

```
skillsphere/
├── backend/
│   ├── config/           # DB, Passport, Cloudinary
│   ├── controllers/      # Business logic
│   ├── middleware/        # Auth, upload, validate
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── socket/           # Socket.IO handlers
│   ├── utils/            # Email, notifications, helpers
│   └── server.js         # Entry point
└── frontend/
    └── src/
        ├── api/          # Axios + Socket.IO clients
        ├── hooks/        # useAuth, useSocket
        ├── pages/        # Login, Register, ...
        ├── store/        # Redux Toolkit slices
        └── App.jsx
```

---

## API Reference

### Auth  `POST /api/auth/*`
| Method | Route | Description |
|--------|-------|-------------|
| POST | /register | Register (client/freelancer) |
| POST | /login | Login + JWT |
| POST | /verify-2fa | 2FA verification |
| GET | /verify-email/:token | Email verify |
| POST | /forgot-password | Send reset email |
| PUT | /reset-password/:token | Reset password |
| POST | /refresh-token | Refresh JWT |
| POST | /logout | Logout |
| POST | /setup-2fa | Get 2FA QR secret |
| POST | /enable-2fa | Enable 2FA |
| GET | /google | Google OAuth |

### Gigs  `GET/POST /api/gigs`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | / | Public | List gigs (filter/search) |
| GET | /:id | Public | Get gig detail |
| POST | / | Client | Create gig |
| PUT | /:id | Client | Update gig |
| DELETE | /:id | Client/Admin | Delete gig |
| GET | /my | Client | My gigs |
| POST | /:id/invite/:fId | Client | Invite freelancer |

### Proposals  `POST /api/proposals`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /gig/:gigId | Freelancer | Submit proposal |
| GET | /gig/:gigId | Client | View proposals |
| GET | /my | Freelancer | My proposals |
| PUT | /:id/accept | Client | Accept |
| PUT | /:id/reject | Client | Reject |

### Payments  `POST /api/payments`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /create-order | Client | Razorpay order |
| POST | /verify | Client | Verify & capture |
| GET | /history | Any | Transaction history |

### Admin  `GET/PUT /api/admin`  _(admin only)_
- GET /dashboard — Stats + analytics
- GET /users — All users
- PUT /users/:id/suspend — Suspend/unsuspend
- PUT /freelancers/:id/verify — Verify freelancer
- GET /disputes — All disputes
- PUT /disputes/:id/resolve — Resolve dispute
- PUT /gigs/:id/approve — Approve/reject gig

---

## Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `notification` | Server→Client | Real-time notification |
| `new_message` | Server→Client | Incoming message |
| `typing_start` | Client→Server | Start typing |
| `typing_stop` | Client→Server | Stop typing |
| `message_read` | Bidirectional | Read receipt |
| `user_online` | Broadcast | User came online |
| `user_offline` | Broadcast | User went offline |
| `join_gig` | Client→Server | Join gig room |
| `gig_update` | Bidirectional | Project progress |

---

## Database Collections
`Users` · `Freelancers` · `Gigs` · `Proposals` · `Reviews` · `Messages` · `Payments` · `Notifications` · `Disputes`

## Tech Stack
**Frontend:** React 18, Redux Toolkit, React Query, Tailwind CSS, Socket.IO client  
**Backend:** Node.js, Express.js, MongoDB Atlas, Socket.IO, JWT, Passport.js  
**Services:** Razorpay, Cloudinary, Nodemailer, Speakeasy (2FA)
