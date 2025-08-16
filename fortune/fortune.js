// -----------------------------
// 상수 및 설정
// -----------------------------
const STORAGE_KEY = 'fortune_today';

// 별자리 데이터 (월/일 기준)
const ZODIAC_SIGNS = [
  { name: '물병자리', emoji: '♒', start: [1, 20], end: [2, 18] },
  { name: '물고기자리', emoji: '♓', start: [2, 19], end: [3, 20] },
  { name: '양자리', emoji: '♈', start: [3, 21], end: [4, 19] },
  { name: '황소자리', emoji: '♉', start: [4, 20], end: [5, 20] },
  { name: '쌍둥이자리', emoji: '♊', start: [5, 21], end: [6, 21] },
  { name: '게자리', emoji: '♋', start: [6, 22], end: [7, 22] },
  { name: '사자자리', emoji: '♌', start: [7, 23], end: [8, 22] },
  { name: '처녀자리', emoji: '♍', start: [8, 23], end: [9, 22] },
  { name: '천칭자리', emoji: '♎', start: [9, 23], end: [10, 22] },
  { name: '전갈자리', emoji: '♏', start: [10, 23], end: [11, 22] },
  { name: '사수자리', emoji: '♐', start: [11, 23], end: [12, 21] },
  { name: '염소자리', emoji: '♑', start: [12, 22], end: [1, 19] }
];

// 띠 데이터 (12년 주기)
const CHINESE_ZODIAC = [
  { name: '쥐띠', emoji: '🐭', offset: 0 },
  { name: '소띠', emoji: '🐮', offset: 1 },
  { name: '호랑이띠', emoji: '🐯', offset: 2 },
  { name: '토끼띠', emoji: '🐰', offset: 3 },
  { name: '용띠', emoji: '🐲', offset: 4 },
  { name: '뱀띠', emoji: '🐍', offset: 5 },
  { name: '말띠', emoji: '🐴', offset: 6 },
  { name: '양띠', emoji: '🐑', offset: 7 },
  { name: '원숭이띠', emoji: '🐵', offset: 8 },
  { name: '닭띠', emoji: '🐔', offset: 9 },
  { name: '개띠', emoji: '🐶', offset: 10 },
  { name: '돼지띠', emoji: '🐷', offset: 11 }
];

// 운세 데이터 풀 (기본값)
let POOL = {
  overall: [
    "오늘은 전반적으로 균형잡힌 하루가 될 것입니다.",
    "새로운 기회와 도전이 찾아올 수 있는 날입니다.",
    "긍정적인 에너지가 흐르는 특별한 하루예요.",
    "안정적이면서도 활력이 넘치는 시간을 보낼 수 있습니다."
  ],
  love: [
    "새로운 만남이 당신을 기다리고 있습니다.",
    "연인과의 관계가 한층 더 깊어질 것입니다.",
    "과거의 인연이 다시 찾아올 수 있습니다.",
    "진실한 사랑을 발견하게 될 날입니다."
  ],
  money: [
    "예상치 못한 수입이 생길 수 있습니다.",
    "투자에 대한 좋은 소식이 있을 것입니다.",
    "절약하는 습관이 큰 도움이 될 것입니다.",
    "금전 관리에 신중함이 필요한 시기입니다."
  ],
  work: [
    "업무에서 좋은 성과를 거둘 수 있는 날입니다.",
    "새로운 기회가 당신 앞에 펼쳐질 것입니다.",
    "동료들과의 협력이 큰 힘이 될 것입니다.",
    "창의적인 아이디어가 떠오르는 하루입니다."
  ],
  study: [
    "학습 능력이 향상되는 시기입니다.",
    "새로운 지식을 흡수하기 좋은 날이에요.",
    "집중력이 높아져 효율적인 공부가 가능합니다.",
    "성적 향상의 기회가 찾아올 수 있어요."
  ],
  health: [
    "활력이 넘치는 하루가 될 것입니다.",
    "규칙적인 운동이 큰 도움이 될 것입니다.",
    "충분한 휴식을 취하는 것이 중요합니다.",
    "건강한 식습관을 유지하세요."
  ],
  tips: [
    "긍정적인 마음가짐이 행운을 불러올 것입니다.",
    "주변 사람들에게 감사한 마음을 표현해보세요.",
    "새로운 도전을 두려워하지 마세요.",
    "직감을 믿고 행동하는 것이 좋겠습니다."
  ],
  moods: ['활발함', '차분함', '열정적', '신중함', '유쾌함', '집중력', '창의적', '안정감'],
  adjectives: ['빛나는', '행복한', '평화로운', '역동적인', '따뜻한', '멋진', '특별한', '화려한']
};

// 시간대별 운세 보정
const TIME_MODIFIERS = {
  dawn: { name: '새벽', boost: 'health', desc: '새로운 시작' },
  morning: { name: '오전', boost: 'work', desc: '활동적 에너지' },
  noon: { name: '정오', boost: 'money', desc: '풍요로운 기운' },
  afternoon: { name: '오후', boost: 'love', desc: '따뜻한 감정' },
  evening: { name: '저녁', boost: 'study', desc: '학습과 성찰' },
  night: { name: '밤', boost: 'overall', desc: '내면의 지혜' }
};

// 성별별 운세 보정
const GENDER_MODIFIERS = {
  male: { overall: 1, love: 1, money: 1.05, work: 1.1, study: 1.05, health: 1 },
  female: { overall: 1, love: 1.1, money: 1, work: 1, study: 1, health: 1.05 }
};

// 달력 구분별 보정
const CALENDAR_MODIFIERS = {
  solar: { multiplier: 1, desc: '서구식 에너지' },
  lunar: { multiplier: 1.05, desc: '전통 운세력' },
  'lunar-leap': { multiplier: 1.1, desc: '특별한 운명력' }
};

// -----------------------------
// 유틸리티 함수들
// -----------------------------
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function randomFromArray(arr, seed) {
  const index = Math.floor(seededRandom(seed) * arr.length);
  return arr[index];
}

function randomNumber(min, max, seed) {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

// -----------------------------
// JSON 데이터 로드 함수
// -----------------------------
async function loadFortuneData() {
  try {
    // CDN URL 설정 (환경에 따라 변경)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const CDN_BASE_URL = isLocal
      ? './' // 로컬 개발 시
      : 'https://cdn.jsdelivr.net/gh/verylore/blog/dist/fortune/'; // 배포 시
    
    let jsonFileName = 'fortune-data.json';
    
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
            jsonFileName = manifest['fortune-data.json'] || jsonFileName;
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
      POOL.overall = data.fortunes.overall || POOL.overall;
      POOL.love = data.fortunes.love || POOL.love;
      POOL.money = data.fortunes.money || POOL.money;
      POOL.work = data.fortunes.work || POOL.work;
      POOL.study = data.fortunes.study || POOL.study;
      POOL.health = data.fortunes.health || POOL.health;
      POOL.tips = data.fortunes.general || POOL.tips;
    }
    if (data.moods) POOL.moods = data.moods;
    if (data.adjectives) POOL.adjectives = data.adjectives;
    
    console.log('운세 데이터 로드 완료 - 확장된 문구 수:', {
      overall: POOL.overall.length,
      love: POOL.love.length,
      money: POOL.money.length,
      work: POOL.work.length,
      study: POOL.study.length,
      health: POOL.health.length,
      tips: POOL.tips.length
    });
    
    console.log('총운 데이터 샘플:', POOL.overall[0]);
    console.log('학업운 데이터 샘플:', POOL.study[0]);
    
    return true;
  } catch (error) {
    console.warn('JSON 파일 로드 실패, 기본 데이터 사용:', error);
    return false;
  }
}

// -----------------------------
// 운세 생성 로직
// -----------------------------
function generateFortune(userInfo) {
  const today = new Date().toISOString().split('T')[0];
  const seedBase = `${userInfo.gender}-${userInfo.calendar}-${userInfo.birthYear}-${userInfo.birthMonth}-${userInfo.birthDay}-${userInfo.birthHour || 'unknown'}-${today}`;
  const hash = hashString(seedBase);
  
  // 기본 운세 점수 생성 (30-95점)
  const baseScore = randomNumber(30, 95, hash);
  
  // 성별 보정
  const genderMod = GENDER_MODIFIERS[userInfo.gender] || GENDER_MODIFIERS.male;
  
  // 달력 구분 보정
  const calendarMod = CALENDAR_MODIFIERS[userInfo.calendar] || CALENDAR_MODIFIERS.solar;
  
  // 시간대 보정
  let timeBoost = null;
  if (userInfo.birthHour !== '') {
    const timeOfDay = getTimeOfDay(parseInt(userInfo.birthHour));
    timeBoost = TIME_MODIFIERS[timeOfDay];
  }
  
  // 생년으로 개인 특성 결정
  const birthYearLast = parseInt(userInfo.birthYear) % 10;
  const personalityBoost = birthYearLast % 4; // 0-3
  
  // 각 카테고리별 점수 계산
  const scores = {
    overall: Math.min(95, Math.round(baseScore * genderMod.overall * calendarMod.multiplier + personalityBoost)),
    love: Math.min(95, Math.round(baseScore * genderMod.love * calendarMod.multiplier + personalityBoost)),
    money: Math.min(95, Math.round(baseScore * genderMod.money * calendarMod.multiplier + personalityBoost)),
    work: Math.min(95, Math.round(baseScore * genderMod.work * calendarMod.multiplier + personalityBoost)),
    study: Math.min(95, Math.round(baseScore * genderMod.study * calendarMod.multiplier + personalityBoost)),
    health: Math.min(95, Math.round(baseScore * genderMod.health * calendarMod.multiplier + personalityBoost))
  };
  
  // 시간대 보정 적용
  if (timeBoost && scores[timeBoost.boost]) {
    scores[timeBoost.boost] = Math.min(95, scores[timeBoost.boost] + 5);
  }
  
  // 전체 평균 점수
  const avgScore = Math.round((scores.overall + scores.love + scores.money + scores.work + scores.study + scores.health) / 6);
  
  // 운세 텍스트 선택
  const fortuneTexts = {
    overall: randomFromArray(POOL.overall, hash + 1),
    love: randomFromArray(POOL.love, hash + 2),
    money: randomFromArray(POOL.money, hash + 3),
    work: randomFromArray(POOL.work, hash + 4),
    study: randomFromArray(POOL.study, hash + 5),
    health: randomFromArray(POOL.health, hash + 6),
    tip: randomFromArray(POOL.tips, hash + 7)
  };
  
  // 기분과 형용사
  const mood = randomFromArray(POOL.moods, hash + 10);
  const adjective = randomFromArray(POOL.adjectives, hash + 11);
  
  return {
    userInfo,
    totalScore: avgScore,
    scores,
    fortunes: fortuneTexts,
    mood,
    adjective,
    timeBoost,
    calendarInfo: calendarMod,
    date: today
  };
}

// -----------------------------
// 상태 저장/로드
// -----------------------------
function saveState(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { /* 무시 */ }
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch (e) { 
    return null; 
  }
}

// 별자리 계산 함수
function getZodiacSign(month, day) {
  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    
    // 염소자리 특별 처리 (12월 22일 ~ 1월 19일)
    if (sign.name === '염소자리') {
      if ((month === 12 && day >= startDay) || (month === 1 && day <= endDay)) {
        return sign;
      }
    } else {
      // 일반적인 경우
      if (month === startMonth && day >= startDay) {
        return sign;
      }
      if (month === endMonth && day <= endDay) {
        return sign;
      }
    }
  }
  
  // 기본값 (오류 시)
  return ZODIAC_SIGNS[0];
}

// 띠 계산 함수 (1900년 = 쥐띠 기준)
function getChineseZodiac(year) {
  // 1900년이 쥐띠(offset: 0)
  const baseYear = 1900;
  const yearOffset = (year - baseYear) % 12;
  return CHINESE_ZODIAC[yearOffset];
}



// -----------------------------
// UI 요소들
// -----------------------------
const headerTitleEl = document.getElementById('header-title');
const inputSection = document.getElementById('input-section');
const resultCard = document.getElementById('result-card');

// 폼 요소들
const genderInputs = document.querySelectorAll('input[name="gender"]');
const calendarInputs = document.querySelectorAll('input[name="calendar"]');
const birthYearSelect = document.getElementById('birth-year');
const birthMonthSelect = document.getElementById('birth-month');
const birthDaySelect = document.getElementById('birth-day');
const birthHourSelect = document.getElementById('birth-hour');
const birthMinuteSelect = document.getElementById('birth-minute');
const checkFortuneBtn = document.getElementById('check-fortune-btn');

// 결과 요소들
const resIco = document.getElementById('res-ico');
const resTitle = document.getElementById('res-title');
const resInfo = document.getElementById('res-info');
const resDate = document.getElementById('res-date');
const resMeter = document.getElementById('res-meter');

const resOverall = document.getElementById('res-overall');
const resLove = document.getElementById('res-love');
const resMoney = document.getElementById('res-money');
const resWork = document.getElementById('res-work');
const resStudy = document.getElementById('res-study');
const resHealth = document.getElementById('res-health');
const zodiacEmoji = document.getElementById('zodiac-emoji');
const zodiacName = document.getElementById('zodiac-name');
const chineseZodiacEmoji = document.getElementById('chinese-zodiac-emoji');
const chineseZodiacName = document.getElementById('chinese-zodiac-name');

// 탭 관련 요소들
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// 탭 전환 기능
function switchTab(targetTab) {
  // 모든 탭 버튼과 패널에서 active 클래스 제거
  tabBtns.forEach(btn => btn.classList.remove('active'));
  tabPanes.forEach(pane => pane.classList.remove('active'));
  
  // 선택된 탭 버튼과 패널에 active 클래스 추가
  const activeBtn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
  const activePane = document.getElementById(`tab-${targetTab}`);
  
  if (activeBtn && activePane) {
    activeBtn.classList.add('active');
    activePane.classList.add('active');
  }
}

// 탭 버튼 클릭 이벤트 리스너
tabBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetTab = e.currentTarget.getAttribute('data-tab');
    switchTab(targetTab);
  });
});

const btnShare = document.getElementById('btn-share');
const yearEl = document.getElementById('year');

// -----------------------------
// 초기화
// -----------------------------
function init() {
  console.log('Fortune app 초기화 시작');
  
  // 연도 설정
  yearEl.textContent = new Date().getFullYear();
  
  // 헤더 날짜 업데이트
  updateHeaderTitle();
  
  // 폼 옵션 생성
  populateFormOptions();
  
  // 이벤트 리스너 등록
  setupEventListeners();
  
  // 저장된 상태 확인
  const saved = loadState();
  if (saved && saved.date === new Date().toISOString().split('T')[0]) {
    displayResult(saved);
  }
  
  console.log('Fortune app 초기화 완료');
}

// 헤더 날짜 업데이트
function updateHeaderTitle() {
  const today = new Date();
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  };
  const dateStr = today.toLocaleDateString('ko-KR', options);
  headerTitleEl.textContent = `${dateStr} 오늘의 운세`;
}

// 폼 옵션 생성
function populateFormOptions() {
  // 연도 옵션 (1950 - 2010)
  const currentYear = new Date().getFullYear();
  for (let year = currentYear - 15; year >= 1950; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = `${year}년`;
    birthYearSelect.appendChild(option);
  }
  
  // 월 옵션
  for (let month = 1; month <= 12; month++) {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = `${month}월`;
    birthMonthSelect.appendChild(option);
  }
  
  // 일 옵션
  for (let day = 1; day <= 31; day++) {
    const option = document.createElement('option');
    option.value = day;
    option.textContent = `${day}일`;
    birthDaySelect.appendChild(option);
  }
  
  // 시간 옵션
  for (let hour = 0; hour < 24; hour++) {
    const option = document.createElement('option');
    option.value = hour;
    option.textContent = `${hour.toString().padStart(2, '0')}시`;
    birthHourSelect.appendChild(option);
  }
  
  // 분 옵션
  for (let minute = 0; minute < 60; minute += 5) {
    const option = document.createElement('option');
    option.value = minute;
    option.textContent = `${minute.toString().padStart(2, '0')}분`;
    birthMinuteSelect.appendChild(option);
  }
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 운세 확인 버튼
  checkFortuneBtn.addEventListener('click', handleFortuneCheck);
  
  // 공유하기 버튼
  btnShare.addEventListener('click', handleShare);
  
  // 월 변경 시 일 옵션 업데이트
  birthMonthSelect.addEventListener('change', updateDayOptions);
  birthYearSelect.addEventListener('change', updateDayOptions);
}

// 일 옵션 업데이트 (윤년 고려)
function updateDayOptions() {
  const year = parseInt(birthYearSelect.value);
  const month = parseInt(birthMonthSelect.value);
  
  if (!year || !month) return;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  const currentDay = parseInt(birthDaySelect.value);
  
  // 기존 옵션 제거 (첫 번째 옵션 제외)
  while (birthDaySelect.children.length > 1) {
    birthDaySelect.removeChild(birthDaySelect.lastChild);
  }
  
  // 새 옵션 추가
  for (let day = 1; day <= daysInMonth; day++) {
    const option = document.createElement('option');
    option.value = day;
    option.textContent = `${day}일`;
    birthDaySelect.appendChild(option);
  }
  
  // 기존 선택값 유지 (가능한 경우)
  if (currentDay && currentDay <= daysInMonth) {
    birthDaySelect.value = currentDay;
  }
}

// 운세 확인 처리
async function handleFortuneCheck() {
  const userInfo = collectUserInfo();
  
  if (!validateUserInfo(userInfo)) {
    alert('생년월일을 모두 입력해주세요.');
    return;
  }
  
  // 동일한 날짜와 사용자 정보에 대한 캐시된 결과 확인
  const today = new Date().toISOString().split('T')[0];
  const saved = loadState();
  
  if (saved && saved.date === today && 
      saved.userInfo.gender === userInfo.gender &&
      saved.userInfo.calendar === userInfo.calendar &&
      saved.userInfo.birthYear === userInfo.birthYear &&
      saved.userInfo.birthMonth === userInfo.birthMonth &&
      saved.userInfo.birthDay === userInfo.birthDay &&
      saved.userInfo.birthHour === userInfo.birthHour &&
      saved.userInfo.birthMinute === userInfo.birthMinute) {
    
    // 캐시된 결과 표시
    displayResult(saved);
    return;
  }
  
  // 버튼 비활성화
  checkFortuneBtn.disabled = true;
  checkFortuneBtn.textContent = '🔮 운세 확인 중...';
  
  try {
    // 데이터 로드
    await loadFortuneData();
    
    // 운세 생성
    const fortune = generateFortune(userInfo);
    
    // 결과 표시
    displayResult(fortune);
    
    // 상태 저장
    saveState(fortune);
    
  } catch (error) {
    console.error('운세 생성 중 오류:', error);
    alert('운세 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    // 버튼 복원
    checkFortuneBtn.disabled = false;
    checkFortuneBtn.textContent = '🔮 내 운세 확인하기';
  }
}

// 사용자 입력 수집
function collectUserInfo() {
  const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
  const calendar = document.querySelector('input[name="calendar"]:checked')?.value || 'solar';
  
  return {
    gender,
    calendar,
    birthYear: birthYearSelect.value,
    birthMonth: birthMonthSelect.value,
    birthDay: birthDaySelect.value,
    birthHour: birthHourSelect.value,
    birthMinute: birthMinuteSelect.value
  };
}

// 사용자 입력 검증
function validateUserInfo(userInfo) {
  return userInfo.birthYear && userInfo.birthMonth && userInfo.birthDay;
}

// 결과 표시
function displayResult(fortune) {
  // 결과 카드 표시 (애니메이션 재시작을 위해 약간의 지연)
  resultCard.hidden = false;
  // 애니메이션 재시작을 위해 클래스 재적용
  resultCard.style.animation = 'none';
  setTimeout(() => {
    resultCard.style.animation = 'slideInUp 0.6s ease-out';
  }, 10);
  
  // 기본 정보
  resIco.textContent = '🔮';
  
  // 제목 구성
  const genderText = fortune.userInfo.gender === 'male' ? '남성' : '여성';
  const calendarText = {
    'solar': '양력',
    'lunar': '음력(평달)',
    'lunar-leap': '음력(윤달)'
  }[fortune.userInfo.calendar] || '양력';
  
  resTitle.textContent = `${genderText} • ${fortune.userInfo.birthYear}년 ${fortune.userInfo.birthMonth}월 ${fortune.userInfo.birthDay}일`;
  resInfo.textContent = `${calendarText} • ${fortune.calendarInfo.desc}`;
  resDate.textContent = new Date().toLocaleDateString('ko-KR');
  
  // 총점 미터
  const degree = Math.round((fortune.totalScore / 100) * 360);
  resMeter.style.setProperty('--deg', `${degree}deg`);
  resMeter.setAttribute('data-val', fortune.totalScore);
  

  
  // 운세 내용
  console.log('운세 결과 데이터:', fortune.fortunes);
  resOverall.textContent = fortune.fortunes.overall;
  resLove.textContent = fortune.fortunes.love;
  resMoney.textContent = fortune.fortunes.money;
  resWork.textContent = fortune.fortunes.work;
  resStudy.textContent = fortune.fortunes.study;
  resHealth.textContent = fortune.fortunes.health;
  
  // 별자리와 띠 정보 업데이트
  const zodiacSign = getZodiacSign(fortune.userInfo.birthMonth, fortune.userInfo.birthDay);
  const chineseZodiac = getChineseZodiac(fortune.userInfo.birthYear);
  
  zodiacEmoji.textContent = zodiacSign.emoji;
  zodiacName.textContent = zodiacSign.name;
  chineseZodiacEmoji.textContent = chineseZodiac.emoji;
  chineseZodiacName.textContent = chineseZodiac.name;
  
  // 시간대 보정 표시
  if (fortune.timeBoost) {
    resInfo.textContent += ` • ${fortune.timeBoost.name} ${fortune.timeBoost.desc}`;
  }
  
  // 스크롤 이동
  resultCard.scrollIntoView({ behavior: 'smooth' });
}



// 공유하기 처리
async function handleShare() {
  const shareData = {
    title: '오늘의 운세',
    text: `${resTitle.textContent}의 오늘 운세를 확인해보세요!`,
    url: window.location.href
  };
  
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // 폴백: URL 복사
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  } catch (error) {
    console.log('공유 실패:', error);
  }
}



// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', init);
