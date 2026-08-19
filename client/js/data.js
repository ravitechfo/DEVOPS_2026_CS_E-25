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
  ]
};
