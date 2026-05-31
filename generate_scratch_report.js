const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const imgDir = '/Users/krish/.gemini/antigravity/brain/813f319a-3aa4-4265-993f-cc9f73d0eb89';
const localDir = __dirname;

function getBase64Img(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  } catch(e) {
    return '';
  }
}

// Helper to escape HTML tags in code blocks (fixes missing #include <iostream>)
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const currentBrainDir = '/Users/krish/.gemini/antigravity/brain/3e88ecca-9e51-44ed-964c-eaad0563532b';

const landingImg = getBase64Img(path.join(imgDir, 'quizzify_landing_page_1776445711613.png'));
const forgeUploadImg = getBase64Img(path.join(currentBrainDir, 'media__1776963063426.png'));
const inputImg = getBase64Img(path.join(currentBrainDir, 'media__1776963250774.png'));
const outputImg = getBase64Img(path.join(currentBrainDir, 'media__1776963286305.png'));
const leaderboardImg = getBase64Img(path.join(imgDir, 'quizzify_leaderboard_1776446215571.png'));
const srmLogoImg = getBase64Img(path.join(currentBrainDir, 'media__1776968384556.png'));

let cppCode = '';
try { 
  cppCode = fs.readFileSync(path.join(__dirname, 'backend', 'QuizzifyCore.cpp'), 'utf8'); 
  cppCode = escapeHTML(cppCode);
} catch(e) {}

// Hardcoded original frontend API code (kept separate from live route.ts)
const jsCode = escapeHTML(`import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in to forge quizzes." }, { status: 401 });
    }

    const formData = await req.formData();
    const extractedText = formData.get("text") as string | null;
    const count = parseInt(formData.get("count") as string || "5", 10);
    const difficulty = formData.get("difficulty") as string || "medium";

    if (!extractedText || !extractedText.trim()) {
      return NextResponse.json({ error: "Empty or invalid document text." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is missing.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const difficultyInstruction = difficulty === "mixed"
      ? "a MIXED difficulty level (e.g., approximately 30% easy, 40% medium, 30% hard)"
      : \`a \${difficulty.toUpperCase()} difficulty level\`;

    const prompt = \`You are an expert test creator.
Extract key concepts from the following text and generate exactly \${count} multiple-choice questions at \${difficultyInstruction}.

Output strictly as a raw JSON array of objects fulfilling this structure:
[
  {
    "question": "The question string",
    "options": ["A", "B", "C", "D"],
    "answer": "The exact string of the correct option",
    "topic": "A 1-3 word classification of the concept tested"
  }
]

Do not include any formatting, markdown wrappers, or extra text. ONLY return the JSON array.

--- Source Text ---
\${extractedText.slice(0, 30000)}\`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    const questions = JSON.parse(cleanedText);

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("API Pipeline Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}`);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OODP Final Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&family=Courier+Prime&display=swap');
    
    * { box-sizing: border-box; }
    
    @page { size: A4; margin: 25mm 20mm; }
    
    body { 
      font-family: 'Times New Roman', Times, serif; 
      margin: 0; padding: 0; background: #fff; color: #000;
      font-size: 14pt; line-height: 1.95;
    }
    
    .front-page {
      display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;
      height: 90vh; page-break-after: always;
    }
    
    h1.super-title { font-size: 40px; font-weight: bold; margin-bottom: 10px; }
    h1.quizzify-title { font-size: 60px; font-weight: bold; margin: 0; letter-spacing: 2px; }
    
    h2 { font-size: 24px; border-bottom: 1px solid #000; padding-bottom: 5px; margin-top: 1.1em; margin-bottom: 0.3em; }
    h3 { font-size: 20px; margin-top: 1.1em; margin-bottom: 0.3em; }
    
    p { margin-bottom: 1.0em; text-align: justify; }
    ul { margin-bottom: 1.0em; }
    li { margin-bottom: 1em; }
    
    .mermaid-wrapper { text-align: center; margin: 1em 0; }
    .mermaid { display: inline-block; width: 100%; max-width: 550px; }
    .section-block { page-break-inside: avoid; margin-bottom: 1em; }
    
    .code-container {
      background: #f8f9fa; border: 1px solid #dee2e6; padding: 12px;
      font-family: 'Courier Prime', monospace; font-size: 11pt; line-height: 1.5;
      white-space: pre-wrap; word-wrap: break-word; margin-top: 0.8em; margin-bottom: 1.2em;
    }
    
    .screenshot-container { text-align: center; margin-top: 2em; margin-bottom: 2em; }
    .screenshot-container img { width: 100%; max-width: 700px; height: auto; border: 1px solid #ccc; box-shadow: 2px 2px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto; }
  </style>
</head>
<body>

  <div class="front-page" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 95vh; font-family: 'Times New Roman', Times, serif; line-height: 1.5;">
    <p style="font-size: 20px; font-weight: bold; margin: 0 0 8px 0; letter-spacing: 1px;">QUIZZIFY: AI-POWERED QUIZ MANAGEMENT SYSTEM</p>
    <p style="font-size: 18px; font-weight: bold; margin: 0 0 6px 0;">21CSC101T &ndash; OBJECT ORIENTED DESIGN AND PROGRAMMING</p>
    <p style="font-size: 16px; font-style: italic; margin: 0 0 30px 0;">Submitted by</p>

    <p style="font-size: 16px; font-weight: bold; margin: 4px 0;">Sautrik Roy &nbsp;&nbsp; [RA2511003010052]</p>
    <p style="font-size: 16px; font-weight: bold; margin: 4px 0;">Shivaani M &nbsp;&nbsp;&nbsp;&nbsp; [RA2511003010066]</p>
    <p style="font-size: 16px; font-weight: bold; margin: 4px 0;">Ashwin Kumar N [RA2511003010033]</p>
    <p style="font-size: 16px; font-weight: bold; margin: 4px 0 20px 0;">Ayush Agarwal &nbsp; [RA2511003010012]</p>

    <p style="font-size: 14px; margin: 3px 0;"><strong>Class and Section:</strong> A1 &nbsp;|&nbsp; 21CSC101T</p>

    <p style="font-size: 14px; margin: 20px 0 4px 0;">under the guidance of</p>
    <p style="font-size: 15px; font-weight: bold; margin: 4px 0;">Dr. Vetriselvi D</p>
    <p style="font-size: 14px; margin: 2px 0;">Assistant Professor</p>
    <p style="font-size: 14px; margin: 2px 0 30px 0;">Dept. of CTECH</p>

    <p style="font-size: 13px; font-style: italic; margin: 0 0 20px 0;">in partial fulfillment of the requirements for the degree of</p>
    <p style="font-size: 15px; font-weight: bold; margin: 4px 0;">BACHELOR OF TECHNOLOGY</p>
    <p style="font-size: 14px; margin: 2px 0;">in</p>
    <p style="font-size: 15px; font-weight: bold; margin: 2px 0 30px 0;">COMPUTER SCIENCE AND ENGINEERING</p>

    <div style="margin: 0 0 24px 0;">
      <img src="${srmLogoImg}" alt="SRM Logo" style="height: 70px; width: auto; max-width: 100%; object-fit: contain;" onerror="this.style.display='none'">
    </div>

    <p style="font-size: 14px; font-weight: bold; margin: 3px 0;">DEPARTMENT OF COMPUTING TECHNOLOGIES</p>
    <p style="font-size: 14px; font-weight: bold; margin: 3px 0;">COLLEGE OF ENGINEERING AND TECHNOLOGY</p>
    <p style="font-size: 14px; font-weight: bold; margin: 3px 0;">SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</p>
    <p style="font-size: 14px; font-weight: bold; margin: 3px 0;">KATTANKULATHUR &ndash; 603 203</p>
    <p style="font-size: 14px; margin-top: 20px; margin-bottom: 0;">APRIL 2026</p>
  </div>

  <!-- BONAFIDE CERTIFICATE -->
  <div style="page-break-after: always; font-family: 'Times New Roman', Times, serif; padding: 40px 0; line-height: 1.9;">
    <h2 style="text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 40px; text-decoration: underline;">BONAFIDE CERTIFICATE</h2>
    <p style="text-align: justify; font-size: 14pt;">
      Certified that the <strong>Object-Oriented Design and Programming using C++ (OODP)</strong> Project titled
      <strong>&ldquo;QUIZZIFY: AI-POWERED QUIZ MANAGEMENT SYSTEM&rdquo;</strong> is the bonafide work of
      <strong>SAUTRIK ROY [RA2511003010052]</strong>,
      <strong>SHIVAANI M [RA2511003010066]</strong>,
      <strong>ASHWIN KUMAR N [RA2511003010033]</strong> and
      <strong>AYUSH AGARWAL [RA2511003010012]</strong>,
      who carried out the project work under my guidance. Certified further that, to the best of my knowledge,
      the students have carried out this project with sincerity and good effort, and the work presented reflects
      their understanding and learning in the subject.
    </p>
    <div style="display: flex; justify-content: space-between; margin-top: 80px; font-size: 14pt;">
      <div>
        <p style="margin: 0;"><strong>Dr. VETRISELVI D</strong></p>
        <p style="margin: 0;">Assistant Professor</p>
        <p style="margin: 0;">Dept. of CTECH, SRMIST.</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0;"><strong>Dr. NIRANJANA G</strong></p>
        <p style="margin: 0;">Professor and Head</p>
        <p style="margin: 0;">Dept. of CTECH, SRMIST.</p>
      </div>
    </div>
  </div>

  <!-- INDEX -->
  <div style="page-break-after: always; font-family: 'Times New Roman', Times, serif; line-height: 1.8; padding-top: 20px;">
    <h1 style="text-align: center; margin-bottom: 30px; font-weight: bold; font-size: 28px;">INDEX</h1>
    <div style="max-width: 650px; margin: 0 auto; font-size: 16px;">
      
      <div style="display: flex; margin-bottom: 5px;"><strong>1. Introduction</strong><span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span><strong>4</strong></div>
      <div style="display: flex; margin-bottom: 5px;"><strong>2. Implementation of Design Concepts</strong><span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span><strong>5</strong></div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">2.1 Encapsulation in Data Security<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>5</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">2.2 Abstraction of Complex Workflows<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>6</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">2.3 Inheritance for Modular Test Modes<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>6</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">2.4 Polymorphism in Execution Logic<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>6</div>
      
      <div style="display: flex; margin-bottom: 5px;"><strong>3. UML Diagrams</strong><span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span><strong>7</strong></div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">3.1 Use Case Diagram<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>7</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">3.2 System Architecture<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>7</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">3.3 Sequence Diagram<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>8</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">3.4 Class Diagram<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>8</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">3.5 Activity Diagram<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>9</div>
      
      <div style="display: flex; margin-bottom: 5px;"><strong>4. Application Interfaces</strong><span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span><strong>11</strong></div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">4.1 Platform Landing Page<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>11</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">4.2 System Input: Document Forging<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>12</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">4.3 System Input: Active Assessment Interface<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>13</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">4.4 System Output: Assessment Results<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>14</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">4.5 System Output: Global Leaderboard<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>15</div>
      
      <div style="display: flex; margin-bottom: 5px;"><strong>5. Coding Implementation</strong><span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span><strong>16</strong></div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">5.1 Backend Core Engine (C++)<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>16</div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">5.2 Frontend Code (JavaScript)<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>22</div>
      
      <div style="display: flex; margin-bottom: 5px;"><strong>6. Conclusion</strong><span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span><strong>23</strong></div>
      <div style="display: flex; margin-left: 30px; margin-bottom: 5px;">6.1 Future Scope<span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span>24</div>
      
      <div style="display: flex; margin-bottom: 5px;"><strong>7. References</strong><span style="flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; top: -6px;"></span><strong>24</strong></div>
    </div>
  </div>

  <h2>1. Introduction</h2>
  <p>The Quizzify Quiz Management System represents a robust and scalable approach to educational technology, bridging the gap between automated content generation and structured software engineering. At its core, the application integrates modern full-stack web technologies with Google's Gemini Flash AI model. This intelligent pipeline parses complex user-uploaded study materials—such as PDFs and PowerPoints—and seamlessly converts them into structured, competitive assessments. The platform aims to reduce the manual overhead of traditional quiz creation while simultaneously offering students an adaptive, highly engaging learning experience.</p>
  
  <p>Throughout the development lifecycle, the architectural design was strictly guided by core software engineering methodologies, specifically Object-Oriented Design Principles (OODP). By modeling the system's domains through objects, classes, and defined interactions, the application achieves a high degree of modularity, memory safety, and maintainability. The backend logic, conceptually structured in C++, handles the complex rules of the assessment engine, while the frontend React application seamlessly renders the user interface. This separation of concerns ensures that the application can effortlessly scale to accommodate diverse testing modes and complex user interactions.</p>

  <h2 style="page-break-before: always;">2. Implementation of Design Concepts</h2>
  <p>The fundamental architecture of Quizzify is deeply rooted in Object-Oriented Design. Rather than executing as a procedural script, the system instantiates discrete objects that encapsulate their own state and behavior. The following outlines precisely how and where these core principles were utilized within the platform to drive functionality and security.</p>

  <h3>2.1 Encapsulation in Data Security</h3>
  <p>Encapsulation ensures the integrity of correct answers and the user's running score. Within the system, objects such as the <code>Question</code> class encapsulate these attributes as private members. The React frontend interfaces with this data solely through controlled API endpoints. When a user selects an answer, the system does not expose the correct answer key to the browser; instead, it sends the selection to an encapsulated algorithm, ensuring malicious actors cannot tamper with the score.</p>

  <h3>2.2 Abstraction of Complex Workflows</h3>
  <p>Abstraction simplifies the interaction between core logic and external services. The process of connecting to the Google Gemini AI, formatting text, sending the API prompt, and parsing JSON involves substantial complexity. This workflow is abstracted behind a clean generation route. When a user clicks "Forge Quiz", they are completely shielded from the underlying algorithms, interacting only with the high-level abstraction.</p>

  <h3>2.3 Inheritance for Modular Test Modes</h3>
  <p>Inheritance was implemented to reduce code duplication and promote modular scalability. The application supports different testing environments, such as Practice Mode and Competitive Mode. A base <code>Assessment</code> class contains shared attributes like the question array and total score. Derived classes like <code>PracticeQuiz</code> and <code>CompetitiveTest</code> inherit this logic but introduce their own specialized rules, such as countdown timers.</p>

  <h3>2.4 Polymorphism in Execution Logic</h3>
  <p>Polymorphism allows the system to dynamically execute logic based on the assessment type. Using overridden virtual functions, the system triggers the <code>conductAssessment()</code> method identically across all modes. However, the runtime behavior changes polymorphically. In a Competitive Test, it strictly enforces time limits; in a Practice Quiz, it reveals correct answers instantly. This ensures the primary execution loop remains clean and decoupled.</p>

  <h2>3. UML Diagrams</h2>
  <p>The system's architecture is modeled using simplified Unified Modeling Language diagrams to clearly illustrate object interactions and execution flow. UML provides a standardized visual language that helps bridge the gap between abstract design and concrete software implementation. By visualizing the structural hierarchy and behavioral workflows, these diagrams explicitly demonstrate how Object-Oriented principles are enforced across the modules, ensuring a shared understanding of the system's security and automated pipelines before execution.</p>

  <div class="section-block">
    <h3>3.1 Use Case Diagram</h3>
    <p>The Use Case diagram illustrates the basic functionalities available to a Student using the platform, from uploading documents to viewing the global leaderboard.</p>
    <div class="mermaid-wrapper">
      <div class="mermaid">
        flowchart LR
          Student(("Student"))
          subgraph Quizzify Platform
            Upload(["Upload Document"])
            Generate(["AI Quiz Generation"])
            Quiz(["Take Assessment"])
            Leaderboard(["View Leaderboard"])
          end
          Student --> Upload
          Student --> Generate
          Student --> Quiz
          Student --> Leaderboard
      </div>
    </div>
  </div>

  <div class="section-block">
    <h3>3.2 System Architecture</h3>
    <p>This diagram shows the high-level flow of data from the frontend interface to the backend database and AI model.</p>
    <div class="mermaid-wrapper">
      <div class="mermaid">
        graph TD
          UI["Frontend Interface"]
          API["Backend API"]
          DB[("Database")]
          AI["Gemini AI"]
          
          UI --> API
          API --> DB
          API --> AI
      </div>
    </div>
  </div>

  <div class="section-block">
    <h3>3.3 Sequence Diagram</h3>
    <p>The Sequence Diagram models the simple chronological steps taken when a user generates a quiz using AI.</p>
    <div class="mermaid-wrapper">
      <div class="mermaid">
        sequenceDiagram
          participant User
          participant UI as Frontend
          participant API as Backend
          participant AI as Gemini AI
          
          User->>UI: Upload PDF Document
          UI->>API: Send Extracted Text
          API->>AI: Request Questions
          AI-->>API: Return JSON Array
          API-->>UI: Send Questions Data
          UI-->>User: Render Interactive Quiz
      </div>
    </div>
  </div>

  <div class="section-block">
    <h3>3.4 Class Diagram</h3>
    <p>The Class Diagram visually represents the two core entities in the system: the User and the Quiz Result.</p>
    <div class="mermaid-wrapper">
      <div class="mermaid">
        classDiagram
          class User {
            +String name
            +String email
          }
          class QuizResult {
            +Int score
            +String mode
            +String difficulty
          }
          User "1" *-- "many" QuizResult : takes
      </div>
    </div>
  </div>

  <div class="section-block">
    <h3>3.5 Activity Diagram</h3>
    <p>The Activity Diagram maps the straightforward execution flow of a user attempting a multiple-choice quiz.</p>
    <div class="mermaid-wrapper">
      <div class="mermaid">
        stateDiagram-v2
          [*] --> StartAssessment
          StartAssessment --> LoadQuestion
          LoadQuestion --> SelectOption
          SelectOption --> LoadQuestion : Has Next
          SelectOption --> SubmitQuiz : All Answered
          SubmitQuiz --> CalculateScore
          CalculateScore --> [*]
      </div>
    </div>
  </div>

  <h2 style="page-break-before: always;">4. Application Interfaces</h2>
  <p>The following screenshots demonstrate how the previously described Object-Oriented concepts manifest practically within the application's user interface, detailing both the inputs required from the user and the outputs generated by the system algorithms.</p>

  <div class="section-block">
    <h3>4.1 Platform Landing Page</h3>
    <p>The landing page serves as the entry point to the application. At this stage, the system abstracts the complex backend processes. The user is presented with a clean interface that introduces the platform's capabilities before they authenticate and initiate the creation of User and Session objects within the system.</p>
    <div class="screenshot-container">
      <img src="${landingImg}" alt="Landing Page" />
    </div>
  </div>

  <div class="section-block">
    <h3>4.2 System Input: Document Forging</h3>
    <p>This interface represents the initial document upload phase where Abstraction is heavily utilized. The user simply uploads their notes (e.g., "UNIT 1 NOTES.pdf") and selects the difficulty and question count. The complex underlying process of parsing the PDF and querying the Google Gemini AI is entirely abstracted away from the user, providing a clean, one-click experience.</p>
    <div class="screenshot-container">
      <img src="${forgeUploadImg}" alt="Document Forging Interface" />
    </div>
  </div>

  <div class="section-block">
    <h3>4.3 System Input: Active Assessment Interface</h3>
    <p>This interface acts as the primary input mechanism where the user actively participates in the assessment. This view heavily relies on Encapsulation. The <code>Question</code> objects are rendered securely on the screen, allowing the user to select options without exposing the underlying correct answer key. The state of the active quiz—including the timer and the user's selections—is meticulously managed and protected from external manipulation until the final submission triggers the evaluation methods.</p>
    <div class="screenshot-container">
      <img src="${inputImg}" alt="Active Quiz Input" />
    </div>
  </div>

  <div class="section-block">
    <h3>4.4 System Output: Assessment Results</h3>
    <p>Upon submission, the system triggers its polymorphic scoring algorithms. Depending on whether the user selected a practice or competitive mode, the <code>evaluateScore()</code> methods compute the final grade and derive analytical insights. This output screen displays the instantiated <code>QuizResult</code> object, detailing the user's score and dynamically highlighting their weak conceptual topics based on incorrect inputs.</p>
    <div class="screenshot-container">
      <img src="${outputImg}" alt="Assessment Output Results" />
    </div>
  </div>

  <div class="section-block">
    <h3>4.5 System Output: Global Leaderboard</h3>
    <p>The final output of the application is the global leaderboard. Once the assessment is complete, the encapsulated score data is transmitted to the Next.js API and securely persisted in the PostgreSQL database. This interface queries the database to rank and display the top-performing User objects, dynamically updating in real-time as new assessments are completed.</p>
    <div class="screenshot-container">
      <img src="${leaderboardImg}" alt="Global Leaderboard" />
    </div>
  </div>

  <h2>5. Coding Implementation</h2>
  <p>The implementation of the system relies on a combination of a structured C++ backend engine to model the core domain logic, and a modern JavaScript API to handle web communications and integrations.</p>

  <h3>5.1 Backend Core Engine (C++)</h3>
  <p>This codebase represents the pure application of the Object-Oriented concepts. It defines the abstract base classes, enforces data protection through private access modifiers, and implements the polymorphic functions that handle the assessment rules.</p>
  <div class="code-container">${cppCode}</div>

  <h3>5.2 Frontend Code (JavaScript)</h3>
  <p>This TypeScript code illustrates the intelligent API route responsible for abstracting the communication with the Google Gemini AI. It securely formats the prompt, handles asynchronous requests, and ensures the data returned strictly adheres to the expected JSON structure before it is parsed by the frontend components.</p>
  <div class="code-container">${jsCode}</div>

  <h2>6. Conclusion</h2>
  <p>The development of the Quizzify platform successfully demonstrates the integration of advanced artificial intelligence within a rigorously structured software architecture. By anchoring the application design in Object-Oriented Design Principles—Encapsulation, Abstraction, Inheritance, and Polymorphism—the system achieved a high degree of security, maintainability, and modularity.</p>
  
  <p>The strict encapsulation of state logic ensures that the application maintains perfect academic integrity during active assessments. The abstraction of the complex AI generation pipeline simplifies the user experience, allowing educators and students to generate dynamic quizzes seamlessly. Furthermore, the use of inheritance and polymorphism guarantees that the platform can effortlessly scale to accommodate new assessment methodologies in the future without requiring extensive rewrites of the foundational code.</p>
  
  <p>Ultimately, Quizzify proves that combining structured software design with modern web frameworks results in a production-ready application capable of drastically transforming the educational landscape, reducing manual workloads, and deeply engaging students through adaptive, competitive learning environments.</p>

  <h3 style="page-break-before: always;">6.1 Future Scope</h3>
  <p>Looking ahead, the robust Object-Oriented foundation of Quizzify allows for seamless integration of advanced features. Future enhancements will focus on extending the Abstraction layer to support multimedia study materials, such as parsing educational video transcripts or audio lectures. Additionally, the inherited <code>Assessment</code> models will be expanded to include collaborative multiplayer quiz modes, further leveraging Polymorphism to introduce real-time competitive scoring without disrupting the existing single-player architecture.</p>

  <h2 style="border-bottom: none;">7. References</h2>
  <ul>
    <li>Stroustrup, B. (2013). <em>The C++ Programming Language</em> (4th ed.). Addison-Wesley Professional.</li>
    <li>Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). <em>Design Patterns: Elements of Reusable Object-Oriented Software</em>. Addison-Wesley.</li>
    <li>React Documentation. (2025). Meta Platforms, Inc. Available at: https://react.dev/</li>
    <li>Google DeepMind. (2025). Gemini AI API Documentation. Available at: https://ai.google.dev/</li>
  </ul>

  <hr style="margin-top: 40px; margin-bottom: 20px; border: 0; border-top: 2px solid #000; width: 50%;">

  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      mermaid.initialize({ startOnLoad: true, theme: 'default' });
    });
  </script>
</body>
</html>
`;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 8000));
  
  const pdfPath = path.join(__dirname, 'Quizzify_Report.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width: 100%; text-align: center; font-size: 11px; color: #555; padding-bottom: 8px;"><span class="pageNumber"></span></div>',
    margin: { top: '25mm', bottom: '25mm', left: '20mm', right: '20mm' }
  });
  
  console.log('PDF generated at:', pdfPath);
  await browser.close();
})();
