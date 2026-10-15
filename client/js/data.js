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
  ],

  attendance: [
    { id: 'att-1', subjectCode: 'CEUL560.1', subjectName: 'Climate Change Science', originalAttended: 12, originalTotal: 27, attended: 12, total: 27, target: 75, faculty: 'Jangid Jitender' },
    { id: 'att-2', subjectCode: 'CRT', subjectName: 'Campus Recruitment Training', originalAttended: 60, originalTotal: 66, attended: 60, total: 66, target: 75, faculty: 'Mahender Kumar Beniwal' },
    { id: 'att-3', subjectCode: 'CSUL501', subjectName: 'Design and Analysis of Algorithms', originalAttended: 20, originalTotal: 31, attended: 20, total: 31, target: 75, faculty: 'Prof. Neetu Agrawal' },
    { id: 'att-4', subjectCode: 'CSUL502', subjectName: 'Machine Learning', originalAttended: 18, originalTotal: 30, attended: 18, total: 30, target: 75, faculty: 'Prof. Loveleen Kumar' },
    { id: 'att-5', subjectCode: 'CSUL503', subjectName: 'Cryptography and Network Security', originalAttended: 26, originalTotal: 30, attended: 26, total: 30, target: 75, faculty: 'Prof. Himani Thakur' },
    { id: 'att-6', subjectCode: 'CSUL504', subjectName: 'Full Stack Development', originalAttended: 14, originalTotal: 19, attended: 14, total: 19, target: 75, faculty: 'Prof. Sumit Kumar' },
    { id: 'att-7', subjectCode: 'CSUL511', subjectName: 'DevOps Practices and Principles', originalAttended: 27, originalTotal: 33, attended: 27, total: 33, target: 75, faculty: 'Prof. Sumit Kumar' },
    { id: 'att-8', subjectCode: 'CSUP520', subjectName: 'Design and Analysis of Algorithms Lab', originalAttended: 20, originalTotal: 22, attended: 20, total: 22, target: 75, faculty: 'Prof. Neetu Agrawal' },
    { id: 'att-9', subjectCode: 'CSUP521', subjectName: 'Machine Learning Lab', originalAttended: 22, originalTotal: 22, attended: 22, total: 22, target: 75, faculty: 'Prof. Loveleen Kumar' },
    { id: 'att-10', subjectCode: 'CSUP522', subjectName: 'Full Stack Development Lab', originalAttended: 14, originalTotal: 20, attended: 14, total: 20, target: 75, faculty: 'Prof. Himani Thakur' },
    { id: 'att-11', subjectCode: 'CSUT530', subjectName: 'Industrial Training', originalAttended: 13, originalTotal: 14, attended: 13, total: 14, target: 75, faculty: 'Dr. R. K. Sharma' }
  ],

  // SKIT & Affiliated Colleges Registry
  colleges: [
    {
      id: 'skit-jaipur',
      name: 'Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT)',
      shortName: 'SKIT Jaipur',
      city: 'Jaipur, Rajasthan',
      domains: ['skit.ac.in', 'jaipur.skit.ac.in', 'campus.edu'],
      departments: ['Computer Science & Engineering', 'Information Technology', 'AI & Data Science', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering'],
      logoText: '🎓 SKIT'
    }
  ],

  // Student Institutional Verification Requests Queue (For non-skit email signups or ID verifications)
  verifications: [
    {
      id: 'vr-101',
      name: 'Rohan Sharma',
      email: 'rohan.sharma.2024@gmail.com',
      collegeId: 'skit-jaipur',
      collegeName: 'SKIT Jaipur',
      rollNo: '24ESKCS112',
      enrollmentNo: '24E1SKITCS112',
      department: 'Computer Science & Engineering',
      semester: '5th Semester (Section A)',
      submissionDate: '18 Sep 2026, 10:30 AM',
      method: 'id_card_upload',
      idProofUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=60',
      status: 'Pending', // 'Pending', 'Approved', 'Rejected'
      reviewerNote: ''
    },
    {
      id: 'vr-102',
      name: 'Ananya Gupta',
      email: 'ananya.g@gmail.com',
      collegeId: 'skit-jaipur',
      collegeName: 'SKIT Jaipur',
      rollNo: '24ESKIT045',
      enrollmentNo: '24E1SKITIT045',
      department: 'Information Technology',
      semester: '5th Semester (Section B)',
      submissionDate: '18 Sep 2026, 09:15 AM',
      method: 'id_card_upload',
      idProofUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60',
      status: 'Pending',
      reviewerNote: ''
    },
    {
      id: 'vr-103',
      name: 'Ravi Goyal',
      email: '24eskcs677@skit.ac.in',
      collegeId: 'skit-jaipur',
      collegeName: 'SKIT Jaipur',
      rollNo: '24ESKCS677',
      enrollmentNo: '24E1SKITCS677',
      department: 'Computer Science & Engineering',
      semester: '5th Semester (Section A)',
      submissionDate: '17 Sep 2026, 04:00 PM',
      method: 'domain_auto_verified',
      idProofUrl: null,
      status: 'Approved',
      reviewerNote: 'Instant verification via institutional email domain (@skit.ac.in)'
    }
  ],

  // 🛡️ Hostel & Outing Digital Gate Passes
  gatePasses: [
    {
      id: 'gp-101',
      passCode: 'GP-2026-8921',
      studentName: 'Ravi Goyal',
      studentEmail: '24eskcs677@skit.ac.in',
      rollNo: '24ESKCS677',
      hostelBlock: 'Boys Hostel Block A',
      roomNo: 'A-214',
      outingType: 'Day Outing',
      destination: 'Gaurav Tower (GT) & Malviya Nagar Book Market',
      purpose: 'Purchasing 5th sem reference books & project electronic components',
      departureDate: '2026-10-10',
      departureTime: '16:30',
      expectedReturnDate: '2026-10-10',
      expectedReturnTime: '20:30',
      guardianName: 'Shri R. K. Goyal (Father)',
      guardianPhone: '+91 94140 12345',
      guardianConsent: 'Call Verified',
      guardianConsentNote: 'Warden spoke to father on 10 Oct 03:45 PM. Permission confirmed.',
      status: 'Approved', // 'Pending', 'Approved', 'Out of Campus', 'Completed', 'Rejected'
      qrCodeData: 'SKIT-OUTING-PASS-GP-8921-24ESKCS677-VALID',
      appliedAt: '10 Oct 2026, 03:15 PM',
      approvedAt: '10 Oct 2026, 03:50 PM',
      wardenName: 'Dr. S. K. Rathore (Hostel Chief Warden)',
      securityCheckOut: null,
      securityCheckIn: null
    },
    {
      id: 'gp-102',
      passCode: 'GP-2026-8922',
      studentName: 'Rohan Sharma',
      studentEmail: 'rohan.sharma.2024@gmail.com',
      rollNo: '24ESKCS112',
      hostelBlock: 'Boys Hostel Block B',
      roomNo: 'B-108',
      outingType: 'Home / Night Leave',
      destination: 'Home (Kota, Rajasthan via Superfast Express)',
      purpose: 'Family wedding ceremony and personal leave for the weekend',
      departureDate: '2026-10-11',
      departureTime: '06:00',
      expectedReturnDate: '2026-10-13',
      expectedReturnTime: '08:00',
      guardianName: 'Shri Manoj Sharma (Father)',
      guardianPhone: '+91 98290 54321',
      guardianConsent: 'Pending Warden Call',
      guardianConsentNote: 'Waiting for hostel warden phone confirmation before 9 PM',
      status: 'Pending',
      qrCodeData: 'SKIT-OUTING-PASS-GP-8922-24ESKCS112-PENDING',
      appliedAt: '10 Oct 2026, 05:20 PM',
      approvedAt: null,
      wardenName: null,
      securityCheckOut: null,
      securityCheckIn: null
    },
    {
      id: 'gp-103',
      passCode: 'GP-2026-8919',
      studentName: 'Sneha Roy',
      studentEmail: 'sneha@campus.edu',
      rollNo: '24ESKIT045',
      hostelBlock: 'Girls Hostel Nirvana Block 1',
      roomNo: 'N-302',
      outingType: 'Medical Emergency',
      destination: 'Apex Hospital, Malviya Nagar Jaipur',
      purpose: 'Physiotherapy & consultation for ankle injury',
      departureDate: '2026-10-10',
      departureTime: '14:00',
      expectedReturnDate: '2026-10-10',
      expectedReturnTime: '18:00',
      guardianName: 'Smt. Anjali Roy (Mother)',
      guardianPhone: '+91 97840 98765',
      guardianConsent: 'Call Verified',
      guardianConsentNote: 'Mother confirmed hospital appointment over call with warden.',
      status: 'Out of Campus',
      qrCodeData: 'SKIT-OUTING-PASS-GP-8919-24ESKIT045-ACTIVE',
      appliedAt: '10 Oct 2026, 01:10 PM',
      approvedAt: '10 Oct 2026, 01:40 PM',
      wardenName: 'Dr. Sunita Pareek (Girls Hostel Warden)',
      securityCheckOut: '10 Oct 2026, 02:08 PM (Gate 1 - Guard Vikram)',
      securityCheckIn: null
    },
    {
      id: 'gp-104',
      passCode: 'GP-2026-8910',
      studentName: 'Aarav Sharma',
      studentEmail: 'aarav@campus.edu',
      rollNo: '22BCSE104',
      hostelBlock: 'Boys Hostel Block A',
      roomNo: 'A-312',
      outingType: 'Day Outing',
      destination: 'World Trade Park (WTP) Stationery & Tech Store',
      purpose: 'Project hardware and printouts for seminar submission',
      departureDate: '2026-10-09',
      departureTime: '15:00',
      expectedReturnDate: '2026-10-09',
      expectedReturnTime: '19:00',
      guardianName: 'Shri R. Sharma (Father)',
      guardianPhone: '+91 98112 00000',
      guardianConsent: 'Call Verified',
      guardianConsentNote: 'Guardian call verified yesterday at 2:30 PM.',
      status: 'Completed',
      qrCodeData: 'SKIT-OUTING-PASS-GP-8910-22BCSE104-COMPLETED',
      appliedAt: '09 Oct 2026, 02:00 PM',
      approvedAt: '09 Oct 2026, 02:35 PM',
      wardenName: 'Dr. S. K. Rathore (Hostel Chief Warden)',
      securityCheckOut: '09 Oct 2026, 03:05 PM (Gate 1)',
      securityCheckIn: '09 Oct 2026, 06:45 PM (Gate 1 - Returned On Time)'
    }
  ],

  // 📚 Library, Syllabi, Past Year Papers (PYQs) & Academic Resources Hub
  libraryDepartments: [
    { id: 'CSE', name: 'Computer Science & Engineering', code: 'CS&E', icon: '💻', count: 12 },
    { id: 'IT', name: 'Information Technology', code: 'IT', icon: '🌐', count: 8 },
    { id: 'AIDS', name: 'AI & Data Science', code: 'AI-DS', icon: '🤖', count: 7 },
    { id: 'ECE', name: 'Electronics & Communication', code: 'ECE', icon: '⚡', count: 9 },
    { id: 'EE', name: 'Electrical Engineering', code: 'EE', icon: '💡', count: 6 },
    { id: 'ME', name: 'Mechanical Engineering', code: 'ME', icon: '⚙️', count: 7 },
    { id: 'CE', name: 'Civil Engineering', code: 'CE', icon: '🏗️', count: 6 }
  ],

  libraryResources: [
    // --- CSE SUBJECTS ---
    {
      id: 'lib-cse-501',
      dept: 'CSE',
      sem: 5,
      subjectCode: 'CSUL501',
      subjectName: 'Design & Analysis of Algorithms (DAA)',
      credits: 4,
      facultyLead: 'Prof. Neetu Agrawal',
      syllabus: {
        officialDoc: 'RTU_CSE_5Sem_DAA_Syllabus_2026.pdf',
        units: [
          { unit: 1, title: 'Introduction & Asymptotic Analysis', topics: 'Algorithm definition, Big-O, Omega, Theta notation, Recurrence relations, Master Theorem and substitution method.' },
          { unit: 2, title: 'Divide & Conquer and Sorting', topics: 'Merge sort, Quick sort worst & average cases, Strassen matrix multiplication, Lower bound on comparison sorts.' },
          { unit: 3, title: 'Greedy Method & Dynamic Programming', topics: 'Fractional Knapsack, Huffman coding, 0/1 Knapsack, Longest Common Subsequence (LCS), Matrix Chain Multiplication.' },
          { unit: 4, title: 'Graph Algorithms & Backtracking', topics: 'BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, N-Queens problem, Subset sum, Graph coloring.' },
          { unit: 5, title: 'Branch & Bound, NP-Completeness', topics: 'Travelling Salesperson Problem, P, NP, NP-Hard, NP-Complete, Cook-Levin theorem, Vertex cover reduction.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Main Exam Paper 2025 - DAA', file: 'RTU_DAA_EndTerm_2025.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2024, term: 'RTU End-Term', title: 'RTU Main Exam Paper 2024 - DAA', file: 'RTU_DAA_EndTerm_2024.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2023, term: 'RTU End-Term', title: 'RTU Main Exam Paper 2023 - DAA', file: 'RTU_DAA_EndTerm_2023.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2025, term: 'Mid-Term 1', title: 'SKIT Mid-Term 1 Question Paper (Units 1 & 2)', file: 'SKIT_DAA_MT1_2025.pdf', marks: '30 Marks', solutionsAvailable: true },
        { year: 2025, term: 'Mid-Term 2', title: 'SKIT Mid-Term 2 Question Paper (Units 3 & 4)', file: 'SKIT_DAA_MT2_2025.pdf', marks: '30 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Toppers Notes', title: 'Complete Handwritten DAA Notes (Units 1-5)', author: 'Ravi Goyal (Rank 1 Topper)', size: '14.2 MB', verified: true },
        { type: 'Standard Book', title: 'Introduction to Algorithms (CLRS 3rd Edition)', author: 'Cormen, Leiserson, Rivest, Stein', size: '28.5 MB', verified: true },
        { type: 'Cheatsheet', title: 'Master Theorem & Recurrence Relations Formula Sheet', author: 'SKIT CS Club', size: '1.4 MB', verified: true },
        { type: 'Lab Manual', title: 'CSUP520 - DAA Practical C++ Implementation Codes', author: 'Dept. of CS&E', size: '3.8 MB', verified: true }
      ],
      videos: [
        { title: 'Abdul Bari - Algorithms Master Playlist', platform: 'YouTube', link: 'https://youtube.com', lectures: '84 Lectures' },
        { title: 'NPTEL Design and Analysis of Algorithms', platform: 'NPTEL SWAYAM', link: 'https://nptel.ac.in', lectures: '40 Hours' }
      ]
    },
    {
      id: 'lib-cse-502',
      dept: 'CSE',
      sem: 5,
      subjectCode: 'CSUL502',
      subjectName: 'Machine Learning (ML)',
      credits: 4,
      facultyLead: 'Prof. Loveleen Kumar',
      syllabus: {
        officialDoc: 'RTU_CSE_5Sem_ML_Syllabus_2026.pdf',
        units: [
          { unit: 1, title: 'Foundations & Linear Models', topics: 'Supervised vs Unsupervised learning, Linear Regression, Cost function, Gradient Descent, Polynomial regression.' },
          { unit: 2, title: 'Classification & Logistic Models', topics: 'Logistic Regression, Odds ratio, Support Vector Machines (SVM), Kernels, Naive Bayes classifier.' },
          { unit: 3, title: 'Decision Trees & Ensemble Methods', topics: 'Entropy, Information Gain, Gini Impurity, Random Forests, Bagging, Boosting (AdaBoost, XGBoost).' },
          { unit: 4, title: 'Neural Networks & Deep Learning Intro', topics: 'Perceptron, Multi-Layer Perceptron (MLP), Backpropagation, Activation functions, Loss functions.' },
          { unit: 5, title: 'Unsupervised Learning & Evaluation', topics: 'K-Means clustering, Hierarchical clustering, PCA (Principal Component Analysis), Confusion matrix, ROC-AUC curve.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Main Exam Paper 2025 - Machine Learning', file: 'RTU_ML_EndTerm_2025.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2024, term: 'RTU End-Term', title: 'RTU Main Exam Paper 2024 - Machine Learning', file: 'RTU_ML_EndTerm_2024.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2025, term: 'Mid-Term 1', title: 'SKIT Mid-Term 1 Exam Paper (Supervised Models)', file: 'SKIT_ML_MT1_2025.pdf', marks: '30 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Toppers Notes', title: 'Machine Learning Complete Lecture Notes & Math Derivations', author: 'CS&E Research Group', size: '18.6 MB', verified: true },
        { type: 'Standard Book', title: 'Hands-On Machine Learning with Scikit-Learn & PyTorch', author: 'Aurélien Géron (O\'Reilly)', size: '32.1 MB', verified: true },
        { type: 'Cheatsheet', title: 'Scikit-Learn, Pandas & Numpy Quick Reference Card', author: 'SKIT AI Lab', size: '2.1 MB', verified: true },
        { type: 'Lab Manual', title: 'CSUP521 - ML Lab Jupyter Notebooks & Datasets', author: 'Dept. of CS&E', size: '6.5 MB', verified: true }
      ],
      videos: [
        { title: 'Andrew Ng - Machine Learning Specialization', platform: 'Coursera / Stanford', link: 'https://coursera.org', lectures: '60 Lectures' },
        { title: 'Krish Naik - Complete Machine Learning with Projects', platform: 'YouTube', link: 'https://youtube.com', lectures: '72 Videos' }
      ]
    },
    {
      id: 'lib-cse-503',
      dept: 'CSE',
      sem: 5,
      subjectCode: 'CSUL503',
      subjectName: 'Cryptography & Network Security (CNS)',
      credits: 3,
      facultyLead: 'Prof. Himani Thakur',
      syllabus: {
        officialDoc: 'RTU_CSE_5Sem_CNS_Syllabus_2026.pdf',
        units: [
          { unit: 1, title: 'Classical Encryption & Number Theory', topics: 'Modular arithmetic, GCD, Euclidean algorithm, Monoalphabetic & Polyalphabetic ciphers, Playfair cipher, Hill cipher.' },
          { unit: 2, title: 'Block Ciphers & Symmetric Encryption', topics: 'DES architecture, Triple DES, Advanced Encryption Standard (AES), Modes of operation (ECB, CBC, CFB, OFB, CTR).' },
          { unit: 3, title: 'Asymmetric Cryptography & Key Exchange', topics: 'Prime numbers, Fermat & Euler theorem, RSA algorithm, Diffie-Hellman Key Exchange, Elliptic Curve Cryptography (ECC).' },
          { unit: 4, title: 'Message Integrity, Hashes & Signatures', topics: 'SHA-256, MD5, HMAC, Digital Signature Standard (DSS), X.509 Public Key Infrastructure (PKI).' },
          { unit: 5, title: 'Network Security Protocols & Firewalls', topics: 'IPsec architecture, SSL/TLS handshake, PGP Email security, Intrusion Detection Systems (IDS), Firewalls.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Main Exam Paper 2025 - CNS', file: 'RTU_CNS_EndTerm_2025.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2024, term: 'RTU End-Term', title: 'RTU Main Exam Paper 2024 - CNS', file: 'RTU_CNS_EndTerm_2024.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2023, term: 'RTU End-Term', title: 'RTU Main Exam Paper 2023 - CNS', file: 'RTU_CNS_EndTerm_2023.pdf', marks: '70 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Toppers Notes', title: 'CNS Numerical & Protocol Derivations (RSA, Diffie-Hellman, AES)', author: 'Prof. Himani Thakur / Toppers', size: '11.8 MB', verified: true },
        { type: 'Standard Book', title: 'Cryptography and Network Security: Principles and Practice', author: 'William Stallings (7th Ed.)', size: '24.0 MB', verified: true },
        { type: 'Lab Manual', title: 'CSUP522 - CNS Lab Wireshark & OpenSSL Commands', author: 'Dept. of CS&E', size: '4.2 MB', verified: true }
      ],
      videos: [
        { title: 'NPTEL Cryptography & Network Security', platform: 'NPTEL IIT Kharagpur', link: 'https://nptel.ac.in', lectures: '40 Lectures' }
      ]
    },
    {
      id: 'lib-cse-511',
      dept: 'CSE',
      sem: 5,
      subjectCode: 'CSUL511',
      subjectName: 'DevOps Practices & Principles',
      credits: 3,
      facultyLead: 'Prof. Sumit Kumar',
      syllabus: {
        officialDoc: 'RTU_CSE_5Sem_DevOps_Syllabus_2026.pdf',
        units: [
          { unit: 1, title: 'DevOps Philosophy & Agile Integration', topics: 'Culture, CALMS framework, Git version control, Trunk-based development, Branching strategies.' },
          { unit: 2, title: 'Continuous Integration & Continuous Delivery', topics: 'Jenkins pipelines, GitHub Actions, Automated unit testing, SonarQube code quality gates.' },
          { unit: 3, title: 'Containerization & Docker Ecosystem', topics: 'Container vs VM, Dockerfile instructions, Multi-stage builds, Docker Compose, Port mapping, Volumes.' },
          { unit: 4, title: 'Orchestration & Kubernetes Basics', topics: 'K8s architecture, Pods, Deployments, Services, Ingress controller, ConfigMaps and Secrets.' },
          { unit: 5, title: 'Infrastructure as Code (IaC) & Observability', topics: 'Terraform basics, Ansible automation, Prometheus metrics, Grafana dashboards, ELK stack.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Model Exam Paper 2025 - DevOps Practices', file: 'RTU_DevOps_2025.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2025, term: 'Mid-Term 1', title: 'SKIT Mid-Term 1 Exam Paper - Docker & CI/CD', file: 'SKIT_DevOps_MT1_2025.pdf', marks: '30 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Toppers Notes', title: 'DevOps Lifecycle, Commands & Architecture Quick Sheet', author: 'DevOps Club SKIT', size: '9.4 MB', verified: true },
        { type: 'Standard Book', title: 'The DevOps Handbook: How to Create World-Class Agility', author: 'Gene Kim, Jez Humble, Patrick Debois', size: '15.6 MB', verified: true }
      ],
      videos: [
        { title: 'Nana Janashia - Complete DevOps Bootcamp', platform: 'YouTube', link: 'https://youtube.com', lectures: '32 Lectures' }
      ]
    },
    {
      id: 'lib-cse-301',
      dept: 'CSE',
      sem: 3,
      subjectCode: 'CSUL301',
      subjectName: 'Data Structures & Algorithms',
      credits: 4,
      facultyLead: 'Prof. R. S. Rathore',
      syllabus: {
        officialDoc: 'RTU_CSE_3Sem_DSA_Syllabus.pdf',
        units: [
          { unit: 1, title: 'Arrays & Linked Lists', topics: 'Linear arrays, Singly, Doubly & Circular linked lists, Operations and complexity.' },
          { unit: 2, title: 'Stacks & Queues', topics: 'Infix to postfix conversion, Evaluation of postfix, Circular queue, Deque, Priority queue.' },
          { unit: 3, title: 'Trees & Binary Search Trees', topics: 'Tree traversals (Inorder, Preorder, Postorder), BST insertions/deletions, AVL trees rotation.' },
          { unit: 4, title: 'Graphs & Traversals', topics: 'Adjacency matrix & list, BFS, DFS, Spanning trees (Prim, Kruskal).' },
          { unit: 5, title: 'Hashing & Sorting Techniques', topics: 'Hash tables, Collision resolution, Separate chaining, Open addressing, Heap sort, Radix sort.' }
        ]
      },
      pyqs: [
        { year: 2024, term: 'RTU End-Term', title: 'RTU End-Term Paper 2024 - DSA', file: 'RTU_DSA_2024.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2023, term: 'RTU End-Term', title: 'RTU End-Term Paper 2023 - DSA', file: 'RTU_DSA_2023.pdf', marks: '70 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Toppers Notes', title: 'Data Structures Complete Solved Hand-Notes with C/C++ Code', author: 'CSE 3rd Sem Toppers', size: '21.0 MB', verified: true },
        { type: 'Standard Book', title: 'Data Structures Using C and C++', author: 'Tanenbaum, Langsam, Augenstein', size: '19.4 MB', verified: true }
      ],
      videos: [
        { title: 'Striver A2Z DSA Course', platform: 'YouTube (takeUforward)', link: 'https://youtube.com', lectures: '150 Lectures' }
      ]
    },
    {
      id: 'lib-cse-401',
      dept: 'CSE',
      sem: 4,
      subjectCode: 'CSUL401',
      subjectName: 'Database Management Systems (DBMS)',
      credits: 4,
      facultyLead: 'Prof. Ankit Sharma',
      syllabus: {
        officialDoc: 'RTU_CSE_4Sem_DBMS_Syllabus.pdf',
        units: [
          { unit: 1, title: 'Database Architecture & ER Modeling', topics: '3-tier architecture, Data independence, ER and EER diagrams, Weak entities, Specialization/Generalization.' },
          { unit: 2, title: 'Relational Model & Relational Algebra', topics: 'Codd rules, Relational algebra operators, Tuple relational calculus, Domain relational calculus.' },
          { unit: 3, title: 'SQL & Normalization', topics: 'DDL, DML, DCL commands, Joins, Subqueries, Functional dependencies, 1NF, 2NF, 3NF, BCNF, 4NF.' },
          { unit: 4, title: 'Transaction Processing & Concurrency Control', topics: 'ACID properties, Serializability, 2PL (Two-Phase Locking), Deadlock prevention & detection, Timestamp ordering.' },
          { unit: 5, title: 'Indexing & Recovery Systems', topics: 'B-Trees, B+ Trees indexing, Log-based recovery, Checkpointing, Shadow paging.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Main Paper 2025 - DBMS', file: 'RTU_DBMS_2025.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2024, term: 'RTU End-Term', title: 'RTU Main Paper 2024 - DBMS', file: 'RTU_DBMS_2024.pdf', marks: '70 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Toppers Notes', title: 'DBMS Full Theory & SQL Queries Practice Sheet', author: 'Prof. Ankit Sharma', size: '16.5 MB', verified: true },
        { type: 'Standard Book', title: 'Database System Concepts (6th Edition)', author: 'Silberschatz, Korth, Sudarshan', size: '26.8 MB', verified: true }
      ],
      videos: [
        { title: 'Gate Smashers - DBMS Complete Playlist', platform: 'YouTube', link: 'https://youtube.com', lectures: '95 Videos' }
      ]
    },

    // --- IT SUBJECTS ---
    {
      id: 'lib-it-501',
      dept: 'IT',
      sem: 5,
      subjectCode: 'ITUL501',
      subjectName: 'Cloud Computing & Virtualization',
      credits: 4,
      facultyLead: 'Prof. Mukesh Gupta',
      syllabus: {
        officialDoc: 'RTU_IT_5Sem_Cloud_Syllabus.pdf',
        units: [
          { unit: 1, title: 'Cloud Paradigms & Architecture', topics: 'NIST Cloud definition, IaaS, PaaS, SaaS, Public, Private, Hybrid cloud deployment models.' },
          { unit: 2, title: 'Virtualization Technologies', topics: 'Hypervisors (Type 1 & Type 2), CPU, memory and storage virtualization, VMware & KVM.' },
          { unit: 3, title: 'Cloud Storage & File Systems', topics: 'GFS, HDFS, S3 bucket storage, Block storage, Object storage, CDN caching.' },
          { unit: 4, title: 'Cloud Security & Compliance', topics: 'Data encryption in transit & rest, IAM policies, Multi-tenancy isolation, Compliance (SOC2, GDPR).' },
          { unit: 5, title: 'Serverless Computing & Cloud Native', topics: 'AWS Lambda, Google Cloud Functions, Event-driven architecture, Cost estimation.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Main Paper 2025 - Cloud Computing', file: 'RTU_Cloud_2025.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2024, term: 'RTU End-Term', title: 'RTU Main Paper 2024 - Cloud Computing', file: 'RTU_Cloud_2024.pdf', marks: '70 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Toppers Notes', title: 'Cloud Computing & AWS Architecture Study Notes', author: 'IT Dept SKIT', size: '12.4 MB', verified: true },
        { type: 'Standard Book', title: 'Cloud Computing: Concepts, Technology & Architecture', author: 'Thomas Erl, Ricardo Puttini', size: '20.1 MB', verified: true }
      ],
      videos: [
        { title: 'Edureka - Cloud Computing Full Course', platform: 'YouTube', link: 'https://youtube.com', lectures: '12 Hours' }
      ]
    },

    // --- AI-DS SUBJECTS ---
    {
      id: 'lib-aids-501',
      dept: 'AIDS',
      sem: 5,
      subjectCode: 'ADUL501',
      subjectName: 'Deep Learning & Neural Architectures',
      credits: 4,
      facultyLead: 'Dr. Vivek Sharma',
      syllabus: {
        officialDoc: 'RTU_AIDS_5Sem_DeepLearning.pdf',
        units: [
          { unit: 1, title: 'Neural Networks & Optimization', topics: 'Deep Feedforward Networks, Loss surfaces, Adam, RMSprop, SGD with momentum, Regularization (Dropout, L1/L2).' },
          { unit: 2, title: 'Convolutional Neural Networks (CNN)', topics: 'Kernels, Convolutions, Stride, Padding, Pooling, LeNet, AlexNet, VGG, ResNet skip connections.' },
          { unit: 3, title: 'Recurrent Neural Networks (RNN) & Sequence Models', topics: 'Vanishing gradient problem, LSTM gates (Forget, Input, Output), GRU units, Bidirectional RNNs.' },
          { unit: 4, title: 'Attention & Transformers', topics: 'Seq2Seq attention mechanism, Self-attention, Multi-head attention, Positional encoding, BERT, GPT overview.' },
          { unit: 5, title: 'Generative Models (GANs & VAEs)', topics: 'Variational Autoencoders, Generative Adversarial Networks (Generator & Discriminator loss), Applications.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Main Exam 2025 - Deep Learning', file: 'RTU_DeepLearning_2025.pdf', marks: '70 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Standard Book', title: 'Deep Learning (Adaptive Computation and Machine Learning)', author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville (MIT Press)', size: '22.8 MB', verified: true },
        { type: 'Toppers Notes', title: 'Deep Learning Math & PyTorch Implementation Notes', author: 'AI Club SKIT', size: '15.0 MB', verified: true }
      ],
      videos: [
        { title: 'DeepLearning.AI - Deep Learning Specialization', platform: 'Coursera / YouTube', link: 'https://youtube.com', lectures: '45 Lectures' }
      ]
    },

    // --- ECE SUBJECTS ---
    {
      id: 'lib-ece-501',
      dept: 'ECE',
      sem: 5,
      subjectCode: 'ECUL501',
      subjectName: 'Digital Signal Processing (DSP)',
      credits: 4,
      facultyLead: 'Prof. R. K. Bansal',
      syllabus: {
        officialDoc: 'RTU_ECE_5Sem_DSP.pdf',
        units: [
          { unit: 1, title: 'Discrete Time Signals & Systems', topics: 'LTI systems, Convolution sum, Z-Transform, Region of Convergence (ROC), Inverse Z-Transform.' },
          { unit: 2, title: 'Discrete Fourier Transform (DFT)', topics: 'Properties of DFT, Circular convolution, Fast Fourier Transform (FFT) Decimation-in-Time (DIT) and Decimation-in-Frequency (DIF).' },
          { unit: 3, title: 'IIR Filter Design', topics: 'Analog filter approximations (Butterworth, Chebyshev), Bilinear transformation, Impulse invariant method.' },
          { unit: 4, title: 'FIR Filter Design', topics: 'Linear phase FIR filters, Windowing techniques (Rectangular, Hamming, Hanning, Blackman), Frequency sampling method.' },
          { unit: 5, title: 'Finite Word Length Effects & DSP Processors', topics: 'Quantization error, Limit cycle oscillations, Architecture of TMS320C67xx DSP processors.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Exam Paper 2025 - DSP', file: 'RTU_DSP_2025.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2024, term: 'RTU End-Term', title: 'RTU Exam Paper 2024 - DSP', file: 'RTU_DSP_2024.pdf', marks: '70 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Standard Book', title: 'Digital Signal Processing: Principles, Algorithms & Applications', author: 'Proakis and Manolakis (4th Edition)', size: '31.2 MB', verified: true },
        { type: 'Toppers Notes', title: 'DSP Solved Numericals & Filter Design Guide', author: 'ECE Dept SKIT', size: '14.0 MB', verified: true }
      ],
      videos: [
        { title: 'NPTEL Digital Signal Processing', platform: 'NPTEL IIT Kharagpur', link: 'https://nptel.ac.in', lectures: '40 Lectures' }
      ]
    },

    // --- EE SUBJECTS ---
    {
      id: 'lib-ee-501',
      dept: 'EE',
      sem: 5,
      subjectCode: 'EEUL501',
      subjectName: 'Power Systems Engineering',
      credits: 4,
      facultyLead: 'Dr. Suresh Verma',
      syllabus: {
        officialDoc: 'RTU_EE_5Sem_PowerSystems.pdf',
        units: [
          { unit: 1, title: 'Transmission Line Parameters', topics: 'Resistance, Inductance and Capacitance of single and 3-phase overhead lines, GMD and GMR calculations.' },
          { unit: 2, title: 'Performance of Transmission Lines', topics: 'Short, Medium (Nominal-T and Pi) and Long lines, Ferranti effect, Surge impedance loading (SIL).' },
          { unit: 3, title: 'Overhead Line Insulators & Cables', topics: 'Pin, suspension and strain insulators, String efficiency, Under-ground cables, Dielectric stress and grading.' },
          { unit: 4, title: 'Corona & Voltage Regulation', topics: 'Critical disruptive voltage, Visual critical voltage, Corona power loss, Methods to reduce corona, Reactive power control.' },
          { unit: 5, title: 'Symmetrical Fault Analysis', topics: 'Per-unit representation, Transient on transmission line, Short circuit capacity (SCC), Selection of circuit breakers.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Exam Paper 2025 - Power Systems', file: 'RTU_PowerSystems_2025.pdf', marks: '70 Marks', solutionsAvailable: true },
        { year: 2024, term: 'RTU End-Term', title: 'RTU Exam Paper 2024 - Power Systems', file: 'RTU_PowerSystems_2024.pdf', marks: '70 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Standard Book', title: 'Modern Power System Analysis', author: 'D. P. Kothari and I. J. Nagrath (Tata McGraw-Hill)', size: '24.5 MB', verified: true },
        { type: 'Toppers Notes', title: 'Power System Formula Sheet & Solved Numerical Problems', author: 'EE Toppers Batch', size: '13.1 MB', verified: true }
      ],
      videos: [
        { title: 'NPTEL Power System Engineering', platform: 'NPTEL IIT Roorkee', link: 'https://nptel.ac.in', lectures: '40 Lectures' }
      ]
    },

    // --- ME SUBJECTS ---
    {
      id: 'lib-me-501',
      dept: 'ME',
      sem: 5,
      subjectCode: 'MEUL501',
      subjectName: 'Thermodynamics & Heat Transfer',
      credits: 4,
      facultyLead: 'Prof. Narendra Kumar',
      syllabus: {
        officialDoc: 'RTU_ME_5Sem_Thermodynamics.pdf',
        units: [
          { unit: 1, title: 'First & Second Law of Thermodynamics', topics: 'Control volume energy analysis, Carnot cycle, Clausius inequality, Entropy generation, Exergy analysis.' },
          { unit: 2, title: 'Vapour Power & Gas Power Cycles', topics: 'Rankine cycle with reheat and regeneration, Otto, Diesel, Dual and Brayton cycles, Thermal efficiency.' },
          { unit: 3, title: 'Conduction Heat Transfer', topics: 'Fourier\'s law, 1D steady conduction through plane and composite walls, Critical thickness of insulation, Extended surfaces (fins).' },
          { unit: 4, title: 'Convection Heat Transfer', topics: 'Newton\'s law of cooling, Dimensional analysis, Nusselt, Reynolds and Prandtl numbers, Free and forced convection over plates.' },
          { unit: 5, title: 'Radiation & Heat Exchangers', topics: 'Stefan-Boltzmann law, Planck\'s law, Shape factor, LMTD and NTU methods for counter and parallel flow heat exchangers.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Exam Paper 2025 - Heat Transfer', file: 'RTU_ME_HT_2025.pdf', marks: '70 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Standard Book', title: 'Fundamentals of Heat and Mass Transfer', author: 'Incropera, DeWitt, Bergman, Lavine', size: '29.3 MB', verified: true },
        { type: 'Toppers Notes', title: 'Thermodynamics & Heat Exchanger Formulas Quick Notes', author: 'ME Dept SKIT', size: '10.8 MB', verified: true }
      ],
      videos: [
        { title: 'NPTEL Heat Transfer Course', platform: 'NPTEL IIT Kharagpur', link: 'https://nptel.ac.in', lectures: '40 Lectures' }
      ]
    },

    // --- CE SUBJECTS ---
    {
      id: 'lib-ce-501',
      dept: 'CE',
      sem: 5,
      subjectCode: 'CEUL501',
      subjectName: 'Structural Analysis & Design',
      credits: 4,
      facultyLead: 'Prof. Ramesh Meena',
      syllabus: {
        officialDoc: 'RTU_CE_5Sem_Structures.pdf',
        units: [
          { unit: 1, title: 'Determinate & Indeterminate Structures', topics: 'Degree of static and kinematic indeterminacy, Castigliano\'s theorems, Unit load method for deflection of beams and trusses.' },
          { unit: 2, title: 'Slope Deflection Method', topics: 'Derivation of slope deflection equations, Analysis of continuous beams with and without support settlement, Portal frames.' },
          { unit: 3, title: 'Moment Distribution Method (Hardy Cross)', topics: 'Stiffness factor, Carry over factor, Distribution factor, Analysis of continuous beams and symmetrical frames.' },
          { unit: 4, title: 'Rolling Loads & Influence Lines (ILD)', topics: 'ILD for reaction, shear force and bending moment in simply supported beams, Muller-Breslau principle for indeterminate beams.' },
          { unit: 5, title: 'Arches & Cables', topics: 'Three hinged and two hinged parabolic arches, Normal thrust and radial shear, Stresses in suspension cables with stiffening girders.' }
        ]
      },
      pyqs: [
        { year: 2025, term: 'RTU End-Term', title: 'RTU Exam Paper 2025 - Structural Analysis', file: 'RTU_CE_SA_2025.pdf', marks: '70 Marks', solutionsAvailable: true }
      ],
      materials: [
        { type: 'Standard Book', title: 'Theory of Structures', author: 'B. C. Punmia, Ashok Kumar Jain, Arun Kumar Jain', size: '25.0 MB', verified: true },
        { type: 'Toppers Notes', title: 'Moment Distribution & Slope Deflection Solved Hand Notes', author: 'Civil Engg Batch SKIT', size: '14.5 MB', verified: true }
      ],
      videos: [
        { title: 'NPTEL Structural Analysis I', platform: 'NPTEL IIT Kharagpur', link: 'https://nptel.ac.in', lectures: '40 Lectures' }
      ]
    }
  ]
};



