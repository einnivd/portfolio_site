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
  { no: 'D — 01', title: '화장품 카드뉴스',           year: '2026', img: 'images/cosmetic.jpg' },
  { no: 'D — 02', title: 'GYM UTO SUMMER',          year: '2026', img: 'images/fitness.jpg'  },
  { no: 'D — 03', title: 'FILA GLIO',               year: '2025', img: 'images/glio.jpg'     },
  { no: 'D — 04', title: 'OWNIST Triple Collagen',  year: '2025', imgs: [
      'images/ownist_top.jpg',
      'images/ownist_gif.gif',
      'images/ownist_bottom.jpg',
    ] },
  { no: 'D — 05', title: 'Sneakers Unboxed',        year: '2025', img: 'images/sneakers.png' },
  { no: 'D — 06', title: 'New Way of Hibiscus Ade', year: '2026', img: 'images/hibiscus_ade.jpg' },
  { no: 'D — 07', title: 'Life Item',               year: '2026', img: 'images/life_item.jpg' },
];

function openModal(idx) {
  const d = modalData[idx % modalData.length];
  document.getElementById('modal-no').textContent    = d.no;
  document.getElementById('modal-title').textContent = d.title;
  document.getElementById('modal-desc').textContent  = d.year + ' · Card News · Visual Design';

  // 이미지 1장(img) 또는 여러 장을 세로로 이어붙인 것(imgs)을 둘 다 지원
  const stack = document.getElementById('modal-img-stack');
  if (stack) {
    stack.innerHTML = '';
    const sources = d.imgs && d.imgs.length ? d.imgs : [d.img];
    sources.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      stack.appendChild(img);
    });
  }

  // 새 카드를 열 때마다 항상 접힌(미리보기) 상태로 초기화
  const imgBox = document.getElementById('modal-img-box');
  const expandBtn = document.getElementById('modal-img-expand');
  if (imgBox) { imgBox.classList.remove('expanded'); imgBox.style.height = ''; }
  if (expandBtn) { expandBtn.textContent = '상세페이지 더보기 ▼'; }
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

// ── 모달 이미지 상단만 미리보기 → 버튼 클릭 시 전체 펼치기 ──
document.getElementById('modal-img-expand')?.addEventListener('click', () => {
  const imgBox = document.getElementById('modal-img-box');
  const stack  = document.getElementById('modal-img-stack');
  const btn    = document.getElementById('modal-img-expand');
  if (!imgBox || !stack || !btn) return;

  const isExpanded = imgBox.classList.contains('expanded');

  if (isExpanded) {
    // 다시 접기 — 기본 미리보기 높이로 되돌림
    imgBox.style.height = '380px';
    imgBox.classList.remove('expanded');
    btn.textContent = '상세페이지 더보기 ▼';
  } else {
    // 펼치기 — 이어붙인 이미지(들) 전체 높이만큼 확장
    const fullHeight = stack.scrollHeight;
    imgBox.style.height = fullHeight + 'px';
    imgBox.classList.add('expanded');
    btn.textContent = '접기 ▲';
  }
});