// -----------------------------
// 데이터: 띠별 정보
// -----------------------------
const ZODIACS = [
  { key: 'rat', ko: '쥐띠', emoji: '🐭', years: [1960, 1972, 1984, 1996, 2008, 2020] },
  { key: 'ox', ko: '소띠', emoji: '🐮', years: [1961, 1973, 1985, 1997, 2009, 2021] },
  { key: 'tiger', ko: '호랑이띠', emoji: '🐯', years: [1962, 1974, 1986, 1998, 2010, 2022] },
  { key: 'rabbit', ko: '토끼띠', emoji: '🐰', years: [1963, 1975, 1987, 1999, 2011, 2023] },
  { key: 'dragon', ko: '용띠', emoji: '🐲', years: [1964, 1976, 1988, 2000, 2012, 2024] },
  { key: 'snake', ko: '뱀띠', emoji: '🐍', years: [1965, 1977, 1989, 2001, 2013, 2025] },
  { key: 'horse', ko: '말띠', emoji: '🐴', years: [1966, 1978, 1990, 2002, 2014, 2026] },
  { key: 'goat', ko: '양띠', emoji: '🐑', years: [1967, 1979, 1991, 2003, 2015, 2027] },
  { key: 'monkey', ko: '원숭이띠', emoji: '🐒', years: [1968, 1980, 1992, 2004, 2016, 2028] },
  { key: 'rooster', ko: '닭띠', emoji: '🐔', years: [1969, 1981, 1993, 2005, 2017, 2029] },
  { key: 'dog', ko: '개띠', emoji: '🐕', years: [1970, 1982, 1994, 2006, 2018, 2030] },
  { key: 'pig', ko: '돼지띠', emoji: '🐷', years: [1971, 1983, 1995, 2007, 2019, 2031] }
];

// 기본 데이터 (JSON 로드 실패 시 사용)
let ZODIAC_DATA = {
  zodiacs: ZODIACS.map(zodiac => ({
    ...zodiac,
    fortunes: [
      "오늘은 새로운 시작에 좋은 날입니다. 당신의 기지와 순발력이 빛을 발할 때입니다.",
      "재치 있는 대화로 주변 사람들의 관심을 끌 수 있는 하루입니다.",
      "경제적 감각이 예리해지는 날로, 투자나 재정 관리에 유리합니다.",
      "가족과의 소통이 특히 중요한 하루입니다. 따뜻한 마음으로 대화해보세요.",
      "창의적인 아이디어가 떠오르는 날입니다. 메모해두면 나중에 도움이 될 것입니다.",
      "건강에 특별히 신경 쓰는 것이 좋겠습니다. 적절한 운동과 휴식을 취하세요.",
      "새로운 사람을 만날 수 있는 기회가 있는 날입니다. 긍정적인 마음가짐을 유지하세요.",
      "학습이나 자기계발에 좋은 날입니다. 새로운 기술을 배우기에 적합합니다.",
      "직장에서 인정받을 수 있는 기회가 있는 날입니다. 자신감을 가지고 임무를 수행하세요.",
      "여행이나 새로운 경험을 통해 행운을 얻을 수 있는 날입니다.",
      "예술적 감각이 높아지는 날로, 창작 활동에 좋은 영감을 얻을 수 있습니다.",
      "인간관계에서 조화를 이루는 것이 중요한 하루입니다. 양보와 이해심을 발휘하세요."
    ],
    tips: [
      "작은 성취부터 시작해보세요. 당신의 끈기가 큰 성공을 만들어낼 것입니다.",
      "새로운 도전을 두려워하지 마세요. 당신의 적응력이 모든 것을 해결해줄 것입니다.",
      "가족과의 시간을 소중히 여기세요. 따뜻한 마음이 가장 큰 행복입니다.",
      "경제적 계획을 세워보세요. 현실적인 판단력이 도움이 될 것입니다.",
      "건강한 습관을 만들어보세요. 작은 노력이 큰 변화를 만들어낼 것입니다."
    ]
  })),
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
async function loadZodiacData() {
  try {
    // CDN URL 설정 (환경에 따라 변경)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const CDN_BASE_URL = isLocal
      ? './' // 로컬 개발 시
      : 'https://cdn.jsdelivr.net/gh/verylore/blog/dist/zodiac/'; // 배포 시
    
    let jsonFileName = 'zodiac-data.json';
    
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
          
          // 3단계: manifest-{hash}.json 로드
          const manifestResponse = await fetch(CDN_BASE_URL + manifestFileName);
          
          if (manifestResponse.ok) {
            const manifest = await manifestResponse.json();
            jsonFileName = manifest[jsonFileName];
            
            console.log('최신 JSON 파일:', jsonFileName);
          }
        }
      }
    } catch (error) {
      console.warn('빌드 정보 로드 실패, 기본 파일명 사용:', error);
    }
    
    // 최종 JSON 파일 로드
    const response = await fetch(CDN_BASE_URL + jsonFileName);
    if (response.ok) {
      const data = await response.json();
      ZODIAC_DATA = data;
      console.log('띠별운세 데이터 로드 성공');
    } else {
      console.warn('띠별운세 데이터 로드 실패, 기본 데이터 사용');
    }
  } catch (error) {
    console.warn('띠별운세 데이터 로드 오류, 기본 데이터 사용:', error);
  }
}

// -----------------------------
// 유틸리티 함수
// -----------------------------

// 랜덤 선택 함수
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 시드 기반 랜덤 함수
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 날짜 기반 시드 생성
function getDateSeed(date = new Date()) {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return dateStr.split('-').reduce((acc, val) => acc + parseInt(val), 0);
}

// -----------------------------
// DOM 요소
// -----------------------------
const zodiacGrid = document.getElementById('zodiac-grid');
const yearSelection = document.getElementById('year-selection');
const yearGrid = document.getElementById('year-grid');
const resultCard = document.getElementById('result-card');

// 결과 요소들
const resIco = document.getElementById('res-ico');
const resTitle = document.getElementById('res-title');
const resYear = document.getElementById('res-year');
const resDate = document.getElementById('res-date');
const resMeter = document.getElementById('res-meter');
const resColorChip = document.getElementById('res-color-chip');
const resColorText = document.getElementById('res-color-text');
const resNumber = document.getElementById('res-number');
const resFortune = document.getElementById('res-fortune');
const resTip = document.getElementById('res-tip');

// 버튼들
const btnShare = document.getElementById('btn-share');
const btnCopyColor = document.getElementById('btn-copy-color');

// -----------------------------
// 상태 관리
// -----------------------------
let selectedZodiac = null;
let selectedYear = null;

// -----------------------------
// UI 렌더링 함수
// -----------------------------

// 띠별 그리드 렌더링
function renderZodiacGrid() {
  zodiacGrid.innerHTML = ZODIAC_DATA.zodiacs.map(zodiac => `
    <div class="zodiac-card" data-zodiac="${zodiac.key}">
      <div class="zodiac-emoji">${zodiac.emoji}</div>
      <div class="zodiac-name">${zodiac.ko}</div>
      <div class="zodiac-years">${zodiac.years.join(', ')}</div>
    </div>
  `).join('');

  // 이벤트 리스너 추가
  zodiacGrid.querySelectorAll('.zodiac-card').forEach(card => {
    card.addEventListener('click', () => selectZodiac(card.dataset.zodiac));
  });
}

// 생년월일 그리드 렌더링
function renderYearGrid(zodiac) {
  yearGrid.innerHTML = zodiac.years.map(year => `
    <div class="year-card" data-year="${year}">
      <div class="year-text">${year}년</div>
    </div>
  `).join('');

  // 이벤트 리스너 추가
  yearGrid.querySelectorAll('.year-card').forEach(card => {
    card.addEventListener('click', () => selectYear(parseInt(card.dataset.year)));
  });
}

// 띠별 선택
function selectZodiac(zodiacKey) {
  // 이전 선택 해제
  zodiacGrid.querySelectorAll('.zodiac-card').forEach(card => {
    card.classList.remove('selected');
  });

  // 새 선택 표시
  const selectedCard = zodiacGrid.querySelector(`[data-zodiac="${zodiacKey}"]`);
  selectedCard.classList.add('selected');

  selectedZodiac = ZODIAC_DATA.zodiacs.find(z => z.key === zodiacKey);
  
  // 생년월일 선택 화면 표시
  yearSelection.hidden = false;
  renderYearGrid(selectedZodiac);
  
  // 결과 카드 숨기기
  resultCard.hidden = true;
}

// 생년월일 선택
function selectYear(year) {
  // 이전 선택 해제
  yearGrid.querySelectorAll('.year-card').forEach(card => {
    card.classList.remove('selected');
  });

  // 새 선택 표시
  const selectedCard = yearGrid.querySelector(`[data-year="${year}"]`);
  selectedCard.classList.add('selected');

  selectedYear = year;
  
  // 운세 결과 표시
  showFortune();
}

// 운세 결과 표시
function showFortune() {
  if (!selectedZodiac || !selectedYear) return;

  const today = new Date();
  const dateSeed = getDateSeed(today);
  const zodiacSeed = selectedZodiac.key.charCodeAt(0) + selectedYear;
  const totalSeed = dateSeed + zodiacSeed;

  // 운세 선택
  const fortuneIndex = Math.floor(seededRandom(totalSeed) * selectedZodiac.fortunes.length);
  const tipIndex = Math.floor(seededRandom(totalSeed + 1) * selectedZodiac.tips.length);
  
  // 색상 선택
  const colorIndex = Math.floor(seededRandom(totalSeed + 2) * ZODIAC_DATA.colors.length);
  const selectedColor = ZODIAC_DATA.colors[colorIndex];
  
  // 럭키 넘버 (1-9)
  const luckyNumber = Math.floor(seededRandom(totalSeed + 3) * 9) + 1;
  
  // 운세 점수 (60-95)
  const fortuneScore = Math.floor(seededRandom(totalSeed + 4) * 36) + 60;

  // UI 업데이트
  resIco.textContent = selectedZodiac.emoji;
  resTitle.textContent = selectedZodiac.ko;
  resYear.textContent = `${selectedYear}년생`;
  resDate.textContent = today.toISOString().split('T')[0];
  
  // 미터 업데이트
  const deg = (fortuneScore / 100) * 360;
  resMeter.style.setProperty('--deg', `${deg}deg`);
  resMeter.setAttribute('data-val', fortuneScore);
  
  // 색상 업데이트
  resColorChip.style.background = selectedColor.hex;
  resColorText.textContent = selectedColor.name;
  
  // 럭키 넘버
  resNumber.textContent = luckyNumber;
  
  // 운세 내용
  resFortune.textContent = selectedZodiac.fortunes[fortuneIndex];
  resTip.textContent = selectedZodiac.tips[tipIndex];

  // 결과 카드 표시
  resultCard.hidden = false;
  
  // 스크롤
  resultCard.scrollIntoView({ behavior: 'smooth' });
}

// -----------------------------
// 이벤트 핸들러
// -----------------------------

// 공유
btnShare.addEventListener('click', async () => {
  if (!selectedZodiac || !selectedYear) return;

  const shareText = `오늘의 ${selectedZodiac.ko} 운세 (${selectedYear}년생)\n${resFortune.textContent}\n\n행운을 가져다주는 색 : ${resColorText.textContent}\n행운의 숫자: ${resNumber.textContent}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: '띠별운세',
        text: shareText,
        url: window.location.href
      });
    } catch (error) {
      console.log('공유 취소됨');
    }
  } else {
    // 폴백: 클립보드 복사
    try {
      await navigator.clipboard.writeText(shareText);
      alert('운세가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
    }
  }
});

// 행운을 가져다주는 색  복사
btnCopyColor.addEventListener('click', async () => {
  const colorHex = resColorChip.style.background;
  try {
    await navigator.clipboard.writeText(colorHex);
    alert('행운을 가져다주는 색 가 클립보드에 복사되었습니다!');
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
  }
});

// -----------------------------
// 초기화
// -----------------------------

// 푸터 연도 업데이트
document.getElementById('year').textContent = new Date().getFullYear();

// 데이터 로드 후 UI 초기화
async function init() {
  await loadZodiacData();
  renderZodiacGrid();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
