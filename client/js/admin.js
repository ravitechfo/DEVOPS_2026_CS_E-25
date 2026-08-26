// Smart Campus - Admin & Management Console Logic

let currentGrievanceFilter = 'All';

document.addEventListener('DOMContentLoaded', () => {
  initAdminProfile();
  renderAdminAll();
});

function initAdminProfile() {
  const user = StateManager.getUser();
  document.getElementById('adminUserName').innerText = user.name || 'Campus Administrator';
}

function switchAdminTab(tabName) {
  const buttons = document.querySelectorAll('.admin-navbar .nav-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  const targetBtn = Array.from(buttons).find(b => b.onclick.toString().includes(tabName));
  if (targetBtn) targetBtn.classList.add('active');

  const contents = document.querySelectorAll('.module-content');
  contents.forEach(sec => sec.classList.remove('active'));

  const targetSection = document.getElementById(`admintab-${tabName}`);
  if (targetSection) targetSection.classList.add('active');
}

function renderAdminAll() {
  renderAdminNotices();
  renderAdminGrievances();
  renderAdminLostFound();
  renderAdminBookings();
  updateAdminStats();
}

function updateAdminStats() {
  const notices = StateManager.getNotices();
  const grievances = StateManager.getComplaints();
  const lostFound = StateManager.getLostFound();
  const bookings = StateManager.getBookings();

  document.getElementById('adminStatNotices').innerText = notices.length;
  document.getElementById('adminStatGrievances').innerText = grievances.filter(g => g.status !== 'Resolved').length;
  document.getElementById('adminStatLostFound').innerText = lostFound.filter(l => l.status === 'Open').length;
  document.getElementById('adminStatBookings').innerText = bookings.filter(b => b.status === 'Pending').length;
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
