/* ════════════════════════════════════
   main.js — YEBIN Portfolio · 전역 공통 스크립트
   nav 스크롤 상태 / 히어로 이름 핏 트리거 / 전역 scroll-reveal(.reveal)
   섹션별 상세 인터랙션은 다음 파일 참고:
     01_hero.js   — 히어로 아치 줌인 + About 진입
     03_roomA.js  — Room A 백라이트
     05_roomC.js  — Room C 백라이트
     06_roomD.js  — Room D 카드뉴스 슬라이더 + 모달
   ════════════════════════════════════ */

// ── 주소창에 남아있는 해시(#room-a, #contact 등) 즉시 제거 ──
// history.scrollRestoration만으로는 "페이지 로드 중 브라우저가 URL 해시
// 위치로 자동 스크롤하는 동작" 자체를 막지 못한다. 특히 이미지가 늦게
// 로드되어 레이아웃이 바뀌면 브라우저가 해시 위치로 스크롤을 다시
// 재적용하기도 해서, 아래 scrollTo(0,0)보다 나중에 실행되며 footer(주로
// #contact가 남아있을 때) 쪽으로 튀는 원인이 된다. 해시 자체를 지우면
// 브라우저가 이동할 대상이 없어져서 근본적으로 막힌다.
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}

// ── 새로고침 시 브라우저가 이전 스크롤 위치를 자동 복원하지 못하게 막기 ──
// (라이브 리로드로 HTML 저장할 때마다 문서 높이가 바뀌면서, 이전 스크롤값이
//  새 문서의 최대 범위를 넘어가 맨 아래(footer)로 튕기는 현상 방지 —
//  브라우저 자체 복원 대신, 아래 sessionStorage 기반 로직으로 직접 제어)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// ── 작업 중 코드 저장 → 라이브 리로드돼도 보던 화면 위치 그대로 유지 ──
// beforeunload 시점(리로드 직전)에 현재 스크롤 위치를 sessionStorage에 저장해두고,
// 새로 로드된 페이지에서 그 값을 읽어 그 자리로 즉시 복원한다.
// (sessionStorage는 새로고침에도 유지되고, 탭을 완전히 닫으면 사라짐)
const SCROLL_KEY = 'yebin-scroll-pos';

window.addEventListener('beforeunload', () => {
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
});

const savedScrollY = sessionStorage.getItem(SCROLL_KEY);
if (savedScrollY !== null) {
  window.scrollTo(0, parseInt(savedScrollY, 10));
} else {
  window.scrollTo(0, 0);
}

// ── LOAD ──
window.addEventListener('load', () => {
  fitHeroName(); // 01_hero.js에 정의
  updateHeroZoom(); // 01_hero.js에 정의 — 복원된 위치에 맞춰 히어로/About 상태를 즉시 동기화
});

// ── NAV 스크롤 상태 + 히어로 줌 갱신 트리거 ──
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 80);
  updateHeroZoom(); // 01_hero.js에 정의
}, { passive: true });

// ── SCROLL REVEAL — 전 섹션 공통(.reveal 클래스가 붙은 모든 요소) ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── NAV/문 안 SCROLL 버튼: About 이동 전용 스크롤 처리 ──
// About(.about-mag)은 position:fixed로 떠 있고 opacity/transform이 전부
// updateHeroZoom()의 scrollY 계산(01_hero.js)으로 제어되는 요소라
// 일반 <a href="#about"> 앵커 점프가 통하지 않는다(고정 요소라 브라우저가
// 점프할 문서상의 위치를 제대로 못 찾음). 그래서 About이 완전히 나타나는
// 지점의 scrollY(p2=1, 히어로가 완전히 사라지고 About이 완전히 보이는 시점)로
// 직접 스크롤시켜준다. nav의 About 링크와 문 안의 SCROLL 버튼(.arch-scroll)
// 둘 다 href="#about"이라 아래 셀렉터 하나로 함께 처리된다.
//
// window.scrollTo({behavior:'smooth'})는 브라우저마다 속도가 달라 시간을
// 정확히 맞출 수 없어서, requestAnimationFrame으로 정확히 2초짜리
// 커스텀 스크롤 애니메이션을 직접 구현한다.
function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    // behavior:'instant'를 명시하지 않으면, CSS에 scroll-behavior:smooth가
    // 걸려있을 때 매 프레임 호출이 브라우저 자체의 스무스 스크롤과 충돌해서
    // 계속 재시작되다가 마지막에 한 번에 훅 이동하는 것처럼 보임
    window.scrollTo({ top: startY + distance * easeInOutQuad(t), left: 0, behavior: 'instant' });
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href="#about"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const viewH = window.innerHeight;
    const targetY = viewH * 2.6; // p2End(01_hero.js)와 반드시 같은 값 — About이 완전히 나타나는 지점
    smoothScrollTo(targetY, 2000); // 클릭 후 About이 나타나기까지 정확히 2초
  });
});

// ── NAV 로고(YEBIN PORTFOLIO GALLERY) 클릭 → 히어로 맨 위로 ──
document.getElementById('nav-logo')?.addEventListener('click', (e) => {
  e.preventDefault();
  smoothScrollTo(0, 1200);
});

// ── NAV 메뉴 hover — 홀로그램 색상 중 하나가 랜덤으로 나타남 ──
// main.css :root에 정의된 --holo1~--holo5 중 하나를 마우스오버할 때마다 랜덤으로 골라
// 배경색으로 적용한다(호버할 때마다 다른 색이 나오도록 매번 새로 뽑음).
// 반투명하게 적용해서 뒤에서 움직이는 커서 입자(cursor-particles.js)가
// 배경 뒤로 비쳐 보이도록 한다.
const holoColors = ['--holo1', '--holo2', '--holo3', '--holo4', '--holo5'];

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

document.querySelectorAll('#nav-menu a').forEach(link => {
  link.addEventListener('mouseenter', () => {
    const pick = holoColors[Math.floor(Math.random() * holoColors.length)];
    const colorValue = getComputedStyle(document.documentElement).getPropertyValue(pick).trim();
    link.style.background = hexToRgba(colorValue, 0.6); // 0.45 정도만 불투명 — 뒤의 입자가 비쳐 보이게
  });
  link.addEventListener('mouseleave', () => {
    link.style.background = '';
  });
});

// ── 나머지 내부 앵커(Room A~D, Contact) — 브라우저 기본 앵커 대신 커스텀 스크롤 ──
// 기본 <a href="#room-a">처럼 두면 클릭할 때마다 주소창에 #room-a 같은 해시가
// 남는다. 그 상태로 라이브 리로드가 되면 브라우저가 새로고침 즉시 그 해시
// 위치로 자동 스크롤시켜버려서(특히 #contact는 footer 바로 위라 "footer로
// 튕긴다"처럼 보임) 편집 중 계속 화면이 튀는 원인이 됐다.
// preventDefault로 기본 동작을 막으면 해시 자체가 안 남으므로, 대신
// smoothScrollTo로 같은 지점까지 부드럽게 이동시켜준다.
// (#about은 위에서 이미 fixed 요소 전용 로직으로 따로 처리했으므로 제외)
document.querySelectorAll('a[href^="#"]:not([href="#"]):not([href="#about"])').forEach(link => {
  const targetEl = document.querySelector(link.getAttribute('href'));
  if (!targetEl) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(targetY, 1200);
  });
});