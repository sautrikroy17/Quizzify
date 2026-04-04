# 🎨 Frontend — Next.js Application

The frontend of **Quizzify AI** is a full-stack Next.js 16 application using the App Router.
Since Vercel requires `package.json` at the repository root, the frontend lives at the **project root level** (not in a subfolder).

## 📁 Frontend Structure (Root Level)

```
/ (project root)
├── src/
│   ├── app/              ← Next.js App Router pages & API routes
│   │   ├── page.tsx      ← Landing page
│   │   ├── layout.tsx    ← Root layout (TopNav, fonts, metadata)
│   │   ├── login/        ← Auth page (login + register)
│   │   ├── dashboard/    ← User stats & weak topic insights
│   │   ├── forge/        ← PDF upload + quiz generation
│   │   ├── leaderboard/  ← Global leaderboard
│   │   ├── profile/      ← User profile
│   │   └── api/          ← Backend API routes (Next.js Server)
│   │       ├── auth/     ← NextAuth + registration endpoint
│   │       ├── generate/ ← Gemini AI quiz generator
│   │       └── results/  ← Quiz save & results
│   ├── components/       ← Shared React components (TopNav, QuizCard, etc.)
│   └── lib/              ← NextAuth config, Prisma client
├── prisma/               ← Database schema (Neon PostgreSQL)
├── public/               ← Static assets (logo.png, etc.)
├── package.json          ← Dependencies
└── next.config.ts        ← Next.js configuration
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS, custom CSS |
| Auth | NextAuth.js (Credentials) |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Prisma |
| AI | Google Gemini 1.5 Flash |
| Hosting | Vercel |

## 🚀 Run Frontend Locally

```bash
npm install
npm run dev
```
