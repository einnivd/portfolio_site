/* ════════════════════════════════════
   06_roomD-reveal.js — Room D 스크롤 진입 감지
   스크롤 중 화면 중앙에 온 작업물에 .lit 클래스 부여
   (Room A/B와 동일한 패턴)
   ════════════════════════════════════ */
const litObsRoomD = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle('lit', e.isIntersecting);
  });
}, {
  threshold: [0.3, 0.5],
  rootMargin: '-12% 0px -12% 0px'
});
document.querySelectorAll('.rd-item').forEach(el => litObsRoomD.observe(el));