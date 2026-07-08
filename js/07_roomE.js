/* ════════════════════════════════════
   06_roomE.js — Room E 카드뉴스
   무한 슬라이더(마우스/터치 드래그) + 상세 모달
   ════════════════════════════════════ */

// ── 카드뉴스 무한 슬라이더 + 드래그 ──
(function () {
  const wrap = document.getElementById("cn-slider-wrap");
  const track = document.getElementById("cn-track");
  if (!track || !wrap) return;

  let x = 0,
    paused = false,
    dragging = false;
  let dragStartX = 0,
    dragStartOff = 0;
  const speed = 3;
  let halfW = 0;

  function init() {
    halfW = track.scrollWidth / 2;
    wrap.style.cursor = "grab";
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

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }

  wrap.addEventListener("mouseenter", () => {
    paused = true;
  });
  wrap.addEventListener("mouseleave", () => {
    if (!dragging) paused = false;
  });

  wrap.addEventListener("mousedown", (e) => {
    dragging = true;
    paused = true;
    dragStartX = e.clientX;
    dragStartOff = x;
    wrap.style.cursor = "grabbing";
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    x = loop(dragStartOff + (dragStartX - e.clientX));
    track.style.transform = `translateX(-${x}px)`;
  });
  window.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    paused = false;
    wrap.style.cursor = "grab";
  });

  wrap.addEventListener(
    "touchstart",
    (e) => {
      dragging = true;
      paused = true;
      dragStartX = e.touches[0].clientX;
      dragStartOff = x;
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (!dragging) return;
      x = loop(dragStartOff + (dragStartX - e.touches[0].clientX));
      track.style.transform = `translateX(-${x}px)`;
    },
    { passive: true },
  );
  window.addEventListener("touchend", () => {
    dragging = false;
    paused = false;
  });
})();

// ── 모달 ──
const modalData = [
  {
    no: "E — 01",
    title: "코스메틱 광고",
    year: "2026",
    img: "images/cosmetic.jpg",
    tools: ["photoshop"],
  },
  {
    no: "E — 02",
    title: "GYM UTO 포스터",
    year: "2026",
    img: "images/fitness.jpg",
    tools: ["Photoshop",],
  },
  {
    no: "E — 03",
    title: "휠라 GLIO SNS 광고",
    year: "2026",
    img: "images/glio.jpg",
    tools: ["Photoshop", "ChatGPT"],
  },
  {
    no: "E — 04",
    title: "알로에 스킨토너 광고",
    year: "2026",
    img: "images/aloe.jpg",
    tools: ["Photoshop", "illustrator"],
  },
  {
    no: "E — 05",
    title: "히비스커스 에이드 웹 포스터",
    year: "2026",
    img: "images/hibiscus_ade.jpg",
    tools: ["Photoshop",],
  },
  {
    no: "E — 06",
    title: "수영복 할인 배너",
    year: "2026",
    img: "images/life_item.jpg",
    tools: ["Photoshop",],
  },
  {
    no: "E — 07",
    title: "반려견 굿즈 만들기 SNS 광고",
    year: "2026",
    img: "images/pet.jpg",
    tools: ["Photoshop",],
  },
  {
    no: "E — 08",
    title: "베이글 카페 포스터",
    year: "2026",
    img: "images/bagel.jpg",
    tools: ["Photoshop",],
  },
  {
    no: "E — 09",
    title: "리뷰 이벤트 광고",
    year: "2026",
    img: "images/review.jpg",
    tools: ["Photoshop",],
  },
];

function openModal(idx) {
  const d = modalData[idx % modalData.length];
  document.getElementById("modal-no").textContent = d.no;
  document.getElementById("modal-title").textContent = d.title;
  document.getElementById("modal-type").textContent =
    d.year + " · Card News · Visual Design";

  const toolsEl = document.getElementById("cn-modal-tools");
  toolsEl.innerHTML = "";
  (d.tools || []).forEach((tool) => {
    const chip = document.createElement("span");
    chip.className = "modal-tool-chip";
    chip.textContent = tool;
    toolsEl.appendChild(chip);
  });

  const stack = document.getElementById("modal-img-stack");
  if (stack) {
    stack.innerHTML = "";
    const sources = d.imgs && d.imgs.length ? d.imgs : [d.img];
    sources.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      stack.appendChild(img);
    });
  }

  const imgBox = document.getElementById("modal-img-box");
  const expandBtn = document.getElementById("modal-img-expand");
  if (imgBox) {
    imgBox.classList.remove("expanded");
    imgBox.style.height = "";
  }
  if (expandBtn) {
    expandBtn.textContent = "더보기 ▼";
  }
  document.getElementById("cn-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(e) {
  const modal = document.getElementById("cn-modal");
  if (!modal) return;

  // 오버레이 배경(모달 바깥) 클릭이거나 닫기(✕) 버튼 클릭일 때만 닫는다.
  // 모달 안쪽(이미지, 텍스트 등) 클릭은 무시한다.
  if (e && e.target !== modal && !e.target.closest(".modal-close")) {
    return;
  }

  modal.classList.remove("open");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("cn-modal").classList.remove("open");
    document.body.style.overflow = "";
  }
});
document.getElementById("cn-modal")?.addEventListener(
  "wheel",
  (e) => {
    const box = document.querySelector(".modal-box");
    if (box && !box.contains(e.target)) {
      box.scrollTop += e.deltaY;
      e.preventDefault();
    }
  },
  { passive: false },
);

// ── 모달 이미지 상단만 미리보기 → 버튼 클릭 시 전체 펼치기 ──
document.getElementById("modal-img-expand")?.addEventListener("click", () => {
  const imgBox = document.getElementById("modal-img-box");
  const stack = document.getElementById("modal-img-stack");
  const btn = document.getElementById("modal-img-expand");
  if (!imgBox || !stack || !btn) return;

  const isExpanded = imgBox.classList.contains("expanded");

  if (isExpanded) {
    imgBox.style.height = "380px";
    imgBox.classList.remove("expanded");
    btn.textContent = "상세페이지 더보기 ▼";
  } else {
    const fullHeight = stack.scrollHeight;
    imgBox.style.height = fullHeight + "px";
    imgBox.classList.add("expanded");
    btn.textContent = "접기 ▲";
  }
});