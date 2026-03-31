document.getElementById('year').textContent = new Date().getFullYear();

// Troca rápida do WhatsApp em um lugar só
const WHATSAPP = '5521920148845'; // <-- troque para seu número
const ctas = [
  { id: 'cta-top', text: 'Quero automatizar meu WhatsApp com IA' },
  { id: 'cta-offer', text: 'Quero fechar o pacote Start' },
  { id: 'cta-bottom', text: 'Quero começar hoje' },
];

ctas.forEach(({ id, text }) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
});

// Dark mode
const toggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
}

function syncThemeIcon() {
  if (!toggle) return;
  const dark = document.body.getAttribute('data-theme') === 'dark';
  toggle.textContent = dark ? '☀️' : '🌙';
}

if (toggle) {
  toggle.addEventListener('click', () => {
    const dark = document.body.getAttribute('data-theme') === 'dark';
    if (dark) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    syncThemeIcon();
  });
}

syncThemeIcon();

// ARIA Chat
const ARIA_API = 'https://aria-backend-production-176b.up.railway.app/chat';
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send');
let ariaBusy = false;

if (chatInput) {
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  });
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ariaSend(); }
  });
}

function ariaAddMsg(text, isUser, sources) {
  const welcome = chatMessages.querySelector('.chat-welcome');
  if (welcome) welcome.remove();
  const div = document.createElement('div');
  div.className = 'chat-msg ' + (isUser ? 'user' : 'bot');
  let html = text;
  if (sources && sources.length) {
    html += '<div class="sources"><strong>📚 Fontes:</strong>';
    sources.forEach(s => {
      const pg = s.page_start ? ` (p. ${s.page_start}${s.page_end ? '-' + s.page_end : ''})` : '';
      html += `<span>• ${s.title}${pg}</span>`;
    });
    html += '</div>';
  }
  div.innerHTML = html;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function ariaTyping() {
  const d = document.createElement('div');
  d.className = 'chat-typing'; d.id = 'chat-typing';
  d.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function ariaRemoveTyping() {
  const el = document.getElementById('chat-typing');
  if (el) el.remove();
}

async function ariaSend() {
  const q = chatInput.value.trim();
  if (!q || ariaBusy) return;
  ariaBusy = true; chatSendBtn.disabled = true;
  chatInput.value = ''; chatInput.style.height = 'auto';
  ariaAddMsg(q, true); ariaTyping();
  try {
    const r = await fetch(ARIA_API, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q, top_k: 5 }),
    });
    ariaRemoveTyping();
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      ariaAddMsg('Erro: ' + (err.detail || 'Falha na conexão.'), false);
    } else {
      const d = await r.json();
      ariaAddMsg(d.answer, false, d.sources);
    }
  } catch (e) {
    ariaRemoveTyping();
    ariaAddMsg('Não foi possível conectar ao servidor.', false);
  }
  ariaBusy = false; chatSendBtn.disabled = false; chatInput.focus();
}
