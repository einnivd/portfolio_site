/* ════════════════════════════════════
   05_roomC.js — Room C 백라이트 (앱 쇼케이스)
   스크롤 중 화면 중앙에 온 쇼케이스에 조명 ON
   ════════════════════════════════════ */
const litObsRoomC = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle('lit', e.isIntersecting);
  });
}, {
  threshold: [0.3, 0.5],
  rootMargin: '-12% 0px -12% 0px'
});
document.querySelectorAll('.app-showcase').forEach(el => litObsRoomC.observe(el));