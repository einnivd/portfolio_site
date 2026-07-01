/* ════════════════════════════════════
   01_hero.js — 히어로 아치 줌인 + About 섹션 진입 애니메이션
   hero-wrap = 300vh
   phase1 (0~100vh): 홀로그램 흐름만 (정적)
   phase2 (100~250vh): arch + text가 scale up, text는 fade out
   phase3 (250vh~): content-wrap이 올라와 덮음

   ※ About 섹션의 fade-in/slide-out 로직이 이 파일 안(updateHeroZoom)에
     함께 들어있는 이유: 히어로가 사라지는 것과 About이 그 자리에서
     등장하는 것이 스크롤 값(p2) 하나로 묶인 단일 연속 트랜지션이기
     때문입니다. 두 파일로 쪼개면 같은 scrollY/p2 계산을 중복하거나
     전역 변수로 공유해야 해서 오히려 더 꼬입니다.
   ════════════════════════════════════ */

// 문 중심 좌표 — scroll=0(확대 전) 상태에서 딱 한 번만 계산해서 캐싱
// (매 프레임 getBoundingClientRect 호출은 강제 리플로우를 유발해 그림자 애니메이션을 멈추게 함)
let _archOriginCache = null;
function getArchOrigin(heroZoomWrap) {
  if (_archOriginCache) return _archOriginCache;
  const archEl = document.querySelector('.arch-frame');
  if (!archEl) return '50% 50%';
  const rect = archEl.getBoundingClientRect();
  const wrapRect = heroZoomWrap.getBoundingClientRect();
  const centerX = ((rect.left + rect.width / 2) - wrapRect.left) / wrapRect.width * 100;
  const centerY = ((rect.top + rect.height / 2) - wrapRect.top) / wrapRect.height * 100;
  _archOriginCache = `${centerX}% ${centerY}%`;
  return _archOriginCache;
}
window.addEventListener('resize', () => { _archOriginCache = null; });

function updateHeroZoom() {
  const viewH = window.innerHeight;
  const scrollY = window.scrollY;

  // phase2 진행도: 0~1
  // ※ p2End는 js/main.js의 About 이동 스크롤 목표(targetY)와 반드시 같은 값이어야 함
  //   (다르면 About 버튼 클릭 시 히어로가 다 사라지기 전 어중간한 지점에서 멈춰
  //    투명도가 남아있는 상태로 보임)
  const p2Start = viewH;
  const p2End   = viewH * 2.6; /* 2.3 → 2.6: 구간을 늘려 확대→About 전환을 더 천천히 */
  const p2 = Math.max(0, Math.min(1, (scrollY - p2Start) / (p2End - p2Start)));

  const heroZoomWrap = document.getElementById('hero-zoom-wrap');
  const archContent  = document.querySelector('.arch-content');
  const heroSticky   = document.getElementById('hero-sticky');
  const navLinks     = document.getElementById('nav-menu');

  if (heroZoomWrap) {
    // transform-origin은 캐싱된 값 사용 — 매 프레임 재계산하지 않음
    heroZoomWrap.style.transformOrigin = getArchOrigin(heroZoomWrap);
    // scale: 1 → 4 — 벽/바닥/문/텍스트 전체가 문을 중심으로 함께 확대
    const scale = 1 + p2 * 3;
    heroZoomWrap.style.transform = `scale(${scale})`;
  }

  if (archContent) {
    // text: 0.4 이후 fadeout
    const textOpacity = p2 < 0.4 ? 1 : Math.max(0, 1 - (p2 - 0.4) * 2.2);
    archContent.style.opacity = textOpacity;
  }

  if (heroSticky) {
    // 히어로 전체(문+텍스트) 페이드아웃 — 0.6 이후 시작
    const heroOpacity = p2 < 0.6 ? 1 : Math.max(0, 1 - (p2 - 0.6) * 2.5);
    heroSticky.style.opacity = heroOpacity;
    // 거의 다 사라지면 pointer-events도 끊어서 스크롤/클릭 간섭 방지
    heroSticky.style.pointerEvents = heroOpacity < 0.05 ? 'none' : 'auto';
  }

  // About 섹션 — 히어로가 사라지는 타이밍에 맞춰 그 자리에서 페이드인
  const aboutMag = document.querySelector('.about-mag');
  if (aboutMag) {
    const aboutOpacity = p2 < 0.5 ? 0 : Math.min(1, (p2 - 0.5) * 2.5);
    aboutMag.style.opacity = aboutOpacity;
    aboutMag.classList.toggle('active', aboutOpacity > 0.05);
  }

  // 상단 메뉴바 전체 — about 페이드인과 동시에 등장
  const nav = document.getElementById('nav');
  if (nav) {
    nav.classList.toggle('visible', p2 > 0.5);
  }
  if (navLinks) {
    navLinks.classList.toggle('visible', p2 > 0.5);
  }

  // hero-wrap(300vh) 끝(=fade-in 완료 시점) + about-spacer(60vh) 만큼만 정지 후 슬라이드 아웃
  const heroWrapH   = viewH * 3;       // hero-wrap height:300vh
  const pauseEnd    = heroWrapH + viewH * 0.6;  // about-spacer height:60vh 끝나는 지점
  const slideOutLen = viewH * 0.8;     // 0.8 viewport 동안 위로 슬라이드 아웃
  if (aboutMag) {
    if (scrollY <= pauseEnd) {
      aboutMag.style.transform = 'translateY(0)';
    } else {
      const slideProgress = Math.min(1, (scrollY - pauseEnd) / slideOutLen);
      aboutMag.style.transform = `translateY(-${slideProgress * 100}vh)`;
    }
  }
}

// ── HERO NAME FIT ──
function fitHeroName() {
  const canvas = document.querySelector('.hero-canvas-body');
  const name   = document.querySelector('.hero-name-fill');
  if (!canvas || !name) return;
  const target = canvas.clientWidth * 0.97;
  let size = 300;
  name.style.fontSize = size + 'px';
  while (name.scrollWidth > target && size > 10) { size -= 1; name.style.fontSize = size + 'px'; }
  while (name.scrollWidth < target && size < 800) { size += 1; name.style.fontSize = size + 'px'; }
}
window.addEventListener('resize', fitHeroName);