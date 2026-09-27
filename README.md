# Nextora.ai — AI Career Consultant for Working Professionals

> **"Tell us where you are. Tell us where you want to go. We'll show you how to get there."**

Nextora is a full-stack, production-quality AI-powered career consulting platform designed specifically for working professionals. It bridges the gap between where a professional is today and where they want to go by analyzing transferable skills, calculating real skill gaps, constructing staged roadmaps, and providing a long-term AI Career Consultant that maintains full contextual awareness.

---

## 1. Product Features & Architecture

* **Conversational Career Assessment**: Step-by-step 8-stage interactive consultant intake (Current profession, education, goals, interests, time availability, budget, and real-life constraints).
* **AI Analysis Engine**: Follows a strict 13-stage reasoning pipeline to determine transferable assets vs. real skill deficits. Conforms to a strict validated JSON schema.
* **Pre-Payment Diagnostic Preview**: Free assessment preview highlighting current position, identified direction, pathways, and detected gaps before paywall.
* **₹49 Razorpay Payment Integration**:
  * Server-side order creation (`/api/payment/create-order`).
  * Cryptographic HMAC-SHA256 signature verification (`/api/payment/verify`).
  * Idempotent webhook listener (`/api/payment/webhook`).
  * Instant mock testing checkout simulation for local development without live merchant credentials.
* **Interactive Phased Roadmap**: Visual multi-phase milestones with hour estimates, deliverable definitions, and task completion checklists (`Not Started`, `In Progress`, `Completed`) with dynamic overall progress % calculation.
* **Skill Gap Matrix & Transferable Assets**: Visual table mapping current level vs. required level, gap severity, priority, and concrete bridging strategies.
* **Curated Learning & Certifications**: Distinguishes AI-generated estimates from verified sources, aligned with user budget constraints.
* **Context-Aware AI Career Consultant**: Dedicated 1-on-1 AI chat retaining full context of the user's background, target role, timeline, and budget.
* **Multi-Assessment Management**: Save, view, and switch between multiple career transition roadmaps.
* **Admin Analytics Portal**: Executive metrics tracking total users, assessments, unlocked reports, revenue in ₹, and popular career transitions.

---

## 2. Technology Stack

* **Framework**: Next.js 14 (App Router, Server Components & Route Handlers)
* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
* **Database & ORM**: PostgreSQL / SQLite via Prisma ORM
* **Authentication**: Stateless, cryptographically signed JSON Web Tokens (JWT) using `jose` with HTTP-Only secure cookies and `bcryptjs` password hashing
* **AI Engine**: OpenAI API (`gpt-4o-mini` / `gpt-4o`) with structured JSON schema adherence + resilient expert synthesis engine fallback
* **Payment Gateway**: Razorpay SDK with server-side HMAC-SHA256 signature verification

---

## 3. Folder Structure

```
nextora/
├── prisma/
│   ├── schema.prisma       # Prisma schema (User, Assessment, Payment, CareerRoadmap, Conversation)
│   └── seed.js             # Demo scenarios seed script (Sales->PM, Sales->Dev, Admin)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/       # register, login, logout, me
│   │   │   ├── assessment/ # save, [id] details
│   │   │   ├── payment/    # create-order, verify, webhook
│   │   │   ├── roadmap/    # generate, [id]/progress
│   │   │   ├── chat/       # AI Career Consultant context chat
│   │   │   └── admin/      # platform analytics
│   │   ├── auth/           # /sign-in, /sign-up
│   │   ├── assessment/     # Multi-step assessment wizard & /preview
│   │   ├── payment/        # Razorpay checkout modal & verification
│   │   ├── dashboard/      # Overview, /roadmap, /skills, /learning, /education, /timeline, /chat, /assessments, /settings, /admin
│   │   ├── globals.css     # Tailwind & custom scrollbars
│   │   ├── layout.tsx      # Root HTML layout with Razorpay checkout script
│   │   └── page.tsx        # High-converting SaaS landing page
│   ├── components/
│   │   └── DashboardLayoutClient.tsx # Client dashboard shell & context provider
│   └── lib/
│       ├── auth.ts         # JWT tokens & cookie management
│       ├── demo-data.ts    # Scenario 1 (Sales -> PM) & Scenario 2 (Sales -> Web Dev)
│       ├── openai.ts       # AI prompts, structured JSON schema & consultant engine
│       ├── prisma.ts       # Singleton Prisma client instance
│       ├── razorpay.ts     # Razorpay orders, HMAC signature verification & webhooks
│       └── types.ts        # Strict TypeScript interfaces
├── tests/
│   └── test-suite.js       # Automated test suite
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 4. Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Prisma SQLite for local zero-config, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# Authentication Secret (JWT and cookie signing)
AUTH_SECRET="nextora-super-secret-jwt-key-for-session-management-2026"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OpenAI API Key (Backend AI Engine)
OPENAI_API_KEY=""

# Razorpay Credentials (Payment Integration)
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
NEXT_PUBLIC_RAZORPAY_KEY_ID=""

# Enable Development/Testing Payment Mode (Allows instant test checkout when live credentials are not set)
NEXT_PUBLIC_ENABLE_MOCK_PAYMENT="true"
```

---

## 5. Local Setup & Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Database
```bash
npx prisma db push
```

### Step 3: Seed Sample Scenarios
```bash
node prisma/seed.js
```

### Step 4: Run Automated Tests
```bash
node tests/test-suite.js
```

### Step 5: Start Local Development Server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 6. Pre-Configured Test Accounts (1-Click Login)

The seed script creates three pre-configured accounts:

| User | Email | Password | Role | Scenario Details |
|---|---|---|---|---|
| **Rohan Sharma** | `demouser@nextora.ai` | `Demo1234!` | User | Enterprise Sales Manager (5 yrs, FinTech, MBA) → Product Manager (7 hrs/wk, ₹15,000 budget, 9 months) |
| **Pooja Verma** | `developer@nextora.ai` | `Demo1234!` | User | Inside Sales Executive (4 yrs) → Full-Stack Web Developer (10 hrs/wk, ₹10,000 budget, 8-10 months) |
| **Administrator** | `admin@nextora.ai` | `Admin1234!` | Admin | Access to `/dashboard/admin` with live revenue, user stats, and roadmap metrics |

---

## 7. Razorpay Payment Architecture & Webhooks

### Payment Flow:
1. User completes free assessment.
2. User sees `/assessment/preview` teaser diagnostic.
3. User clicks **"Unlock Full Career Roadmap — ₹49"**.
4. Client requests `/api/payment/create-order` → Server registers a `PENDING` payment and creates a Razorpay Order (`amount: 4900` paise = ₹49.00).
5. Razorpay Checkout modal handles payment.
6. Upon completion, callback sends `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to `/api/payment/verify`.
7. Server validates signature using HMAC-SHA256:
   ```ts
   crypto.createHmac("sha256", secret).update(orderId + "|" + paymentId).digest("hex") === signature
   ```
8. On verification success:
   * Payment marked `SUCCESS`.
   * Assessment marked `isPaid: true`.
   * AI roadmap is generated and stored in the database.
   * User is redirected to `/dashboard`.

### Webhook Configuration:
* Endpoint: `https://your-domain.com/api/payment/webhook`
* Events: `payment.captured`, `order.paid`
* Set secret in environment: `RAZORPAY_WEBHOOK_SECRET`

---

## 8. AI Prompt Architecture & Cost Control

1. **Structured Reasoning Pipeline**:
   * Assessment Intake → Experience Deconstruction → Transferable Asset Extraction → Target Role Requirements Mapping → Gap Identification → Budget & Time Constrained Phasing → Concrete Deliverables.
2. **Strict JSON Schema**: AI responses are validated against a strict schema before DB persistence.
3. **Cost Control & Caching**: Roadmaps are generated **once** upon payment verification and cached in the database. Opening the dashboard does **not** make unnecessary OpenAI calls. Regeneration only occurs when the user explicitly requests parameter modification.
4. **Context Window Strategy**: The AI Career Consultant chat injects a structured summary of the user's active roadmap rather than sending raw unformatted text, maximizing token efficiency.

---

## 9. Production Deployment

* **Vercel**: Deploy directly by importing your repository and configuring environment variables.
* **Production Database**: Replace `file:./dev.db` with a connection string to PostgreSQL (e.g. Supabase, Neon, AWS RDS) and change `provider = "postgresql"` in `prisma/schema.prisma`.

---

## 10. License

Nextora is proprietary software. All rights reserved.
