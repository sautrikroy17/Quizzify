#include <iostream>
#include <string>
#include <vector>

using namespace std;

// ============================================
// CLASS: Question
// Demonstrates: Encapsulation, Constructor, Destructor
// ============================================
class Question {
private:
    // Private data - cannot be accessed directly from outside
    string text;
    vector<string> options;
    int correctOptionIndex;

public:
    // Constructor - runs automatically when object is created
    Question(string t, vector<string> opts, int correct) {
        text = t;
        options = opts;
        correctOptionIndex = correct;
        cout << "Question created: " << text << endl;
    }

    // Destructor - runs automatically when object is destroyed
    ~Question() {
        cout << "Question destroyed: " << text << endl;
    }

    // Public methods - the only way to access private data
    string getText() {
                return text;
    }

    void display() {
                cout << "Q: " << text << endl;
        for (int i = 0; i < options.size(); i++) {
            cout << i + 1 << ". " << options[i] << endl;
        }
    }

    bool checkAnswer(int selected) {
                return selected == correctOptionIndex;
    }
};


// ============================================
// BASE CLASS: Assessment
// Demonstrates: Abstraction (pure virtual function)
// ============================================
class Assessment {
protected:
    string title;
    int currentScore;

public:
    // Constructor
    Assessment(string t) {
        title = t;
        currentScore = 0;
        cout << "Assessment created: " << title << endl;
    }

    // Destructor
    virtual ~Assessment() {
        cout << "Assessment destroyed: " << title << endl;
    }

    // Pure virtual function - subclasses MUST implement this
    // This is what makes Assessment an abstract class
    virtual void conductAssessment() = 0;

    string getTitle() {
                return title;
    }

    int getScore() {
                return currentScore;
    }
};


// ============================================
// DERIVED CLASS 1: PracticeQuiz
// Demonstrates: Inheritance, Runtime Polymorphism
// ============================================
class PracticeQuiz : public Assessment {
public:
    // Constructor calling parent constructor
    PracticeQuiz(string t) : Assessment(t) {}

    // Override the base class function - Runtime Polymorphism
    void conductAssessment() {
                cout << "=== PRACTICE MODE ===" << endl;
        cout << "Quiz: " << title << endl;
        cout << "Answers shown immediately after each question." << endl;
        cout << "No timer. Relax and learn!" << endl;
        currentScore = 8; // example score
    }
};


// ============================================
// DERIVED CLASS 2: CompetitiveTest
// Demonstrates: Inheritance, Runtime Polymorphism
// ============================================
class CompetitiveTest : public Assessment {
private:
    int timeLimitSeconds;

public:
    // Constructor
    CompetitiveTest(string t, int timeLimit) : Assessment(t) {
        timeLimitSeconds = timeLimit;
    }

    // Override the base class function - Runtime Polymorphism
    void conductAssessment() {
                cout << "=== TEST MODE ===" << endl;
        cout << "Quiz: " << title << endl;
        cout << "Time limit: " << timeLimitSeconds << " seconds." << endl;
        cout << "Score will be saved to the leaderboard!" << endl;
        currentScore = 9; // example score
    }
};


// ============================================
// BASE CLASS: User
// Demonstrates: Inheritance, Polymorphism
// ============================================
class User {
protected:
    string name;
    string email;

public:
    // Constructor
    User(string n, string e) {
        name = n;
        email = e;
        cout << "User created: " << name << endl;
    }

    // Virtual destructor
    virtual ~User() {
        cout << "User destroyed: " << name << endl;
    }

    // Virtual function - can be overridden by subclasses
    virtual void displayDashboard() {
                cout << "User: " << name << " | Email: " << email << endl;
    }

    string getName() {
                return name;
    }
};


// ============================================
// DERIVED CLASS: Student
// Demonstrates: Inheritance, Polymorphism
// ============================================
class Student : public User {
private:
    int totalScore;
    int quizzesTaken;

public:
    // Constructor
    Student(string n, string e) : User(n, e) {
        totalScore = 0;
        quizzesTaken = 0;
    }

    // Override displayDashboard - Runtime Polymorphism
    void displayDashboard() {
                cout << "--- STUDENT DASHBOARD ---" << endl;
        cout << "Name: " << name << endl;
        cout << "Total Score: " << totalScore << endl;
        cout << "Quizzes Taken: " << quizzesTaken << endl;
    }

    void updateScore(int score) {
                totalScore += score;
        quizzesTaken++;
    }
};


// ============================================
// DERIVED CLASS: Admin
// Demonstrates: Inheritance, Polymorphism
// ============================================
class Admin : public User {
public:
    // Constructor
    Admin(string n, string e) : User(n, e) {}

    // Override displayDashboard - Runtime Polymorphism
    void displayDashboard() {
                cout << "--- ADMIN PANEL ---" << endl;
        cout << "Admin: " << name << endl;
        cout << "Access: Full system control" << endl;
    }

    void removeUser(string userName) {
                cout << "Admin removed user: " << userName << endl;
    }
};


// ============================================
// MAIN FUNCTION
// Shows all OOP concepts in action
// ============================================
int main() {
        cout << "===== QUIZZIFY AI - OOP DEMO =====" << endl << endl;

    // 1. ENCAPSULATION + CONSTRUCTOR
    cout << "--- Creating Questions ---" << endl;
    vector<string> opts1 = {"Data Hiding", "Inheritance", "Polymorphism", "None"};
    Question q1("What is Encapsulation?", opts1, 0);
    q1.display();
    cout << "Correct answer check: " << (q1.checkAnswer(0) ? "Correct!" : "Wrong!") << endl;
    cout << endl;

    // 2. ABSTRACTION + INHERITANCE + RUNTIME POLYMORPHISM
    cout << "--- Creating Assessments ---" << endl;
    // Base class pointer pointing to derived class object = Polymorphism
    Assessment* test1 = new PracticeQuiz("Operating Systems");
    Assessment* test2 = new CompetitiveTest("Computer Networks", 600);

    // Same function call - different behaviour at runtime = Runtime Polymorphism
    test1->conductAssessment();
    cout << endl;
    test2->conductAssessment();
    cout << endl;

    // 3. INHERITANCE + POLYMORPHISM with User hierarchy
    cout << "--- User Hierarchy ---" << endl;
    User* user1 = new Student("Krish", "krish@college.edu");
    User* user2 = new Admin("Professor", "prof@college.edu");

    // Same function call on base class pointer - different result each time
    user1->displayDashboard();
    cout << endl;
    user2->displayDashboard();
    cout << endl;

    // 4. DESTRUCTOR - called when delete is used
    cout << "--- Cleaning Up ---" << endl;
    delete test1;
    delete test2;
    delete user1;
    delete user2;

    cout << endl << "Program ended." << endl;
    return 0;
}
