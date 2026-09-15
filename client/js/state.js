// Smart Campus State Store with LocalStorage Persistence
const StateManager = {
  KEYS: {
    NOTICES: 'smart_campus_notices',
    LOST_FOUND: 'smart_campus_lost_found',
    COMPLAINTS: 'smart_campus_complaints',
    BOOKINGS: 'smart_campus_bookings',
    RESOURCES: 'smart_campus_resources',
    TIMETABLE: 'smart_campus_timetable',
    SUBJECTS: 'smart_campus_subjects',
    ATTENDANCE: 'smart_campus_attendance',
    USER: 'smart_campus_user'
  },

  init() {
    if (!localStorage.getItem(this.KEYS.NOTICES)) {
      localStorage.setItem(this.KEYS.NOTICES, JSON.stringify(INITIAL_DATA.notices));
    }
    if (!localStorage.getItem(this.KEYS.LOST_FOUND)) {
      localStorage.setItem(this.KEYS.LOST_FOUND, JSON.stringify(INITIAL_DATA.lostFound));
    }
    if (!localStorage.getItem(this.KEYS.COMPLAINTS)) {
      localStorage.setItem(this.KEYS.COMPLAINTS, JSON.stringify(INITIAL_DATA.complaints));
    }
    if (!localStorage.getItem(this.KEYS.RESOURCES)) {
      localStorage.setItem(this.KEYS.RESOURCES, JSON.stringify(INITIAL_DATA.resources));
    }
    if (!localStorage.getItem(this.KEYS.BOOKINGS)) {
      localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(INITIAL_DATA.bookings));
    }
    if (!localStorage.getItem(this.KEYS.TIMETABLE)) {
      localStorage.setItem(this.KEYS.TIMETABLE, JSON.stringify(INITIAL_DATA.timetables));
    }
    if (!localStorage.getItem(this.KEYS.SUBJECTS)) {
      localStorage.setItem(this.KEYS.SUBJECTS, JSON.stringify(INITIAL_DATA.subjects));
    }
    if (!localStorage.getItem(this.KEYS.ATTENDANCE)) {
      localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify([]));
    } else {
      const stored = JSON.parse(localStorage.getItem(this.KEYS.ATTENDANCE) || '[]');
      if (stored.length > 0 && stored[0].id === 'att-101') {
        localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify([]));
      }
    }
  },

  // User & Authentication Helpers
  getUser() {
    const userStr = localStorage.getItem(this.KEYS.USER);
    if (!userStr) {
      return {
        name: localStorage.getItem('name') || 'Aarav Sharma (Student)',
        email: localStorage.getItem('email') || 'student@campus.edu',
        role: localStorage.getItem('role') || 'student'
      };
    }
    return JSON.parse(userStr);
  },

  setUser(user) {
    localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
    localStorage.setItem('name', user.name);
    localStorage.setItem('role', user.role);
    localStorage.setItem('email', user.email);
    localStorage.setItem('token', 'mock_jwt_token_' + Date.now());
  },

  logout() {
    localStorage.removeItem(this.KEYS.USER);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    window.location.href = 'index.html';
  },

  // Notices
  getNotices() {
    return JSON.parse(localStorage.getItem(this.KEYS.NOTICES) || '[]');
  },

  addNotice(notice) {
    const notices = this.getNotices();
    const newNotice = {
      id: 'not-' + Date.now(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...notice
    };
    notices.unshift(newNotice);
    localStorage.setItem(this.KEYS.NOTICES, JSON.stringify(notices));
    return newNotice;
  },

  deleteNotice(id) {
    const notices = this.getNotices().filter(n => n.id !== id);
    localStorage.setItem(this.KEYS.NOTICES, JSON.stringify(notices));
  },

  // Lost & Found
  getLostFound() {
    return JSON.parse(localStorage.getItem(this.KEYS.LOST_FOUND) || '[]');
  },

  addLostFound(item) {
    const items = this.getLostFound();
    const newItem = {
      id: 'lf-' + Date.now(),
      dateTime: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Open',
      ...item
    };
    items.unshift(newItem);
    localStorage.setItem(this.KEYS.LOST_FOUND, JSON.stringify(items));
    return newItem;
  },

  updateLostFoundStatus(id, newStatus) {
    const items = this.getLostFound();
    const target = items.find(i => i.id === id);
    if (target) {
      target.status = newStatus;
      localStorage.setItem(this.KEYS.LOST_FOUND, JSON.stringify(items));
    }
  },

  // Complaints / Grievance
  getComplaints() {
    return JSON.parse(localStorage.getItem(this.KEYS.COMPLAINTS) || '[]');
  },

  addComplaint(complaint) {
    const complaints = this.getComplaints();
    const newComplaint = {
      id: 'cmp-' + Date.now(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Submitted',
      assignedTo: 'Campus Helpdesk',
      resolutionNote: 'Your complaint has been registered and queued for technical review.',
      ...complaint
    };
    complaints.unshift(newComplaint);
    localStorage.setItem(this.KEYS.COMPLAINTS, JSON.stringify(complaints));
    return newComplaint;
  },

  updateComplaintStatus(id, status, resolutionNote = '') {
    const complaints = this.getComplaints();
    const target = complaints.find(c => c.id === id);
    if (target) {
      target.status = status;
      if (resolutionNote) target.resolutionNote = resolutionNote;
      localStorage.setItem(this.KEYS.COMPLAINTS, JSON.stringify(complaints));
    }
  },

  // Facilities & Bookings
  getResources() {
    return JSON.parse(localStorage.getItem(this.KEYS.RESOURCES) || '[]');
  },

  getBookings() {
    return JSON.parse(localStorage.getItem(this.KEYS.BOOKINGS) || '[]');
  },

  addBooking(bookingData) {
    const bookings = this.getBookings();
    const resources = this.getResources();
    const resource = resources.find(r => r.id === bookingData.resourceId);

    const newBooking = {
      id: 'bk-' + Date.now(),
      resourceName: resource ? resource.name : 'Campus Facility',
      location: resource ? resource.location : 'Campus',
      status: 'Pending',
      ...bookingData
    };
    bookings.unshift(newBooking);
    localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(bookings));
    return newBooking;
  },

  updateBookingStatus(id, status) {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === id);
    if (target) {
      target.status = status;
      localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(bookings));
    }
  },

  // Timetable State Operations (Scalable by student / section)
  getTimetable(filterOpts = {}) {
    let slots = JSON.parse(localStorage.getItem(this.KEYS.TIMETABLE) || '[]');
    if (!slots || slots.length === 0) {
      slots = INITIAL_DATA.timetables || [];
      localStorage.setItem(this.KEYS.TIMETABLE, JSON.stringify(slots));
    }
    if (filterOpts.day && filterOpts.day !== 'ALL') {
      slots = slots.filter(s => s.day.toUpperCase() === filterOpts.day.toUpperCase());
    }
    if (filterOpts.studentEmail) {
      slots = slots.filter(s => !s.studentEmail || s.studentEmail === filterOpts.studentEmail);
    }
    if (filterOpts.section) {
      slots = slots.filter(s => !s.section || s.section === filterOpts.section);
    }
    return slots;
  },

  addTimetableSlot(slot) {
    const slots = this.getTimetable();
    const newSlot = {
      id: 'tt-' + Date.now(),
      ...slot
    };
    slots.push(newSlot);
    localStorage.setItem(this.KEYS.TIMETABLE, JSON.stringify(slots));
    return newSlot;
  },

  updateTimetableSlot(id, updatedFields) {
    const slots = this.getTimetable();
    const idx = slots.findIndex(s => s.id === id);
    if (idx !== -1) {
      slots[idx] = { ...slots[idx], ...updatedFields };
      localStorage.setItem(this.KEYS.TIMETABLE, JSON.stringify(slots));
      return slots[idx];
    }
    return null;
  },

  deleteTimetableSlot(id) {
    let slots = this.getTimetable();
    slots = slots.filter(s => s.id !== id);
    localStorage.setItem(this.KEYS.TIMETABLE, JSON.stringify(slots));
  },

  getSubjects() {
    return JSON.parse(localStorage.getItem(this.KEYS.SUBJECTS) || JSON.stringify(INITIAL_DATA.subjects));
  },

  getSubjectDetails(code) {
    const subjects = this.getSubjects();
    return subjects.find(s => s.code.toLowerCase() === code.toLowerCase()) || {
      code,
      name: code,
      credits: 3,
      type: 'Core Academic Course',
      attendance: '85%',
      faculty: 'Faculty Incharge',
      room: 'Main Academic Wing',
      desc: 'Syllabus and study materials available on campus LMS.'
    };
  },

  // ==========================================
  // Attendance & Bunk Manager State Operations
  // ==========================================
  getAttendance() {
    return JSON.parse(localStorage.getItem(this.KEYS.ATTENDANCE) || '[]');
  },

  setAttendance(list) {
    localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify(list));
  },

  addAttendance(subject) {
    const list = this.getAttendance();
    const attended = Math.max(0, parseInt(subject.attended) || 0);
    const total = Math.max(attended, parseInt(subject.total) || 0);

    const newSubject = {
      id: 'att-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      subjectCode: (subject.subjectCode || 'SUB101').toUpperCase().trim(),
      subjectName: subject.subjectName || 'General Subject',
      originalAttended: attended,
      originalTotal: total,
      attended: attended,
      total: total,
      target: parseInt(subject.target) || 75,
      faculty: subject.faculty || 'Faculty Incharge'
    };
    list.push(newSubject);
    this.setAttendance(list);
    return newSubject;
  },

  importErpAttendance(subjectsList, replace = true) {
    let list = replace ? [] : this.getAttendance();

    subjectsList.forEach(item => {
      const attended = Math.max(0, parseInt(item.attended) || 0);
      const total = Math.max(attended, parseInt(item.total) || 0);
      list.push({
        id: 'att-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
        subjectCode: (item.subjectCode || 'COURSE').toUpperCase().trim(),
        subjectName: item.subjectName || item.subjectCode || 'Course Name',
        originalAttended: attended,
        originalTotal: total,
        attended: attended,
        total: total,
        target: parseInt(item.target) || 75,
        faculty: item.faculty || 'Faculty Incharge'
      });
    });

    this.setAttendance(list);
    return list;
  },

  updateAttendance(id, updatedFields) {
    const list = this.getAttendance();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      const item = list[idx];
      const attended = updatedFields.attended !== undefined ? parseInt(updatedFields.attended) : item.attended;
      const total = updatedFields.total !== undefined ? parseInt(updatedFields.total) : item.total;
      
      list[idx] = {
        ...item,
        ...updatedFields,
        attended: Math.max(0, attended),
        total: Math.max(attended, total),
        originalAttended: Math.max(0, attended),
        originalTotal: Math.max(attended, total)
      };
      this.setAttendance(list);
      return list[idx];
    }
    return null;
  },

  deleteAttendance(id) {
    let list = this.getAttendance();
    list = list.filter(s => s.id !== id);
    this.setAttendance(list);
  },

  clearAllAttendance() {
    this.setAttendance([]);
  },

  // Attendance Settlement / What-If Simulation
  simulateSubject(id, actionType) {
    const list = this.getAttendance();
    const target = list.find(s => s.id === id);
    if (!target) return null;

    if (target.originalAttended === undefined) {
      target.originalAttended = target.attended || 0;
      target.originalTotal = target.total || 0;
    }

    if (actionType === 'attend_more') {
      // User attends 1 more class
      target.attended = (target.attended || 0) + 1;
      target.total = (target.total || 0) + 1;
    } else if (actionType === 'bunk_more') {
      // User misses/bunks 1 class
      target.total = (target.total || 0) + 1;
    } else if (actionType === 'attend_less') {
      // Undo a simulated attended class
      if (target.attended > 0 && target.total > 0) {
        target.attended = target.attended - 1;
        target.total = target.total - 1;
      }
    } else if (actionType === 'bunk_less') {
      // Undo a simulated bunked class
      if (target.total > target.attended) {
        target.total = target.total - 1;
      }
    }

    this.setAttendance(list);
    return target;
  },

  // Reset single subject back to baseline ERP counts
  resetSubjectSimulation(id) {
    const list = this.getAttendance();
    const target = list.find(s => s.id === id);
    if (!target) return null;

    target.attended = target.originalAttended !== undefined ? target.originalAttended : target.attended;
    target.total = target.originalTotal !== undefined ? target.originalTotal : target.total;

    this.setAttendance(list);
    return target;
  },

  // Reset all subjects back to baseline ERP values
  resetAllSimulations() {
    const list = this.getAttendance();
    list.forEach(sub => {
      sub.attended = sub.originalAttended !== undefined ? sub.originalAttended : sub.attended;
      sub.total = sub.originalTotal !== undefined ? sub.originalTotal : sub.total;
    });
    this.setAttendance(list);
    return list;
  },

  // Core Math Calculation Logic for Single Subject
  calculateSubjectStats(sub) {
    const attended = sub.attended || 0;
    const total = sub.total || 0;
    const target = sub.target || 75;
    const origAttended = sub.originalAttended !== undefined ? sub.originalAttended : attended;
    const origTotal = sub.originalTotal !== undefined ? sub.originalTotal : total;

    const percentage = total === 0 ? 100 : ((attended / total) * 100);
    const roundedPercent = Math.round(percentage * 10) / 10;
    
    const origPercentage = origTotal === 0 ? 100 : ((origAttended / origTotal) * 100);
    const roundedOrigPercent = Math.round(origPercentage * 10) / 10;

    const deltaPercent = Math.round((roundedPercent - roundedOrigPercent) * 10) / 10;
    const isSimulated = (attended !== origAttended) || (total !== origTotal);

    const targetDecimal = target / 100;
    let isSafe = percentage >= target;
    let safeBunks = 0;
    let classesToAttend = 0;

    if (total === 0) {
      isSafe = true;
      safeBunks = 0;
      classesToAttend = 0;
    } else if (isSafe) {
      // Safe to Bunk: floor((attended - target*total) / target)
      safeBunks = Math.floor((attended - (targetDecimal * total)) / targetDecimal);
      if (safeBunks < 0) safeBunks = 0;
    } else {
      // Need to Attend: ceil((target*total - attended) / (1 - target))
      const num = (targetDecimal * total) - attended;
      const den = 1 - targetDecimal;
      classesToAttend = Math.ceil(num / den);
      if (classesToAttend < 0) classesToAttend = 0;
    }

    let statusClass = 'safe';
    let statusLabel = 'On Track';

    if (percentage < target - 7) {
      statusClass = 'danger';
      statusLabel = 'Critical Shortage';
    } else if (percentage < target) {
      statusClass = 'warning';
      statusLabel = 'Low Attendance';
    } else if (percentage >= 90) {
      statusClass = 'stellar';
      statusLabel = 'Excellent';
    }

    return {
      percentage: roundedPercent,
      origPercentage: roundedOrigPercent,
      deltaPercent,
      isSimulated,
      simulatedAttended: attended,
      simulatedTotal: total,
      origAttended,
      origTotal,
      isSafe,
      safeBunks,
      classesToAttend,
      statusClass,
      statusLabel
    };
  },

  // Calculate Overall Aggregate Summary
  calculateOverallStats() {
    const list = this.getAttendance();
    if (list.length === 0) {
      return {
        totalSubjects: 0,
        totalAttended: 0,
        totalClasses: 0,
        overallPercentage: 0,
        origOverallPercentage: 0,
        deltaOverallPercent: 0,
        safeCount: 0,
        dangerCount: 0,
        totalSafeBunks: 0,
        totalNeedToAttend: 0,
        isOverallSafe: false,
        anySimulated: false,
        isEmpty: true
      };
    }

    let totalAttended = 0;
    let totalClasses = 0;
    let origTotalAttended = 0;
    let origTotalClasses = 0;
    let safeCount = 0;
    let dangerCount = 0;
    let totalSafeBunks = 0;
    let totalNeedToAttend = 0;
    let anySimulated = false;

    list.forEach(sub => {
      totalAttended += (sub.attended || 0);
      totalClasses += (sub.total || 0);
      origTotalAttended += (sub.originalAttended !== undefined ? sub.originalAttended : (sub.attended || 0));
      origTotalClasses += (sub.originalTotal !== undefined ? sub.originalTotal : (sub.total || 0));

      const stats = this.calculateSubjectStats(sub);
      if (stats.isSimulated) anySimulated = true;

      if (stats.isSafe) {
        safeCount++;
        totalSafeBunks += stats.safeBunks;
      } else {
        dangerCount++;
        totalNeedToAttend += stats.classesToAttend;
      }
    });

    const overallPercentage = totalClasses === 0 ? 100 : Math.round((totalAttended / totalClasses) * 1000) / 10;
    const origOverallPercentage = origTotalClasses === 0 ? 100 : Math.round((origTotalAttended / origTotalClasses) * 1000) / 10;
    const deltaOverallPercent = Math.round((overallPercentage - origOverallPercentage) * 10) / 10;

    return {
      totalSubjects: list.length,
      totalAttended,
      totalClasses,
      origTotalAttended,
      origTotalClasses,
      overallPercentage,
      origOverallPercentage,
      deltaOverallPercent,
      safeCount,
      dangerCount,
      totalSafeBunks,
      totalNeedToAttend,
      isOverallSafe: overallPercentage >= 75,
      anySimulated,
      isEmpty: false
    };
  }
};

// UI Notification Toasts
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span><strong>${icon}</strong> ${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Auto-initialize state on page load
StateManager.init();
