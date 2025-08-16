// -----------------------------
// 데이터: 별자리/문구 풀
// -----------------------------
const SIGNS = [
  { key:'aries',      ko:'양자리', ico:'♈', period:'3.21~4.19' },
  { key:'taurus',     ko:'황소자리', ico:'♉', period:'4.20~5.20' },
  { key:'gemini',     ko:'쌍둥이자리', ico:'♊', period:'5.21~6.21' },
  { key:'cancer',     ko:'게자리', ico:'♋', period:'6.22~7.22' },
  { key:'leo',        ko:'사자자리', ico:'♌', period:'7.23~8.22' },
  { key:'virgo',      ko:'처녀자리', ico:'♍', period:'8.23~9.22' },
  { key:'libra',      ko:'천칭자리', ico:'♎', period:'9.23~10.22' },
  { key:'scorpio',    ko:'전갈자리', ico:'♏', period:'10.23~11.22' },
  { key:'sagittarius',ko:'사수자리', ico:'♐', period:'11.23~12.21' },
  { key:'capricorn',  ko:'염소자리', ico:'♑', period:'12.22~1.19' },
  { key:'aquarius',   ko:'물병자리', ico:'♒', period:'1.20~2.18' },
  { key:'pisces',     ko:'물고기자리', ico:'♓', period:'2.19~3.20' },
];

// JSON 데이터를 로드하는 변수 (기본 데이터로 초기화)
let POOL = {
  love: [
    "마음의 여유가 대화를 부드럽게 만듭니다.",
    "기대치보다 솔직함이 더 큰 힘을 발휘합니다.",
    "우연한 메시지가 좋은 신호가 됩니다.",
    "관심 표현은 작게, 그러나 분명하게.",
    "그린라이트는 디테일에 숨어 있습니다."
  ],
  work: [
    "우선순위를 명확히 하면 속도가 붙습니다.",
    "작은 성과를 기록으로 남기면 협업이 유리합니다.",
    "회의 전 메모 5줄이 결과를 바꿉니다.",
    "새로운 도구를 시험해 볼 가치가 있습니다.",
    "집중 시간대에 핵심 업무를 배치하세요."
  ],
  money: [
    "충동구매 대신 찜 목록으로 시간을 벌어보세요.",
    "낡은 구독 하나를 정리할 때입니다.",
    "작은 절약이 큰 선택의 자유를 만듭니다.",
    "가격이 아닌 사용 빈도를 기준으로 판단하세요.",
    "현금흐름 캘린더를 점검하면 마음이 가벼워집니다."
  ],
  health: [
    "수분 섭취와 가벼운 스트레칭으로 리듬을 되찾습니다.",
    "저녁엔 화면 밝기를 낮춰 휴식을 준비하세요.",
    "가벼운 산책이 생각을 정리해 줍니다.",
    "허리를 곧게, 어깨의 긴장을 풀어주세요.",
    "음식 기록이 컨디션의 힌트를 줍니다."
  ],
  tips: [
    "작게 시작하면 마음이 움직입니다.",
    "오전에 중요한 연락을 먼저 시도하세요.",
    "정리한 책상에서 좋은 아이디어가 나옵니다.",
    "잠깐의 휴식이 긴 집중을 만듭니다.",
    "감사의 한마디가 상황을 바꿉니다."
  ],
  colors: [
    { hex: '#25D0A9', name: '터쿠아즈' },
    { hex: '#7C8CFF', name: '라벤더 블루' },
    { hex: '#FFB84D', name: '골든 옐로우' },
    { hex: '#FF6B6B', name: '코랄 핑크' },
    { hex: '#6B8CFF', name: '스카이 블루' },
    { hex: '#9B59B6', name: '퍼플' },
    { hex: '#2ECC71', name: '에메랄드 그린' },
    { hex: '#E67E22', name: '오렌지' },
    { hex: '#1ABC9C', name: '민트 그린' },
    { hex: '#F39C12', name: '앰버' },
    { hex: '#E84393', name: '로즈 핑크' },
    { hex: '#00BCD4', name: '아쿠아 블루' }
  ]
};

// JSON 데이터 로드 함수
async function loadFortuneData() {
  try {
    // CDN URL 설정 (환경에 따라 변경)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const CDN_BASE_URL = isLocal
      ? './' // 로컬 개발 시
      : 'https://cdn.jsdelivr.net/gh/verylore/blog/dist/constellation/'; // 배포 시
    
    let jsonFileName = 'horoscope-data.json';
    
    // build-timestamp.txt에서 최신 타임스탬프를 가져와서 build-{timestamp}.json 로드
    try {
      // 1단계: build-timestamp.txt에서 최신 빌드 타임스탬프 확인
      const timestampResponse = await fetch(CDN_BASE_URL + 'build-timestamp.txt');
      
      if (timestampResponse.ok) {
        const buildTimestamp = await timestampResponse.text();
        const buildFileName = `build-${buildTimestamp.trim()}.json`;
        
        console.log('최신 빌드 파일:', buildFileName);
        
        // 2단계: build-{timestamp}.json 로드 (타임스탬프가 달라서 캐시 무효화됨)
        const buildResponse = await fetch(CDN_BASE_URL + buildFileName);
        
        if (buildResponse.ok) {
          const buildInfo = await buildResponse.json();
          const manifestFileName = buildInfo.manifest;
          
          // 3단계: manifest-{hash}.json 로드 (해시 포함이므로 캐시 무효화됨)
          const manifestResponse = await fetch(CDN_BASE_URL + manifestFileName);
          
          if (manifestResponse.ok) {
            const manifest = await manifestResponse.json();
            jsonFileName = manifest['horoscope-data.json'] || jsonFileName;
            console.log('빌드 정보 로드 성공:', {
              buildFile: buildFileName,
              manifest: manifestFileName,
              version: buildInfo.version,
              timestamp: new Date(buildInfo.timestamp).toLocaleString(),
              jsonFile: jsonFileName
            });
          } else {
            console.warn('매니페스트 파일 로드 실패:', manifestResponse.status);
          }
        } else {
          console.warn('빌드 파일 로드 실패:', buildResponse.status);
        }
      } else {
        console.warn('빌드 타임스탬프 로드 실패, 기본 파일명 사용');
      }
    } catch (manifestError) {
      console.warn('매니페스트 로드 완전 실패, 기본 파일명 사용:', manifestError);
    }
    
    const response = await fetch(CDN_BASE_URL + jsonFileName);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // JSON 데이터로 업데이트 (기존 구조 유지하면서 확장)
    if (data.fortunes) {
      POOL.love = data.fortunes.love || POOL.love;
      POOL.work = data.fortunes.career || POOL.work; // career -> work 매핑
      POOL.money = data.fortunes.money || POOL.money;
      POOL.health = data.fortunes.health || POOL.health;
      POOL.tips = data.fortunes.general || POOL.tips; // general -> tips 매핑
    }
    if (data.moods) POOL.moods = data.moods;
    if (data.adjectives) POOL.adjectives = data.adjectives;
    
    console.log('운세 데이터 로드 완료 - 확장된 문구 수:', {
      love: POOL.love.length,
      work: POOL.work.length,
      money: POOL.money.length,
      health: POOL.health.length,
      tips: POOL.tips.length
    });
    
    return true;
  } catch (error) {
    console.warn('JSON 파일 로드 실패, 기본 데이터 사용:', error);
    return false;
  }
}

// -----------------------------
// 유틸: 날짜/시드/PRNG
// -----------------------------
const todayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
};

// 간단 해시 → 시드
function hashSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i=0;i<str.length;i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
// 시드 기반 PRNG (Mulberry32)
function prng(seed) {
  let t = seed >>> 0;
  return function() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ t >>> 15, 1 | t);
    r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
    return ((r ^ r >>> 14) >>> 0) / 4294967296;
  }
}
const pick = (rng, arr) => arr[Math.floor(rng()*arr.length)];
const clamp = (n,min,max) => Math.max(min, Math.min(max, n));

// -----------------------------
// 상태/스토리지
// -----------------------------
const STORAGE_KEY = 'horoscope.daily.v1';
function saveState(obj) { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }
function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'); }
  catch(e){ return null; }
}

// -----------------------------
// UI 빌드: 별자리 그리드
// -----------------------------
const signGrid = document.getElementById('sign-grid');
const resultCard = document.getElementById('result-card');
const resIco = document.getElementById('res-ico');
const resTitle = document.getElementById('res-title');
const resPeriod = document.getElementById('res-period');
const resDate = document.getElementById('res-date');
const resMeter = document.getElementById('res-meter');
const resColorChip = document.getElementById('res-color-chip');
const resColorText = document.getElementById('res-color-text');
const resNumber = document.getElementById('res-number');
const resLove = document.getElementById('res-love');
const resWork = document.getElementById('res-work');
const resMoney = document.getElementById('res-money');
const resHealth = document.getElementById('res-health');
const resTip = document.getElementById('res-tip');
const btnReroll = document.getElementById('btn-reroll');
const btnShare = document.getElementById('btn-share');
const btnCopyColor = document.getElementById('btn-copy-color');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

function buildGrid() {
  console.log('buildGrid 시작', signGrid);
  signGrid.innerHTML = '';
  SIGNS.forEach(s => {
    const card = document.createElement('button');
    card.className = 'card sign';
    card.setAttribute('aria-label', `${s.ko} 운세 보기`);
    card.innerHTML = `
      <div class="ico" aria-hidden="true">${s.ico}</div>
      <div class="nm">${s.ko}</div>
      <div class="dt">${s.period}</div>
    `;
    card.addEventListener('click', () => selectSign(s.key));
    signGrid.appendChild(card);
  });
  console.log('buildGrid 완료, 생성된 카드 수:', signGrid.children.length);
}

// -----------------------------
// 운세 생성 로직
// -----------------------------
function generate(signKey, variantOffset=0) {
  const date = todayStr();
  const seed = hashSeed(date + '|' + signKey) + variantOffset;
  const rng = prng(seed);

  // 전체 기조: 긍정/중립/주의 가중치
  const moodRoll = rng();
  const bias = moodRoll < 0.55 ? 'pos' : (moodRoll < 0.85 ? 'mid' : 'caut');

  // 종합점수(정규화)
  let base = Math.floor(rng()*100);
  if (bias==='pos') base = clamp(base+15, 52, 98);
  else if (bias==='caut') base = clamp(base-10, 25, 75);
  const luck = base;

  const love = pick(rng, POOL.love);
  const work = pick(rng, POOL.work);
  const money = pick(rng, POOL.money);
  const health = pick(rng, POOL.health);
  const tip = pick(rng, POOL.tips);
  const colorObj = pick(rng, POOL.colors);
  const number = 1 + Math.floor(rng()*9); // 1~9

  const sign = SIGNS.find(s => s.key===signKey);
  return {
    date, signKey, signKo: sign.ko, ico: sign.ico, period: sign.period,
    luck, colorHex: colorObj.hex, colorName: colorObj.name, number,
    love, work, money, health, tip
  };
}

function render(result) {
  resIco.textContent = result.ico;
  resTitle.textContent = result.signKo;
  resPeriod.textContent = result.period;
  resDate.textContent = result.date;

  resMeter.style.setProperty('--deg', `${Math.round(result.luck/100*360)}deg`);
  resMeter.setAttribute('data-val', result.luck);

  // 새로운 구조와 이전 구조 모두 지원
  if (result.colorHex && result.colorName) {
    resColorChip.style.background = result.colorHex;
    resColorText.textContent = result.colorName;
  } else if (result.color) {
    // 이전 구조 지원 (헥스코드만 있는 경우)
    resColorChip.style.background = result.color;
    resColorText.textContent = result.color;
  }
  resNumber.textContent = result.number;

  resLove.textContent = result.love;
  resWork.textContent = result.work;
  resMoney.textContent = result.money;
  resHealth.textContent = result.health;
  resTip.textContent = result.tip;

  resultCard.hidden = false;
}

let current = null;
let rerollOffset = 0;

function selectSign(signKey) {
  rerollOffset = 0;
  const result = generate(signKey, 0);
  current = result;
  saveState({ date: result.date, signKey, result });
  render(result);
}

btnReroll.addEventListener('click', () => {
  if (!current) return;
  rerollOffset += 101; // 다른 궤적으로 이동
  const result = generate(current.signKey, rerollOffset);
  current = result;
  saveState({ date: result.date, signKey: current.signKey, result });
  render(result);
});

btnShare.addEventListener('click', async () => {
  if (!current) return;
  const colorText = current.colorName || current.color || '미정';
  const text = `오늘의 ${current.signKo} 운세 (${current.date})\n총운 ${current.luck}점 · 럭키컬러 ${colorText} · 럭키넘버 ${current.number}\n한 줄 조언: ${current.tip}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: '오늘의 별자리 운세', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('공유 문구를 클립보드에 복사했습니다.');
    }
  } catch (e) {
    await navigator.clipboard.writeText(text);
    alert('공유 문구를 클립보드에 복사했습니다.');
  }
});

btnCopyColor.addEventListener('click', async () => {
  if (!current) return;
  try {
    let copyText;
    if (current.colorName && current.colorHex) {
      copyText = `${current.colorName} (${current.colorHex})`;
    } else if (current.color) {
      copyText = current.color;
    } else {
      copyText = '럭키컬러 정보 없음';
    }
    await navigator.clipboard.writeText(copyText);
    alert('럭키컬러가 복사되었습니다.');
  } catch(e) {
    alert('복사 권한이 거부되어 럭키컬러를 선택해 직접 복사하세요.');
  }
});

// 초기화: 저장된 오늘 운세가 있으면 복원
async function init() {
  console.log('초기화 시작');
  // JSON 데이터 로드 시도
  await loadFortuneData();
  
  console.log('그리드 생성 시작');
  buildGrid();
  const saved = loadState();
  const today = todayStr();
  if (saved && saved.date === today && saved.result) {
    current = saved.result;
    render(saved.result);
  }
  console.log('초기화 완료');
}

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded 이벤트 발생');
  init();
});

// 혹시 모를 경우를 대비해 바로 실행도 추가
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
