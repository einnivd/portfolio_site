/* ════════════════════════════════════
   06_roomD.js — Room D 카드뉴스
   무한 슬라이더(마우스/터치 드래그) + 상세 모달
   ════════════════════════════════════ */

// ── 카드뉴스 무한 슬라이더 + 드래그 ──
(function () {
  const wrap  = document.getElementById('cn-slider-wrap');
  const track = document.getElementById('cn-track');
  if (!track || !wrap) return;

  let x = 0, paused = false, dragging = false;
  let dragStartX = 0, dragStartOff = 0;
  const speed = 0.6;
  let halfW = 0;

  function init() {
    halfW = track.scrollWidth / 2;
    wrap.style.cursor = 'grab';
    requestAnimationFrame(tick);
  }

  function loop(val) {
    if (halfW <= 0) return val;
    val = val % halfW;
    if (val < 0) val += halfW;
    return val;
  }

  function tick() {
    if (!paused && !dragging) {
      x = loop(x + speed);
      track.style.transform = `translateX(-${x}px)`;
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'complete') { init(); }
  else { window.addEventListener('load', init); }

  wrap.addEventListener('mouseenter', () => { paused = true; });
  wrap.addEventListener('mouseleave', () => { if (!dragging) paused = false; });

  wrap.addEventListener('mousedown', e => {
    dragging = true; paused = true;
    dragStartX = e.clientX; dragStartOff = x;
    wrap.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    x = loop(dragStartOff + (dragStartX - e.clientX));
    track.style.transform = `translateX(-${x}px)`;
  });
  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false; paused = false;
    wrap.style.cursor = 'grab';
  });

  wrap.addEventListener('touchstart', e => {
    dragging = true; paused = true;
    dragStartX = e.touches[0].clientX; dragStartOff = x;
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (!dragging) return;
    x = loop(dragStartOff + (dragStartX - e.touches[0].clientX));
    track.style.transform = `translateX(-${x}px)`;
  }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; paused = false; });
})();

// ── 모달 ──
const modalData = [
  { no: 'D — 01', title: '화장품 카드뉴스',           year: '2026', img: 'images/cosmetic.png' },
  { no: 'D — 02', title: 'GYM UTO SUMMER',          year: '2026', img: 'images/fitness.png'  },
  { no: 'D — 03', title: 'FILA GLIO',               year: '2025', img: 'images/glio.png'     },
  { no: 'D — 04', title: 'OWNIST Triple Collagen',  year: '2025', img: 'images/ownist.png'   },
  { no: 'D — 05', title: 'Sneakers Unboxed',        year: '2025', img: 'images/sneakers.png' },
];

function openModal(idx) {
  const d = modalData[idx % modalData.length];
  document.getElementById('modal-no').textContent    = d.no;
  document.getElementById('modal-title').textContent = d.title;
  document.getElementById('modal-desc').textContent  = d.year + ' · Card News · Visual Design';
  const imgEl = document.getElementById('modal-img-el');
  if (imgEl) { imgEl.src = d.img; }
  document.getElementById('cn-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(e) {
  if (e.target === document.getElementById('cn-modal')) {
    document.getElementById('cn-modal').classList.remove('open');
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('cn-modal').classList.remove('open');
    document.body.style.overflow = '';
  }
});
document.querySelector('.modal-close')?.addEventListener('click', () => {
  document.getElementById('cn-modal').classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('cn-modal')?.addEventListener('wheel', e => {
  const box = document.querySelector('.modal-box');
  if (box && !box.contains(e.target)) {
    box.scrollTop += e.deltaY;
    e.preventDefault();
  }
}, { passive: false });