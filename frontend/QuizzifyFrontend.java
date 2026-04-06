// ============================================================
//   QUIZZIFY AI — Frontend Logic in Java
//   File: QuizzifyFrontend.java
//   Location: frontend/ folder
//
//   PURPOSE:
//   This Java file demonstrates the exact same logic that the
//   Next.js frontend (src/ folder) uses — written in simple Java
//   so it can be easily explained to a professor.
//
//   THE REAL CODE is in TypeScript (Next.js/React) inside src/
//   This Java file is the CONCEPTUAL BLUEPRINT of that code.
// ============================================================

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


// ============================================================
// 1. DATA MODELS
//    These represent the shape of data used across the app.
//    In the real code: TypeScript interfaces in forge/page.tsx
// ============================================================

// Represents one multiple-choice question returned by Gemini AI
class Question {
    String questionText;   // The actual question string
    String[] options;      // Array of 4 possible answers (A, B, C, D)
    String correctAnswer;  // The correct option text
    String topic;          // Topic tag e.g. "Photosynthesis", "OOP"

    // Constructor — same as how Gemini AI JSON is parsed in real code
    public Question(String questionText, String[] options, String correctAnswer, String topic) {
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.topic = topic;
    }
}


// Represents one quiz attempt saved in the database
class QuizResult {
    String userId;         // Which user took this quiz (foreign key)
    int score;             // Number of correct answers
    int total;             // Total number of questions
    int percentage;        // score / total * 100
    String mode;           // "practice" or "test"
    String difficulty;     // "easy", "medium", "hard", or "mixed"
    List<String> weakTopics; // Topics the user got wrong (saved as JSON in DB)

    public QuizResult(String userId, int score, int total, String mode, String difficulty, List<String> weakTopics) {
        this.userId = userId;
        this.score = score;
        this.total = total;
        this.percentage = Math.round((float) score / total * 100); // Same formula as real code
        this.mode = mode;
        this.difficulty = difficulty;
        this.weakTopics = weakTopics;
    }
}


// Represents a logged-in user (mirrors the Prisma User model)
class User {
    String id;             // Unique ID (cuid() in real DB)
    String name;           // Display name
    String email;          // Institutional email
    String passwordHash;   // bcrypt hash — never plain text
    int totalScore;        // Sum of all weighted quiz scores
    int quizzesTaken;      // How many quizzes completed
    List<QuizResult> quizHistory; // Last 5 quizzes shown on dashboard

    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.totalScore = 0;
        this.quizzesTaken = 0;
        this.quizHistory = new ArrayList<>();
    }
}


// ============================================================
// 2. AUTHENTICATION SERVICE
//    Mirrors: src/lib/nextauth.ts + src/app/login/page.tsx
//    Handles login, registration, and session management
// ============================================================

class AuthService {

    // Simulated user database (in real app: Neon PostgreSQL via Prisma)
    private Map<String, User> userDatabase = new HashMap<>();
    private Map<String, String> passwordStore = new HashMap<>(); // email → bcrypt hash

    // --------------------------------------------------------
    // REGISTER: Create a new account
    // Real code: POST /api/auth/register → prisma.user.create()
    // --------------------------------------------------------
    public User register(String name, String email, String plainPassword) {

        // Step 1: Validate that the email is an institutional email
        // Real code checks against a blocklist of Gmail, Yahoo, Hotmail etc.
        if (isPersonalEmail(email)) {
            System.out.println("ERROR: Please use your institutional email, not Gmail/Yahoo.");
            return null;
        }

        // Step 2: Check if account already exists
        if (userDatabase.containsKey(email)) {
            System.out.println("ERROR: An account with this email already exists.");
            return null;
        }

        // Step 3: Hash the password with bcrypt (10 salt rounds in real code)
        // We simulate this here — in real code: bcrypt.hash(password, 10)
        String hashedPassword = simulateBcryptHash(plainPassword);

        // Step 4: Create the new User object
        String userId = "USER_" + System.currentTimeMillis(); // cuid() in real code
        User newUser = new User(userId, name, email);
        newUser.passwordHash = hashedPassword;

        // Step 5: Save to "database" (Prisma saves to Neon PostgreSQL in real code)
        userDatabase.put(email, newUser);
        passwordStore.put(email, hashedPassword);

        System.out.println("Account created successfully for: " + name);
        return newUser;
    }

    // --------------------------------------------------------
    // LOGIN: Authenticate an existing user
    // Real code: NextAuth CredentialsProvider → authorize()
    // --------------------------------------------------------
    public User login(String email, String plainPassword) {

        // Step 1: Find the user by email in the database
        User user = userDatabase.get(email);
        if (user == null) {
            System.out.println("ERROR: No account found with email: " + email);
            return null;
        }

        // Step 2: Compare entered password against stored hash
        // Real code: bcrypt.compare(credentials.password, user.password)
        boolean passwordMatches = simulateBcryptCompare(plainPassword, passwordStore.get(email));
        if (!passwordMatches) {
            System.out.println("ERROR: Incorrect password.");
            return null;
        }

        // Step 3: Return user — NextAuth creates a JWT session token from this
        // The JWT is stored as a cookie in the browser
        System.out.println("Login successful! Welcome back, " + user.name);
        return user;
    }

    // --------------------------------------------------------
    // GOOGLE SIGN-IN: OAuth flow
    // Real code: NextAuth GoogleProvider → signIn callback
    // --------------------------------------------------------
    public User googleSignIn(String googleEmail, String googleName) {

        // If user already exists, just return them
        if (userDatabase.containsKey(googleEmail)) {
            System.out.println("Existing Google user logged in: " + googleName);
            return userDatabase.get(googleEmail);
        }

        // First time Google login → auto-create account in DB
        // Real code: prisma.user.create({ data: { name, email, password: "" } })
        String userId = "GUSER_" + System.currentTimeMillis();
        User newUser = new User(userId, googleName, googleEmail);
        newUser.passwordHash = ""; // Google users have no password

        userDatabase.put(googleEmail, newUser);
        System.out.println("New Google user registered: " + googleName);
        return newUser;
    }

    // Helper: Block personal email providers
    private boolean isPersonalEmail(String email) {
        String[] blockedDomains = {"gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"};
        for (String domain : blockedDomains) {
            if (email.toLowerCase().endsWith("@" + domain)) {
                return true; // Blocked — must use institutional email
            }
        }
        return false;
    }

    // Simulates bcrypt hash (real code uses the bcryptjs library)
    private String simulateBcryptHash(String password) {
        return "HASHED_" + password.hashCode(); // Simplified for demo
    }

    // Simulates bcrypt compare (real code: bcrypt.compare())
    private boolean simulateBcryptCompare(String plain, String hash) {
        return hash.equals(simulateBcryptHash(plain));
    }
}


// ============================================================
// 3. FORGE PAGE — The Main Quiz Engine
//    Mirrors: src/app/forge/page.tsx (331 lines — biggest file)
//    Manages the full quiz lifecycle: upload → AI → quiz → save
// ============================================================

class ForgePage {

    // ── STATE VARIABLES ─────────────────────────────────────
    // In React (real code): useState() hooks
    // In Java: instance variables (same concept)

    private String uploadedFileName = null;    // Name of the uploaded file
    private boolean isLoading = false;         // Is AI currently generating?
    private String errorMessage = null;        // Any error to show the user

    private String mode = "practice";          // "practice" or "test"
    private boolean useTimer = false;          // Should the test be timed?
    private int timerLengthSeconds = 600;      // Default: 10 minutes

    private int questionCount = 5;             // How many questions to generate
    private String difficulty = "medium";      // easy/medium/hard/mixed

    private List<Question> questions = null;   // Questions from Gemini AI (null = not generated yet)
    private Map<Integer, String> userAnswers = new HashMap<>(); // Question index → chosen answer
    private boolean quizFinished = false;      // Has the user submitted?

    // ── WHICH UI STATE ARE WE IN? ─────────────────────────
    // Real code: conditional JSX rendering in forge/page.tsx
    // Three possible states:
    //   STATE 1: Setup   — show upload box + settings
    //   STATE 2: Active  — show quiz questions
    //   STATE 3: Done    — show results screen

    public String getCurrentUIState() {
        if (questions == null && !quizFinished) {
            return "STATE_1_SETUP";       // Show: upload box + mode toggle + difficulty picker
        } else if (questions != null && !quizFinished) {
            return "STATE_2_ACTIVE_QUIZ"; // Show: question cards + timer
        } else {
            return "STATE_3_RESULTS";     // Show: score + weak topics + review
        }
    }

    // ── STEP 1: EXTRACT TEXT FROM PDF ──────────────────────
    // Real code: extractTextFromPdf() using pdfjs-dist library in the BROWSER
    // IMPORTANT: This runs CLIENT-SIDE (in browser) NOT on the server
    // WHY? Vercel server has a 4.5MB body limit. PDFs can be 70MB.
    //      By extracting text in the browser, we only send ~50KB of text to server.
    public String extractTextFromDocument(String filePath) {
        System.out.println("[BROWSER] Reading file: " + filePath);

        // In real code, pdfjs-dist reads the PDF byte-by-byte and extracts text
        // For PPTX files, JSZip opens the ZIP archive and reads slide XML files
        // For TXT files, it's just file.text()

        // Check file size limit (70MB max in real code)
        long fileSizeBytes = 5 * 1024 * 1024; // Simulated 5MB
        if (fileSizeBytes > 70L * 1024 * 1024) {
            errorMessage = "File too large. Maximum size is 70MB.";
            return null;
        }

        System.out.println("[BROWSER] Text extracted from document successfully.");
        return "Sample extracted text from the document... (truncated to 150,000 characters in real code)";
    }

    // ── STEP 2: CALL GEMINI AI TO GENERATE QUESTIONS ───────
    // Real code: fetch('/api/generate', { method: 'POST', body: formData })
    // This sends the extracted text to OUR OWN backend server API route
    public List<Question> generateQuizFromText(String extractedText, User currentUser) {
        isLoading = true;
        System.out.println("[BROWSER → SERVER] Sending extracted text to /api/generate...");

        // Build the request (real code uses FormData object)
        System.out.println("  text: " + extractedText.substring(0, Math.min(50, extractedText.length())) + "...");
        System.out.println("  count: " + questionCount);
        System.out.println("  difficulty: " + difficulty);

        // The server (/api/generate/route.ts) then:
        //   1. Checks authentication (session must be valid)
        //   2. Calls Google Gemini 2.5 Flash API with a detailed prompt
        //   3. Parses the JSON response
        //   4. Returns the questions array

        // Simulated response from Gemini AI:
        List<Question> generatedQuestions = new ArrayList<>();
        generatedQuestions.add(new Question(
            "What is the primary function of a kernel in an operating system?",
            new String[]{"Manages user interface", "Core bridge between hardware and software", "Handles web requests", "Stores user files"},
            "Core bridge between hardware and software",
            "Operating Systems"
        ));
        generatedQuestions.add(new Question(
            "What does OOP stand for?",
            new String[]{"Object Oriented Programming", "Output Oriented Processing", "Object Output Program", "Open Oriented Protocol"},
            "Object Oriented Programming",
            "OOP Concepts"
        ));

        isLoading = false;
        this.questions = generatedQuestions;

        System.out.println("[SERVER → BROWSER] Received " + generatedQuestions.size() + " questions from Gemini AI!");
        return generatedQuestions;
    }

    // ── STEP 3: USER SELECTS AN ANSWER ─────────────────────
    // Real code: handleSelectAnswer() → setAnswers(prev => ({...prev, [qIndex]: opt}))
    public void selectAnswer(int questionIndex, String chosenOption) {

        // In PRACTICE mode: once answer selected, it's locked (can't change)
        if (mode.equals("practice") && userAnswers.containsKey(questionIndex)) {
            System.out.println("Practice mode: answer already locked for question " + (questionIndex + 1));
            return;
        }

        // In TEST mode: can change answer anytime until Submit is clicked
        if (quizFinished) {
            System.out.println("Quiz is finished. Cannot change answers.");
            return;
        }

        userAnswers.put(questionIndex, chosenOption);
        System.out.println("Answer recorded for Q" + (questionIndex + 1) + ": " + chosenOption);
    }

    // ── STEP 4: CALCULATE SCORE ─────────────────────────────
    // Real code: calculateScore() — counts how many answers match correctAnswer
    public int calculateScore() {
        if (questions == null) return 0;

        int score = 0;
        for (int i = 0; i < questions.size(); i++) {
            String userAnswer = userAnswers.get(i);
            String correctAnswer = questions.get(i).correctAnswer;

            if (userAnswer != null && userAnswer.equals(correctAnswer)) {
                score++; // User got this one right
            }
        }
        return score;
    }

    // ── STEP 5: FIND WEAK TOPICS ────────────────────────────
    // Real code: extractWeakTopics() — collects topics of wrong answers
    public List<String> extractWeakTopics() {
        List<String> weakTopics = new ArrayList<>();

        if (questions == null) return weakTopics;

        for (int i = 0; i < questions.size(); i++) {
            String userAnswer = userAnswers.get(i);
            String correctAnswer = questions.get(i).correctAnswer;
            String topic = questions.get(i).topic;

            // If the user got this wrong, add its topic to the weak list
            if (userAnswer == null || !userAnswer.equals(correctAnswer)) {
                if (!weakTopics.contains(topic)) { // No duplicates (Set in real code)
                    weakTopics.add(topic);
                }
            }
        }
        return weakTopics;
    }

    // ── STEP 6: SUBMIT QUIZ & SAVE TO DATABASE ──────────────
    // Real code: submitTest() → setQuizFinished(true) → fetch('/api/results', POST)
    public void submitQuiz(User currentUser) {

        // Mark as finished immediately (show results screen NOW)
        quizFinished = true;
        System.out.println("[UI] Results screen shown immediately!");

        int finalScore = calculateScore();
        List<String> weakTopics = extractWeakTopics();
        int percentage = (int) Math.round((double) finalScore / questions.size() * 100);

        System.out.println("\n===== QUIZ RESULTS =====");
        System.out.println("Score: " + finalScore + " / " + questions.size());
        System.out.println("Percentage: " + percentage + "%");
        System.out.println("Mode: " + mode);
        System.out.println("Difficulty: " + difficulty);
        System.out.println("Weak Topics: " + weakTopics);

        // Save result to database ASYNCHRONOUSLY (fire-and-forget)
        // Real code: fetch('/api/results', {...}).catch(console.error)
        // The UI doesn't wait for the DB — it shows results instantly
        System.out.println("[BROWSER → SERVER] Saving result to database asynchronously...");
        saveResultToDatabase(currentUser, finalScore, questions.size(), percentage, weakTopics);
    }

    // ── STEP 7: SAVE TO DATABASE (via API route) ────────────
    // Real code: POST /api/results/route.ts → prisma.quiz.create() + prisma.user.update()
    private void saveResultToDatabase(User user, int score, int total, int percentage, List<String> weakTopics) {

        // Create a QuizResult object (saved as a Quiz row in PostgreSQL)
        QuizResult result = new QuizResult(user.id, score, total, mode, difficulty, weakTopics);

        // Calculate difficulty multiplier for leaderboard scoring
        // Hard = 2x points, Medium = 1.5x points, Easy = 1x points
        double multiplier;
        switch (difficulty) {
            case "hard":   multiplier = 2.0;  break;
            case "medium": multiplier = 1.5;  break;
            default:       multiplier = 1.0;  break; // easy or mixed
        }

        // Update the user's running total score
        // Real code: prisma.user.update({ data: { totalScore: { increment: score * 10 * multiplier } } })
        int pointsEarned = (int)(score * 10 * multiplier);
        user.totalScore += pointsEarned;
        user.quizzesTaken += 1;
        user.quizHistory.add(result);

        System.out.println("[DATABASE] Quiz saved. User " + user.name + " earned " + pointsEarned + " points.");
        System.out.println("[DATABASE] New total score: " + user.totalScore);
    }

    // ── RESET: Go back to setup ─────────────────────────────
    // Real code: resetAll() — clears all state variables
    public void resetAll() {
        uploadedFileName = null;
        questions = null;
        userAnswers = new HashMap<>();
        quizFinished = false;
        errorMessage = null;
        System.out.println("[UI] Reset to setup screen. Ready for next quiz.");
    }
}


// ============================================================
// 4. DASHBOARD PAGE
//    Mirrors: src/app/dashboard/page.tsx
//    Shows a user's stats and top weak topics
// ============================================================

class DashboardPage {

    // ── LOAD DASHBOARD DATA ──────────────────────────────────
    // Real code: async server component — queries DB directly without an API call
    // Uses: prisma.user.findUnique() with quizzes relation
    public void loadDashboard(User user) {

        System.out.println("\n===== DASHBOARD: " + user.name + " =====");
        System.out.println("Total Score: " + user.totalScore);
        System.out.println("Quizzes Taken: " + user.quizzesTaken);

        // Calculate top weak topics from quiz history
        List<String> topWeakTopics = getTopWeakTopics(user);

        System.out.println("Top Areas to Improve: " + topWeakTopics);
        System.out.println("\n-- Recent History (last 5 quizzes) --");

        // Show last 5 quizzes (real code: take:5 in Prisma query)
        int start = Math.max(0, user.quizHistory.size() - 5);
        for (int i = user.quizHistory.size() - 1; i >= start; i--) {
            QuizResult quiz = user.quizHistory.get(i);
            System.out.printf("  %s | %s | Score: %d/%d | %d%%%n",
                quiz.mode.toUpperCase(), quiz.difficulty.toUpperCase(),
                quiz.score, quiz.total, quiz.percentage);
        }
    }

    // ── WEAK TOPIC ALGORITHM ─────────────────────────────────
    // Real code in dashboard/page.tsx:
    //   flatMap → gets all weakTopics arrays across all quizzes
    //   reduce  → counts frequency of each topic
    //   sort    → highest count first
    //   slice   → top 5 topics only
    public List<String> getTopWeakTopics(User user) {

        // Step 1: FLATTEN — collect all weak topics from all quizzes into one list
        // Real: user.quizzes.flatMap(q => JSON.parse(q.weakTopics || "[]"))
        List<String> allWeakTopics = new ArrayList<>();
        for (QuizResult quiz : user.quizHistory) {
            allWeakTopics.addAll(quiz.weakTopics); // Flatten arrays into one list
        }
        // Example: [Photosynthesis, Mitosis, Photosynthesis, OOP, Photosynthesis]

        // Step 2: COUNT — count how many times each topic appears
        // Real: .reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {})
        Map<String, Integer> topicFrequency = new HashMap<>();
        for (String topic : allWeakTopics) {
            topicFrequency.put(topic, topicFrequency.getOrDefault(topic, 0) + 1);
        }
        // Example: { Photosynthesis: 3, Mitosis: 1, OOP: 1 }

        // Step 3: SORT by frequency (highest count = weakest area)
        List<Map.Entry<String, Integer>> sorted = new ArrayList<>(topicFrequency.entrySet());
        sorted.sort((a, b) -> b.getValue() - a.getValue()); // Descending order

        // Step 4: Return top 5 topic names only
        List<String> result = new ArrayList<>();
        for (int i = 0; i < Math.min(5, sorted.size()); i++) {
            result.add(sorted.get(i).getKey()); // Just the name, not the count
        }
        return result;
    }
}


// ============================================================
// 5. LEADERBOARD PAGE
//    Mirrors: src/app/leaderboard/page.tsx
//    Shows top 50 users ranked by totalScore
// ============================================================

class LeaderboardPage {

    // ── LOAD LEADERBOARD ─────────────────────────────────────
    // Real code: prisma.user.findMany({ orderBy: { totalScore: 'desc' }, take: 50 })
    // Uses: export const dynamic = "force-dynamic" → NEVER caches this page
    // WHY force-dynamic? Without it, Next.js caches the page → stale scores shown
    public void displayLeaderboard(List<User> allUsers) {

        System.out.println("\n===== GLOBAL LEADERBOARD =====");
        System.out.println("Rankings based on weighted score (Hard=2x, Medium=1.5x, Easy=1x)");
        System.out.println("------------------------------------------------");

        // Sort users by totalScore (highest first)
        // Real code: orderBy: { totalScore: 'desc' } in Prisma query
        allUsers.sort((a, b) -> b.totalScore - a.totalScore);

        // Display top 50 (real code: take: 50)
        int limit = Math.min(50, allUsers.size());
        for (int i = 0; i < limit; i++) {
            User user = allUsers.get(i);

            // Special display for top 3 (Gold/Silver/Bronze in real UI)
            String rank;
            if (i == 0)      rank = "🥇 1st";
            else if (i == 1) rank = "🥈 2nd";
            else if (i == 2) rank = "🥉 3rd";
            else             rank = "    #" + (i + 1);

            System.out.printf("%-10s %-25s %d pts  (%d quizzes)%n",
                rank, user.name, user.totalScore, user.quizzesTaken);
        }
    }
}


// ============================================================
// 6. COMPONENTS
//    Mirrors: src/components/ folder
//    Reusable UI pieces used across multiple pages
// ============================================================

// Mirrors: TopNav.tsx — Navigation bar shown on every page
class TopNavComponent {

    // Whether the current user is logged in
    // Real code: getServerSession(authOptions) — runs on server
    public void render(User currentUser) {

        System.out.println("\n[TOP NAV]");

        if (currentUser == null) {
            // Not logged in — show only "Sign In" button
            System.out.println("  Logo: Quizzify    |    [Sign In]");
        } else {
            // Logged in — show navigation links
            // On MOBILE: these links appear as a FIXED BOTTOM BAR (like a mobile app)
            // On DESKTOP: these links appear inline in the top bar
            System.out.println("  Logo: Quizzify  |  Dashboard  Forge  Leaderboard  |  " + currentUser.name + "  [Sign Out]");
        }
    }
}


// Mirrors: Timer.tsx — Countdown timer for test mode
class TimerComponent {

    private int timeLeftSeconds;
    private boolean isActive;

    public TimerComponent(int durationSeconds) {
        this.timeLeftSeconds = durationSeconds;
        this.isActive = true;
    }

    // Real code uses: useEffect + setInterval(1000ms) → decrements timeLeft every second
    // When timeLeft <= 0 → calls onTimeUp() which triggers submitTest() automatically
    public void tick() {
        if (!isActive) return;

        if (timeLeftSeconds <= 0) {
            System.out.println("[TIMER] Time's up! Auto-submitting quiz...");
            isActive = false;
            return;
        }

        timeLeftSeconds--;

        // When under 60 seconds: timer turns RED and PULSES in real UI
        // Real code: className={timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}
        int mins = timeLeftSeconds / 60;
        int secs = timeLeftSeconds % 60;
        String color = timeLeftSeconds < 60 ? "[RED]" : "[WHITE]";

        System.out.printf("  %s Timer: %02d:%02d%n", color, mins, secs);
    }
}


// Mirrors: QuizCard.tsx — A single question card with 4 options
class QuizCardComponent {

    // Display one question with its options and state
    // Real code: dynamically changes button colour based on answer state
    public void render(Question question, int questionNumber, String mode, String selectedOption, boolean showCorrections) {

        boolean isVerified = (mode.equals("practice") && selectedOption != null) || showCorrections;
        // ↑ Real code: const isVerified = (isPrac && selectedOption !== null) || showCorrections;

        System.out.println("\n  Q" + questionNumber + ": " + question.questionText);

        for (String option : question.options) {
            boolean isSelected = option.equals(selectedOption);
            boolean isCorrect  = option.equals(question.correctAnswer);

            String prefix;

            if (isVerified) {
                // Answers are being judged — show right/wrong
                if (isCorrect)             prefix = "[✅ GREEN]"; // Correct answer highlighted
                else if (isSelected)        prefix = "[❌ RED  ]"; // User picked wrong
                else                        prefix = "[        ]";
            } else if (isSelected) {
                prefix = "[🔵 BLUE ]"; // User selected but not yet judged
            } else {
                prefix = "[        ]"; // Default unselected
            }

            System.out.println("    " + prefix + " " + option);
        }
    }
}


// Mirrors: ResultScreen.tsx — Final score display after quiz
class ResultScreenComponent {

    // Display the final result screen
    // Real code: animated spring progress bar, dynamic message based on percentage
    public void render(int score, int total, List<String> weakTopics) {

        int percentage = (int) Math.round((double) score / total * 100);

        // Dynamic message — same logic as real code
        String message;
        if      (percentage >= 90) message = "Exceptional performance! Outstanding mastery.";
        else if (percentage >= 70) message = "Great job! You have a solid grasp of this.";
        else if (percentage >= 50) message = "You successfully forged through all questions.";
        else                       message = "Keep studying! You'll master this soon.";

        System.out.println("\n========== QUIZ COMPLETE ==========");
        System.out.println("Final Score: " + score + " / " + total);
        System.out.println("Percentage:  " + percentage + "%");
        System.out.println("Message:     " + message);

        // Animated progress bar in real code:
        // <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ type: "spring" }} />
        System.out.print("Progress:    [");
        int bars = percentage / 5; // 20 bars = 100%
        for (int i = 0; i < 20; i++) System.out.print(i < bars ? "█" : "░");
        System.out.println("] " + percentage + "%");

        // Show weak topic recommendations if any
        if (!weakTopics.isEmpty()) {
            System.out.println("\n⚠ Focus Areas (topics you got wrong):");
            for (String topic : weakTopics) {
                System.out.println("    • " + topic);
            }
        }
        System.out.println("=====================================");
    }
}


// ============================================================
// 7. MAIN — Demonstrates the full quiz flow
//    This ties everything together and shows the complete
//    journey: Register → Login → Upload → AI → Quiz → Results
// ============================================================

public class QuizzifyFrontend {

    public static void main(String[] args) {

        System.out.println("══════════════════════════════════════════");
        System.out.println("     QUIZZIFY AI — Frontend Flow Demo       ");
        System.out.println("══════════════════════════════════════════\n");

        // ── 1. AUTHENTICATION ────────────────────────────────
        System.out.println("--- STEP 1: AUTHENTICATION ---");
        AuthService auth = new AuthService();

        // Register a new account (blocked if Gmail/Yahoo)
        User krish = auth.register("Krish", "krish@university.edu", "securePass123");

        // Simulate logging in
        User loggedInUser = auth.login("krish@university.edu", "securePass123");

        // ── 2. NAVIGATION ────────────────────────────────────
        System.out.println("\n--- STEP 2: NAVIGATION ---");
        TopNavComponent nav = new TopNavComponent();
        nav.render(loggedInUser); // Shows nav for logged-in user

        // ── 3. FORGE PAGE — Upload + Generate ───────────────
        System.out.println("\n--- STEP 3: FORGE PAGE ---");
        ForgePage forge = new ForgePage();

        // Show current UI state (should be STATE_1_SETUP)
        System.out.println("Current UI State: " + forge.getCurrentUIState());

        // Extract text from uploaded PDF (runs in browser, not server)
        String documentText = forge.extractTextFromDocument("OS_Chapter1.pdf");

        // Call Gemini AI to generate questions
        List<Question> questions = forge.generateQuizFromText(documentText, loggedInUser);

        // UI is now in STATE_2_ACTIVE_QUIZ
        System.out.println("Current UI State: " + forge.getCurrentUIState());

        // ── 4. TIMER (Test Mode) ─────────────────────────────
        System.out.println("\n--- STEP 4: TIMER (if Test Mode) ---");
        TimerComponent timer = new TimerComponent(65); // 65 seconds
        timer.tick(); // Shows white (65s remaining)
        for (int i = 0; i < 6; i++) timer.tick(); // Counts down to 59s → turns RED

        // ── 5. USER ANSWERS QUESTIONS ────────────────────────
        System.out.println("\n--- STEP 5: USER ANSWERS ---");
        forge.selectAnswer(0, "Core bridge between hardware and software"); // CORRECT
        forge.selectAnswer(1, "Output Oriented Processing");                // WRONG

        // Show a QuizCard (practice mode — shows correct/wrong immediately)
        QuizCardComponent card = new QuizCardComponent();
        card.render(questions.get(0), 1, "practice",
                    "Core bridge between hardware and software", false);

        // ── 6. SUBMIT & RESULTS ──────────────────────────────
        System.out.println("\n--- STEP 6: SUBMIT QUIZ ---");
        forge.submitQuiz(loggedInUser);

        // Show the ResultScreen component
        ResultScreenComponent resultScreen = new ResultScreenComponent();
        resultScreen.render(forge.calculateScore(), questions.size(), forge.extractWeakTopics());

        // ── 7. DASHBOARD ─────────────────────────────────────
        System.out.println("\n--- STEP 7: DASHBOARD ---");
        DashboardPage dashboard = new DashboardPage();
        dashboard.loadDashboard(loggedInUser);

        // ── 8. LEADERBOARD ───────────────────────────────────
        System.out.println("\n--- STEP 8: LEADERBOARD ---");

        // Simulate multiple users for the leaderboard
        User user2 = new User("U002", "Priya", "priya@university.edu");
        user2.totalScore = 340;
        user2.quizzesTaken = 4;

        User user3 = new User("U003", "Arjun", "arjun@university.edu");
        user3.totalScore = 210;
        user3.quizzesTaken = 2;

        List<User> allUsers = new ArrayList<>();
        allUsers.add(loggedInUser);
        allUsers.add(user2);
        allUsers.add(user3);

        LeaderboardPage leaderboard = new LeaderboardPage();
        leaderboard.displayLeaderboard(allUsers);

        System.out.println("\n══════════════════════════════════════════");
        System.out.println("     FULL FLOW DEMONSTRATION COMPLETE       ");
        System.out.println("══════════════════════════════════════════");
    }
}
