/* ════════════════════════════════════
   04_roomB.js — Room B 백라이트
   스크롤 중 화면 중앙에 온 작업물에 조명 ON (다른 Room들과 동일한 패턴)
   ════════════════════════════════════ */
const litObsRoomB = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle('lit', e.isIntersecting);
  });
}, {
  threshold: [0.3, 0.5],
  rootMargin: '-12% 0px -12% 0px'
});
document.querySelectorAll('.h-card').forEach(el => litObsRoomB.observe(el));