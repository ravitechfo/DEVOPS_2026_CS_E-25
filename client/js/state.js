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
