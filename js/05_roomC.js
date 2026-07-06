/* ════════════════════════════════════
   05_roomC.js — Room C 백라이트 (앱 쇼케이스) + 상세 페이지 모달
   ════════════════════════════════════ */

/* ── 백라이트: 스크롤 중 화면 중앙에 온 쇼케이스에 조명 ON ── */
const litObsRoomC = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle('lit', e.isIntersecting);
  });
}, {
  threshold: [0.3, 0.5],
  rootMargin: '-12% 0px -12% 0px'
});
document.querySelectorAll('.app-showcase').forEach(el => litObsRoomC.observe(el));

/* ── 상세 페이지(오니스트 콜라겐) 모달 ── */
const rcModalImages = [
  "images/ownist_top.jpg",
  "images/ownist_gif.gif",
  "images/ownist_bottom.jpg",
];

const RC_INITIAL_VISIBLE = 1;

let rcModalInitialized = false;
let rcModalExpanded = false;

function renderRcModalImages() {
  const stack = document.getElementById("rc-modal-img-stack");
  const expandBtn = document.getElementById("rc-modal-img-expand");
  if (!stack) return;

  stack.innerHTML = "";
  rcModalImages.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `오니스트 트리플 콜라겐 상세 이미지 ${i + 1}`;
    img.className = "modal-stack-img";
    stack.appendChild(img);
  });

  rcModalInitialized = true;

  if (expandBtn) {
    expandBtn.style.display =
      rcModalImages.length > RC_INITIAL_VISIBLE ? "" : "none";
  }
}

function setRcModalExpanded(expanded) {
  const box = document.getElementById("rc-modal-img-box");
  const expandBtn = document.getElementById("rc-modal-img-expand");
  if (!box || !expandBtn) return;

  rcModalExpanded = expanded;
  box.classList.toggle("expanded", expanded);

  if (expanded) {
    const stack = document.getElementById("rc-modal-img-stack");
    box.style.height = stack ? `${stack.scrollHeight}px` : "auto";
  } else {
    box.style.height = "";
  }

  expandBtn.textContent = expanded ? "접기 ▲" : "더보기 ▼";
}

function openRcModal() {
  const modal = document.getElementById("rc-modal");
  if (!modal) return;

  if (!rcModalInitialized) {
    renderRcModalImages();
  }
  setRcModalExpanded(false);

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeRcModal(event) {
  const modal = document.getElementById("rc-modal");
  if (!modal) return;

  if (event && event.target !== modal && !event.target.closest(".modal-close")) {
    return;
  }

  modal.classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const expandBtn = document.getElementById("rc-modal-img-expand");
  if (expandBtn) {
    expandBtn.addEventListener("click", () => {
      setRcModalExpanded(!rcModalExpanded);
    });
  }
});

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("rc-modal");
  if (e.key === "Escape" && modal && modal.classList.contains("open")) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
});