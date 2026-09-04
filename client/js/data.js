// Smart Campus Seed Dataset for Demonstration & Presentation
const INITIAL_DATA = {
  notices: [
    {
      id: 'not-101',
      title: 'End-Semester Examination Schedule (Spring 2026)',
      category: 'Exams',
      priority: 'Urgent',
      date: '18 Aug 2026',
      author: 'Office of Controller of Examinations',
      content: 'The finalized timetable for the End-Semester Theory & Practical examinations is now released. Students must carry their hall tickets and valid college ID cards. Any unfair means will lead to strict disciplinary actions.',
      badgeClass: 'tag-exams',
      isUrgent: true,
      attachment: 'Final_Exam_Datesheet_2026.pdf'
    },
    {
      id: 'not-102',
      title: 'Annual TechFest "INVENTO 2026" - Call for Registrations',
      category: 'Events',
      priority: 'Important',
      date: '17 Aug 2026',
      author: 'Student Council & Tech Club',
      content: 'Gear up for the biggest technical fest of the year! Hackathons, Robotics Arena, Coding Battles, and Project Exhibitions. Total cash prizes worth ₹2,50,000. Last date for team registrations is 25th August.',
      badgeClass: 'tag-events',
      isUrgent: false,
      attachment: 'Invento_Rulebook.pdf'
    },
    {
      id: 'not-103',
      title: 'Google & Microsoft Campus Placement Drive 2026-27',
      category: 'Placement',
      priority: 'Important',
      date: '16 Aug 2026',
      author: 'Training & Placement Cell (T&P)',
      content: 'Eligible final-year students (B.Tech CSE/IT/ECE) with CGPA > 7.5 are invited to register for upcoming on-campus recruitment rounds. Ensure your resume and GitHub profiles are updated on the placement portal.',
      badgeClass: 'tag-placement',
      isUrgent: false,
      attachment: 'Job_Description_SDE.pdf'
    },
    {
      id: 'not-104',
      title: 'Hostel Wi-Fi Upgrade & Scheduled Maintenance',
      category: 'Academic',
      priority: 'Normal',
      date: '15 Aug 2026',
      author: 'IT Infrastructure Dept',
      content: 'Wi-Fi access points in Boys Hostel Blocks A & B will undergo a fiber upgrade this weekend from 1:00 AM to 5:00 AM. Internet connectivity may be intermittent during this window.',
      badgeClass: 'tag-academic',
      isUrgent: false
    }
  ],

  lostFound: [
    {
      id: 'lf-201',
      type: 'lost',
      title: 'Apple AirPods Pro (2nd Gen) in White Case',
      category: 'Electronics',
      location: 'Central Library, 2nd Floor Reading Hall',
      dateTime: '17 Aug 2026, 04:30 PM',
      description: 'Lost my white AirPods case with a small anime sticker on the back. Left it on Desk #42 while studying.',
      contactName: 'Aarav Sharma',
      contactPhone: '+91 98765 43210',
      status: 'Open', // 'Open', 'Claimed', 'Resolved'
      icon: '🎧'
    },
    {
      id: 'lf-202',
      type: 'found',
      title: 'College ID Card & Metro Pass',
      category: 'ID Cards',
      location: 'Near Canteen Counter 2',
      dateTime: '18 Aug 2026, 11:15 AM',
      description: 'Found an ID card belonging to Roll No: 22BCSE104 (Rohan Verma) along with a blue Delhi Metro smart card.',
      contactName: 'Priya Patel (Faculty, ECE)',
      contactPhone: 'Security Desk / Ext 402',
      status: 'Open',
      icon: '🪪'
    },
    {
      id: 'lf-203',
      type: 'lost',
      title: 'HP Spectre Laptop Charger (Type-C 65W)',
      category: 'Electronics',
      location: 'Computer Lab 3 (Block C)',
      dateTime: '16 Aug 2026, 02:00 PM',
      description: 'Black HP Type-C power adapter with yellow velcro strap. Needed urgently for project work.',
      contactName: 'Sameer Khan',
      contactPhone: '+91 98112 34567',
      status: 'Open',
      icon: '🔌'
    },
    {
      id: 'lf-204',
      type: 'found',
      title: 'Scientific Calculator Casio fx-991EX',
      category: 'Books & Stationery',
      location: 'Audi-1, Row G',
      dateTime: '15 Aug 2026, 05:00 PM',
      description: 'Found after the Mathematics seminar. It has initials "V.K." written on the back battery cover.',
      contactName: 'Campus Security Desk',
      contactPhone: 'Main Gate Booth',
      status: 'Claimed',
      icon: '🔢'
    }
  ],

  complaints: [
    {
      id: 'cmp-301',
      title: 'High-Speed Wi-Fi Router Down in Lab 4',
      category: 'IT & Wi-Fi',
      urgency: 'High',
      location: 'Block B, 3rd Floor, Lab 4',
      reportedBy: 'Kavita Joshi (CSE 3rd Year)',
      date: '18 Aug 2026',
      description: 'The primary access point is blinking red and students are unable to connect to the cloud sandbox during lab sessions.',
      status: 'In Progress', // 'Submitted', 'In Progress', 'Resolved'
      assignedTo: 'Network Admin (Er. Rajesh)',
      resolutionNote: 'Technician dispatched to replace the PoE switch.'
    },
    {
      id: 'cmp-302',
      title: 'Projector HDMI Audio & Display Glitch',
      category: 'Classroom & Labs',
      urgency: 'Normal',
      location: 'Seminar Hall 201',
      reportedBy: 'Dr. Alok Verma (Faculty)',
      date: '17 Aug 2026',
      description: 'Projector flickers whenever resolution is set above 1080p, and HDMI audio port is loose.',
      status: 'Submitted',
      assignedTo: 'AV Support Team',
      resolutionNote: 'Scheduled for inspection on Wednesday.'
    },
    {
      id: 'cmp-303',
      title: 'Water Purifier & Dispenser Leakage',
      category: 'Cleanliness & Hygiene',
      urgency: 'Normal',
      location: 'Hostel Block A, Ground Floor',
      reportedBy: 'Mohit Rawat',
      date: '15 Aug 2026',
      description: 'Water overflow tray is damaged causing water accumulation near the main staircase.',
      status: 'Resolved',
      assignedTo: 'Facility Maintenance',
      resolutionNote: 'Valve replaced and drainage cleaned successfully.'
    }
  ],

  resources: [
    { id: 'res-1', name: 'Main Auditorium (Audi-1)', location: 'Academic Block A', capacity: 500, type: 'Hall', icon: '🎭' },
    { id: 'res-2', name: 'Smart Seminar Hall 102', location: 'Block C, 1st Floor', capacity: 120, type: 'Seminar', icon: '📽️' },
    { id: 'res-3', name: 'AI & Robotics Innovation Lab', location: 'Tech Park, 2nd Floor', capacity: 40, type: 'Lab', icon: '🤖' },
    { id: 'res-4', name: 'High-Performance Computing Lab', location: 'Block B, Ground Floor', capacity: 60, type: 'Lab', icon: '💻' },
    { id: 'res-5', name: 'Library Quiet Study Pod A', location: 'Central Library 3rd Floor', capacity: 8, type: 'Study', icon: '📚' }
  ],

  bookings: [
    {
      id: 'bk-401',
      resourceId: 'res-2',
      resourceName: 'Smart Seminar Hall 102',
      location: 'Block C, 1st Floor',
      studentName: 'Aarav Sharma',
      studentEmail: 'aarav@campus.edu',
      bookingDate: '2026-08-22',
      timeSlot: '11:00 AM - 01:00 PM',
      purpose: 'Guest Lecture on Cloud Computing',
      status: 'Approved' // 'Pending', 'Approved', 'Rejected'
    },
    {
      id: 'bk-402',
      resourceId: 'res-3',
      resourceName: 'AI & Robotics Innovation Lab',
      location: 'Tech Park, 2nd Floor',
      studentName: 'Sneha Roy',
      studentEmail: 'sneha@campus.edu',
      bookingDate: '2026-08-24',
      timeSlot: '02:00 PM - 04:00 PM',
      purpose: 'Autonomous Drone Flight Test Demo',
      status: 'Pending'
    }
  ],

  subjects: [
    { code: 'CSUL501', name: 'Design and Analysis of Algorithms (DAA)', credits: 4, type: 'Theory', attendance: '88%', faculty: 'Neetu Agrawal', room: '305', desc: 'Divide & conquer, greedy method, dynamic programming, backtracking, branch & bound, NP-completeness.' },
    { code: 'CSUL511', name: 'Design Patterns & Principles (DPP)', credits: 3, type: 'Theory', attendance: '92%', faculty: 'Sumit Kumar', room: '305 / 405', desc: 'Creational, structural, and behavioral design patterns in modern enterprise software engineering.' },
    { code: 'CSUL502', name: 'Machine Learning (ML)', credits: 4, type: 'Theory', attendance: '85%', faculty: 'Loveleen Kumar', room: '305', desc: 'Supervised & unsupervised learning, regression, classification, neural networks, and model evaluation.' },
    { code: 'CSUP521', name: 'Machine Learning Lab', credits: 2, type: 'Practical Lab', attendance: '95%', faculty: 'Loveleen Kumar', room: 'Computer Lab 19 (First Floor)', desc: 'Hands-on implementation of ML algorithms using Python, Scikit-learn, and PyTorch.' },
    { code: 'CSUP520', name: 'DAA Lab', credits: 2, type: 'Practical Lab', attendance: '90%', faculty: 'Neetu Agrawal', room: 'Computer Lab 20 (First Floor)', desc: 'Implementation and complexity benchmarking of sorting, graph traversal, and shortest path algorithms.' },
    { code: 'CSUL503', name: 'Cryptography & Network Security (CNS)', credits: 3, type: 'Theory', attendance: '82%', faculty: 'Himani Thakur', room: '304 / 305', desc: 'Symmetric & asymmetric encryption, AES, RSA, digital signatures, hashing, and firewalls.' },
    { code: 'CSUT530', name: 'Industrial Training & Project Mentorship', credits: 2, type: 'Training', attendance: '100%', faculty: 'Loveleen Kumar', room: '305', desc: 'Review and evaluation of industrial internships and semester capstone project milestones.' },
    { code: 'CRT', name: 'Campus Recruitment Training (CRT)', credits: 3, type: 'Training', attendance: '91%', faculty: 'Mahender Kumar Beniwal', room: '5F:L4 / 7F:L12', desc: 'Quantitative aptitude, logical reasoning, verbal ability, and technical interview preparation.' },
    { code: 'CEUL560.1', name: 'Climate Change & Sustainable Engineering', credits: 2, type: 'Open Elective', attendance: '80%', faculty: 'Jangid Jitender', room: '303', desc: 'Global warming impacts, carbon accounting, renewable energy transitions, and green policies.' },
    { code: 'CSUP522', name: 'Cryptography & Security Lab', credits: 2, type: 'Practical Lab', attendance: '94%', faculty: 'Himani Thakur', room: 'Computer Lab 21', desc: 'Practical penetration testing, packet sniffing with Wireshark, and SSL/TLS configuration.' }
  ],

  // Student Timetable slots mapped by student / batch (scalable for multiple students)
  timetables: [
    // Monday
    { id: 'tt-101', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'MONDAY', time: '8:15 AM-9:15 AM', startTime: '08:15', endTime: '09:15', duration: '1.0 hours', subjectCode: 'CSUL501', subjectName: 'DAA', room: '305', faculty: 'Neetu Agrawal', type: 'Theory' },
    { id: 'tt-102', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'MONDAY', time: '9:15 AM-10:15 AM', startTime: '09:15', endTime: '10:15', duration: '1.0 hours', subjectCode: 'CSUL511', subjectName: 'DPP', room: '305', faculty: 'Sumit Kumar', type: 'Theory' },
    { id: 'tt-103', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'MONDAY', time: '10:15 AM-11:15 AM', startTime: '10:15', endTime: '11:15', duration: '1.0 hours', subjectCode: 'CSUL502', subjectName: 'Machine Learning', room: '305', faculty: 'Loveleen Kumar', type: 'Theory' },
    { id: 'tt-104', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'MONDAY', time: '1:00 PM-3:00 PM', startTime: '13:00', endTime: '15:00', duration: '2.0 hours', subjectCode: 'CRT', subjectName: 'CRT', room: '5F:L4', faculty: 'Mahender Kumar Beniwal', type: 'Training' },

    // Tuesday
    { id: 'tt-201', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'TUESDAY', time: '8:15 AM-9:15 AM', startTime: '08:15', endTime: '09:15', duration: '1.0 hours', subjectCode: 'CSUL503', subjectName: 'CNS', room: '304', faculty: 'Himani Thakur', type: 'Theory' },
    { id: 'tt-202', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'TUESDAY', time: '9:15 AM-10:15 AM', startTime: '09:15', endTime: '10:15', duration: '1.0 hours', subjectCode: 'CSUL511', subjectName: 'DPP', room: '304', faculty: 'Sumit Kumar', type: 'Theory' },
    { id: 'tt-203', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'TUESDAY', time: '10:15 AM-12:15 PM', startTime: '10:15', endTime: '12:15', duration: '2.0 hours', subjectCode: 'CRT', subjectName: 'CRT', room: '5F:L4', faculty: 'Mahender Kumar Beniwal', type: 'Training' },
    { id: 'tt-204', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'TUESDAY', time: '1:00 PM-3:00 PM', startTime: '13:00', endTime: '15:00', duration: '2.0 hours', subjectCode: 'CSUP521', subjectName: 'Machine Learning Lab', room: 'Computer Lab 19 (First Floor)', faculty: 'Loveleen Kumar', type: 'Practical' },

    // Wednesday
    { id: 'tt-301', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'WEDNESDAY', time: '8:15 AM-10:15 AM', startTime: '08:15', endTime: '10:15', duration: '2.0 hours', subjectCode: 'CSUP520', subjectName: 'DAA Lab', room: 'Computer Lab 20 (First Floor)', faculty: 'Neetu Agrawal', type: 'Practical' },
    { id: 'tt-302', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'WEDNESDAY', time: '10:15 AM-11:15 AM', startTime: '10:15', endTime: '11:15', duration: '1.0 hours', subjectCode: 'CSUL511', subjectName: 'DPP', room: '405', faculty: 'Sumit Kumar', type: 'Theory' },
    { id: 'tt-303', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'WEDNESDAY', time: '1:00 PM-3:00 PM', startTime: '13:00', endTime: '15:00', duration: '2.0 hours', subjectCode: 'CSUL502', subjectName: 'Machine Learning', room: '305', faculty: 'Loveleen Kumar', type: 'Theory' },

    // Thursday
    { id: 'tt-401', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'THURSDAY', time: '8:15 AM-9:15 AM', startTime: '08:15', endTime: '09:15', duration: '1.0 hours', subjectCode: 'CSUL501', subjectName: 'DAA', room: '305', faculty: 'Neetu Agrawal', type: 'Theory' },
    { id: 'tt-402', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'THURSDAY', time: '9:15 AM-10:15 AM', startTime: '09:15', endTime: '10:15', duration: '1.0 hours', subjectCode: 'CSUL503', subjectName: 'CNS', room: '305', faculty: 'Himani Thakur', type: 'Theory' },
    { id: 'tt-403', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'THURSDAY', time: '10:15 AM-11:15 AM', startTime: '10:15', endTime: '11:15', duration: '1.0 hours', subjectCode: 'CSUT530', subjectName: 'Industrial Training', room: '305', faculty: 'Loveleen Kumar', type: 'Training' },
    { id: 'tt-404', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'THURSDAY', time: '12:00 PM-2:00 PM', startTime: '12:00', endTime: '14:00', duration: '2.0 hours', subjectCode: 'CRT', subjectName: 'CRT', room: '7F:L12', faculty: 'Mahender Kumar Beniwal', type: 'Training' },
    { id: 'tt-405', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'THURSDAY', time: '2:00 PM-3:00 PM', startTime: '14:00', endTime: '15:00', duration: '1.0 hours', subjectCode: 'CEUL560.1', subjectName: 'Climate Change', room: '303', faculty: 'Jangid Jitender', type: 'Elective' },

    // Friday
    { id: 'tt-501', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'FRIDAY', time: '8:15 AM-9:15 AM', startTime: '08:15', endTime: '09:15', duration: '1.0 hours', subjectCode: 'CSUL503', subjectName: 'CNS', room: '305', faculty: 'Himani Thakur', type: 'Theory' },
    { id: 'tt-502', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'FRIDAY', time: '9:15 AM-10:15 AM', startTime: '09:15', endTime: '10:15', duration: '1.0 hours', subjectCode: 'CSUL501', subjectName: 'DAA', room: '305', faculty: 'Neetu Agrawal', type: 'Theory' },
    { id: 'tt-503', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'FRIDAY', time: '10:15 AM-11:15 AM', startTime: '10:15', endTime: '11:15', duration: '1.0 hours', subjectCode: 'CSUL502', subjectName: 'Machine Learning', room: '305', faculty: 'Loveleen Kumar', type: 'Theory' },
    { id: 'tt-504', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'FRIDAY', time: '1:00 PM-3:00 PM', startTime: '13:00', endTime: '15:00', duration: '2.0 hours', subjectCode: 'CSUP522', subjectName: 'CNS Lab', room: 'Computer Lab 21', faculty: 'Himani Thakur', type: 'Practical' },

    // Saturday
    { id: 'tt-601', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'SATURDAY', time: '9:15 AM-11:15 AM', startTime: '09:15', endTime: '11:15', duration: '2.0 hours', subjectCode: 'CSUT530', subjectName: 'Capstone Project Review', room: 'Seminar Hall 2', faculty: 'Dr. R. K. Sharma', type: 'Training' },
    { id: 'tt-602', studentEmail: 'student@campus.edu', section: '5th Sem - CSE (Sec A)', day: 'SATURDAY', time: '11:30 AM-1:30 PM', startTime: '11:30', endTime: '13:30', duration: '2.0 hours', subjectCode: 'CRT', subjectName: 'CRT Mock Assessment', room: '5F:L4', faculty: 'Mahender Kumar Beniwal', type: 'Training' }
  ]
};
