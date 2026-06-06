# 🎯 Provably Fair Plinko Lab

A modern Plinko game built with Next.js, TypeScript, Prisma, and SQLite that demonstrates a provably fair gaming system using cryptographic verification.

## 🚀 Features

* Provably Fair Architecture
* Server Seed + Client Seed + Nonce verification
* Commit-Reveal Scheme
* Deterministic Path Generation
* Real Ball Drop Animation
* Winning Bin Calculation
* Round Verification Page
* Sound Effects with Mute Toggle
* Responsive Modern UI
* TypeScript Support
* Prisma ORM
* SQLite Database

---

## 🛠 Tech Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js Route Handlers
* Prisma ORM
* SQLite

### Fairness System

* SHA-256 Hashing
* Commit-Reveal Protocol
* Deterministic Seed Generation

---

## 🎮 How It Works

1. Server generates a secret Server Seed.
2. A Commit Hash is created from the Server Seed.
3. User provides a Client Seed.
4. Server Seed + Client Seed + Nonce generate a Combined Seed.
5. Combined Seed deterministically generates the ball path.
6. The winning bin can be verified later using the same inputs.

---

## 🔐 Provably Fair Workflow

```text
Server Seed
      +
Client Seed
      +
Nonce
      ↓
Combined Seed
      ↓
Deterministic Path Generation
      ↓
Winning Bin
      ↓
Verification
```

The same inputs always produce the same result, allowing players to independently verify fairness.

---

## 📡 API Endpoints

### Create Commit

POST `/api/rounds/commit`

### Start Round

POST `/api/rounds/[id]/start`

### Reveal Round

POST `/api/rounds/[id]/reveal`

### Verify Round

POST `/api/verify`

---

## 🔊 Sound System

* Landing Win Sound
* Sound On / Off Toggle
* Real-time audio feedback during gameplay

---

## 🎨 UI Features

* Modern Dark Theme
* Responsive Design
* Real Falling Ball Animation
* Winning Bin Highlight
* Interactive Verification Flow
* Mobile Friendly Layout

---

## ⚙️ Local Setup

```bash
git clone <repository-url>

cd plinko-lab

npm install

npx prisma generate

npx prisma db push

npm run dev
```

---

## 🏗 Production Build

```bash
npm run build
```

---

## 🤖 AI Usage

AI-assisted development was used for:

* UI refinement
* Debugging assistance
* Documentation support

All final implementation, testing, architecture decisions, and project validation were reviewed and verified manually.

---

## ✨ Project Highlights

* Provably Fair Gaming Logic
* Deterministic Replay Verification
* Cryptographic Commit-Reveal Scheme
* Real Ball Animation
* Sound Effects
* Responsive UI
* Next.js 16 App Router
* TypeScript
* Prisma ORM

---

## 🔮 Future Improvements

* Confetti Effects
* Round History
* Payout Multipliers
* Statistics Dashboard
* Advanced Animations

---

## 👨‍💻 Author

**Sahid Khan**

Associate Full Stack Developer

Built using Next.js, TypeScript, Prisma, SQLite, and Cryptographic Verification Principles.
