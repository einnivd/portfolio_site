/* ════════════════════════════════════
   cursor-particles.js — 페이지 전체(메뉴바 포함)에서 마우스를 따라다니는
   홀로그램 입자 원들. 각 원마다 크기(size)와 추적 속도(lag)를 다르게 줘서
   마우스를 움직이면 원들이 서로 다른 속도로 뒤따라오며 흩날리는 느낌을 낸다.
   main.css :root의 --holo1~--holo5 색상을 그대로 사용.

   ※ 원 컨테이너를 nav 안(nav-menu 바로 앞)에 둔 이유:
     - nav.scrolled의 반투명 블러 배경 뒤에 원이 완전히 가려지는 문제 방지
       (자식 요소는 항상 부모 자신의 배경보다 위에 그려짐)
     - .nav-menu에 준 z-index:2가 원(z-index:1)보다 높아서, 메뉴 위에서는
       텍스트가 원에 가려지지 않음
     - position:fixed라 nav 안에 있어도 시각적으로는 뷰포트 전체를 덮으므로
       메뉴바 밖 페이지 전체에서도 그대로 보임
   ════════════════════════════════════ */
(function () {
  // 터치 기기는 마우스 포인터가 없으니 아예 생성하지 않음
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const navMenu = document.getElementById('nav-menu');
  if (!navMenu) return;

  const holoVars = ['--holo1', '--holo2', '--holo3', '--holo4', '--holo5'];
  const COUNT = 20; // 원 개수

  function getHoloColor(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  const container = document.createElement('div');
  container.id = 'cursor-particles';
  container.setAttribute('aria-hidden', 'true');
  // body에 직접 붙여서 nav의 opacity(스크롤 전엔 0) 영향을 안 받게 함
  // → 페이지 맨 처음 히어로 화면부터 끝까지 항상 보이게
  document.body.appendChild(container);

  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'cursor-particle';

    const size = 4 + Math.random() * 56; // 4px ~ 60px — 가장 큰 원은 메뉴바 높이 정도
    const color = getHoloColor(holoVars[i % holoVars.length]);

    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.background = color;
    el.style.boxShadow = `0 0 ${size * 0.5}px ${size * 0.12}px ${color}`;

    container.appendChild(el);

    particles.push({
      el,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      lag: 0.03 + (1 - size / 60) * 0.2 + Math.random() * 0.05,
    });
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let hasMoved = false;

  container.classList.add('active'); // 페이지 전체에서 항상 켜짐

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) {
      // 첫 움직임 순간엔 원들을 그 위치로 즉시 스냅 — 화면 구석에서 날아오는 것 방지
      particles.forEach((p) => { p.x = mouseX; p.y = mouseY; });
    }
    hasMoved = true;
  });

  function animate() {
    if (hasMoved) {
      particles.forEach((p) => {
        p.x += (mouseX - p.x) * p.lag;
        p.y += (mouseY - p.y) * p.lag;
        p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
      });
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();