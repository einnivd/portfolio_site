/* ════════════════════════════════════
   gotop.js — 맨 위로 가기(Go to Top) 버튼 동작
   ════════════════════════════════════ */
(function () {
  const btn = document.getElementById("go-top-btn");
  if (!btn) return;

  const SHOW_AFTER = 400; // 이 값(px)만큼 스크롤하면 버튼이 나타남

  function toggleVisible() {
    if (window.scrollY > SHOW_AFTER) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }

  toggleVisible();
  window.addEventListener("scroll", toggleVisible, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();