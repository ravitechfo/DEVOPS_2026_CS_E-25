const express = require('express');
const router = express.Router();

// Campus Knowledge Base for offline / rapid semantic responses
const CAMPUS_INTENTS = [
  {
    keywords: ['gate pass', 'outing', 'warden', 'hostel', 'leave', 'exit', 'gatepass'],
    title: '🛡️ Hostel Outing & Gate Pass Protocol',
    response: `To apply for a **Hostel Outing Gate Pass**:
1. Go to the **Gate Pass** tab on the navigation bar.
2. Select your outing type (**Local Market**, **Day Outing**, or **Home Leave**).
3. Specify your departure and return time (Evening cutoff is **8:30 PM**).
4. Provide Guardian details. Warden approves requests after verification.
5. Your unique digital pass QR/code (e.g. \`GP-2026-XXXX\`) must be presented at the Main Gate security scanner upon leaving and returning.`,
    suggestedActions: ['Open Gate Pass Form', 'View Outing Status']
  },
  {
    keywords: ['attendance', 'bunk', 'safe bunk', 'shortage', 'percentage', '75%'],
    title: '📊 RTU 75% Attendance & Safe Bunk Policy',
    response: `According to Rajasthan Technical University (RTU) & SKIT academic regulations:
- **Mandatory Minimum Attendance:** 75% overall and per subject to appear in End-Semester examinations.
- **Safe Bunk Formula:** If your attendance is $A$ lectures out of $T$ total lectures ($A/T \\ge 0.75$), you can safely bunk:
  $$\\text{Safe Bunks} = \\left\\lfloor \\frac{A - 0.75 \\times T}{0.75} \\right\\rfloor$$
- **Current Status:** You can check your live subject-wise attendance and safe bunks in the **Attendance** tab!`,
    suggestedActions: ['Open Attendance Tracker', 'Calculate Safe Bunks']
  },
  {
    keywords: ['pyq', 'question paper', 'library', 'syllabus', 'rtu', 'books', 'notes'],
    title: '📚 RTU Syllabi, Notes & Previous Year Questions (PYQs)',
    response: `The **Library & PYQ Hub** contains verified academic materials for all branches:
- **Available Years:** RTU Main & Back exam papers from **2023, 2024, and 2025**.
- **Departments Covered:** Computer Science (CSE), IT, AI & Data Science (AIDS), ECE, Mechanical, and Civil.
- **Resources:** Official RTU schemes, handwritten Toppers Notes, and unit-by-unit syllabus breakdowns.
Navigate to the **Library & PYQs** tab to search and download directly!`,
    suggestedActions: ['Browse RTU PYQs', 'Download Syllabus']
  },
  {
    keywords: ['book', 'lab', 'seminar', 'hall', 'auditorium', 'reservation', 'facility'],
    title: '🏢 Campus Facility & Lab Booking',
    response: `Students and faculty coordinators can reserve campus infrastructure:
- **Available Facilities:**
  1. *AI & Robotics Innovation Lab* (Tech Park, 2nd Floor — Capacity 40)
  2. *Central Seminar Hall 201* (Block A — Capacity 150)
  3. *High-Performance GPU Computing Lab* (Block B — Capacity 60)
- **Booking Steps:** Navigate to **More Services ➔ Lab & Hall Booking**, choose the date and available time slot (e.g., 09:00 AM - 11:00 AM), and submit for automated approval.`,
    suggestedActions: ['Book a Facility', 'View My Reservations']
  },
  {
    keywords: ['complaint', 'grievance', 'wifi', 'wi-fi', 'water', 'electricity', 'projector', 'repair'],
    title: '🛠️ Grievance Redressal & Maintenance',
    response: `Notice an issue on campus?
- You can register complaints under **IT & Wi-Fi**, **Hostel Facilities**, **Classroom & Labs**, or **Sanitation**.
- Average resolution time is **24-48 hours**.
- The maintenance team dispatches technicians and updates the status from *Submitted* ➔ *In Progress* ➔ *Resolved* with resolution remarks in your dashboard!`,
    suggestedActions: ['Submit New Grievance', 'Track Grievances']
  },
  {
    keywords: ['lost', 'found', 'wallet', 'id card', 'airpods', 'charger', 'keys'],
    title: '🔍 Campus Lost & Found Hub',
    response: `Misplaced or found an item on campus?
- **Report Item:** Go to **More Services ➔ Lost & Found Hub** and post details with location and photo/contact info.
- **Claiming:** If you spot your item listed by security or a peer, click **"Claim Item"** to retrieve it from the Central Security Desk (Main Gate Booth) upon identity verification.`,
    suggestedActions: ['Report Lost Item', 'View Found Items']
  },
  {
    keywords: ['exam', 'datesheet', 'invento', 'techfest', 'notice', 'announcement', 'placement'],
    title: '📢 Campus Notices & Announcements',
    response: `Latest highlights from the SKIT Notice Board:
- **End-Sem Exams (Spring 2026):** Timetable published; admit cards mandatory.
- **INVENTO 2026 TechFest:** Robotics, Hackathons, and Coding challenges with ₹2,50,000 prize pool.
- **Placement Drive:** Google & Microsoft campus registration open for final-year students (CGPA > 7.5).
Check the **Notices** tab for full PDF attachments and circulars!`,
    suggestedActions: ['View All Notices', 'Check Exam Schedule']
  }
];

// POST /api/ai/chat - Intelligent Assistant response
router.post('/chat', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required.' });
    }

    const q = query.toLowerCase().trim();

    // Check matching intent
    let matchedIntent = null;
    let maxKeywordMatches = 0;

    for (const intent of CAMPUS_INTENTS) {
      let matches = 0;
      for (const kw of intent.keywords) {
        if (q.includes(kw)) matches++;
      }
      if (matches > maxKeywordMatches) {
        maxKeywordMatches = matches;
        matchedIntent = intent;
      }
    }

    if (matchedIntent && maxKeywordMatches > 0) {
      return res.json({
        reply: matchedIntent.response,
        title: matchedIntent.title,
        suggestedActions: matchedIntent.suggestedActions,
        isContextual: true
      });
    }

    // Default Smart Campus Assistant fallback
    const genericResponse = `Hello! I am your **SKIT Smart Campus AI Assistant** 🎓. 

I can assist you with:
- 🛡️ **Hostel Gate Passes & Outing permissions**
- 📊 **75% Attendance rules & Safe Bunk calculation**
- 📚 **RTU Syllabus & Previous Year Question Papers (PYQs)**
- 🏢 **Lab & Seminar Hall reservations**
- 🛠️ **Campus Grievances & Wi-Fi complaints**
- 🔍 **Lost & Found item reports**

*Try asking: "How do I apply for a gate pass?", "Can I bunk class?", or "Where are RTU PYQs?"*`;

    return res.json({
      reply: genericResponse,
      title: '🎓 Smart Campus AI Assistant',
      suggestedActions: ['Gate Pass Rules', 'Safe Bunks', 'RTU PYQs', 'Book a Lab'],
      isContextual: false
    });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Internal AI service error' });
  }
});

module.exports = router;
