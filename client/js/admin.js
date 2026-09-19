// Smart Campus - Admin & Management Console Logic

let currentGrievanceFilter = 'All';
let currentVerificationFilter = 'All';

document.addEventListener('DOMContentLoaded', () => {
  initAdminProfile();
  renderAdminAll();
});

function initAdminProfile() {
  const user = StateManager.getUser();
  document.getElementById('adminUserName').innerText = user.name || 'SKIT Administrator';
}

function switchAdminTab(tabName) {
  const buttons = document.querySelectorAll('.admin-navbar .nav-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  const targetBtn = Array.from(buttons).find(b => b.onclick && b.onclick.toString().includes(tabName));
  if (targetBtn) targetBtn.classList.add('active');

  const contents = document.querySelectorAll('.module-content');
  contents.forEach(sec => sec.classList.remove('active'));

  const targetSection = document.getElementById(`admintab-${tabName}`);
  if (targetSection) targetSection.classList.add('active');
}

function renderAdminAll() {
  renderAdminNotices();
  renderAdminVerifications();
  renderAdminTimetable();
  renderAdminGrievances();
  renderAdminLostFound();
  renderAdminBookings();
  updateAdminStats();
}

function updateAdminStats() {
  const notices = StateManager.getNotices();
  const verifications = StateManager.getVerifications();
  const grievances = StateManager.getComplaints();
  const lostFound = StateManager.getLostFound();
  const bookings = StateManager.getBookings();

  const pendingVerifications = verifications.filter(v => v.status === 'Pending').length;

  const statVerifEl = document.getElementById('adminStatVerifications');
  if (statVerifEl) statVerifEl.innerText = pendingVerifications;

  const badgeVerifEl = document.getElementById('badgePendingVerifications');
  if (badgeVerifEl) {
    badgeVerifEl.innerText = pendingVerifications;
    badgeVerifEl.style.display = pendingVerifications > 0 ? 'inline-block' : 'none';
  }

  const filterCountEl = document.getElementById('countPendingFilter');
  if (filterCountEl) filterCountEl.innerText = pendingVerifications;

  document.getElementById('adminStatNotices').innerText = notices.length;
  document.getElementById('adminStatGrievances').innerText = grievances.filter(g => g.status !== 'Resolved').length;
  document.getElementById('adminStatLostFound').innerText = lostFound.filter(l => l.status === 'Open').length;
  document.getElementById('adminStatBookings').innerText = bookings.filter(b => b.status === 'Pending').length;
}

// ==========================================
// 🎓 STUDENT VERIFICATION DESK
// ==========================================
function filterAdminVerifications(status) {
  currentVerificationFilter = status;
  const filterBtns = document.querySelectorAll('#admintab-verifications .filter-btn');
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.innerText.includes(status) || (status === 'All' && btn.innerText.startsWith('All')));
  });
  renderAdminVerifications();
}

function renderAdminVerifications() {
  let list = StateManager.getVerifications();
  const tbody = document.getElementById('adminVerificationsTableBody');
  if (!tbody) return;

  if (currentVerificationFilter !== 'All') {
    list = list.filter(v => v.status === currentVerificationFilter);
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: var(--gray-500);">No student verification requests matching '${currentVerificationFilter}'.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(v => {
    const isPending = v.status === 'Pending';
    const isApproved = v.status === 'Approved';
    const isAutoVerified = v.method === 'domain_auto_verified';

    const statusBadge = isApproved 
      ? `<span class="status-pill status-approved">✓ Verified & Approved</span>`
      : v.status === 'Rejected'
      ? `<span class="status-pill status-rejected">✕ Rejected</span>`
      : `<span class="status-pill status-pending">⏳ Pending Review</span>`;

    const methodBadge = isAutoVerified
      ? `<span class="card-tag tag-exams" style="font-size: 0.75rem;">⚡ @skit.ac.in Domain</span>`
      : `<span class="card-tag tag-academic" style="font-size: 0.75rem;">🪪 ID Card Upload</span>`;

    const idProofBtn = v.idProofUrl 
      ? `<button type="button" class="btn btn-secondary btn-sm" onclick="inspectIdProof('${v.id}')" style="display: inline-flex; align-items: center; gap: 4px;">
           <span style="font-size: 0.9rem;">👁️</span> View ID Proof
         </button>`
      : `<span style="color: var(--text-muted); font-size: 0.8rem;">Auto-Verified Domain</span>`;

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 0.92rem;">${v.name}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${v.email}</div>
          <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px;">🕒 ${v.submissionDate || 'Recently'}</div>
        </td>
        <td>
          <span style="font-family: monospace; font-weight: 700; font-size: 0.9rem; color: var(--primary);">${v.rollNo || 'N/A'}</span>
          ${v.enrollmentNo ? `<div style="font-size: 0.72rem; color: var(--text-muted);">${v.enrollmentNo}</div>` : ''}
        </td>
        <td><strong>${v.department || 'B.Tech CSE'}</strong></td>
        <td><span class="role-pill role-student" style="font-size: 0.75rem;">${v.semester || '5th Sem'}</span></td>
        <td>${methodBadge}</td>
        <td>${idProofBtn}</td>
        <td>${statusBadge}</td>
        <td>
          ${isPending ? `
            <div style="display: flex; gap: 6px;">
              <button type="button" class="btn btn-success btn-sm" onclick="handleVerifyStudent('${v.id}', 'Approved')">✓ Approve</button>
              <button type="button" class="btn btn-danger btn-sm" onclick="handleVerifyStudent('${v.id}', 'Rejected')">✕ Reject</button>
            </div>
          ` : `
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              ${v.reviewedAt ? `Reviewed ${v.reviewedAt}` : 'Decision Finalized'}
            </div>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function inspectIdProof(id) {
  const req = StateManager.getVerifications().find(v => v.id === id);
  if (!req) return;

  document.getElementById('inspectIdTitle').innerText = `🪪 ID Proof: ${req.name} (${req.rollNo || req.email})`;
  document.getElementById('inspectIdInfoBox').innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <div><strong>Student:</strong> ${req.name}</div>
      <div><strong>Email:</strong> ${req.email}</div>
      <div><strong>Roll No:</strong> <span style="font-family:monospace; color:var(--primary); font-weight:700;">${req.rollNo}</span></div>
      <div><strong>Branch:</strong> ${req.department}</div>
      <div><strong>Semester:</strong> ${req.semester}</div>
      <div><strong>Submitted:</strong> ${req.submissionDate}</div>
    </div>
  `;

  document.getElementById('inspectIdImage').src = req.idProofUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=60';

  const footer = document.getElementById('inspectIdActionFooter');
  if (req.status === 'Pending') {
    footer.innerHTML = `
      <button type="button" class="btn btn-secondary" onclick="closeModal('modalInspectIdProof')">Close</button>
      <button type="button" class="btn btn-danger" onclick="closeModal('modalInspectIdProof'); handleVerifyStudent('${req.id}', 'Rejected');">✕ Reject ID Proof</button>
      <button type="button" class="btn btn-success" onclick="closeModal('modalInspectIdProof'); handleVerifyStudent('${req.id}', 'Approved');">✓ Verify & Approve Student</button>
    `;
  } else {
    footer.innerHTML = `
      <button type="button" class="btn btn-secondary" onclick="closeModal('modalInspectIdProof')">Close</button>
      <span style="font-size:0.85rem; font-weight:700; color:${req.status === 'Approved' ? 'var(--success)' : 'var(--danger)'};">
        Status: ${req.status}
      </span>
    `;
  }

  openModal('modalInspectIdProof');
}

function handleVerifyStudent(id, decision) {
  const note = decision === 'Approved' ? 'Verified by SKIT Exam & Admin Office' : 'ID proof could not be validated with SKIT student records.';
  StateManager.updateVerificationStatus(id, decision, note);

  showToast(`Student record ${decision.toLowerCase()} successfully!`, decision === 'Approved' ? 'success' : 'warning');
  renderAdminVerifications();
  updateAdminStats();
}


// ==========================================
// 1. ADMIN NOTICES
// ==========================================
function renderAdminNotices() {
  const notices = StateManager.getNotices();
  const tbody = document.getElementById('adminNoticesTableBody');

  if (notices.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--gray-500);">No active circulars published.</td></tr>`;
    return;
  }

  tbody.innerHTML = notices.map(n => `
    <tr>
      <td><strong>${n.title}</strong></td>
      <td><span class="card-tag ${n.badgeClass || 'tag-academic'}">${n.category}</span></td>
      <td>
        <span style="font-weight: 700; color: ${n.isUrgent ? 'var(--danger)' : 'var(--gray-600)'};">
          ${n.priority || 'Normal'}
        </span>
      </td>
      <td>📅 ${n.date}</td>
      <td>${n.attachment ? `📎 ${n.attachment}` : '<span style="color:var(--gray-400);">None</span>'}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="handleDeleteNotice('${n.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function handlePublishNotice(e) {
  e.preventDefault();
  const priority = document.getElementById('adminNoticePriority').value;
  const category = document.getElementById('adminNoticeCategory').value;

  const categoryMap = {
    'Exams': 'tag-exams',
    'Events': 'tag-events',
    'Placement': 'tag-placement',
    'Urgent': 'tag-urgent',
    'Academic': 'tag-academic'
  };

  const newNotice = {
    title: document.getElementById('adminNoticeTitle').value,
    category: category,
    priority: priority,
    author: document.getElementById('adminNoticeAuthor').value,
    content: document.getElementById('adminNoticeContent').value,
    attachment: document.getElementById('adminNoticeAttachment').value || null,
    isUrgent: priority === 'Urgent',
    badgeClass: categoryMap[category] || 'tag-academic'
  };

  StateManager.addNotice(newNotice);
  showToast('Campus circular broadcasted successfully!', 'success');
  closeModal('modalPublishNotice');
  document.getElementById('formPublishNotice').reset();
  renderAdminNotices();
  updateAdminStats();
}

function handleDeleteNotice(id) {
  if (confirm('Are you sure you want to remove this announcement?')) {
    StateManager.deleteNotice(id);
    showToast('Notice removed.', 'warning');
    renderAdminNotices();
    updateAdminStats();
  }
}

// ==========================================
// 📅 ADMIN TIMETABLE MANAGEMENT
// ==========================================
function renderAdminTimetable() {
  const tbody = document.getElementById('adminTimetableTableBody');
  if (!tbody) return;

  const slots = StateManager.getTimetable();

  if (slots.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--gray-500);">No timetable slots configured yet. Click "+ Add Lecture / Lab Slot" to add.</td></tr>`;
    return;
  }

  tbody.innerHTML = slots.map(slot => {
    return `
      <tr>
        <td><strong>${slot.day}</strong></td>
        <td>${slot.time}</td>
        <td><span class="role-pill role-student" style="font-size: 0.72rem;">${slot.duration || '1.0 hours'}</span></td>
        <td>
          <div style="font-weight: 700; color: var(--text-primary);">${slot.subjectCode}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${slot.subjectName}</div>
        </td>
        <td>${slot.room}</td>
        <td>${slot.faculty}</td>
        <td><span style="font-size: 0.8rem; color: var(--text-secondary);">${slot.section || '5th Sem - CSE (Sec A)'}</span></td>
        <td>
          <button type="button" class="btn btn-danger btn-sm" onclick="handleDeleteTimetableSlot('${slot.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function handleCreateTimetableSlot(e) {
  e.preventDefault();

  const newSlot = {
    day: document.getElementById('slotDay').value,
    section: document.getElementById('slotSection').value,
    subjectCode: document.getElementById('slotSubjectCode').value.trim().toUpperCase(),
    subjectName: document.getElementById('slotSubjectName').value.trim(),
    time: document.getElementById('slotTimeRange').value.trim(),
    duration: document.getElementById('slotDuration').value,
    startTime: document.getElementById('slotStartTime').value,
    endTime: document.getElementById('slotEndTime').value,
    room: document.getElementById('slotRoom').value.trim(),
    faculty: document.getElementById('slotFaculty').value.trim(),
    type: document.getElementById('slotType').value
  };

  StateManager.addTimetableSlot(newSlot);
  showToast('Timetable lecture slot added successfully!', 'success');
  closeModal('modalAddTimetableSlot');
  document.getElementById('formAddTimetableSlot').reset();
  renderAdminTimetable();
}

function handleDeleteTimetableSlot(id) {
  if (confirm('Are you sure you want to delete this lecture slot?')) {
    StateManager.deleteTimetableSlot(id);
    showToast('Timetable slot deleted.', 'warning');
    renderAdminTimetable();
  }
}

// ==========================================
// 2. ADMIN GRIEVANCES
// ==========================================
function filterAdminGrievances(status) {
  currentGrievanceFilter = status;
  const filterBtns = document.querySelectorAll('#admintab-grievances .filter-btn');
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.innerText.includes(status) || (status === 'All' && btn.innerText === 'All'));
  });
  renderAdminGrievances();
}

function renderAdminGrievances() {
  let complaints = StateManager.getComplaints();
  const tbody = document.getElementById('adminGrievancesTableBody');

  if (currentGrievanceFilter !== 'All') {
    complaints = complaints.filter(c => c.status === currentGrievanceFilter);
  }

  if (complaints.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--gray-500);">No tickets matching this status.</td></tr>`;
    return;
  }

  tbody.innerHTML = complaints.map(c => {
    const statusClass = c.status === 'Resolved' ? 'status-resolved' : c.status === 'In Progress' ? 'status-in-progress' : 'status-pending';
    return `
      <tr>
        <td><strong>${c.title}</strong></td>
        <td><span class="card-tag tag-academic">${c.category}</span></td>
        <td>📍 ${c.location}</td>
        <td><span style="font-weight:700; color:${c.urgency === 'Critical' ? 'var(--danger)' : c.urgency === 'High' ? 'var(--warning)' : 'var(--success)'};">${c.urgency}</span></td>
        <td>👤 ${c.reportedBy || 'Student'}</td>
        <td><span class="status-pill ${statusClass}">${c.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="openResolveModal('${c.id}')">Manage / Resolve</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openResolveModal(id) {
  const ticket = StateManager.getComplaints().find(c => c.id === id);
  if (!ticket) return;

  document.getElementById('resolveTicketId').value = ticket.id;
  document.getElementById('resolveTicketTitle').innerText = `Issue: ${ticket.title} (${ticket.location})`;
  document.getElementById('resolveStatusSelect').value = ticket.status;
  document.getElementById('resolveRemarkInput').value = ticket.resolutionNote || '';

  openModal('modalResolveGrievance');
}

function handleSaveGrievanceResolution(e) {
  e.preventDefault();
  const id = document.getElementById('resolveTicketId').value;
  const status = document.getElementById('resolveStatusSelect').value;
  const remark = document.getElementById('resolveRemarkInput').value;

  StateManager.updateComplaintStatus(id, status, remark);
  showToast(`Grievance ticket updated to '${status}'`, 'success');
  closeModal('modalResolveGrievance');
  renderAdminGrievances();
  updateAdminStats();
}

// ==========================================
// 3. ADMIN LOST & FOUND
// ==========================================
function renderAdminLostFound() {
  const items = StateManager.getLostFound();
  const tbody = document.getElementById('adminLostFoundTableBody');

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--gray-500);">No items recorded in lost & found desk.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const isLost = item.type === 'lost';
    const isClosed = item.status === 'Resolved' || item.status === 'Claimed';
    return `
      <tr>
        <td>
          <span class="lost-found-badge ${isLost ? 'badge-lost' : 'badge-found'}">
            ${isLost ? '🔴 LOST' : '🟢 FOUND'}
          </span>
        </td>
        <td><strong>${item.title}</strong></td>
        <td>${item.category || 'General'}</td>
        <td>📍 ${item.location}</td>
        <td>${item.contactName} (${item.contactPhone})</td>
        <td>
          <span class="status-pill ${isClosed ? 'status-resolved' : 'status-pending'}">${item.status}</span>
        </td>
        <td>
          ${item.status !== 'Resolved' ? `
            <button class="btn btn-success btn-sm" onclick="handleAdminLFStatus('${item.id}', 'Resolved')">Mark Resolved</button>
          ` : '<span style="color:var(--gray-400); font-size:0.85rem;">✓ Handed Over</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

function handleAdminLFStatus(id, status) {
  StateManager.updateLostFoundStatus(id, status);
  showToast(`Item record marked as ${status}.`, 'success');
  renderAdminLostFound();
  updateAdminStats();
}

// ==========================================
// 4. ADMIN BOOKINGS APPROVAL
// ==========================================
function renderAdminBookings() {
  const bookings = StateManager.getBookings();
  const tbody = document.getElementById('adminBookingsTableBody');

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--gray-500);">No facility reservation requests.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => {
    const statusClass = b.status === 'Approved' ? 'status-approved' : b.status === 'Rejected' ? 'status-rejected' : 'status-pending';
    const isPending = b.status === 'Pending';

    return `
      <tr>
        <td><strong>${b.studentName || 'Student'}</strong></td>
        <td>${b.studentEmail || 'N/A'}</td>
        <td>${b.resourceName}</td>
        <td>📅 ${b.bookingDate}</td>
        <td>🕒 ${b.timeSlot}</td>
        <td>${b.purpose || 'Session'}</td>
        <td><span class="status-pill ${statusClass}">${b.status}</span></td>
        <td>
          ${isPending ? `
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-success btn-sm" onclick="handleBookingApproval('${b.id}', 'Approved')">Approve</button>
              <button class="btn btn-danger btn-sm" onclick="handleBookingApproval('${b.id}', 'Rejected')">Reject</button>
            </div>
          ` : `<span style="color:var(--gray-400); font-size:0.85rem;">Decision Logged</span>`}
        </td>
      </tr>
    `;
  }).join('');
}

function handleBookingApproval(id, decision) {
  StateManager.updateBookingStatus(id, decision);
  showToast(`Facility booking has been ${decision.toLowerCase()}!`, decision === 'Approved' ? 'success' : 'warning');
  renderAdminBookings();
  updateAdminStats();
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

window.onclick = function(e) {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
  }
};

// Interactive 3D Parallax Tilt Effect for Admin Stat Cards
function initCardTilt() {
  const interactiveCards = document.querySelectorAll('.stat-card');
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

document.addEventListener('DOMContentLoaded', () => {
  initCardTilt();
});
