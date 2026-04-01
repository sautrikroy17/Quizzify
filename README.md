# Quizzify AI

Quizzify AI is a modern SaaS platform that leverages Google Generative AI (Gemini) to instantly convert uploaded documents and PDFs into interactive, dynamic quizzes. Built with Next.js, React, and PostgreSQL, the platform allows users to assess their knowledge, track performance across practice and test modes, and compete on a global leaderboard.

🌍 **Live Production URL:** [https://quizzify-ai.vercel.app](https://quizzify-ai.vercel.app)

## 🚀 Key Features
- **Dynamic Quiz Generation:** Upload any PDF/Document (up to 70MB) and let Gemini AI automatically generate multiple-choice questions.
- **Client-Side Parsing:** Bypasses standard server execution limits by safely parsing heavy PDFs locally in the browser with `pdfjs-dist` before sending text securely to the AI API.
- **NextAuth Security:** Secure registration and credential-based authentication.
- **Practice & Test Modes:** Real-time correction in practice mode, or time-enforced assessments in test mode.
- **Global Leaderboards:** Track user high-scores and attempt counts persisted securely via a neon PostgreSQL cloud database.
- **Adaptive Insights:** The dashboard tracks and alerts users to their weakest conceptual topics based on missed questions.

## 🛠 Tech Stack
- **Frontend Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS & Framer Motion (for animations)
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma ORM
- **Authentication:** NextAuth.js
- **Artificial Intelligence:** `@google/generative-ai` (Gemini-2.5-Flash)
- **Hosting / Deployment:** Vercel

## 💻 Running Locally

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root with your credentials:
```env
GEMINI_API_KEY="your_google_gemini_api_key_here"
NEXTAUTH_SECRET="your_nextauth_secret_here"
POSTGRES_PRISMA_URL="your_neon_db_url"
POSTGRES_URL_NON_POOLING="your_neon_direct_url"
```

3. Run the development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with the application locally.
