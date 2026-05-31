<div align="center">
  <h1>🧠 Quizzify AI</h1>
  <b>The fastest way to master any subject.</b><br/>
  Transform any PDF into an interactive, competitive assessment in seconds using Gemini AI.
  
  <br/><br/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
  [![C++ Backend](https://img.shields.io/badge/C++-Engine-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)]()
  [![GSSoC'26](https://img.shields.io/badge/GSSoC'26-Open_Source-orange?style=for-the-badge&logo=girlscript)](https://gssoc.girlscript.tech/)
</div>
<br/>

🌍 **Live Production URL:** [https://quizzify-ai.vercel.app](https://quizzify-ai.vercel.app)

---

## 📁 Repository Structure

```
Quizzify/
├── frontend/             ← Frontend documentation (Next.js app lives at root)
├── backend/              ← C++ OOP Core Engine
│   ├── QuizzifyCore.cpp  ← Full OOP demonstration (Abstraction, Inheritance, Polymorphism)
│   └── README.md
├── src/                  ← Next.js App Source Code
│   ├── app/              ← Pages + API Routes (App Router)
│   │   ├── page.tsx      ← Landing page
│   │   ├── layout.tsx    ← Root layout with logo & nav
│   │   ├── login/        ← Email authentication (login + register)
│   │   ├── dashboard/    ← Adaptive learning insights
│   │   ├── forge/        ← PDF → AI Quiz generator
│   │   ├── leaderboard/  ← Global competitive rankings
│   │   ├── profile/      ← User stats & profile
│   │   └── api/          ← REST API routes
│   │       ├── auth/     ← NextAuth + email-validated registration
│   │       ├── generate/ ← Gemini AI question generation
│   │       └── results/  ← Quiz result persistence
│   ├── components/       ← Shared UI components (TopNav, QuizCard, etc.)
│   └── lib/              ← NextAuth config, Prisma client
├── prisma/               ← PostgreSQL schema (Neon)
├── public/               ← Static assets (logo, icons)
├── package.json          ← Node.js dependencies
└── next.config.ts        ← Next.js + Vercel config
```

---

## 🚀 Key Features

- **Dynamic Quiz Generation:** Upload any PDF/Document and let Gemini 1.5 Flash automatically generate multiple-choice questions with configurable difficulty and count.
- **Client-Side PDF Parsing:** Bypasses server execution limits by parsing PDFs locally in the browser with `pdfjs-dist` before sending text securely to the AI API.
- **Secure Email Authentication:** NextAuth.js credential-based auth with deep email validation (MX record check, disposable domain detection) to block fake accounts.
- **Practice & Test Modes:** Real-time correction in Practice mode, or time-enforced competitive Test mode that affects leaderboard scores.
- **Global Leaderboard:** Track user high-scores and quiz counts, persisted in a Neon PostgreSQL serverless database.
- **Adaptive Insights Dashboard:** Automatically identifies and tracks your weakest conceptual topics based on missed questions.
- **C++ OOP Backend Engine:** A C++ core that mirrors the platform's domain model, demonstrating advanced OOP patterns (see `backend/`).

---

## 🧱 C++ OOP Backend Engine (`/backend`)

The `backend/` folder contains `QuizzifyCore.cpp` — a C++ demonstration of the platform's architecture using core OOP principles:

| Concept | Implementation |
|---------|----------------|
| **Encapsulation** | `Question` class with private fields |
| **Abstraction** | `IMeasurable` interface + `Assessment` abstract class |
| **Inheritance** | `PracticeQuiz`, `CompetitiveTest` → `Assessment`; `Student`, `Admin` → `User` |
| **Polymorphism** | Virtual `conductAssessment()` + dynamic dispatch |
| **Smart Pointers** | `unique_ptr<Assessment>` for memory safety |

```bash
# Compile and run the C++ engine
g++ -std=c++17 -o backend/QuizzifyCore backend/QuizzifyCore.cpp
./backend/QuizzifyCore
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Next.js 16 (App Router) + React 19 |
| **Styling** | Tailwind CSS + custom CSS animations |
| **Authentication** | NextAuth.js (JWT + Credentials) |
| **Database** | PostgreSQL (Neon Serverless) |
| **ORM** | Prisma |
| **AI Engine** | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| **Email Validation** | `deep-email-validator` (MX + disposable check) |
| **PDF Parsing** | `pdfjs-dist` v3 (browser-side, Safari compatible) |
| **Backend OOP Demo** | C++17 (see `/backend`) |
| **Deployment** | Vercel (auto-deploy from GitHub `main`) |

---

## 🤝 Contributing (GSSoC Welcome!)

We encourage contributions from the open-source community, particularly from **GirlScript Summer of Code (GSSoC)** participants! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 💻 Running Locally

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/sautrikroy17/Quizzify.git
cd Quizzify
npm install
```

2. Create a `.env` file in the root with your credentials:
```env
GEMINI_API_KEY="your_google_gemini_api_key_here"
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"
POSTGRES_PRISMA_URL="your_neon_db_pooling_url"
POSTGRES_URL_NON_POOLING="your_neon_direct_url"
```

3. Push the Prisma schema to your database:
```bash
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

Navigate to `http://localhost:3000` to interact with the application locally.

---

## 🔐 Authentication Flow

1. User registers with full name, email, and password
2. Email is validated: format check → MX record lookup → disposable domain block
3. Password is bcrypt-hashed (10 rounds) before storage
4. NextAuth issues a signed JWT session
5. Protected routes (`/dashboard`, `/forge`, `/leaderboard`) check session server-side

---

<div align="center">

**© 2026 Sautrik Roy — Licensed under the [MIT License](LICENSE)**

*Built for academic and competitive showcase. Any resemblance to production-grade engineering is entirely intentional.*

</div>
