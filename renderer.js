const $ = (sel) => document.querySelector(sel);

const img = $('#pastedImage');
const placeholder = $('#placeholder');
const content = $('.content');
const container = $('#imageContainer');

// --- Transform state ---
let scale = 1.0;
let panX = 0;
let panY = 0;

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10.0;
const ZOOM_FACTOR = 1.15;

function applyTransform() {
  img.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  container.classList.toggle('pannable', scale > 1);
}

function fitImage() {
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;

  scale = Math.min(cw / iw, ch / ih, 1);
  panX = (cw - iw * scale) / 2;
  panY = (ch - ih * scale) / 2;
  applyTransform();
}

// --- Toast feedback ---
let toastEl = null;
let toastTimer = null;

function showToast(message) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    content.appendChild(toastEl);
  }
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1500);
}

// --- Paste ---
async function pasteFromClipboard() {
  const dataURL = await window.electronAPI.pasteImage();
  if (!dataURL) {
    showToast('Arabellekte gorsel yok');
    return;
  }
  img.src = dataURL;
  img.classList.add('visible');
  placeholder.classList.add('hidden');
  img.onload = () => fitImage();
}

// --- Zoom (mouse wheel, centered on cursor) ---
container.addEventListener('wheel', (e) => {
  if (!img.classList.contains('visible')) return;
  e.preventDefault();

  const rect = container.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const oldScale = scale;
  if (e.deltaY < 0) {
    scale = Math.min(scale * ZOOM_FACTOR, MAX_ZOOM);
  } else {
    scale = Math.max(scale / ZOOM_FACTOR, MIN_ZOOM);
  }

  // Keep the point under cursor fixed
  panX = mx - (mx - panX) * (scale / oldScale);
  panY = my - (my - panY) * (scale / oldScale);

  applyTransform();
}, { passive: false });

// --- Pan (drag) ---
let isPanning = false;
let startX = 0;
let startY = 0;
let startPanX = 0;
let startPanY = 0;

container.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;
  if (!img.classList.contains('visible')) return;
  if (scale <= 1) return;

  isPanning = true;
  startX = e.clientX;
  startY = e.clientY;
  startPanX = panX;
  startPanY = panY;
  container.classList.add('panning');
  e.preventDefault();
});

window.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  panX = startPanX + (e.clientX - startX);
  panY = startPanY + (e.clientY - startY);
  applyTransform();
});

window.addEventListener('mouseup', () => {
  if (!isPanning) return;
  isPanning = false;
  container.classList.remove('panning');
});

// --- Reset zoom (fit to window) ---
function resetZoom() {
  fitImage();
}

// --- Pin toggle ---
async function togglePin() {
  const pinned = await window.electronAPI.togglePin();
  $('#btnPin').classList.toggle('pin-active', pinned);
}

// --- Refit on window resize ---
window.addEventListener('resize', () => {
  if (img.classList.contains('visible') && scale <= 1) {
    fitImage();
  }
});

// --- Event listeners ---

// Keyboard: Ctrl+V
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'v') {
    e.preventDefault();
    pasteFromClipboard();
  }
});

// Title bar buttons
$('#btnPin').addEventListener('click', togglePin);
$('#btnMinimize').addEventListener('click', () => window.electronAPI.minimizeWindow());
$('#btnClose').addEventListener('click', () => window.electronAPI.closeWindow());
