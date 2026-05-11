/* ── SYSINT CHAT WIDGET ── */

const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
const CHAT_API_URL = IS_LOCAL
  ? 'http://localhost:8000/api/chat'
  : 'https://sysint-website-agent.kindmushroom-93329cd8.eastus.azurecontainerapps.io/api/chat';

const BOT_NAME    = 'SysInt Assistant';
const STORAGE_KEY = 'sysint_chat_state';
const EXPIRY_MS   = 24 * 60 * 60 * 1000; // reset after 24 hours

// in-memory conversation history for API calls
let chatHistory = [];

/* ── STORAGE ── */

function saveState() {
  try {
    const messages = [];
    document.querySelectorAll('#chat-messages .msg-row').forEach(row => {
      const role = row.classList.contains('user') ? 'user' : 'bot';
      const text = row.querySelector('.msg-bubble')?.textContent || '';
      const time = row.querySelector('.msg-time')?.textContent  || '';
      if (text) messages.push({ role, text, time });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      messages,
      history:  chatHistory,
      savedAt:  Date.now()
    }));
  } catch(e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    if (Date.now() - state.savedAt > EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return state;
  } catch(e) { return null; }
}

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
  chatHistory = [];
  document.getElementById('chat-messages').innerHTML = '';
  addMessage("Chat cleared. 👋 Ask me about Enterprise Integration, AI services, or our AI Agent Store for local businesses.", 'bot');
}

/* ── FALLBACK (keyword matching) ── */

const RESPONSES = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
    reply: "Hi! 👋 I'm SysInt's assistant. I can help with Enterprise Integration, AI services, or our AI Agent Store for local businesses. What are you looking for?"
  },
  {
    keywords: ['integration', 'biztalk', 'logic apps', 'service bus', 'api management', 'event grid', 'middleware', 'enterprise integration'],
    reply: "Our Enterprise Integration practice covers:\n• Azure Integration Services — Logic Apps, Service Bus, API Management, Event Grid\n• BizTalk Server migration & modernization\n• API strategy & middleware design\n• Event-driven architecture\n\nWant to talk to an engineer?"
  },
  {
    keywords: ['biztalk', 'migrate', 'migration', 'legacy', 'modernize'],
    reply: "BizTalk to Azure migration is one of our deepest capabilities — 20+ years of BizTalk experience. We assess your estate, preserve business rules, and design cloud-ready replacements. Want to start with an assessment?"
  },
  {
    keywords: ['ai services', 'artificial intelligence', 'machine learning', 'inference', 'llm', 'gpt', 'agentic', 'copilot', 'rag'],
    reply: "We offer 4 AI services:\n1. AI Integration — connecting data & APIs into AI workflows\n2. Agentic Automation — copilots, task agents, approval loops\n3. Inference Platforms — deployment, guardrails, observability\n4. Intelligent Apps — portals, multimodal products\n\nWhich interests you?"
  },
  {
    keywords: ['agent store', 'local business', 'small business', 'salon', 'restaurant', 'clinic', 'real estate', 'retail', 'home service', 'legal', 'education'],
    reply: "Our AI Agent Store has ready-to-deploy bots for local businesses:\n🍽️ Restaurants  💇 Salons & Spas\n🏥 Clinics  🏠 Real Estate\n🛍️ Retail  🔧 Home Services\n⚖️ Legal  🎓 Education\n\nAgents go live in 48 hours. Want a demo?"
  },
  {
    keywords: ['chatbot', 'bot', 'ai agent', 'ai bot', 'ai chat'],
    reply: "We build AI agents for both enterprise (agentic automation, RAG, inference platforms) and local business (booking bots, FAQ agents, lead capture). Which scenario fits you best?"
  },
  {
    keywords: ['price', 'pricing', 'cost', 'how much', 'rates', 'fee', 'plan', 'plans'],
    reply: "For local business AI agents we have:\n• Starter — website bot, FAQ & lead capture\n• Growth — multi-channel, CRM sync, booking integration\n• Enterprise — white-label, custom workflows, multi-location\n\nFor enterprise integration, we scope per engagement. Want to talk numbers?"
  },
  {
    keywords: ['contact', 'talk', 'call', 'email', 'reach', 'speak', 'demo', 'meeting', 'book', 'schedule'],
    reply: "Reach Ganga Ananthoju directly:\n📞 440-364-6078\n✉️ gangadhar.ananthoju@sysintinc.com\n🌐 www.sysintinc.com\n\nOr tell me what you need and we'll follow up."
  },
  {
    keywords: ['how long', 'timeline', 'how fast', 'how quick', 'time to live', 'go live', 'fast'],
    reply: "Local business AI agents typically go live in 48 hours — just a 20-minute call to set up. Enterprise integration projects vary, but most start delivering value within 2–4 weeks of kickoff."
  },
  {
    keywords: ['who are you', 'what is sysint', 'about sysint', 'about you', 'company', 'who is'],
    reply: "SysInt Inc is an enterprise integration and AI engineering firm. We combine 20+ years of integration expertise (BizTalk, Azure) with modern AI engineering — founded by Ganga Ananthoju. We serve both enterprise clients and local businesses."
  },
  {
    keywords: ['thanks', 'thank you', 'great', 'awesome', 'perfect', 'helpful'],
    reply: "Happy to help! 😊 Anything else you'd like to know about our services?"
  }
];

function fallback(message) {
  const msg = message.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some(k => msg.includes(k))) return r.reply;
  }
  return "I can help with Enterprise Integration, AI services, or our AI Agent Store for local businesses. Feel free to ask anything — or reach us directly at 440-364-6078.";
}

/* ── API ── */

async function getReply(message) {
  if (CHAT_API_URL) {
    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: chatHistory.slice(-6) })
      });
      const data = await res.json();
      return data.reply || data.message || fallback(message);
    } catch {
      return fallback(message);
    }
  }
  return new Promise(resolve => setTimeout(() => resolve(fallback(message)), 900 + Math.random() * 600));
}

/* ── UI HELPERS ── */

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, role, time) {
  const messages = document.getElementById('chat-messages');
  const row = document.createElement('div');
  row.className = `msg-row ${role}`;

  if (role === 'bot') {
    const av = document.createElement('div');
    av.className = 'msg-avatar';
    av.innerHTML = '<img src="logos/logo.png" alt="SysInt" />';
    row.appendChild(av);
  }

  const col = document.createElement('div');

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;
  col.appendChild(bubble);

  const ts = document.createElement('div');
  ts.className = 'msg-time';
  ts.textContent = time || timestamp();
  col.appendChild(ts);

  row.appendChild(col);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const messages = document.getElementById('chat-messages');
  const row = document.createElement('div');
  row.className = 'msg-row bot';
  row.id = 'typing-indicator';

  const av = document.createElement('div');
  av.className = 'msg-avatar';
  av.innerHTML = '<img src="logos/logo.png" alt="SysInt" />';
  row.appendChild(av);

  const bubble = document.createElement('div');
  bubble.className = 'typing-bubble';
  bubble.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  row.appendChild(bubble);

  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

/* ── SEND ── */

async function handleSend() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  addMessage(text, 'user');

  // update history before API call
  chatHistory.push({ role: 'user', content: text });
  showTyping();

  const reply = await getReply(text);
  hideTyping();
  addMessage(reply, 'bot');

  chatHistory.push({ role: 'assistant', content: reply });
  saveState();
}

/* ── INIT ── */

function initChatWidget() {
  const widget = document.createElement('div');
  widget.id = 'sysint-chat';
  widget.innerHTML = `
    <div id="chat-window">
      <div id="chat-header">
        <div class="chat-avatar"><img src="logos/logo.png" alt="SysInt" /></div>
        <div class="chat-info">
          <div class="chat-name">${BOT_NAME}</div>
          <div class="chat-status">● Online</div>
        </div>
        <button id="chat-clear" aria-label="Clear chat" title="Clear chat">
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
        <button id="chat-close" aria-label="Close chat">✕</button>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input-row">
        <input id="chat-input" type="text" placeholder="Ask about our services..." autocomplete="off" />
        <button id="chat-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
    <button id="chat-fab" aria-label="Open chat">
      <svg id="fab-icon-chat" viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H6l-2 2V4h16v10z"/></svg>
      <svg id="fab-icon-close" viewBox="0 0 24 24" style="display:none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
  `;
  document.body.appendChild(widget);

  // restore or greet
  const state = loadState();
  if (state && state.messages && state.messages.length > 0) {
    chatHistory = state.history || [];
    state.messages.forEach(m => addMessage(m.text, m.role, m.time));
  } else {
    setTimeout(() => {
      addMessage("👋 Hi! Ask me about Enterprise Integration, AI services, or our AI Agent Store for local businesses.", 'bot');
      saveState();
    }, 600);
  }

  // FAB toggle
  document.getElementById('chat-fab').addEventListener('click', () => {
    const win = document.getElementById('chat-window');
    const isOpen = win.classList.contains('open');
    win.classList.toggle('open');
    document.getElementById('fab-icon-chat').style.display = isOpen ? '' : 'none';
    document.getElementById('fab-icon-close').style.display = isOpen ? 'none' : '';
  });

  document.getElementById('chat-close').addEventListener('click', () => {
    document.getElementById('chat-window').classList.remove('open');
    document.getElementById('fab-icon-chat').style.display = '';
    document.getElementById('fab-icon-close').style.display = 'none';
  });

  document.getElementById('chat-clear').addEventListener('click', clearState);
  document.getElementById('chat-send').addEventListener('click', handleSend);
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend();
  });
}

function openChat() {
  const win = document.getElementById('chat-window');
  win.classList.add('open');
  document.getElementById('fab-icon-chat').style.display = 'none';
  document.getElementById('fab-icon-close').style.display = '';
}

window.toggleChat = function() {
  const win = document.getElementById('chat-window');
  const isOpen = win.classList.contains('open');
  if (isOpen) {
    win.classList.remove('open');
    document.getElementById('fab-icon-chat').style.display = '';
    document.getElementById('fab-icon-close').style.display = 'none';
  } else {
    openChat();
  }
};

document.addEventListener('DOMContentLoaded', initChatWidget);
