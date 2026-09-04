// Smart Campus - Student & Faculty Portal Logic

let currentNoticeFilter = 'All';
let currentNoticeSearch = '';
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
});

// Profile & Header Init
function initUserProfile() {
  const user = StateManager.getUser();
  document.getElementById('navUserName').innerText = user.name || 'Campus Student';
  document.getElementById('userAvatar').innerText = (user.name || 'S').charAt(0).toUpperCase();
  
  const roleEl = document.getElementById('navUserRole');
  roleEl.innerText = (user.role || 'STUDENT').toUpperCase();
  roleEl.className = `role-pill role-${user.role || 'student'}`;
  
  document.getElementById('welcomeTitle').innerText = `Welcome back, ${user.name || 'Student'} 👋`;

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

// Module Navigation Tabs
function switchModule(moduleName) {
  // Update nav buttons
  const buttons = document.querySelectorAll('.nav-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  const targetBtn = Array.from(buttons).find(b => b.onclick && b.onclick.toString().includes(moduleName));
  if (targetBtn) targetBtn.classList.add('active');

  // Update content sections
  const contents = document.querySelectorAll('.module-content');
  contents.forEach(sec => sec.classList.remove('active'));

  const targetSection = document.getElementById(`module-${moduleName}`);
  if (targetSection) targetSection.classList.add('active');
}

// Render All Modules & Stats
function renderAllModules() {
  renderNotices();
  renderTimetable();
  renderLostFound();
  renderComplaints();
  renderFacilitiesAndBookings();
  updateStats();
}

function updateStats() {
  const notices = StateManager.getNotices();
  const lostFound = StateManager.getLostFound();
  const complaints = StateManager.getComplaints();
  const bookings = StateManager.getBookings();

  document.getElementById('statNoticeCount').innerText = notices.length;
  document.getElementById('statLostCount').innerText = lostFound.length;
  document.getElementById('statComplaintCount').innerText = complaints.filter(c => c.status !== 'Resolved').length;
  document.getElementById('statBookingCount').innerText = bookings.length;
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

// Modal Helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

// Close modals when clicking backdrop
window.onclick = function(e) {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
  }
};

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
