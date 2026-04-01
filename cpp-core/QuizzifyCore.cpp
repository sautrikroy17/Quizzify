#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <ctime>

using namespace std;

// ==========================================
// ABSTRACTION & ENCAPSULATION
// Interface representing any measurable item
// ==========================================
class IMeasurable {
public:
    virtual int getScore() const = 0;
    virtual ~IMeasurable() = default;
};

// ==========================================
// CORE CLASSES: Question
// Demonstrates strong encapsulation
// ==========================================
class Question {
private:
    string text;
    vector<string> options;
    int correctOptionIndex;

public:
    Question(string q, vector<string> opts, int correctIndex) 
        : text(q), options(opts), correctOptionIndex(correctIndex) {}

    string getText() const { return text; }
    vector<string> getOptions() const { return options; }
    
    bool checkAnswer(int selectedIndex) const {
        return selectedIndex == correctOptionIndex;
    }
};

// ==========================================
// POLYMORPHISM & INHERITANCE
// Base Assessment Class
// ==========================================
class Assessment : public IMeasurable {
protected:
    string id;
    string title;
    vector<Question> questions;
    int currentScore;

public:
    Assessment(string t) : title(t), currentScore(0) {
        id = "ASSESS_" + to_string(time(0));
    }

    void addQuestion(const Question& q) {
        questions.push_back(q);
    }

    // Pure virtual function making this an Abstract Class
    virtual void conductAssessment() = 0;

    int getScore() const override {
        return currentScore;
    }
    
    virtual ~Assessment() = default;
};

// Derived Class 1: Practice Mode (No timer, shows answers)
class PracticeQuiz : public Assessment {
public:
    PracticeQuiz(string t) : Assessment(t) {}

    void conductAssessment() override {
        cout << "--- Starting Practice Module: " << title << " ---" << endl;
        cout << "(Hints Enabled. Take Your Time.)" << endl;
        
        // Simulating taking a quiz
        currentScore = questions.size() * 10; // Auto-pass for demo
        cout << "Practice Completed! You learned the concepts." << endl;
    }
};

// Derived Class 2: Competitive Test Mode (Timed, affects Leaderboard)
class CompetitiveTest : public Assessment {
private:
    int timeLimitSeconds;

public:
    CompetitiveTest(string t, int timeLimit) : Assessment(t), timeLimitSeconds(timeLimit) {}

    void conductAssessment() override {
        cout << "*** STARTING COMPETITIVE EXAM: " << title << " ***" << endl;
        cout << "TIME LIMIT: " << timeLimitSeconds << " seconds." << endl;
        
        // Simulating the stress test
        currentScore = questions.size() * 10; 
        cout << "Exam Completed under time pressure. Score secured!" << endl;
    }
};


// ==========================================
// INHERITANCE: User Types
// Demonstrates hierarchical classes
// ==========================================
class User {
protected:
    string userId;
    string email;
    string name;

public:
    User(string id, string e, string n) : userId(id), email(e), name(n) {}
    
    virtual void displayDashboard() const {
        cout << "Welcome back, " << name << endl;
    }

    string getName() const { return name; }
    
    virtual ~User() = default;
};

class Student : public User {
private:
    int totalScore;
    int quizzesTaken;

public:
    Student(string id, string e, string n) : User(id, e, n), totalScore(0), quizzesTaken(0) {}

    void recordAssessment(const unique_ptr<Assessment>& assessment) {
        assessment->conductAssessment();
        totalScore += assessment->getScore();
        quizzesTaken++;
    }

    void displayDashboard() const override {
        cout << "========================================" << endl;
        cout << "🎓 STUDENT DASHBOARD: " << name << endl;
        cout << "Total EXP Score: " << totalScore << endl;
        cout << "Assessments Conquered: " << quizzesTaken << endl;
        cout << "========================================" << endl;
    }
};

class Admin : public User {
public:
    Admin(string id, string e, string n) : User(id, e, n) {}
    
    void displayDashboard() const override {
        cout << "⚙️ SYSTEM ADMIN DASHBOARD: " << name << endl;
        cout << "System Status: Online. Leaderboards Synchronized." << endl;
    }
};


// ==========================================
// SYSTEM ENGINE (Singleton Design Pattern concept)
// ==========================================
int main() {
    cout << "INITIALIZING QUIZZIFY AI C++ CORE ENGINE...\n" << endl;

    // 1. Instantiating Users
    Student user1("U001", "krish@university.edu", "Krish");
    Admin sysAdmin("A001", "root@quizzify.com", "System Overseer");

    // 2. Polymorphism: Base class pointer array
    vector<User*> systemUsers;
    systemUsers.push_back(&user1);
    systemUsers.push_back(&sysAdmin);

    // 3. Document AI Pipeline Simulation (Abstraction)
    cout << "[AI ENGINE] Parsing Uploaded PDF: 'Operating_Systems_Ch1.pdf'..." << endl;
    
    // Using Smart Pointers to manage Memory Exceptionally well
    unique_ptr<Assessment> practice = make_unique<PracticeQuiz>("OS Fundamentals (Practice)");
    practice->addQuestion(Question("What is a kernel?", {"Hardware", "Core OS Program", "App"}, 1));
    
    unique_ptr<Assessment> exam = make_unique<CompetitiveTest>("OS Fundamentals (Ranked Exam)", 600);
    exam->addQuestion(Question("What is deadlock?", {"Process Starvation", "Memory Access", "Endless Wait"}, 2));

    // 4. Executing Logic
    user1.recordAssessment(practice);
    cout << "\n";
    user1.recordAssessment(exam);
    cout << "\n";

    // 5. Demonstrating Virtual Functions / Dynamic Dispatch
    for (const auto* user : systemUsers) {
        user->displayDashboard();
    }

    cout << "\nSYSTEM SHUTDOWN SEQUENCE INITIATED..." << endl;

    return 0;
}
