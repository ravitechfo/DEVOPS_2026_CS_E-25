// Smart Campus - Student & Faculty Portal Logic

let currentNoticeFilter = 'All';
let currentNoticeSearch = '';
let currentAttendanceFilter = 'All';
let currentAttendanceSearch = '';
let currentLFFilter = 'All';
let currentLFSearch = '';
let currentComplaintFilter = 'All';
let currentTimetableDay = 'ALL';
let currentTimetableSearch = '';
let currentTimetableSection = '5th Sem - CSE (Sec A)';
let activeLiveSubjectCode = null;

document.addEventListener('DOMContentLoaded', () => {
  initUserProfile();
  renderAllModules();
  setupDatePicker();

  // Asynchronous REST API Synchronization with Backend
  if (StateManager && StateManager.syncFromServer) {
    StateManager.syncFromServer().then(synced => {
      if (synced) {
        renderAllModules();
        console.log('🔄 Dashboard state synchronized with backend REST API!');
      }
    });
  }
});

// Profile & Header Init
function initUserProfile() {
  const user = StateManager.getUser();
  const isSkitDomain = StateManager.isInstitutionalDomain(user.email);
  const isVerified = user.isVerified || isSkitDomain;

  document.getElementById('navUserName').innerText = user.name || 'SKIT Student';
  document.getElementById('userAvatar').innerText = (user.name || 'R').charAt(0).toUpperCase();
  
  const roleEl = document.getElementById('navUserRole');
  roleEl.innerText = (user.role || 'STUDENT').toUpperCase();
  roleEl.className = `role-pill role-${user.role || 'student'}`;
  
  // Verification Badge in Nav
  const verifBadge = document.getElementById('navVerificationBadge');
  if (verifBadge) {
    if (isVerified) {
      verifBadge.innerText = '🛡️ SKIT VERIFIED';
      verifBadge.className = 'status-pill status-approved';
      verifBadge.style.display = 'inline-block';
    } else if (user.verificationStatus === 'Rejected') {
      verifBadge.innerText = '✕ UNVERIFIED';
      verifBadge.className = 'status-pill status-rejected';
      verifBadge.style.display = 'inline-block';
    } else {
      verifBadge.innerText = '⏳ PENDING REVIEW';
      verifBadge.className = 'status-pill status-pending';
      verifBadge.style.display = 'inline-block';
    }
  }

  // Hero section badge
  const collegeNameEl = document.getElementById('heroCollegeName');
  if (collegeNameEl) collegeNameEl.innerText = '🎓 ' + (user.collegeName || 'SKIT Jaipur');
  
  const studentRollEl = document.getElementById('heroStudentRoll');
  if (studentRollEl) studentRollEl.innerText = `Roll: ${user.rollNo || '24ESKCS677'} | ${user.department || 'CSE'}`;

  document.getElementById('welcomeTitle').innerText = `Welcome back, ${user.name || 'User'} 👋`;

  // Role-Based UI Customization (Hide Attendance for Faculty / Admin)
  const isStudent = (user.role === 'student' || !user.role);
  const attendanceNavBtn = document.getElementById('navTabAttendance');
  const attendanceStatCard = document.getElementById('statCardAttendance');
  const heroSubtitle = document.getElementById('heroSubtitle');

  if (!isStudent) {
    // Hide Attendance Tab and Stat Card for Faculty & Admin
    if (attendanceNavBtn) attendanceNavBtn.style.display = 'none';
    if (attendanceStatCard) attendanceStatCard.style.display = 'none';

    if (heroSubtitle) {
      heroSubtitle.innerText = user.role === 'faculty'
        ? 'Access departmental timetables, official circulars, report campus grievances, and book seminar halls.'
        : 'Access student view preview, circular broadcasts, and campus resource management.';
    }

    // If currently on attendance tab, switch to notices
    const activeBtn = document.querySelector('.nav-tab-btn.active');
    if (activeBtn && activeBtn.onclick && activeBtn.onclick.toString().includes('attendance')) {
      switchModule('notices');
    }
  } else {
    if (attendanceNavBtn) attendanceNavBtn.style.display = 'flex';
    if (attendanceStatCard) attendanceStatCard.style.display = 'block';
  }

  // Dynamic Verification Alert Banner
  const alertBanner = document.getElementById('studentVerificationAlert');
  if (alertBanner) {
    if (isVerified || !isStudent) {
      alertBanner.style.display = 'none';
    } else if (user.verificationStatus === 'Rejected') {
      alertBanner.style.display = 'flex';
      alertBanner.style.background = 'var(--danger-light)';
      alertBanner.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      alertBanner.style.color = 'var(--danger-text)';
      document.getElementById('verifAlertIcon').innerText = '⚠️';
      document.getElementById('verifAlertHeading').innerText = 'SKIT Institutional Verification Rejected';
      document.getElementById('verifAlertMsg').innerText = 'Your submitted ID proof could not be validated by the SKIT Admin Desk. Please re-upload your valid College ID Card or contact admin.';
      document.getElementById('verifAlertActions').innerHTML = `
        <a href="index.html" class="btn btn-danger btn-sm">Re-Submit ID</a>
      `;
    } else {
      // Pending
      alertBanner.style.display = 'flex';
      alertBanner.style.background = 'var(--warning-light)';
      alertBanner.style.borderColor = 'rgba(245, 158, 11, 0.3)';
      alertBanner.style.color = 'var(--warning-text)';
      document.getElementById('verifAlertIcon').innerText = '⏳';
      document.getElementById('verifAlertHeading').innerText = 'SKIT Student ID Verification Under Review';
      document.getElementById('verifAlertMsg').innerText = `You logged in with '${user.email}'. Your verification request for Roll No: ${user.rollNo || '24ESKCS112'} has been submitted to SKIT Admin Desk.`;
      document.getElementById('verifAlertActions').innerHTML = `
        <span class="status-pill status-pending">In Admin Queue</span>
      `;
    }
  }

  // Prefill contact names in modals if available
  const lostContactName = document.getElementById('lostContactName');
  if (lostContactName) lostContactName.value = user.name || '';
  const foundContactName = document.getElementById('foundContactName');
  if (foundContactName) foundContactName.value = user.name || '';
}

function setupDatePicker() {
  const bookDate = document.getElementById('bookDate');
  if (bookDate) {
    const today = new Date().toISOString().split('T')[0];
    bookDate.min = today;
    bookDate.value = today;
  }
}

// Dropdown Toggle & Services Hub
function toggleServicesDropdown(event) {
  if (event) event.stopPropagation();
  const wrap = document.getElementById('campusServicesDropdownWrap');
  if (wrap) wrap.classList.toggle('open');
}

function closeServicesDropdown() {
  const wrap = document.getElementById('campusServicesDropdownWrap');
  if (wrap) wrap.classList.remove('open');
}

document.addEventListener('click', (e) => {
  const wrap = document.getElementById('campusServicesDropdownWrap');
  if (wrap && !wrap.contains(e.target)) {
    wrap.classList.remove('open');
  }
});

// Module Navigation Tabs
function switchModule(moduleName) {
  closeServicesDropdown();
  const user = StateManager.getUser();
  const isStudent = (user.role === 'student' || !user.role);

  // Prevent non-students from switching into attendance module
  if (moduleName === 'attendance' && !isStudent) {
    showToast('Attendance tracking is only available for Students.', 'warning');
    moduleName = 'notices';
  }

  // Update nav buttons
  const buttons = document.querySelectorAll('.nav-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  const targetBtn = Array.from(buttons).find(b => b.onclick && b.onclick.toString().includes(`'${moduleName}'`));
  if (targetBtn) {
    targetBtn.classList.add('active');
  } else {
    // If inside mega dropdown, highlight More Services dropdown button
    const dropdownBtn = document.getElementById('servicesDropdownBtn');
    if (dropdownBtn) dropdownBtn.classList.add('active');
  }

  // Update Hub Launcher Cards active state
  const hubCards = document.querySelectorAll('.hub-card');
  hubCards.forEach(card => {
    if (card.getAttribute('onclick') && card.getAttribute('onclick').includes(moduleName)) {
      card.classList.add('active-hub');
    } else {
      card.classList.remove('active-hub');
    }
  });

  // Update content sections
  const contents = document.querySelectorAll('.module-content');
  contents.forEach(sec => sec.classList.remove('active'));

  const targetSection = document.getElementById(`module-${moduleName}`);
  if (targetSection) targetSection.classList.add('active');

  // Trigger module-specific renders
  if (moduleName === 'gatepass') renderGatePassModule();
  if (moduleName === 'library') renderLibraryModule();
}

// Render All Modules & Stats
function renderAllModules() {
  renderNotices();
  renderAttendance();
  renderTimetable();
  renderLostFound();
  renderComplaints();
  renderFacilitiesAndBookings();
  renderGatePassModule();
  renderLibraryModule();
  initGatePassFormDefaults();
  updateStats();
}

function updateStats() {
  const notices = StateManager.getNotices();
  const lostFound = StateManager.getLostFound();
  const complaints = StateManager.getComplaints();
  const bookings = StateManager.getBookings();
  const overallStats = StateManager.calculateOverallStats();
  const gatePasses = StateManager.getGatePasses();
  const libResources = StateManager.getLibraryResources();

  const noticeCountEl = document.getElementById('statNoticeCount');
  if (noticeCountEl) noticeCountEl.innerText = notices.length;

  const lostCountEl = document.getElementById('statLostCount');
  if (lostCountEl) lostCountEl.innerText = lostFound.length;

  const cmpCountEl = document.getElementById('statComplaintCount');
  if (cmpCountEl) cmpCountEl.innerText = complaints.filter(c => c.status !== 'Resolved').length;

  const bkCountEl = document.getElementById('statBookingCount');
  if (bkCountEl) bkCountEl.innerText = bookings.length;

  // Gate Pass Count
  const gpStatEl = document.getElementById('statGatePassCount');
  if (gpStatEl) {
    const activePass = gatePasses.find(g => g.status === 'Approved' || g.status === 'Out of Campus');
    gpStatEl.innerText = activePass ? (activePass.status === 'Out of Campus' ? '🚶 Out (Gate 1)' : '✓ 1 Active') : `${gatePasses.length} Passes`;
  }

  // Library Count
  const libStatEl = document.getElementById('statLibResourceCount');
  if (libStatEl) {
    libStatEl.innerText = `${libResources.length} Courses`;
  }

  const attPercentEl = document.getElementById('statAttendancePercent');
  const attSubEl = document.getElementById('statAttendanceSubtitle');
  if (attPercentEl && attSubEl) {
    attPercentEl.innerText = `${overallStats.overallPercentage}%`;
    if (overallStats.isOverallSafe) {
      attSubEl.innerText = `🟢 Safe (${overallStats.totalSafeBunks} Bunks Left)`;
      attSubEl.style.color = 'var(--success)';
    } else {
      attSubEl.innerText = `🔴 Shortage (${overallStats.dangerCount} Subjects < 75%)`;
      attSubEl.style.color = 'var(--danger)';
    }
  }

  // Update Hub Launcher Badge for attendance
  const hubAttBadge = document.getElementById('hubAttBadge');
  if (hubAttBadge) {
    hubAttBadge.innerText = `${overallStats.overallPercentage}% Safe`;
  }
}

// ==========================================
// 1. NOTICE BOARD MODULE
// ==========================================
function filterNotices(category) {
  currentNoticeFilter = category;
  const filterBtns = document.querySelectorAll('#noticeFilterGroup .filter-btn');
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.innerText.includes(category) || (category === 'All' && btn.innerText === 'All Notices'));
  });
  renderNotices();
}

function handleNoticeSearch() {
  currentNoticeSearch = document.getElementById('noticeSearchInput').value.toLowerCase().trim();
  renderNotices();
}

function renderNotices() {
  const container = document.getElementById('noticesContainer');
  let notices = StateManager.getNotices();

  // Filter by category
  if (currentNoticeFilter !== 'All') {
    notices = notices.filter(n => n.category.toLowerCase() === currentNoticeFilter.toLowerCase());
  }

  // Filter by search
  if (currentNoticeSearch) {
    notices = notices.filter(n => 
      n.title.toLowerCase().includes(currentNoticeSearch) ||
      n.content.toLowerCase().includes(currentNoticeSearch) ||
      (n.author && n.author.toLowerCase().includes(currentNoticeSearch))
    );
  }

  if (notices.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-md); border: 1px dashed var(--gray-300);">
        <p style="color: var(--gray-500); font-size: 1.1rem;">No notices found matching your filter criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = notices.map((notice, idx) => {
    const borderClass = notice.isUrgent ? 'urgent' : notice.category ? notice.category.toLowerCase() : 'academic';
    const tagClass = notice.badgeClass || 'tag-academic';

    return `
      <div class="card notice-card ${borderClass}" style="--item-index: ${idx};">
        <div class="card-meta">
          <span class="card-tag ${tagClass}">${notice.category}</span>
          <span class="card-date">📅 ${notice.date}</span>
        </div>
        <h3 class="card-title">${notice.title}</h3>
        <p class="card-desc">${notice.content}</p>
        <div class="card-footer">
          <span style="font-size: 0.78rem; font-weight: 600; color: var(--gray-500);">
            🏛️ ${notice.author || 'Campus Administration'}
          </span>
          <button class="btn btn-secondary btn-sm" onclick="openNoticeModal('${notice.id}')">Read Full</button>
        </div>
      </div>
    `;
  }).join('');
}

function openNoticeModal(id) {
  const notice = StateManager.getNotices().find(n => n.id === id);
  if (!notice) return;

  document.getElementById('viewNoticeTitle').innerText = notice.title;
  document.getElementById('viewNoticeTag').innerText = notice.category;
  document.getElementById('viewNoticeTag').className = `card-tag ${notice.badgeClass || 'tag-academic'}`;
  document.getElementById('viewNoticeDate').innerText = '📅 ' + notice.date;
  document.getElementById('viewNoticeAuthor').innerText = 'Published by: ' + (notice.author || 'Dean of Academic Affairs');
  document.getElementById('viewNoticeContent').innerText = notice.content;

  const attachBox = document.getElementById('viewNoticeAttachmentBox');
  if (notice.attachment) {
    attachBox.style.display = 'block';
    document.getElementById('viewNoticeAttachmentName').innerText = notice.attachment;
  } else {
    attachBox.style.display = 'none';
  }

  openModal('modalNoticeView');
}

// ==========================================
// 📅 STUDENT ACADEMIC TIME TABLE MODULE
// ==========================================
const WEEK_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

function filterTimetableDay(day) {
  currentTimetableDay = day;
  const buttons = document.querySelectorAll('#ttDayTabs .tt-day-btn');
  buttons.forEach(btn => {
    if (day === 'ALL' && btn.innerText.includes('Full Week')) {
      btn.classList.add('active');
    } else if (day === 'TODAY' && btn.innerText.includes('Today')) {
      btn.classList.add('active');
    } else if (btn.innerText.toUpperCase().startsWith(day.substring(0, 3))) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderTimetable();
}

function handleTimetableSearch() {
  currentTimetableSearch = document.getElementById('ttSearchInput').value.toLowerCase().trim();
  renderTimetable();
}

function handleTimetableSectionChange() {
  const select = document.getElementById('ttSectionSelect');
  if (select) {
    currentTimetableSection = select.value;
  }
  renderTimetable();
}

function renderTimetable() {
  const container = document.getElementById('timetableContainer');
  if (!container) return;

  const user = StateManager.getUser();
  let allSlots = StateManager.getTimetable({ section: currentTimetableSection });
  
  // Also update live lecture alert
  detectLiveLecture(allSlots);

  // Determine which days to display
  let daysToDisplay = WEEK_DAYS;
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  if (currentTimetableDay === 'TODAY') {
    daysToDisplay = WEEK_DAYS.includes(todayName) ? [todayName] : ['MONDAY'];
  } else if (currentTimetableDay !== 'ALL') {
    daysToDisplay = [currentTimetableDay];
  }

  // Filter slots by search query
  if (currentTimetableSearch) {
    allSlots = allSlots.filter(s => 
      s.subjectCode.toLowerCase().includes(currentTimetableSearch) ||
      s.subjectName.toLowerCase().includes(currentTimetableSearch) ||
      s.faculty.toLowerCase().includes(currentTimetableSearch) ||
      s.room.toLowerCase().includes(currentTimetableSearch)
    );
  }

  // Group slots by Day
  let html = '';
  daysToDisplay.forEach(day => {
    const daySlots = allSlots.filter(s => s.day.toUpperCase() === day);
    
    // Sort slots by start time
    daySlots.sort((a, b) => (a.startTime || a.time).localeCompare(b.startTime || b.time));

    const isToday = day === todayName;

    html += `
      <div class="tt-day-section">
        <div class="tt-day-header">
          <div class="tt-day-title">${day}</div>
          <div class="tt-day-sub">${isToday ? '⚡ Today' : daySlots.length + ' Classes'}</div>
        </div>
        <div class="tt-slots-container">
    `;

    if (daySlots.length === 0) {
      html += `
        <div class="tt-empty-day">
          <span>☕ No classes or lab sessions scheduled for ${day.toLowerCase()}.</span>
        </div>
      `;
    } else {
      html += daySlots.map(slot => {
        const is2Hours = slot.duration && slot.duration.includes('2.0');
        const isLab = slot.type === 'Practical' || slot.subjectName.toLowerCase().includes('lab');
        const isOngoing = checkIsSlotOngoing(slot);

        const cardClasses = [
          'tt-slot-card',
          is2Hours ? 'slot-2hours' : '',
          isLab ? 'slot-lab' : '',
          isOngoing ? 'slot-ongoing' : ''
        ].filter(Boolean).join(' ');

        return `
          <div class="${cardClasses}" onclick="openSubjectDetails('${slot.subjectCode}')" title="Click to view subject & faculty details">
            <div class="tt-card-top">
              <span class="tt-time">${slot.time}</span>
              <span class="tt-duration">${slot.duration || '1.0 hours'}</span>
            </div>
            <div class="tt-card-body">
              <a href="javascript:void(0)" class="tt-subject-link">${slot.subjectCode} - ${slot.subjectName}</a>
            </div>
            <div class="tt-card-bottom">
              <span class="tt-room">${slot.room}</span>
              <span class="tt-faculty">${slot.faculty}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Detect ongoing or next upcoming class based on real-time clock
function checkIsSlotOngoing(slot) {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  if (slot.day.toUpperCase() !== currentDay) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  if (slot.startTime && slot.endTime) {
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    const slotStartMin = startH * 60 + startM;
    const slotEndMin = endH * 60 + endM;
    return currentMinutes >= slotStartMin && currentMinutes < slotEndMin;
  }
  return false;
}

function detectLiveLecture(slots) {
  const alertEl = document.getElementById('ttLiveAlert');
  if (!alertEl) return;

  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const todaySlots = slots.filter(s => s.day.toUpperCase() === currentDay);

  if (todaySlots.length === 0) {
    alertEl.style.display = 'none';
    return;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let ongoingSlot = null;
  let nextSlot = null;

  for (const slot of todaySlots) {
    if (slot.startTime && slot.endTime) {
      const [startH, startM] = slot.startTime.split(':').map(Number);
      const [endH, endM] = slot.endTime.split(':').map(Number);
      const startMin = startH * 60 + startM;
      const endMin = endH * 60 + endM;

      if (currentMinutes >= startMin && currentMinutes < endMin) {
        ongoingSlot = slot;
        break;
      } else if (currentMinutes < startMin && (!nextSlot || startMin < nextSlot.startMin)) {
        nextSlot = { ...slot, startMin };
      }
    }
  }

  if (ongoingSlot) {
    activeLiveSubjectCode = ongoingSlot.subjectCode;
    alertEl.style.display = 'flex';
    document.getElementById('ttLiveBadge').innerText = '🔴 Happening Now';
    document.getElementById('ttLiveBadge').style.background = '#ef4444';
    document.getElementById('ttLiveSubject').innerText = `${ongoingSlot.subjectCode} - ${ongoingSlot.subjectName}`;
    document.getElementById('ttLiveSubtext').innerText = `Room: ${ongoingSlot.room} • Faculty: ${ongoingSlot.faculty} • Time: ${ongoingSlot.time}`;
  } else if (nextSlot) {
    activeLiveSubjectCode = nextSlot.subjectCode;
    alertEl.style.display = 'flex';
    const diff = nextSlot.startMin - currentMinutes;
    document.getElementById('ttLiveBadge').innerText = diff <= 60 ? `⏳ Next in ${diff}m` : '📅 Upcoming Today';
    document.getElementById('ttLiveBadge').style.background = '#0ea5e9';
    document.getElementById('ttLiveSubject').innerText = `${nextSlot.subjectCode} - ${nextSlot.subjectName}`;
    document.getElementById('ttLiveSubtext').innerText = `Room: ${nextSlot.room} • Faculty: ${nextSlot.faculty} • Time: ${nextSlot.time}`;
  } else {
    // Show first morning lecture of today or none
    alertEl.style.display = 'none';
  }
}

function openLiveSubjectDetails() {
  if (activeLiveSubjectCode) {
    openSubjectDetails(activeLiveSubjectCode);
  }
}

function openSubjectDetails(subjectCode) {
  const details = StateManager.getSubjectDetails(subjectCode);
  
  document.getElementById('subjectCodePill').innerText = details.code;
  document.getElementById('subjectDetailName').innerText = details.name;
  document.getElementById('subjectFacultyName').innerText = details.faculty || 'Faculty Incharge';
  document.getElementById('subjectRoomNumber').innerText = details.room || 'Department Classroom';
  document.getElementById('subjectCredits').innerText = `${details.credits || 3} Credits (${details.type || 'Theory'})`;
  document.getElementById('subjectAttendance').innerText = `${details.attendance || '88%'} (Good Standing)`;
  document.getElementById('subjectDescription').innerText = details.desc || 'Complete syllabus and session plan available on university ERP.';

  openModal('modalSubjectDetails');
}

// ==========================================
// 2. LOST & FOUND MODULE
// ==========================================
function filterLostFound(type) {
  currentLFFilter = type;
  renderLostFound();
}

function handleLostFoundSearch() {
  currentLFSearch = document.getElementById('lfSearchInput').value.toLowerCase().trim();
  renderLostFound();
}

function renderLostFound() {
  const container = document.getElementById('lostFoundContainer');
  let items = StateManager.getLostFound();

  if (currentLFFilter !== 'All') {
    items = items.filter(i => i.type === currentLFFilter);
  }

  if (currentLFSearch) {
    items = items.filter(i => 
      i.title.toLowerCase().includes(currentLFSearch) ||
      i.location.toLowerCase().includes(currentLFSearch) ||
      i.description.toLowerCase().includes(currentLFSearch)
    );
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-md); border: 1px dashed var(--gray-300);">
        <p style="color: var(--gray-500); font-size: 1.1rem;">No lost or found items reported in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map((item, idx) => {
    const isLost = item.type === 'lost';
    const isClaimed = item.status === 'Claimed' || item.status === 'Resolved';
    const badgeClass = isClaimed ? 'badge-claimed' : (isLost ? 'badge-lost' : 'badge-found');
    const badgeText = isClaimed ? '✓ CLAIMED / RESOLVED' : (isLost ? '🔴 LOST' : '🟢 FOUND');

    return `
      <div class="card" style="--item-index: ${idx};">
        <div class="card-meta">
          <span class="lost-found-badge ${badgeClass}">${badgeText}</span>
          <span class="card-date">🕒 ${item.dateTime || 'Recent'}</span>
        </div>
        <div class="item-visual">${item.icon || (isLost ? '❓' : '📦')}</div>
        <h3 class="card-title">${item.title}</h3>
        <div class="item-loc-info">
          <span>📍 <strong>Location:</strong> ${item.location}</span>
        </div>
        <div class="item-loc-info" style="margin-bottom: 0.8rem;">
          <span>🏷️ <strong>Category:</strong> ${item.category || 'General'}</span>
        </div>
        <p class="card-desc">${item.description}</p>
        
        <div class="card-footer">
          <div style="font-size: 0.8rem;">
            <div style="font-weight: 700; color: var(--gray-800);">👤 ${item.contactName}</div>
            <div style="color: var(--primary); font-weight: 600;">📞 ${item.contactPhone}</div>
          </div>
          ${!isClaimed ? `
            <button class="btn btn-primary btn-sm" onclick="handleClaimItem('${item.id}', '${item.type}')">
              ${isLost ? 'I Found This' : 'Claim Item'}
            </button>
          ` : `
            <span class="status-pill status-resolved">Closed</span>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function handleClaimItem(id, type) {
  const actionText = type === 'lost' ? 'Report finding this lost item to owner' : 'Claim this found item';
  if (confirm(`Do you want to ${actionText}? The status will update to Claimed/In-Process.`)) {
    StateManager.updateLostFoundStatus(id, 'Claimed');
    showToast(`Item status updated to Claimed. Please coordinate with the contact!`, 'success');
    renderLostFound();
    updateStats();
  }
}

function handleCreateLostItem(e) {
  e.preventDefault();
  const newItem = {
    type: 'lost',
    title: document.getElementById('lostItemTitle').value,
    category: document.getElementById('lostItemCategory').value,
    icon: document.getElementById('lostItemIcon').value || '🎧',
    location: document.getElementById('lostItemLocation').value,
    description: document.getElementById('lostItemDesc').value,
    contactName: document.getElementById('lostContactName').value,
    contactPhone: document.getElementById('lostContactPhone').value
  };

  StateManager.addLostFound(newItem);
  showToast('Lost item alert published across the campus network!', 'success');
  closeModal('modalReportLost');
  document.getElementById('formReportLost').reset();
  renderLostFound();
  updateStats();
}

function handleCreateFoundItem(e) {
  e.preventDefault();
  const newItem = {
    type: 'found',
    title: document.getElementById('foundItemTitle').value,
    category: document.getElementById('foundItemCategory').value,
    icon: document.getElementById('foundItemIcon').value || '📦',
    location: document.getElementById('foundItemLocation').value,
    description: document.getElementById('foundItemDesc').value,
    contactName: document.getElementById('foundContactName').value,
    contactPhone: document.getElementById('foundContactPhone').value
  };

  StateManager.addLostFound(newItem);
  showToast('Found item reported successfully! Students will be notified.', 'success');
  closeModal('modalReportFound');
  document.getElementById('formReportFound').reset();
  renderLostFound();
  updateStats();
}

// ==========================================
// 3. GRIEVANCES & COMPLAINTS MODULE
// ==========================================
function filterComplaints(status) {
  currentComplaintFilter = status;
  renderComplaints();
}

function renderComplaints() {
  const container = document.getElementById('complaintsContainer');
  let complaints = StateManager.getComplaints();

  if (currentComplaintFilter !== 'All') {
    complaints = complaints.filter(c => c.status === currentComplaintFilter);
  }

  if (complaints.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-md); border: 1px dashed var(--gray-300);">
        <p style="color: var(--gray-500); font-size: 1.1rem;">No grievances registered in this view.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = complaints.map((c, idx) => {
    const isSubmitted = true;
    const isInProgress = c.status === 'In Progress' || c.status === 'Resolved';
    const isResolved = c.status === 'Resolved';

    return `
      <div class="card" style="--item-index: ${idx};">
        <div class="card-meta">
          <span class="card-tag tag-academic">${c.category}</span>
          <span class="status-pill ${c.status === 'Resolved' ? 'status-resolved' : c.status === 'In Progress' ? 'status-in-progress' : 'status-pending'}">
            ${c.status}
          </span>
        </div>

        <h3 class="card-title">${c.title}</h3>
        <div class="item-loc-info">
          <span>📍 <strong>Location:</strong> ${c.location}</span>
        </div>
        <div class="item-loc-info" style="margin-bottom: 0.8rem;">
          <span>⚡ <strong>Urgency:</strong> <span style="color:${c.urgency === 'Critical' ? 'var(--danger)' : c.urgency === 'High' ? 'var(--warning)' : 'var(--success)'}; font-weight:700;">${c.urgency}</span></span>
        </div>

        <p class="card-desc">${c.description}</p>

        <!-- Stepper Progress Tracker -->
        <div class="complaint-status-stepper">
          <div class="step-node ${isSubmitted ? (isInProgress ? 'completed' : 'active') : ''}">
            <div class="step-dot">${isSubmitted ? '✓' : '1'}</div>
            <span class="step-label">Submitted</span>
          </div>
          <div class="step-node ${isInProgress ? (isResolved ? 'completed' : 'active') : ''}">
            <div class="step-dot">${isResolved ? '✓' : '2'}</div>
            <span class="step-label">In Progress</span>
          </div>
          <div class="step-node ${isResolved ? 'completed' : ''}">
            <div class="step-dot">${isResolved ? '✓' : '3'}</div>
            <span class="step-label">Resolved</span>
          </div>
        </div>

        <!-- Resolution Note from Admin -->
        <div style="background: var(--gray-50); border: 1px solid var(--gray-200); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.825rem; margin-top: auto;">
          <strong>Official Response:</strong> ${c.resolutionNote || 'Ticket queued for technical review.'}
          <div style="color: var(--gray-400); margin-top: 4px;">Assigned to: ${c.assignedTo || 'Campus Helpdesk'}</div>
        </div>
      </div>
    `;
  }).join('');
}

function handleCreateComplaint(e) {
  e.preventDefault();
  const user = StateManager.getUser();
  const newComplaint = {
    title: document.getElementById('cmpTitle').value,
    category: document.getElementById('cmpCategory').value,
    urgency: document.getElementById('cmpUrgency').value,
    location: document.getElementById('cmpLocation').value,
    description: document.getElementById('cmpDesc').value,
    reportedBy: user.name || 'Campus Student'
  };

  StateManager.addComplaint(newComplaint);
  showToast('Grievance ticket created! Campus maintenance has been notified.', 'success');
  closeModal('modalReportComplaint');
  document.getElementById('formReportComplaint').reset();
  renderComplaints();
  updateStats();
}

// ==========================================
// 4. FACILITY & LAB BOOKINGS MODULE
// ==========================================
function renderFacilitiesAndBookings() {
  const resources = StateManager.getResources();
  const bookings = StateManager.getBookings();

  // Populate Resource Catalog Cards
  const resContainer = document.getElementById('resourcesContainer');
  if (resContainer) {
    resContainer.innerHTML = resources.map((res, idx) => `
      <div class="card" style="text-align: center; --item-index: ${idx};">
        <div style="font-size: 2.8rem; margin-bottom: 0.6rem;">${res.icon || '🏢'}</div>
        <h3 class="card-title">${res.name}</h3>
        <p style="font-size: 0.85rem; color: var(--gray-500); margin-bottom: 0.5rem;">📍 ${res.location}</p>
        <p style="font-size: 0.85rem; font-weight: 600; color: var(--primary); margin-bottom: 1rem;">👥 Capacity: ${res.capacity} Persons</p>
        <button class="btn btn-secondary btn-sm" onclick="quickBookFacility('${res.id}')">Book Slot</button>
      </div>
    `).join('');
  }

  // Populate Select Dropdown in Modal
  const selectEl = document.getElementById('bookFacilitySelect');
  if (selectEl) {
    selectEl.innerHTML = resources.map(r => `
      <option value="${r.id}">${r.name} - (${r.location}) [Cap: ${r.capacity}]</option>
    `).join('');
  }

  // Render My Bookings Table
  const tbody = document.getElementById('myBookingsTableBody');
  if (tbody) {
    if (bookings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--gray-500);">No facility bookings placed yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = bookings.map(b => {
      const statusClass = b.status === 'Approved' ? 'status-approved' : b.status === 'Rejected' ? 'status-rejected' : 'status-pending';
      return `
        <tr>
          <td><strong>${b.resourceName}</strong></td>
          <td>${b.location}</td>
          <td>📅 ${b.bookingDate}</td>
          <td>🕒 ${b.timeSlot}</td>
          <td>${b.purpose || 'Academic Session'}</td>
          <td><span class="status-pill ${statusClass}">${b.status}</span></td>
        </tr>
      `;
    }).join('');
  }
}

function quickBookFacility(resourceId) {
  const selectEl = document.getElementById('bookFacilitySelect');
  if (selectEl) selectEl.value = resourceId;
  openModal('modalBookFacility');
}

function handleCreateBooking(e) {
  e.preventDefault();
  const user = StateManager.getUser();
  const bookingData = {
    resourceId: document.getElementById('bookFacilitySelect').value,
    bookingDate: document.getElementById('bookDate').value,
    timeSlot: document.getElementById('bookTimeSlot').value,
    purpose: document.getElementById('bookPurpose').value,
    studentName: user.name || 'Campus Student',
    studentEmail: user.email || 'student@campus.edu'
  };

  StateManager.addBooking(bookingData);
  showToast('Booking request submitted! Waiting for Admin verification.', 'success');
  closeModal('modalBookFacility');
  document.getElementById('formBookFacility').reset();
  renderFacilitiesAndBookings();
  updateStats();
}

// ==========================================
// ==========================================
// SMART ATTENDANCE & BUNK MANAGER (ATTENDIFY ENGINE)
// ==========================================
let currentAttendanceEntryMode = 'present_total';

function filterAttendance(type) {
  currentAttendanceFilter = type;
  const filterBtns = document.querySelectorAll('#attFilterGroup .filter-btn');
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.innerText.includes(type) || (type === 'All' && btn.innerText === 'All Subjects'));
  });
  renderAttendance();
}

function handleAttendanceSearch() {
  currentAttendanceSearch = document.getElementById('attSearchInput').value.toLowerCase().trim();
  renderAttendance();
}

function renderAttendance() {
  const container = document.getElementById('attendanceContainer');
  const heroContainer = document.getElementById('attSummaryHero');
  if (!container) return;

  const attendanceList = StateManager.getAttendance();
  const overall = StateManager.calculateOverallStats();

  // If no attendance data yet -> Show Setup / Paste CTA State
  if (overall.isEmpty || attendanceList.length === 0) {
    if (heroContainer) heroContainer.style.display = 'none';

    container.innerHTML = `
      <div class="att-empty-setup-card" style="grid-column: 1 / -1;">
        <div class="att-empty-icon">📊</div>
        <h3>Set Up Your Attendance Tracker</h3>
        <p>
          Koi fake ya hardcoded data load nahi kiya gaya hai. Apne College ERP (CollPoll / SKIT ERP / iCloudEMS / TCS iON / Webkiosk) se attendance table copy karke direct paste karein ya manually enter karein.
        </p>
        
        <div class="att-empty-actions">
          <button type="button" class="btn btn-primary btn-lg" onclick="openModal('modalBulkAttendance')">
            ⚡ Paste ERP Attendance Table
          </button>
          <button type="button" class="btn btn-secondary" onclick="openAddAttendanceModal()">
            + Add Subject Manually
          </button>
          <button type="button" class="btn btn-subtle" onclick="loadSampleErpDemoData()" title="Quick load realistic subjects to test">
            🧪 Load Sample ERP Demo Data
          </button>
        </div>

        <div class="att-preview-hint">
          <strong>Tip / Supported Formats:</strong><br>
          Direct table copy from ERP, Excel copy, or line formats like: <code>CSUL501, Design and Analysis of Algorithms, 32, 39, 82.05%</code>
        </div>
      </div>
    `;
    return;
  }

  // Show Hero Banner
  if (heroContainer) heroContainer.style.display = 'flex';

  // 1. Update Hero Aggregate Summary View
  const percentValEl = document.getElementById('attOverallPercent');
  const circleBar = document.getElementById('attOverallCircle');
  const heroTitle = document.getElementById('attHeroTitle');
  const heroDesc = document.getElementById('attHeroDesc');
  const heroStatusPill = document.getElementById('attHeroStatusPill');

  if (percentValEl && circleBar) {
    percentValEl.innerText = `${overall.overallPercentage}%`;
    
    // Circle radius = 50, Circumference = 2 * PI * 50 = ~314.16
    const circumference = 314.16;
    const offset = circumference - ((Math.min(overall.overallPercentage, 100) / 100) * circumference);
    circleBar.style.strokeDashoffset = offset;

    if (overall.anySimulated) {
      const sign = overall.deltaOverallPercent >= 0 ? '+' : '';
      circleBar.className = overall.overallPercentage < 75 ? 'att-circle-bar danger' : 'att-circle-bar safe';
      heroStatusPill.className = 'att-status-pill simulated';
      heroStatusPill.innerHTML = `<span>⚡ Simulator Active (Original: ${overall.origOverallPercentage}%)</span>`;
      heroTitle.innerText = `Projected Attendance: ${overall.overallPercentage}% (${sign}${overall.deltaOverallPercent}%)`;
      heroDesc.innerHTML = `You are testing "What-If" scenarios on your subjects. <strong><a href="javascript:void(0)" onclick="handleResetAllSimulations()" style="color: var(--primary); text-decoration: underline;">Click here to Reset All to Original ERP baseline</a></strong>.`;
    } else if (overall.overallPercentage < 75) {
      circleBar.className = 'att-circle-bar danger';
      heroStatusPill.className = 'att-status-pill danger';
      heroStatusPill.innerHTML = `<span>🔴 Attendance Shortage Alert (&lt; 75%)</span>`;
      heroTitle.innerText = `Attention! ${overall.dangerCount} Subject(s) Below 75% Cutoff`;
      heroDesc.innerHTML = `You need to attend a total of <strong>${overall.totalNeedToAttend} more classes</strong> straight to regain university examination eligibility.`;
    } else {
      circleBar.className = 'att-circle-bar safe';
      heroStatusPill.className = 'att-status-pill safe';
      heroStatusPill.innerHTML = `<span>🟢 Safe Zone (Above 75% Criteria)</span>`;
      heroTitle.innerText = `Great Job! Attendance is comfortably safe.`;
      heroDesc.innerHTML = `You have <strong>${overall.totalSafeBunks} safe bunks</strong> remaining across your courses without dropping below the 75% eligibility cutoff.`;
    }
  }

  // Mini stats update
  const statAttEl = document.getElementById('attStatAttended');
  const statTotalCoursesEl = document.getElementById('attStatTotalCourses');
  const statSafeBunksEl = document.getElementById('attStatSafeBunks');
  const statShortageEl = document.getElementById('attStatShortageCount');

  if (statAttEl) statAttEl.innerText = `${overall.totalAttended} / ${overall.totalClasses}`;
  if (statTotalCoursesEl) statTotalCoursesEl.innerText = `${overall.totalSubjects} Subjects`;
  if (statSafeBunksEl) statSafeBunksEl.innerText = `🔥 ${overall.totalSafeBunks} Bunks`;
  if (statShortageEl) statShortageEl.innerText = overall.dangerCount > 0 ? `⚠️ ${overall.dangerCount} Subjects` : `✓ 0 Shortage`;

  // 2. Filter & Search Subjects
  let filtered = attendanceList.filter(item => {
    const stats = StateManager.calculateSubjectStats(item);
    const matchesFilter = currentAttendanceFilter === 'All' ||
      (currentAttendanceFilter === 'Danger' && !stats.isSafe) ||
      (currentAttendanceFilter === 'Safe' && stats.isSafe);

    const matchesSearch = !currentAttendanceSearch ||
      item.subjectName.toLowerCase().includes(currentAttendanceSearch) ||
      item.subjectCode.toLowerCase().includes(currentAttendanceSearch) ||
      (item.faculty && item.faculty.toLowerCase().includes(currentAttendanceSearch));

    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1;">
        <span>🔍</span>
        <p>No subjects found matching your filters. Click <strong>"+ Add Subject"</strong> or <strong>"⚡ Paste ERP Table"</strong> to add subjects.</p>
      </div>
    `;
    return;
  }

  // 3. Render Subject Cards with Attendify Steppers & Next-Class Projections
  container.innerHTML = filtered.map(sub => {
    const stats = StateManager.calculateSubjectStats(sub);

    // Build Advisor Message
    let advisorHtml = '';
    if (sub.total === 0) {
      advisorHtml = `<div class="att-advisor-box safe">✨ 0 classes held yet. Ready for start!</div>`;
    } else if (stats.isSafe) {
      if (stats.safeBunks > 0) {
        advisorHtml = `<div class="att-advisor-box safe">🎉 Safe to bunk <strong>${stats.safeBunks} ${stats.safeBunks === 1 ? 'class' : 'classes'}</strong> and stay &ge; 75%.</div>`;
      } else {
        advisorHtml = `<div class="att-advisor-box warning">⚖️ Borderline (75.0%)! Missing next class causes shortage.</div>`;
      }
    } else {
      advisorHtml = `<div class="att-advisor-box danger">⚠️ Shortage! Attend next <strong>${stats.classesToAttend} ${stats.classesToAttend === 1 ? 'class' : 'classes'} straight</strong> to reach 75%.</div>`;
    }

    const percentageColor = stats.statusClass === 'danger' ? 'var(--danger)' : stats.statusClass === 'warning' ? 'var(--warning)' : 'var(--success)';

    // Next Class Impact Projections
    const nextPresentSign = stats.nextPresentDelta >= 0 ? '+' : '';
    const nextAbsentSign = stats.nextAbsentDelta >= 0 ? '+' : '';

    return `
      <div class="att-card ${stats.isSimulated ? 'is-simulated' : ''}" id="att-card-${sub.id}">
        <div>
          <div class="att-card-header">
            <div>
              <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px;">
                <span class="att-card-code">${sub.subjectCode}</span>
                ${stats.isSimulated ? '<span class="att-sim-pill">Testing</span>' : ''}
              </div>
              <h4 class="att-card-title">${sub.subjectName}</h4>
              <div class="att-card-faculty">👨‍🏫 ${sub.faculty || 'Faculty Incharge'}</div>
            </div>
            <span class="att-card-badge ${stats.statusClass}">${stats.statusLabel}</span>
          </div>

          <div style="margin-top: 1.15rem;">
            <div class="att-metrics-row">
              <div class="att-percentage" style="color: ${percentageColor};">${stats.percentage}%</div>
              <div class="att-counts">
                ${stats.attended} Present &bull; ${stats.absent} Absent &bull; ${stats.total} Total
              </div>
            </div>

            <div class="att-bar-container">
              <div class="att-bar-fill ${stats.statusClass}" style="width: ${Math.min(stats.percentage, 100)}%;"></div>
              <div class="att-bar-target-line" title="Mandatory 75% Cutoff"></div>
            </div>

            <!-- Next Class Impact Projection -->
            <div class="att-card-aux-row" style="margin-top: 8px;">
              <div class="att-next-projection" title="Projected percentage if you attend or miss next class">
                <span>Next Class:</span>
                <span class="att-next-proj-tag pos">✓ Attended ➔ ${stats.nextPresentPercent}% (${nextPresentSign}${stats.nextPresentDelta}%)</span>
                <span>|</span>
                <span class="att-next-proj-tag neg">✗ Bunked ➔ ${stats.nextAbsentPercent}% (${nextAbsentSign}${stats.nextAbsentDelta}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          ${advisorHtml}

          <!-- Attendify Interactive Class Steppers -->
          <div class="att-actions-container">
            <div class="att-steppers-grid">
              <!-- Present Stepper -->
              <div class="att-stepper-group" title="Record Present Classes">
                <button type="button" class="att-stepper-btn minus" onclick="handleQuickPresent('${sub.id}', -1)" title="Undo 1 Present (-1 Present, -1 Total)">−</button>
                <button type="button" class="att-stepper-btn plus-present" onclick="handleQuickPresent('${sub.id}', 1)" title="Mark Present (+1 Present, +1 Total)">
                  <span>+ Present (${stats.attended})</span>
                </button>
              </div>

              <!-- Absent / Bunk Stepper -->
              <div class="att-stepper-group" title="Record Absent / Bunked Classes">
                <button type="button" class="att-stepper-btn minus" onclick="handleQuickAbsent('${sub.id}', -1)" title="Undo 1 Bunk (-1 Total)">−</button>
                <button type="button" class="att-stepper-btn plus-absent" onclick="handleQuickAbsent('${sub.id}', 1)" title="Mark Absent / Bunk (+1 Total)">
                  <span>+ Bunk (${stats.absent})</span>
                </button>
              </div>
            </div>

            <!-- Aux Controls (Edit, Reset, Delete) -->
            <div style="display: flex; justify-content: flex-end; gap: 8px; align-items: center; margin-top: 4px;">
              ${stats.isSimulated ? `
                <button type="button" class="btn-icon-subtle reset active" onclick="handleResetSubject('${sub.id}')" title="Reset subject back to original ERP baseline">
                  ↺ Reset
                </button>
              ` : ''}
              <button type="button" class="btn-icon-subtle" onclick="openAddAttendanceModal('${sub.id}')" title="Edit course details">
                ✏️
              </button>
              <button type="button" class="btn-icon-subtle delete" onclick="deleteAttendanceCourse('${sub.id}')" title="Delete subject">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Quick Present Stepper (+1 or -1)
function handleQuickPresent(id, delta) {
  const type = delta > 0 ? 'present_plus' : 'present_minus';
  const updated = StateManager.markAttendance(id, type);
  if (updated) {
    const stats = StateManager.calculateSubjectStats(updated);
    if (delta > 0) {
      showToast(`Marked Present for ${updated.subjectCode}: ${stats.attended}/${stats.total} (${stats.percentage}%)`, 'success');
    } else {
      showToast(`Undid Present for ${updated.subjectCode}: ${stats.attended}/${stats.total} (${stats.percentage}%)`, 'info');
    }
    renderAttendance();
    updateStats();
  }
}

// Quick Absent / Bunk Stepper (+1 or -1)
function handleQuickAbsent(id, delta) {
  const type = delta > 0 ? 'absent_plus' : 'absent_minus';
  const updated = StateManager.markAttendance(id, type);
  if (updated) {
    const stats = StateManager.calculateSubjectStats(updated);
    if (delta > 0) {
      showToast(`Recorded Bunk for ${updated.subjectCode}: ${stats.attended}/${stats.total} (${stats.percentage}%)`, 'error');
    } else {
      showToast(`Undid Bunk for ${updated.subjectCode}: ${stats.attended}/${stats.total} (${stats.percentage}%)`, 'info');
    }
    renderAttendance();
    updateStats();
  }
}

// Reset single subject back to original ERP baseline
function handleResetSubject(id) {
  const updated = StateManager.resetSubjectSimulation(id);
  if (updated) {
    showToast(`Reset ${updated.subjectCode} to original ERP baseline (${updated.attended}/${updated.total})`, 'info');
    renderAttendance();
    updateStats();
  }
}

// Reset all simulations to original ERP baseline
function handleResetAllSimulations() {
  StateManager.resetAllSimulations();
  showToast('Reset all subjects back to original ERP baseline!', 'info');
  renderAttendance();
  updateStats();
}

// Clear all attendance data to start fresh
function handleClearAllAttendance() {
  if (confirm('Are you sure you want to clear all attendance data and re-import from scratch?')) {
    StateManager.clearAllAttendance();
    showToast('Attendance data cleared. Ready for fresh import.', 'info');
    renderAttendance();
    updateStats();
  }
}

// Load sample realistic ERP demo dataset for 1-click test
function loadSampleErpDemoData() {
  const sampleData = [
    { subjectCode: 'CSUL501', subjectName: 'Design and Analysis of Algorithms (DAA)', attended: 32, total: 39, target: 75, faculty: 'Prof. Neetu Agrawal' },
    { subjectCode: 'CSUL502', subjectName: 'Machine Learning (ML)', attended: 21, total: 25, target: 75, faculty: 'Prof. Loveleen Kumar' },
    { subjectCode: 'CSUL503', subjectName: 'Cryptography & Network Security (CNS)', attended: 18, total: 22, target: 75, faculty: 'Prof. Himani Thakur' },
    { subjectCode: 'CSUL511', subjectName: 'Design Patterns & Principles (DPP)', attended: 24, total: 28, target: 75, faculty: 'Prof. Sumit Kumar' },
    { subjectCode: 'CSUP521', subjectName: 'Machine Learning Lab', attended: 12, total: 12, target: 75, faculty: 'Prof. Loveleen Kumar' },
    { subjectCode: 'CRT', subjectName: 'Campus Recruitment Training (CRT)', attended: 19, total: 22, target: 75, faculty: 'Prof. Mahender Beniwal' }
  ];
  StateManager.importErpAttendance(sampleData, true);
  showToast('Loaded realistic semester courses into tracker!', 'success');
  renderAttendance();
  updateStats();
}

// ==========================================
// ADD / EDIT COURSE MODAL MULTI-MODE LOGIC
// ==========================================
function setAttendanceEntryMode(mode) {
  currentAttendanceEntryMode = mode;
  
  const pills = document.querySelectorAll('#attEntryModeGroup .att-mode-pill');
  pills.forEach(p => {
    p.classList.toggle('active', p.getAttribute('onclick').includes(mode));
  });

  const rowPT = document.getElementById('attRowPresentTotal');
  const rowPA = document.getElementById('attRowPresentAbsent');
  const rowPct = document.getElementById('attRowPercentTotal');

  if (rowPT) rowPT.style.display = mode === 'present_total' ? 'flex' : 'none';
  if (rowPA) rowPA.style.display = mode === 'present_absent' ? 'flex' : 'none';
  if (rowPct) rowPct.style.display = mode === 'percent_total' ? 'flex' : 'none';

  updateAttendanceModalPreview();
}

function handleModalInputChanged(sourceMode) {
  let attended = parseInt(document.getElementById('attAttendedCount').value) || 0;
  let total = parseInt(document.getElementById('attTotalCount').value) || 0;

  if (sourceMode === 'present_absent') {
    const present = parseInt(document.getElementById('attModePresentCount').value) || 0;
    const absent = parseInt(document.getElementById('attModeAbsentCount').value) || 0;
    attended = present;
    total = present + absent;
    document.getElementById('attAttendedCount').value = attended;
    document.getElementById('attTotalCount').value = total;
  } else if (sourceMode === 'percent_total') {
    const pct = parseFloat(document.getElementById('attModeDirectPercent').value) || 0;
    total = parseInt(document.getElementById('attModeDirectTotal').value) || 0;
    attended = Math.round((pct / 100) * total);
    document.getElementById('attAttendedCount').value = attended;
    document.getElementById('attTotalCount').value = total;
  } else if (sourceMode === 'present_total') {
    const absent = Math.max(0, total - attended);
    const pct = total > 0 ? (Math.round((attended / total) * 1000) / 10) : 0;
    document.getElementById('attModePresentCount').value = attended;
    document.getElementById('attModeAbsentCount').value = absent;
    document.getElementById('attModeDirectPercent').value = pct;
    document.getElementById('attModeDirectTotal').value = total;
  }

  updateAttendanceModalPreview();
}

function updateAttendanceModalPreview() {
  const attendedInput = document.getElementById('attAttendedCount');
  const totalInput = document.getElementById('attTotalCount');
  const targetInput = document.getElementById('attTargetPercent');
  const percentEl = document.getElementById('attLiveCalcPercent');
  const breakdownEl = document.getElementById('attLiveCalcBreakdown');
  const statusEl = document.getElementById('attLiveCalcStatus');

  if (!attendedInput || !totalInput || !percentEl || !statusEl) return;

  const attended = Math.max(0, parseInt(attendedInput.value) || 0);
  const total = Math.max(0, parseInt(totalInput.value) || 0);
  const target = parseInt(targetInput.value) || 75;

  if (total === 0) {
    percentEl.innerText = '0.0%';
    percentEl.style.color = 'var(--text-muted)';
    if (breakdownEl) breakdownEl.innerText = '(0 / 0 Classes)';
    statusEl.innerText = 'Enter class counts';
    statusEl.style.color = 'var(--text-muted)';
    return;
  }

  const effectiveAttended = Math.min(attended, total);
  const percent = Math.round((effectiveAttended / total) * 1000) / 10;
  percentEl.innerText = `${percent}%`;
  if (breakdownEl) breakdownEl.innerText = `(${effectiveAttended} Present / ${total} Total, ${total - effectiveAttended} Absent)`;

  if (percent >= target) {
    percentEl.style.color = 'var(--success)';
    const safeBunks = Math.floor((effectiveAttended - ((target / 100) * total)) / (target / 100));
    statusEl.innerText = `🟢 Safe (${safeBunks} Bunks Available)`;
    statusEl.style.color = 'var(--success)';
  } else {
    percentEl.style.color = 'var(--danger)';
    const num = ((target / 100) * total) - effectiveAttended;
    const den = 1 - (target / 100);
    const need = Math.ceil(num / den);
    statusEl.innerText = `🔴 Shortage (Attend next ${need} classes straight)`;
    statusEl.style.color = 'var(--danger)';
  }
}

// Open Add or Edit Modal
function openAddAttendanceModal(editId = null) {
  const form = document.getElementById('formAddAttendance');
  const title = document.getElementById('attModalTitle');
  const submitBtn = document.getElementById('attSubmitBtn');
  const editIdInput = document.getElementById('attEditId');

  form.reset();
  setAttendanceEntryMode('present_total');

  if (editId) {
    const list = StateManager.getAttendance();
    const item = list.find(s => s.id === editId);
    if (item) {
      editIdInput.value = item.id;
      document.getElementById('attSubjectCode').value = item.subjectCode;
      document.getElementById('attSubjectName').value = item.subjectName;
      const att = item.originalAttended !== undefined ? item.originalAttended : item.attended;
      const tot = item.originalTotal !== undefined ? item.originalTotal : item.total;
      
      document.getElementById('attAttendedCount').value = att;
      document.getElementById('attTotalCount').value = tot;
      document.getElementById('attModePresentCount').value = att;
      document.getElementById('attModeAbsentCount').value = Math.max(0, tot - att);
      document.getElementById('attModeDirectPercent').value = tot > 0 ? (Math.round((att / tot) * 1000) / 10) : 0;
      document.getElementById('attModeDirectTotal').value = tot;
      
      document.getElementById('attTargetPercent').value = item.target || 75;
      document.getElementById('attFacultyName').value = item.faculty || '';
      
      title.innerText = `✏️ Edit Course Attendance`;
      submitBtn.innerText = `Update Course`;
    }
  } else {
    editIdInput.value = '';
    title.innerText = `📊 Add Course Attendance`;
    submitBtn.innerText = `Save Course`;
    document.getElementById('attTargetPercent').value = 75;
  }

  updateAttendanceModalPreview();
  openModal('modalAddAttendance');
}

// Save Subject from Form
function handleSaveAttendanceSubject(e) {
  e.preventDefault();
  const editId = document.getElementById('attEditId').value;
  let attended = parseInt(document.getElementById('attAttendedCount').value) || 0;
  let total = parseInt(document.getElementById('attTotalCount').value) || 0;
  const target = parseInt(document.getElementById('attTargetPercent').value) || 75;

  if (total <= 0 && attended > 0) {
    total = attended;
  }
  if (attended > total) {
    total = attended;
  }

  const subjectData = {
    subjectCode: document.getElementById('attSubjectCode').value.trim().toUpperCase(),
    subjectName: document.getElementById('attSubjectName').value.trim(),
    attended: attended,
    total: total,
    target: target,
    faculty: document.getElementById('attFacultyName').value.trim()
  };

  if (editId) {
    StateManager.updateAttendance(editId, subjectData);
    showToast(`Updated ${subjectData.subjectCode} details!`, 'success');
  } else {
    StateManager.addAttendance(subjectData);
    showToast(`Added ${subjectData.subjectCode} to tracker!`, 'success');
  }

  closeModal('modalAddAttendance');
  renderAttendance();
  updateStats();
}

// Delete Course
function deleteAttendanceCourse(id) {
  const list = StateManager.getAttendance();
  const target = list.find(s => s.id === id);
  const name = target ? target.subjectCode : 'Subject';

  if (confirm(`Are you sure you want to remove "${name}" from your Attendance tracker?`)) {
    StateManager.deleteAttendance(id);
    showToast(`Removed ${name}`, 'info');
    renderAttendance();
    updateStats();
  }
}

// ==========================================
// INTELLIGENT ERP PARSER & BULK IMPORTER
// ==========================================
function parseErpRawText(rawText) {
  if (!rawText) return [];
  const lines = rawText.split('\n');
  const parsedSubjects = [];

  // 1. Detect Header columns if present
  let colMap = null;
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const l = lines[i].toLowerCase();
    if ((l.includes('subject') || l.includes('course')) && (l.includes('present') || l.includes('absent') || l.includes('percentage') || l.includes('attended') || l.includes('total'))) {
      const headers = lines[i].split(/\t|,| {2,}/).map(h => h.trim().toLowerCase()).filter(Boolean);
      if (headers.length >= 3) {
        colMap = {};
        headers.forEach((h, idx) => {
          if (h.includes('code')) colMap.code = idx;
          else if (h === 'subject' || h === 'course' || h.includes('name')) colMap.name = idx;
          else if (h.includes('type')) colMap.type = idx;
          else if (h.includes('present') || h.includes('attended')) colMap.present = idx;
          else if (h.includes('od') || h.includes('duty')) colMap.od = idx;
          else if (h.includes('makeup') || h.includes('make up')) colMap.makeup = idx;
          else if (h.includes('absent') || h.includes('missed')) colMap.absent = idx;
          else if (h.includes('total') || h.includes('delivered') || h.includes('held')) colMap.total = idx;
          else if (h.includes('percent') || h === '%') colMap.pct = idx;
        });
      }
      break;
    }
  }

  lines.forEach(line => {
    line = line.trim();
    if (!line || line.length < 3) return;

    // Ignore header rows
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('attendance report') || (lowerLine.includes('subject') && lowerLine.includes('present') && lowerLine.includes('absent'))) {
      return;
    }

    // Split by tab, comma, or 2+ spaces
    const delimParts = line.split(/\t|,| {2,}/).map(p => p.trim()).filter(Boolean);

    // If we have header colMap and matching row length
    if (colMap && delimParts.length >= 4) {
      let code = colMap.code !== undefined && delimParts[colMap.code] ? delimParts[colMap.code] : '';
      let name = colMap.name !== undefined && delimParts[colMap.name] ? delimParts[colMap.name] : '';
      
      let present = colMap.present !== undefined ? parseInt(delimParts[colMap.present]) || 0 : 0;
      let od = colMap.od !== undefined ? parseInt(delimParts[colMap.od]) || 0 : 0;
      let makeup = colMap.makeup !== undefined ? parseInt(delimParts[colMap.makeup]) || 0 : 0;
      let absent = colMap.absent !== undefined ? parseInt(delimParts[colMap.absent]) || 0 : 0;
      let total = colMap.total !== undefined ? parseInt(delimParts[colMap.total]) || 0 : 0;

      const attended = present + od + makeup;
      if (total <= 0) {
        total = attended + absent;
      }

      if (total > 0) {
        if (!code) {
          const codeMatch = line.match(/\b([A-Za-z0-9]{2,6}[-\.][A-Za-z0-9]{1,4}|[A-Za-z]{2,5}\d{3,4}|CRT|DEVOPS)\b/i);
          if (codeMatch) code = codeMatch[1];
        }
        if (!name || name === code) {
          name = delimParts[2] || delimParts[1] || code;
        }

        parsedSubjects.push({
          subjectCode: (code || 'COURSE').toUpperCase().trim(),
          subjectName: name.trim(),
          attended: attended,
          total: total,
          target: 75,
          faculty: 'Faculty Incharge'
        });
        return;
      }
    }

    // Delimited or Space separated fallback
    let explicitPercentage = null;
    const pctMatch = line.match(/([\d\.]+)\s*%/);
    if (pctMatch) {
      explicitPercentage = parseFloat(pctMatch[1]);
    } else {
      const endFloatMatch = line.match(/(\b\d{1,3}\.\d{1,2}\b)\s*$/);
      if (endFloatMatch) {
        explicitPercentage = parseFloat(endFloatMatch[1]);
      }
    }

    let code = '';
    const codeMatch = line.match(/\b([A-Za-z0-9]{2,6}[-\.][A-Za-z0-9]{1,4}|[A-Za-z]{2,5}\d{3,4}|CRT|DEVOPS)\b/i);
    if (codeMatch) {
      code = codeMatch[1].toUpperCase();
    }

    let lineWithoutPct = line;
    if (explicitPercentage !== null) {
      lineWithoutPct = line.replace(new RegExp(`\\b${explicitPercentage}(?:%)?\\b`), ' ');
    }
    lineWithoutPct = lineWithoutPct.replace(/([\d\.]+)\s*%/g, ' ');

    const allNumbers = [];
    const numRegex = /\b(\d+)\b/g;
    let match;
    while ((match = numRegex.exec(lineWithoutPct)) !== null) {
      allNumbers.push(parseInt(match[1]));
    }

    let attended = null;
    let total = null;

    const presWordMatch = line.match(/(\d+)\s*(?:present|attended|att\b|pres\b)/i) || line.match(/(?:present|attended|att\b|pres\b)\s*[:=]?\s*(\d+)/i);
    const absWordMatch = line.match(/(\d+)\s*(?:absent|missed|bunk|bunked|abs\b)/i) || line.match(/(?:absent|missed|bunk|bunked|abs\b)\s*[:=]?\s*(\d+)/i);
    const totWordMatch = line.match(/(\d+)\s*(?:total|delivered|held|conducted)/i) || line.match(/(?:total|delivered|held|conducted)\s*[:=]?\s*(\d+)/i);

    if (presWordMatch && absWordMatch) {
      attended = parseInt(presWordMatch[1]);
      const absent = parseInt(absWordMatch[1]);
      total = attended + absent;
    } else if (presWordMatch && totWordMatch) {
      attended = parseInt(presWordMatch[1]);
      total = parseInt(totWordMatch[1]);
    } else if (absWordMatch && totWordMatch) {
      const absent = parseInt(absWordMatch[1]);
      total = parseInt(totWordMatch[1]);
      attended = Math.max(0, total - absent);
    }

    if (attended === null || total === null) {
      const slashMatch = line.match(/(\d+)\s*\/\s*(\d+)/);
      if (slashMatch) {
        const n1 = parseInt(slashMatch[1]);
        const n2 = parseInt(slashMatch[2]);
        attended = Math.min(n1, n2);
        total = Math.max(n1, n2);
      }
    }

    if ((attended === null || total === null) && allNumbers.length >= 2) {
      let matchFound = false;
      if (explicitPercentage !== null) {
        for (let i = 0; i < allNumbers.length; i++) {
          for (let j = i + 1; j < allNumbers.length; j++) {
            const p = allNumbers[i];
            const a = allNumbers[j];
            const tot = p + a;
            if (tot > 0) {
              const calcPct = (p / tot) * 100;
              if (Math.abs(calcPct - explicitPercentage) < 0.2) {
                attended = p;
                total = tot;
                matchFound = true;
                break;
              }
            }
            for (let k = j + 1; k < allNumbers.length; k++) {
              const odVal = allNumbers[j];
              const absVal = allNumbers[k];
              const attVal = allNumbers[i] + odVal;
              const totVal = attVal + absVal;
              if (totVal > 0) {
                const calcPct = (attVal / totVal) * 100;
                if (Math.abs(calcPct - explicitPercentage) < 0.2) {
                  attended = attVal;
                  total = totVal;
                  matchFound = true;
                  break;
                }
              }
            }
            if (matchFound) break;
          }
          if (matchFound) break;
        }
      }

      if (!matchFound && explicitPercentage !== null) {
        let bestDiff = 9999;
        for (let i = 0; i < allNumbers.length; i++) {
          for (let j = 0; j < allNumbers.length; j++) {
            if (i !== j) {
              const a = allNumbers[i];
              const b = allNumbers[j];
              if (a <= b && b > 0) {
                const ratio = (a / b) * 100;
                const diff = Math.abs(ratio - explicitPercentage);
                if (diff < bestDiff && diff < 1.0) {
                  bestDiff = diff;
                  attended = a;
                  total = b;
                }
              }
            }
          }
        }
      }
    }

    if (attended !== null && total !== null && total > 0) {
      let cleanName = line
        .replace(/([\d\.]+\s*%)|(\b\d{1,3}\.\d{1,2}\b)/g, ' ')
        .replace(/\b(\d+(?:st|nd|rd|th)?\s*sem(?:ester)?|\d+\s*credits?|present|absent|total|held|delivered|classes|sr\.?\s*no|theory|practical|lab|lecture|makeup|od)\b/gi, '')
        .trim();

      if (code) {
        cleanName = cleanName.replace(new RegExp(code.replace('.', '\\.'), 'gi'), '').trim();
      }
      cleanName = cleanName.replace(/^\d+\s+/, '').replace(/\b\d+\b/g, '').replace(/\s+/g, ' ').trim();

      if (!cleanName || cleanName.length < 2) {
        cleanName = code || 'Course Subject';
      }

      parsedSubjects.push({
        subjectCode: code || 'COURSE',
        subjectName: cleanName,
        attended: attended,
        total: total,
        target: 75,
        faculty: 'Faculty Incharge'
      });
    }
  });

  return parsedSubjects;
}

// Live Parse Preview in Bulk Modal
function handleBulkInputLivePreview() {
  const text = document.getElementById('bulkAttendanceText').value.trim();
  const container = document.getElementById('bulkParsePreviewContainer');
  const countEl = document.getElementById('bulkParsedCount');
  const tbody = document.getElementById('bulkParsePreviewTbody');

  if (!text) {
    if (container) container.style.display = 'none';
    return;
  }

  const parsed = parseErpRawText(text);
  if (parsed.length > 0) {
    if (container) container.style.display = 'block';
    if (countEl) countEl.innerText = parsed.length;
    if (tbody) {
      tbody.innerHTML = parsed.map(sub => {
        const pct = Math.round((sub.attended / sub.total) * 1000) / 10;
        const absent = sub.total - sub.attended;
        const isSafe = pct >= 75;
        const statusBadge = isSafe 
          ? `<span style="color: var(--success); font-weight: 700;">🟢 Safe</span>` 
          : `<span style="color: var(--danger); font-weight: 700;">🔴 Shortage</span>`;

        return `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 6px 10px; font-weight: 700;">${sub.subjectCode}</td>
            <td style="padding: 6px 10px;">${sub.subjectName}</td>
            <td style="padding: 6px 10px; text-align: center; color: var(--success); font-weight: 700;">${sub.attended}</td>
            <td style="padding: 6px 10px; text-align: center; color: var(--danger); font-weight: 700;">${absent}</td>
            <td style="padding: 6px 10px; text-align: center; font-weight: 700;">${sub.total}</td>
            <td style="padding: 6px 10px; text-align: center; font-weight: 800; color: ${isSafe ? 'var(--success)' : 'var(--danger)'};">${pct}%</td>
            <td style="padding: 6px 10px;">${statusBadge}</td>
          </tr>
        `;
      }).join('');
    }
  } else {
    if (container) container.style.display = 'none';
  }
}

// Load sample ERP raw text directly into the modal textarea for 1-click preview
function loadSampleErpDemoDataIntoBulkBox() {
  const sampleText = `CSUL501\tDesign and Analysis of Algorithms (DAA)\t32\t7\t39\t82.05%\nCSUL502\tMachine Learning (ML)\t21\t4\t25\t84.00%\nCSUL503\tCryptography & Network Security (CNS)\t18\t4\t22\t81.82%\nCSUL511\tDesign Patterns & Principles (DPP)\t24\t4\t28\t85.71%\nCSUP521\tMachine Learning Lab\t12\t0\t12\t100.00%\nCRT\tCampus Recruitment Training\t19\t3\t22\t86.36%`;
  const textarea = document.getElementById('bulkAttendanceText');
  if (textarea) {
    textarea.value = sampleText;
    handleBulkInputLivePreview();
  }
}

// Handle ERP Import Submit
function handleBulkImportAttendance(e) {
  e.preventDefault();
  const text = document.getElementById('bulkAttendanceText').value.trim();
  if (!text) return;

  const parsedSubjects = parseErpRawText(text);

  if (parsedSubjects.length > 0) {
    StateManager.importErpAttendance(parsedSubjects, true);
    showToast(`Successfully parsed and imported ${parsedSubjects.length} courses from your ERP!`, 'success');
    closeModal('modalBulkAttendance');
    document.getElementById('formBulkAttendance').reset();
    const previewContainer = document.getElementById('bulkParsePreviewContainer');
    if (previewContainer) previewContainer.style.display = 'none';
    renderAttendance();
    updateStats();
  } else {
    showToast('Could not extract attendance numbers. Please check format (e.g. CSUL501, DAA, 32, 39)', 'error');
  }
}

// Modal Helpers with Background Scroll Lock
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    // Focus first input or button for accessibility & immediate keyboard scroll
    const firstInput = modal.querySelector('input:not([readonly]), textarea, select, button.btn-primary');
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
  }
  if (!document.querySelector('.modal-backdrop.open')) {
    document.body.classList.remove('modal-open');
  }
}

// Close modals when clicking backdrop
window.addEventListener('click', function(e) {
  if (e.target.classList && e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
    if (!document.querySelector('.modal-backdrop.open')) {
      document.body.classList.remove('modal-open');
    }
  }
});

// Close open modals on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal-backdrop.open');
    openModals.forEach(m => m.classList.remove('open'));
    document.body.classList.remove('modal-open');
    closeServicesDropdown();
  }
});

// Scroll Reveal Observer
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

// Interactive 3D Parallax Tilt Effect
function initCardTilt() {
  const interactiveCards = document.querySelectorAll('.stat-card, .feat-item');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(700px) rotateX(${(-y / 18).toFixed(2)}deg) rotateY(${(x / 18).toFixed(2)}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCardTilt();
});

// ==========================================================================
// 🛡️ HOSTEL OUTING & DIGITAL GATE PASS CONTROLLER
// ==========================================================================
let currentGatePassFilter = 'All';

function renderGatePassModule() {
  const passes = StateManager.getGatePasses();
  const user = StateManager.getUser();

  // 1. Render Active Pass Banner Showcase
  const activePassContainer = document.getElementById('activeGatePassBannerContainer');
  if (activePassContainer) {
    const activePass = passes.find(g => g.status === 'Approved' || g.status === 'Out of Campus');
    
    if (activePass) {
      const isOut = activePass.status === 'Out of Campus';
      activePassContainer.innerHTML = `
        <div class="digital-gatepass-banner">
          <div class="gatepass-inner-grid">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span class="status-pill ${isOut ? 'status-pending' : 'status-approved'}">
                  ${isOut ? '🚶 OUT OF CAMPUS (CHECKED OUT)' : '🛡️ ACTIVE VERIFIED PASS'}
                </span>
                <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">Valid Today</span>
              </div>
              <h3 style="margin: 0 0 6px 0; font-size: 1.25rem; color: var(--text-primary);">
                ${activePass.outingType} to ${activePass.destination}
              </h3>
              <p style="margin: 0 0 12px 0; font-size: 0.82rem; color: var(--text-secondary); max-width: 540px;">
                <strong>Reason:</strong> ${activePass.purpose}
              </p>
              
              <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px;">
                <div>🕒 <strong>Out Window:</strong> ${activePass.departureTime} - ${activePass.expectedReturnTime}</div>
                <div>🏢 <strong>Hostel:</strong> ${activePass.hostelBlock} (Room ${activePass.roomNo})</div>
                <div>📞 <strong>Guardian:</strong> ${activePass.guardianName} (${activePass.guardianPhone})</div>
              </div>

              <div class="guardian-verified-stamp">
                <span>🛡️</span>
                <span>${activePass.guardianConsentNote || 'Guardian confirmed phone verification with chief warden.'}</span>
              </div>

              <div class="pass-action-buttons">
                <button type="button" class="btn btn-primary btn-sm" onclick="viewGatePassModal('${activePass.id}')">
                  👁️ Inspect Full QR Pass
                </button>
                ${!isOut ? `
                  <button type="button" class="btn btn-warning btn-sm" onclick="simulateGatePunch('${activePass.id}', 'exit')">
                    🚶 Simulate Security Exit Punch (Gate 1)
                  </button>
                ` : `
                  <button type="button" class="btn btn-success btn-sm" onclick="simulateGatePunch('${activePass.id}', 'entry')">
                    🏠 Simulate Security Return Punch (Gate 1)
                  </button>
                `}
              </div>
            </div>

            <!-- E-Gate Pass Card Preview -->
            <div class="gatepass-card-interactive" onclick="viewGatePassModal('${activePass.id}')" style="cursor: pointer;">
              <div class="gatepass-hologram-strip"></div>
              <div class="gatepass-header-row">
                <div>
                  <div class="gatepass-title-sub">SKIT DIGITAL GATE PASS</div>
                  <div class="gatepass-code">${activePass.passCode}</div>
                </div>
                <div style="text-align: right;">
                  <span class="role-pill role-student" style="font-size: 0.65rem;">STUDENT PASS</span>
                </div>
              </div>

              <div class="gatepass-qr-box">
                <!-- Visual SVG QR Code -->
                <svg width="120" height="120" viewBox="0 0 100 100" style="shape-rendering: crispEdges;">
                  <rect width="100" height="100" fill="#ffffff"/>
                  <path d="M10,10 h24 v24 h-24 z M14,14 v16 h16 v-16 z M18,18 h8 v8 h-8 z" fill="#0f172a"/>
                  <path d="M66,10 h24 v24 h-24 z M70,14 v16 h16 v-16 z M74,18 h8 v8 h-8 z" fill="#0f172a"/>
                  <path d="M10,66 h24 v24 h-24 z M14,70 v16 h16 v-16 z M18,74 h8 v8 h-8 z" fill="#0f172a"/>
                  <rect x="42" y="12" width="6" height="6" fill="#4f46e5"/>
                  <rect x="52" y="16" width="6" height="6" fill="#0f172a"/>
                  <rect x="42" y="26" width="6" height="6" fill="#0f172a"/>
                  <rect x="52" y="32" width="6" height="6" fill="#4f46e5"/>
                  <rect x="14" y="42" width="6" height="6" fill="#0f172a"/>
                  <rect x="24" y="48" width="6" height="6" fill="#0f172a"/>
                  <rect x="36" y="42" width="6" height="6" fill="#4f46e5"/>
                  <rect x="46" y="48" width="8" height="8" fill="#4f46e5"/>
                  <rect x="62" y="42" width="6" height="6" fill="#0f172a"/>
                  <rect x="74" y="48" width="6" height="6" fill="#0f172a"/>
                  <rect x="84" y="42" width="6" height="6" fill="#4f46e5"/>
                  <rect x="42" y="66" width="6" height="6" fill="#0f172a"/>
                  <rect x="52" y="74" width="6" height="6" fill="#4f46e5"/>
                  <rect x="66" y="66" width="6" height="6" fill="#0f172a"/>
                  <rect x="76" y="74" width="6" height="6" fill="#0f172a"/>
                  <rect x="84" y="82" width="6" height="6" fill="#4f46e5"/>
                </svg>
              </div>

              <table class="gatepass-details-table">
                <tr><td>Student:</td><td>${activePass.studentName}</td></tr>
                <tr><td>Roll No:</td><td>${activePass.rollNo}</td></tr>
                <tr><td>Room No:</td><td>${activePass.roomNo} (${activePass.hostelBlock})</td></tr>
                <tr><td>Valid Until:</td><td>Today, ${activePass.expectedReturnTime}</td></tr>
              </table>

              <div style="margin-top: 8px; text-align: center; font-size: 0.68rem; color: var(--text-muted);">
                Click to inspect and show to guard
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      activePassContainer.innerHTML = `
        <div style="background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
          <div style="font-size: 2rem; margin-bottom: 6px;">🛡️</div>
          <h4 style="margin: 0 0 4px 0; color: var(--text-primary);">No Active Gate Pass at Present</h4>
          <p style="margin: 0 0 12px 0; font-size: 0.82rem; color: var(--text-muted);">
            Need to leave the campus for market, medical, or weekend home leave? Submit an outing request below for warden verification.
          </p>
          <button type="button" class="btn btn-primary btn-sm" onclick="openModal('modalApplyGatePass')">
            + Apply For Outing Gate Pass
          </button>
        </div>
      `;
    }
  }

  // 2. Render Passes History Table
  renderGatePassesTable();
}

function renderGatePassesTable() {
  const tbody = document.getElementById('gatePassesTableBody');
  if (!tbody) return;

  let passes = StateManager.getGatePasses();
  const searchInput = document.getElementById('gatePassSearchInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  if (currentGatePassFilter !== 'All') {
    passes = passes.filter(p => p.status === currentGatePassFilter);
  }

  if (query) {
    passes = passes.filter(p => 
      p.passCode.toLowerCase().includes(query) ||
      p.destination.toLowerCase().includes(query) ||
      p.purpose.toLowerCase().includes(query) ||
      p.guardianName.toLowerCase().includes(query)
    );
  }

  if (passes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">No outing gate passes matching filter '${currentGatePassFilter}'.</td></tr>`;
    return;
  }

  tbody.innerHTML = passes.map(p => {
    let statusBadge = '';
    if (p.status === 'Approved') statusBadge = '<span class="status-pill status-approved">✓ Approved</span>';
    else if (p.status === 'Out of Campus') statusBadge = '<span class="status-pill status-pending" style="background: rgba(245, 158, 11, 0.15); color: #d97706;">🚶 Out of Campus</span>';
    else if (p.status === 'Pending') statusBadge = '<span class="status-pill status-pending">⏳ Pending Warden</span>';
    else if (p.status === 'Completed') statusBadge = '<span class="status-pill status-approved" style="background: rgba(16, 185, 129, 0.12); color: var(--success);">🏠 Returned Safely</span>';
    else statusBadge = `<span class="status-pill status-rejected">✕ ${p.status}</span>`;

    return `
      <tr>
        <td>
          <strong style="font-family: monospace; color: var(--primary);">${p.passCode}</strong>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${p.appliedAt}</div>
        </td>
        <td>
          <div style="font-weight: 700;">${p.roomNo}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${p.hostelBlock}</div>
        </td>
        <td>
          <span class="role-pill role-student" style="font-size: 0.7rem;">${p.outingType}</span>
        </td>
        <td>
          <div style="font-weight: 700; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.destination}">${p.destination}</div>
          <div style="font-size: 0.74rem; color: var(--text-muted); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.purpose}">${p.purpose}</div>
        </td>
        <td>
          <div style="font-size: 0.8rem; font-weight: 600;">Dep: ${p.departureDate} ${p.departureTime}</div>
          <div style="font-size: 0.74rem; color: var(--text-muted);">Ret: ${p.expectedReturnDate} ${p.expectedReturnTime}</div>
        </td>
        <td>
          <div style="font-size: 0.78rem; font-weight: 600;">${p.guardianName}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${p.guardianPhone}</div>
          <span style="font-size: 0.68rem; color: var(--success); font-weight: 700;">${p.guardianConsent}</span>
        </td>
        <td>${statusBadge}</td>
        <td style="text-align: right;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="viewGatePassModal('${p.id}')">
            👁️ Pass
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterGatePasses(status) {
  currentGatePassFilter = status;
  const btns = document.querySelectorAll('#gatePassFilterGroup .filter-btn');
  btns.forEach(btn => btn.classList.toggle('active', btn.innerText.includes(status) || (status === 'All' && btn.innerText.startsWith('All'))));
  renderGatePassesTable();
}

function handleGatePassSearch() {
  renderGatePassesTable();
}

function handleApplyGatePass(event) {
  event.preventDefault();
  const user = StateManager.getUser();

  const newPass = StateManager.addGatePass({
    studentName: document.getElementById('gpStudentName').value || user.name || 'Ravi Goyal',
    studentEmail: user.email || '24eskcs677@skit.ac.in',
    rollNo: document.getElementById('gpRollNo').value || user.rollNo || '24ESKCS677',
    hostelBlock: document.getElementById('gpHostelBlock').value,
    roomNo: document.getElementById('gpRoomNo').value,
    outingType: document.getElementById('gpOutingType').value,
    destination: document.getElementById('gpDestination').value,
    purpose: document.getElementById('gpPurpose').value,
    departureDate: document.getElementById('gpDepartureDate').value,
    departureTime: document.getElementById('gpDepartureTime').value,
    expectedReturnDate: document.getElementById('gpReturnDate').value,
    expectedReturnTime: document.getElementById('gpReturnTime').value,
    guardianName: document.getElementById('gpGuardianName').value,
    guardianPhone: document.getElementById('gpGuardianPhone').value,
    guardianConsent: document.getElementById('gpGuardianConsent').value,
    guardianConsentNote: `Outing request submitted by student. Awaiting warden verification with ${document.getElementById('gpGuardianName').value}.`
  });

  closeModal('modalApplyGatePass');
  document.getElementById('formApplyGatePass').reset();
  initGatePassFormDefaults();
  renderGatePassModule();
  updateStats();
  showToast(`Gate Pass application (${newPass.passCode}) submitted for Chief Warden review!`, 'success');
}

function initGatePassFormDefaults() {
  const user = StateManager.getUser();
  const nameEl = document.getElementById('gpStudentName');
  const rollEl = document.getElementById('gpRollNo');
  if (nameEl) nameEl.value = user.name || 'Ravi Goyal';
  if (rollEl) rollEl.value = user.rollNo || '24ESKCS677';

  const today = new Date().toISOString().split('T')[0];
  const depDate = document.getElementById('gpDepartureDate');
  const retDate = document.getElementById('gpReturnDate');
  if (depDate) { depDate.min = today; depDate.value = today; }
  if (retDate) { retDate.min = today; retDate.value = today; }
  const depTime = document.getElementById('gpDepartureTime');
  const retTime = document.getElementById('gpReturnTime');
  if (depTime && !depTime.value) depTime.value = '17:00';
  if (retTime && !retTime.value) retTime.value = '21:00';
}

function viewGatePassModal(id) {
  const pass = StateManager.getGatePassById(id);
  if (!pass) return;

  const bodyEl = document.getElementById('viewGatePassModalBody');
  if (!bodyEl) return;

  bodyEl.innerHTML = `
    <div style="border: 2px solid var(--primary); border-radius: var(--radius-md); padding: 1.25rem; background: var(--bg-card); position: relative; overflow: hidden;">
      <div class="gatepass-hologram-strip"></div>
      
      <div style="text-align: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 12px; margin-bottom: 12px;">
        <div style="font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted);">
          SWAMI KESHVANAND INSTITUTE OF TECHNOLOGY, JAIPUR
        </div>
        <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 2px 0;">
          CAMPUS &amp; HOSTEL OUTING PASS
        </div>
        <div style="font-size: 0.82rem; font-weight: 800; color: var(--primary); font-family: monospace;">
          ${pass.passCode}
        </div>
      </div>

      <div class="gatepass-qr-box">
        <svg width="140" height="140" viewBox="0 0 100 100" style="shape-rendering: crispEdges;">
          <rect width="100" height="100" fill="#ffffff"/>
          <path d="M10,10 h24 v24 h-24 z M14,14 v16 h16 v-16 z M18,18 h8 v8 h-8 z" fill="#0f172a"/>
          <path d="M66,10 h24 v24 h-24 z M70,14 v16 h16 v-16 z M74,18 h8 v8 h-8 z" fill="#0f172a"/>
          <path d="M10,66 h24 v24 h-24 z M14,70 v16 h16 v-16 z M18,74 h8 v8 h-8 z" fill="#0f172a"/>
          <rect x="42" y="12" width="6" height="6" fill="#4f46e5"/>
          <rect x="52" y="16" width="6" height="6" fill="#0f172a"/>
          <rect x="42" y="26" width="6" height="6" fill="#0f172a"/>
          <rect x="52" y="32" width="6" height="6" fill="#4f46e5"/>
          <rect x="14" y="42" width="6" height="6" fill="#0f172a"/>
          <rect x="24" y="48" width="6" height="6" fill="#0f172a"/>
          <rect x="36" y="42" width="6" height="6" fill="#4f46e5"/>
          <rect x="46" y="48" width="8" height="8" fill="#4f46e5"/>
          <rect x="62" y="42" width="6" height="6" fill="#0f172a"/>
          <rect x="74" y="48" width="6" height="6" fill="#0f172a"/>
          <rect x="84" y="42" width="6" height="6" fill="#4f46e5"/>
          <rect x="42" y="66" width="6" height="6" fill="#0f172a"/>
          <rect x="52" y="74" width="6" height="6" fill="#4f46e5"/>
          <rect x="66" y="66" width="6" height="6" fill="#0f172a"/>
          <rect x="76" y="74" width="6" height="6" fill="#0f172a"/>
          <rect x="84" y="82" width="6" height="6" fill="#4f46e5"/>
        </svg>
      </div>

      <table class="gatepass-details-table" style="font-size: 0.8rem;">
        <tr><td>Student Name:</td><td>${pass.studentName}</td></tr>
        <tr><td>Roll Number:</td><td>${pass.rollNo}</td></tr>
        <tr><td>Hostel &amp; Room:</td><td>${pass.hostelBlock} (Room ${pass.roomNo})</td></tr>
        <tr><td>Outing Category:</td><td>${pass.outingType}</td></tr>
        <tr><td>Destination:</td><td>${pass.destination}</td></tr>
        <tr><td>Purpose:</td><td>${pass.purpose}</td></tr>
        <tr><td>Departure:</td><td>${pass.departureDate} at ${pass.departureTime}</td></tr>
        <tr><td>Expected Return:</td><td>${pass.expectedReturnDate} at ${pass.expectedReturnTime}</td></tr>
        <tr><td>Guardian Name:</td><td>${pass.guardianName} (${pass.guardianPhone})</td></tr>
        <tr><td>Warden Sign:</td><td>${pass.wardenName || 'Chief Hostel Warden'}</td></tr>
        <tr><td>Status:</td><td><strong style="color: var(--primary);">${pass.status}</strong></td></tr>
      </table>

      ${pass.securityCheckOut ? `
        <div style="margin-top: 8px; font-size: 0.72rem; color: var(--text-muted); background: var(--bg-subtle); padding: 4px 8px; border-radius: 4px;">
          🚪 <strong>Exit Gate Punch:</strong> ${pass.securityCheckOut}
        </div>
      ` : ''}

      ${pass.securityCheckIn ? `
        <div style="margin-top: 4px; font-size: 0.72rem; color: var(--success); background: rgba(16, 185, 129, 0.1); padding: 4px 8px; border-radius: 4px;">
          🏠 <strong>Return Gate Punch:</strong> ${pass.securityCheckIn}
        </div>
      ` : ''}

      <div class="guardian-verified-stamp" style="margin-top: 10px;">
        <span>🛡️</span>
        <span>${pass.guardianConsentNote || 'Guardian Phone Verification Complete & Verified.'}</span>
      </div>
    </div>
  `;

  openModal('modalViewGatePass');
}

function simulateGatePunch(id, punchType) {
  const res = StateManager.punchGatePass(id, punchType);
  if (res) {
    if (punchType === 'exit') {
      showToast(`Gate Punch Out Recorded! Have a safe outing. Please return before ${res.expectedReturnTime}.`, 'info');
    } else {
      showToast(`Gate Punch In Recorded! Welcome back to campus. Pass ${res.passCode} marked Completed.`, 'success');
    }
    renderGatePassModule();
    updateStats();
  }
}

function simulatePrintGatePass() {
  showToast('Printing Digital Pass / Downloading Security PDF...', 'success');
  setTimeout(() => {
    window.print();
  }, 300);
}

// ==========================================================================
// 📚 ACADEMIC DIGITAL LIBRARY, SYLLABI & PYQ HUB CONTROLLER
// ==========================================================================
let currentLibDept = 'ALL';
let currentLibSem = 'ALL';
let currentLibCategory = 'all';
let currentLibSearch = '';

function renderLibraryModule() {
  const depts = StateManager.getLibraryDepartments();

  // 1. Render Department Pills
  const deptsContainer = document.getElementById('libDeptPillsContainer');
  if (deptsContainer) {
    deptsContainer.innerHTML = `
      <button type="button" class="lib-dept-btn ${currentLibDept === 'ALL' ? 'active' : ''}" onclick="setLibraryDepartment('ALL')">
        🏛️ All Departments
      </button>
      ${depts.map(d => `
        <button type="button" class="lib-dept-btn ${currentLibDept === d.id ? 'active' : ''}" onclick="setLibraryDepartment('${d.id}')">
          <span>${d.icon}</span> <span>${d.code}</span>
        </button>
      `).join('')}
    `;
  }

  // 2. Render Cards Grid
  renderLibraryCardsGrid();
}

function renderLibraryCardsGrid() {
  const gridEl = document.getElementById('libCardsGrid');
  if (!gridEl) return;

  const resources = StateManager.getLibraryResources({
    dept: currentLibDept,
    sem: currentLibSem,
    query: currentLibSearch
  });

  if (resources.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column: 1 / -1; background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 3rem; text-align: center;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">📚</div>
        <h4 style="margin: 0 0 4px 0; color: var(--text-primary);">No Course Resources Found</h4>
        <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">
          No subjects matching department '${currentLibDept}' and semester '${currentLibSem}'. Try clearing the search filter.
        </p>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = resources.map(r => {
    const pyqs = r.pyqs || [];
    const materials = r.materials || [];
    const videos = r.videos || [];

    const showSyllabus = (currentLibCategory === 'all' || currentLibCategory === 'syllabus');
    const showPyq = (currentLibCategory === 'all' || currentLibCategory === 'pyq');
    const showBooks = (currentLibCategory === 'all' || currentLibCategory === 'books');
    const showVideos = (currentLibCategory === 'all' || currentLibCategory === 'videos');

    return `
      <div class="subject-resource-card">
        <div class="subject-card-header">
          <div>
            <span class="subject-code-tag">${r.subjectCode}</span>
            <span class="subject-sem-tag" style="margin-left: 6px;">${r.sem}th Semester • ${r.credits} Credits</span>
          </div>
          <span class="role-pill role-student" style="font-size: 0.65rem;">${r.dept}</span>
        </div>

        <div class="subject-title">${r.subjectName}</div>
        <div class="subject-faculty">Lead: ${r.facultyLead}</div>

        <!-- 1. Syllabus Preview Section -->
        ${showSyllabus ? `
          <div class="resource-section-block">
            <div class="res-section-title">
              <span>📋 Official Syllabus</span>
              <span style="font-size: 0.7rem; color: var(--primary); cursor: pointer;" onclick="viewSyllabusModal('${r.id}')">View Units 1-5 ➔</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-subtle); padding: 6px 10px; border-radius: var(--radius-sm); font-size: 0.76rem;">
              <span>5 Units Detailed Breakdown</span>
              <button type="button" class="btn btn-secondary btn-sm" style="padding: 2px 8px; font-size: 0.7rem;" onclick="viewSyllabusModal('${r.id}')">
                Preview Syllabus
              </button>
            </div>
          </div>
        ` : ''}

        <!-- 2. PYQs Section -->
        ${showPyq && pyqs.length > 0 ? `
          <div class="resource-section-block">
            <div class="res-section-title">
              <span>📝 Past Year Papers (PYQ)</span>
              <span style="font-size: 0.68rem; color: var(--text-muted);">${pyqs.length} Papers</span>
            </div>
            <div class="pyq-chips-list">
              ${pyqs.map(p => `
                <button type="button" class="pyq-chip-btn" onclick="viewPyqModal('${r.id}', '${p.year}', '${p.term}')" title="${p.title}">
                  <span class="dl-icon">📄</span>
                  <span>${p.year} (${p.term})</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 3. Notes & Books Section -->
        ${showBooks && materials.length > 0 ? `
          <div class="resource-section-block">
            <div class="res-section-title">
              <span>📖 Handwritten Notes &amp; Books</span>
              <span style="font-size: 0.68rem; color: var(--text-muted);">${materials.length} Files</span>
            </div>
            <div class="materials-list-compact">
              ${materials.slice(0, 3).map(m => `
                <div class="mat-item-row" onclick="simulateDownloadResource('${m.title}')">
                  <span class="mat-title" title="${m.title}">📥 ${m.title}</span>
                  <span class="mat-size">${m.size}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 4. Video Lectures -->
        ${showVideos && videos.length > 0 ? `
          <div class="resource-section-block">
            <div class="res-section-title">
              <span>🎥 Video Lectures</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${videos.map(v => `
                <a href="${v.link}" target="_blank" class="mat-item-row" style="text-decoration: none;">
                  <span class="mat-title">▶️ ${v.title}</span>
                  <span class="mat-size" style="color: var(--secondary); font-weight: 700;">${v.platform}</span>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function setLibraryDepartment(dept) {
  currentLibDept = dept;
  renderLibraryModule();
}

function setLibrarySemester(sem) {
  currentLibSem = sem;
  const pills = document.querySelectorAll('.lib-sem-bar .sem-pill');
  pills.forEach(p => p.classList.toggle('active', p.innerText.startsWith(sem) || (sem === 'ALL' && p.innerText.includes('All'))));
  renderLibraryCardsGrid();
}

function setLibraryCategoryTab(cat) {
  currentLibCategory = cat;
  const btns = document.querySelectorAll('.lib-category-tabs .lib-cat-btn');
  btns.forEach(b => b.classList.toggle('active', b.getAttribute('onclick').includes(cat)));
  renderLibraryCardsGrid();
}

function handleLibrarySearch(e) {
  currentLibSearch = e.target.value;
  renderLibraryCardsGrid();
}

function viewSyllabusModal(id) {
  const r = StateManager.getLibraryResourceById(id);
  if (!r) return;

  document.getElementById('sylSubjectCode').innerText = r.subjectCode;
  document.getElementById('sylSubjectName').innerText = `${r.subjectName} Syllabus`;
  document.getElementById('sylFacultyLead').innerText = `Lead Faculty: ${r.facultyLead} | Dept of ${r.dept}`;
  document.getElementById('sylCredits').innerText = `Semester: ${r.sem}th • Credits: ${r.credits} • RTU Scheme`;

  const container = document.getElementById('sylUnitsContainer');
  const units = (r.syllabus && r.syllabus.units) ? r.syllabus.units : [];

  if (units.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">Standard RTU 5-unit curriculum applies.</p>`;
  } else {
    container.innerHTML = units.map(u => `
      <div class="syllabus-unit-accordion">
        <div class="syllabus-unit-head">
          <span>Unit ${u.unit}: ${u.title}</span>
          <span style="font-size: 0.72rem; color: var(--primary);">Exam Weightage: 14 Marks</span>
        </div>
        <div class="syllabus-unit-body">
          ${u.topics}
        </div>
      </div>
    `).join('');
  }

  openModal('modalSyllabusView');
}

function viewPyqModal(id, year, term) {
  const r = StateManager.getLibraryResourceById(id);
  if (!r) return;

  const pyq = (r.pyqs || []).find(p => String(p.year) === String(year) && p.term === term) || (r.pyqs || [])[0];
  if (!pyq) return;

  document.getElementById('pyqModalTitle').innerText = pyq.title;
  document.getElementById('pyqModalSubjectCode').innerText = `${r.subjectCode} - ${r.subjectName}`;
  document.getElementById('pyqModalTerm').innerText = `${pyq.term} (${pyq.year})`;
  document.getElementById('pyqModalMarks').innerText = pyq.marks || '70 Marks';
  document.getElementById('pyqModalSolutions').innerText = pyq.solutionsAvailable ? '✓ Official Verified Answers & Detailed Steps Included' : 'Question Paper PDF';

  openModal('modalPyqView');
}

function simulateDownloadPaper() {
  closeModal('modalPyqView');
  showToast('Downloading RTU Exam Paper & Answer Key PDF...', 'success');
}

function simulateDownloadSyllabus() {
  showToast('Downloading Official RTU Syllabus Document (PDF)...', 'success');
}

function simulateDownloadResource(title) {
  showToast(`Downloading: ${title}...`, 'success');
}

// =====================================================================
// CAMPUS AI ASSISTANT INTERACTION ENGINE
// =====================================================================
function toggleAIChat() {
  const drawer = document.getElementById('aiChatDrawer');
  if (!drawer) return;
  const isHidden = drawer.style.display === 'none' || drawer.style.display === '';
  drawer.style.display = isHidden ? 'flex' : 'none';
  if (isHidden) {
    setTimeout(() => {
      const input = document.getElementById('aiChatInput');
      if (input) input.focus();
    }, 100);
  }
}

function handleAIChatKey(event) {
  if (event.key === 'Enter') {
    sendAIChatMessage();
  }
}

function askAIQuickPrompt(promptText) {
  const input = document.getElementById('aiChatInput');
  if (input) input.value = promptText;
  sendAIChatMessage();
}

async function sendAIChatMessage() {
  const input = document.getElementById('aiChatInput');
  const chatMessages = document.getElementById('aiChatMessages');
  if (!input || !chatMessages) return;

  const text = input.value.trim();
  if (!text) return;

  // Append user message
  const userDiv = document.createElement('div');
  userDiv.className = 'ai-msg user';
  userDiv.innerHTML = `<div class="ai-msg-bubble">${escapeHtml(text)}</div>`;
  chatMessages.appendChild(userDiv);
  input.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'ai-msg bot';
  typingDiv.id = 'aiTypingIndicator';
  typingDiv.innerHTML = `
    <div class="ai-msg-bubble ai-typing-indicator">
      <span class="ai-typing-dot"></span>
      <span class="ai-typing-dot"></span>
      <span class="ai-typing-dot"></span>
    </div>
  `;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const data = await StateManager.askCampusAI(text);
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) indicator.remove();

    const botDiv = document.createElement('div');
    botDiv.className = 'ai-msg bot';

    // Format markdown-like text
    const formattedReply = formatAIMarkdown(data.reply || 'Here is what I found for you.');
    botDiv.innerHTML = `
      <div class="ai-msg-bubble">
        ${data.title ? `<div style="font-weight: 800; margin-bottom: 6px; color: var(--primary); font-size: 0.9rem;">${data.title}</div>` : ''}
        ${formattedReply}
      </div>
    `;
    chatMessages.appendChild(botDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (err) {
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) indicator.remove();

    const errDiv = document.createElement('div');
    errDiv.className = 'ai-msg bot';
    errDiv.innerHTML = `<div class="ai-msg-bubble" style="color: var(--danger);">⚠️ Could not fetch AI response. Please try again later.</div>`;
    chatMessages.appendChild(errDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatAIMarkdown(str) {
  let res = escapeHtml(str);
  // Bold **text**
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic *text*
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Code `text`
  res = res.replace(/`([^`]+)`/g, '<code style="background: rgba(99,102,241,0.15); padding: 2px 5px; border-radius: 4px; font-family: monospace;">$1</code>');
  // Numbered list items
  res = res.replace(/(?:^|<br>)(\d+)\.\s+/g, '<br>&bull; ');
  // Newlines
  res = res.replace(/\n/g, '<br>');
  return res;
}


