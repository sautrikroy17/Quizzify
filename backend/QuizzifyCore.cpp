#include <iostream>
#include <string>
#include <vector>

using namespace std;

// ============================================================
// CLASS: Question
// Concept: ENCAPSULATION — data is private, only accessible
//          through controlled public methods (getText, checkAnswer)
// ============================================================
class Question {
private:
    string text;
    vector<string> options;
    int correctOptionIndex;  // Hidden — prevents correct answer from leaking outside

public:
    // CONSTRUCTOR — fires automatically when a Question object is created;
    // initialises all fields so no field is ever left undefined
    Question(string q, vector<string> opts, int correctIndex)
        : text(q), options(opts), correctOptionIndex(correctIndex) {
        cout << "[Question Created] " << text << endl;
    }

    // DESTRUCTOR — fires automatically when this Question goes out of scope
    // (at end of main, since q1 and q2 are local variables — no manual delete needed)
    ~Question() {
        cout << "[Question Destroyed] " << text << endl;
    }

    // Encapsulation: expose only what is needed, never the raw answer
    string getText() const { return text; }
    vector<string> getOptions() const { return options; }

    // The ONLY way to verify an answer — keeps correctOptionIndex private
    bool checkAnswer(int selectedIndex) const {
        return selectedIndex == correctOptionIndex;
    }
};


// ============================================================
// CLASS: Assessment (Abstract Base Class)
// Concept: ABSTRACTION — defines WHAT must exist (conductAssessment)
//          without defining HOW. No Assessment object can be created directly.
// Concept: POLYMORPHISM — virtual conductAssessment() is the engine that allows
//          different behaviour (Practice vs Test mode) through the same base pointer
// ============================================================
class Assessment {
protected:
    string title;
    vector<Question> questions;
    int currentScore;

public:
    // CONSTRUCTOR — called automatically when any derived object (PracticeQuiz or
    // CompetitiveTest) is created; sets up shared title and currentScore for both
    Assessment(string t) : title(t), currentScore(0) {}

    // DESTRUCTOR — virtual so when a derived object is deleted through a base
    // class pointer, the correct derived destructor is also called (prevents memory leak)
    virtual ~Assessment() {
        cout << "[Assessment Ended] " << title << " — questions destroyed." << endl;
    }

    void addQuestion(const Question& q) {
        questions.push_back(q);
    }

    // PURE VIRTUAL FUNCTION — the = 0 makes Assessment abstract.
    // Forces every derived class to define its own version.
    // This single line is the ENGINE of both Abstraction AND Polymorphism:
    //   Abstraction: you cannot instantiate Assessment directly
    //   Polymorphism: calling this via Assessment* runs the correct derived version at runtime
    virtual void conductAssessment() = 0;

    int getScore() const { return currentScore; }
    string getTitle() const { return title; }
};


// ============================================================
// CLASS: PracticeQuiz (Derived from Assessment)
// Concept: INHERITANCE — gets title, questions, currentScore, addQuestion()
//          from Assessment without rewriting any of them
// Concept: RUNTIME POLYMORPHISM — overrides conductAssessment() to provide
//          Practice-specific behaviour: no timer, answer shown immediately after each question
// ============================================================
class PracticeQuiz : public Assessment {
public:
    // Calls parent constructor first via : Assessment(t) to initialise shared fields
    PracticeQuiz(string t) : Assessment(t) {}

    // OVERRIDE — this version runs when an Assessment* pointing to PracticeQuiz calls conductAssessment()
    // C++ resolves which version to call at RUNTIME based on actual object type, not pointer type
    void conductAssessment() override {
        cout << "--- PRACTICE MODE: " << title << " ---" << endl;
        cout << "(Hints enabled. Each answer shown immediately after selection.)" << endl;
        currentScore = questions.size() * 10;
        cout << "Practice complete! Score: " << currentScore << endl;
    }
};


// ============================================================
// CLASS: CompetitiveTest (Derived from Assessment)
// Concept: INHERITANCE — inherits all Assessment data and methods
// Concept: RUNTIME POLYMORPHISM — overrides conductAssessment() to provide
//          Test-specific behaviour: timed, no hints, score saved to leaderboard
// ============================================================
class CompetitiveTest : public Assessment {
private:
    int timeLimitSeconds;  // Extra field specific to Test mode only — Practice doesn't need it

public:
    // Calls parent constructor first, then initialises its own extra field
    CompetitiveTest(string t, int timeLimit) : Assessment(t), timeLimitSeconds(timeLimit) {}

    // OVERRIDE — same function name as PracticeQuiz's override, but completely different behaviour
    // This contrast between the two overrides IS the definition of Runtime Polymorphism
    void conductAssessment() override {
        cout << "*** TEST MODE: " << title << " ***" << endl;
        cout << "Time Limit: " << timeLimitSeconds << " seconds. No hints. No second chances." << endl;
        currentScore = questions.size() * 10;
        cout << "Exam complete! Score saved to leaderboard: " << currentScore << endl;
    }
};


// ============================================================
// CLASS: User (Base Class)
// Concept: INHERITANCE base — defines shared interface (name, email, displayDashboard)
//          that both Student and Admin inherit from
// ============================================================
class User {
protected:
    string name;
    string email;

public:
    User(string n, string e) : name(n), email(e) {}

    // Virtual — allows Student and Admin to override with their own dashboard output
    virtual void displayDashboard() const {
        cout << "User: " << name << endl;
    }

    string getName() const { return name; }

    // Virtual destructor — ensures correct cleanup when deleting through a User* pointer
    virtual ~User() {}
};


// ============================================================
// CLASS: Student (Derived from User)
// Concept: INHERITANCE — gets name, email, getName() from User automatically
// Concept: RUNTIME POLYMORPHISM — overrides displayDashboard() to show
//          student-specific stats (score, number of quizzes taken)
// ============================================================
class Student : public User {
private:
    int totalScore;
    int quizzesTaken;

public:
    Student(string n, string e) : User(n, e), totalScore(0), quizzesTaken(0) {}

    // Takes any Assessment* — works for both PracticeQuiz and CompetitiveTest
    // because of Polymorphism: conductAssessment() picks the right version at runtime
    void recordAssessment(Assessment* assessment) {
        assessment->conductAssessment();
        totalScore += assessment->getScore();
        quizzesTaken++;
    }

    // OVERRIDE — same name as User::displayDashboard, but shows student-specific content
    void displayDashboard() const override {
        cout << "========================================" << endl;
        cout << "STUDENT DASHBOARD: " << name << endl;
        cout << "Total Score: " << totalScore << endl;
        cout << "Quizzes Taken: " << quizzesTaken << endl;
        cout << "========================================" << endl;
    }
};


// ============================================================
// CLASS: Admin (Derived from User)
// Concept: INHERITANCE — inherits all User fields for free
// Concept: RUNTIME POLYMORPHISM — overrides displayDashboard() with
//          admin-specific view (system status, leaderboard access)
// ============================================================
class Admin : public User {
public:
    Admin(string n, string e) : User(n, e) {}

    void displayDashboard() const override {
        cout << "ADMIN DASHBOARD: " << name << endl;
        cout << "System Status: Online. Leaderboard: Synchronized." << endl;
    }
};


// ============================================================
// MAIN — Shows all OOP concepts fired in sequence
// ============================================================
int main() {
    cout << "\n=== QUIZZIFY AI — C++ CORE ENGINE ===\n" << endl;

    // CONSTRUCTOR fires here — Question objects created, fields initialised automatically
    Question q1("What is a kernel?", {"Hardware", "Core OS component", "App layer"}, 1);
    Question q2("What is deadlock?", {"Process starvation", "Memory error", "Endless wait"}, 2);

    // POLYMORPHISM + INHERITANCE:
    // Base class pointer holds derived objects — correct conductAssessment() chosen at RUNTIME
    Assessment* practice = new PracticeQuiz("OS Fundamentals — Practice");
    Assessment* exam     = new CompetitiveTest("OS Fundamentals — Ranked Exam", 600);

    practice->addQuestion(q1);
    exam->addQuestion(q2);

    // Student's recordAssessment uses Assessment* polymorphically —
    // same function call works for both Practice and Test mode
    Student student("Krish", "krish@university.edu");
    Admin   sysAdmin("System Overseer", "root@quizzify.com");

    cout << "\n--- Running Practice Mode ---" << endl;
    student.recordAssessment(practice);   // Calls PracticeQuiz::conductAssessment()

    cout << "\n--- Running Test Mode ---" << endl;
    student.recordAssessment(exam);       // Calls CompetitiveTest::conductAssessment()

    // RUNTIME POLYMORPHISM on User hierarchy:
    // Same loop, same function call — different output for Student vs Admin
    cout << "\n--- User Dashboards (Runtime Polymorphism via User*) ---" << endl;
    User* users[] = { &student, &sysAdmin };
    for (const auto* u : users) {
        u->displayDashboard();   // C++ decides at runtime: Student or Admin version?
        cout << endl;
    }

    // DESTRUCTOR fires here — Assessment objects (and their Question copies) cleaned up
    // Virtual destructor ensures both base AND derived destructors run correctly
    cout << "\n--- Cleaning Up ---" << endl;
    delete practice;
    delete exam;
    // q1 and q2 destructors called automatically as local variables go out of scope

    cout << "\n=== SYSTEM SHUTDOWN COMPLETE ===" << endl;
    return 0;
}
