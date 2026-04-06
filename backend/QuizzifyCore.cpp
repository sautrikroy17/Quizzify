#include <iostream>
#include <string>
#include <vector>

using namespace std;

// Encapsulation — private data, controlled access via public methods
class Question {
private:
    string text;
    vector<string> options;
    int correctOptionIndex;

public:
    // Constructor — initialises fields when object is created
    Question(string q, vector<string> opts, int correctIndex)
        : text(q), options(opts), correctOptionIndex(correctIndex) {}

    // Destructor — called when object goes out of scope
    ~Question() {}

    string getText() const { return text; }
    vector<string> getOptions() const { return options; }
    bool checkAnswer(int selectedIndex) const { return selectedIndex == correctOptionIndex; }
};


// Abstraction — pure virtual function forces derived classes to define their own conductAssessment()
// Polymorphism — virtual keyword enables the correct derived version to be called at runtime
class Assessment {
protected:
    string title;
    vector<Question> questions;
    int currentScore;

public:
    // Constructor — sets shared state for all derived classes
    Assessment(string t) : title(t), currentScore(0) {}

    // Destructor — virtual so the correct derived destructor also runs when deleting via base pointer
    virtual ~Assessment() {}

    void addQuestion(const Question& q) { questions.push_back(q); }

    // Pure virtual — makes Assessment abstract; also the source of runtime polymorphism
    virtual void conductAssessment() = 0;

    int getScore() const { return currentScore; }
    string getTitle() const { return title; }
};


// Inheritance — gets title, questions, currentScore from Assessment
// Runtime Polymorphism — overrides conductAssessment() with Practice behaviour (no timer, instant feedback)
class PracticeQuiz : public Assessment {
public:
    PracticeQuiz(string t) : Assessment(t) {}

    void conductAssessment() override {
        cout << "--- PRACTICE MODE: " << title << " ---" << endl;
        cout << "Hints enabled. Answers shown immediately after each question." << endl;
        currentScore = questions.size() * 10;
        cout << "Practice complete! Score: " << currentScore << endl;
    }
};


// Inheritance — gets title, questions, currentScore from Assessment
// Runtime Polymorphism — overrides conductAssessment() with Test behaviour (timed, score saved to leaderboard)
class CompetitiveTest : public Assessment {
private:
    int timeLimitSeconds;

public:
    CompetitiveTest(string t, int timeLimit) : Assessment(t), timeLimitSeconds(timeLimit) {}

    void conductAssessment() override {
        cout << "*** TEST MODE: " << title << " ***" << endl;
        cout << "Time Limit: " << timeLimitSeconds << " seconds. No hints." << endl;
        currentScore = questions.size() * 10;
        cout << "Exam complete! Score saved to leaderboard: " << currentScore << endl;
    }
};


// Inheritance base — shared interface for Student and Admin
class User {
protected:
    string name;
    string email;

public:
    User(string n, string e) : name(n), email(e) {}
    virtual void displayDashboard() const { cout << "User: " << name << endl; }
    string getName() const { return name; }
    virtual ~User() {}
};


// Inheritance — gets name, email from User
// Runtime Polymorphism — overrides displayDashboard() with student-specific stats
class Student : public User {
private:
    int totalScore;
    int quizzesTaken;

public:
    Student(string n, string e) : User(n, e), totalScore(0), quizzesTaken(0) {}

    void recordAssessment(Assessment* assessment) {
        assessment->conductAssessment();
        totalScore += assessment->getScore();
        quizzesTaken++;
    }

    void displayDashboard() const override {
        cout << "========================================" << endl;
        cout << "STUDENT DASHBOARD: " << name << endl;
        cout << "Total Score: " << totalScore << endl;
        cout << "Quizzes Taken: " << quizzesTaken << endl;
        cout << "========================================" << endl;
    }
};


// Inheritance — gets name, email from User
// Runtime Polymorphism — overrides displayDashboard() with admin-specific view
class Admin : public User {
public:
    Admin(string n, string e) : User(n, e) {}

    void displayDashboard() const override {
        cout << "ADMIN DASHBOARD: " << name << endl;
        cout << "System Status: Online. Leaderboard: Synchronized." << endl;
    }
};


int main() {
    cout << "\n=== QUIZZIFY AI — C++ CORE ENGINE ===\n" << endl;

    // Constructor fires here — Question objects created and fields initialised
    Question q1("What is a kernel?", {"Hardware", "Core OS component", "App layer"}, 1);
    Question q2("What is deadlock?", {"Process starvation", "Memory error", "Endless wait"}, 2);

    // Polymorphism — base class pointer holds derived objects; correct version called at runtime
    Assessment* practice = new PracticeQuiz("OS Fundamentals — Practice");
    Assessment* exam     = new CompetitiveTest("OS Fundamentals — Ranked Exam", 600);

    practice->addQuestion(q1);
    exam->addQuestion(q2);

    Student student("Krish", "krish@university.edu");
    Admin   sysAdmin("System Overseer", "root@quizzify.com");

    cout << "\n--- Practice Mode ---" << endl;
    student.recordAssessment(practice);

    cout << "\n--- Test Mode ---" << endl;
    student.recordAssessment(exam);

    // Runtime Polymorphism — same call on different User types, different output
    cout << "\n--- Dashboards ---" << endl;
    User* users[] = { &student, &sysAdmin };
    for (const auto* u : users) {
        u->displayDashboard();
        cout << endl;
    }

    // Destructor fires here — virtual destructor ensures correct cleanup
    delete practice;
    delete exam;

    cout << "\n=== SYSTEM SHUTDOWN COMPLETE ===" << endl;
    return 0;
}
