/* ════════════════════════════════════
   03_roomA.js — Room A 백라이트
   스크롤 중 화면 중앙에 온 작품에 조명 ON
   ════════════════════════════════════ */
const litObsRoomA = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle('lit', e.isIntersecting);
  });
}, {
  threshold: [0.3, 0.5],
  rootMargin: '-12% 0px -12% 0px'
});
document.querySelectorAll('.v-item').forEach(el => litObsRoomA.observe(el));