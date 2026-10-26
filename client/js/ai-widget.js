// Campus AI Assistant Widget Client Logic
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
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  res = res.replace(/`([^`]+)`/g, '<code style="background: rgba(99,102,241,0.15); padding: 2px 5px; border-radius: 4px; font-family: monospace;">$1</code>');
  res = res.replace(/(?:^|<br>)(\d+)\.\s+/g, '<br>&bull; ');
  res = res.replace(/\n/g, '<br>');
  return res;
}
