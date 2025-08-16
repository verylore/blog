# 🌟 별자리 운세 웹 애플리케이션

12별자리 오늘의 운세를 확인할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🎯 12별자리별 오늘의 운세
- 💕 사랑/일/금전/건강 4가지 영역 운세
- 🎨 럭키컬러 & 럭키넘버 제공
- 📱 반응형 웹 디자인
- ⚡ 빠른 로딩 속도
- 🔄 결과 재생성 기능
- 📤 공유 기능

## 🛠️ 기술 스택

- **빌드 도구**: Vite
- **언어**: JavaScript (ES6+), CSS3, HTML5
- **압축/난독화**: Terser
- **개발 서버**: Vite Dev Server

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
개발 서버가 `http://localhost:3000`에서 실행됩니다.

### 3. 배포용 빌드
```bash
npm run build
```
빌드 결과물이 `dist/` 폴더에 생성됩니다.

### 4. 빌드 결과 미리보기
```bash
npm run preview
```

## 📁 프로젝트 구조

```
blog/
├── constellation/            # 소스 파일
│   ├── constellation.html    # 메인 HTML 파일
│   ├── horoscope.js          # 메인 JavaScript  
│   ├── horoscope.css         # 스타일시트
│   └── horoscope-data.json   # 운세 데이터
├── dist/                     # 빌드 결과물 (자동 생성)
│   └── constellation/
│       ├── constellation.html    # 최적화된 HTML
│       ├── horoscope.min.js      # 압축된 JavaScript
│       ├── horoscope.min.css     # 압축된 CSS
│       └── horoscope-data.min.js # 압축된 JSON
├── package.json              # 프로젝트 설정
├── vite.config.js           # Vite 설정
├── .gitignore               # Git 무시 파일
└── README.md                # 이 파일
```

## ⚙️ 빌드 설정

Vite 설정(`vite.config.js`)에서 다음과 같은 최적화가 적용됩니다:

### 압축 및 난독화
- **JavaScript**: Terser를 사용한 압축 및 난독화
- **CSS**: 자동 압축 및 최적화
- **JSON**: 번들링 시 자동 압축

### 성능 최적화
- ✅ Console.log 제거
- ✅ 주석 제거  
- ✅ 파일명 해싱
- ✅ 코드 분할
- ✅ 작은 파일 인라인화
- ✅ 소스맵 비활성화 (배포용)

## 📦 빌드 결과

빌드 후 `dist/constellation/` 폴더에 생성되는 파일들:

- `constellation.html` - 메인 HTML (최적화됨)
- `horoscope.min.js` - 압축된 JavaScript
- `horoscope.min.css` - 압축된 CSS
- `horoscope-data.min.js` - 압축된 JSON 데이터

## 🔧 개발 환경

- **Node.js**: >= 18.0.0
- **npm**: 최신 버전 권장

## 📝 스크립트 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 배포용 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run serve` | 빌드 결과를 3000포트에서 서빙 |

## 🌐 배포

빌드된 `dist/constellation/` 폴더의 내용을 웹 서버에 업로드하면 됩니다.

### 정적 호스팅 서비스
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

### 전통적인 웹 서버
- Apache
- Nginx
- IIS

## 📄 라이선스

MIT License
