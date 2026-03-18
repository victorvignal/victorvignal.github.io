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
