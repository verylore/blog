# Constellation Horoscope & Fortune

별자리 운세와 오늘의 운세를 제공하는 웹 애플리케이션입니다.

## 기능

- **별자리 운세**: 12개 별자리의 일일 운세 제공
- **오늘의 운세**: 전체운, 연애운, 금전운, 직장운, 학업운, 건강운 제공
- **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 경험
- **빠른 로딩**: 최적화된 빌드로 빠른 페이지 로딩

## 설치 및 실행

### 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드

#### 전체 빌드 (기본)
```bash
npm run build
```

#### 폴더별 선택적 빌드

**별자리 운세만 빌드:**
```bash
npm run build:constellation
```

**오늘의 운세만 빌드:**
```bash
npm run build:fortune
```

### 빌드 결과 확인

```bash
# 빌드 결과 미리보기
npm run preview

# 또는 특정 포트로 서버 실행
npm run serve
```

## 프로젝트 구조

```
├── constellation/          # 별자리 운세
│   ├── constellation.html
│   ├── constellation.js
│   ├── horoscope.css
│   └── horoscope-data.json
├── fortune/               # 오늘의 운세
│   ├── fortune.html
│   ├── fortune.js
│   ├── fortune.css
│   └── fortune-data.json
├── dist/                  # 빌드 결과물
├── vite.config.js         # Vite 설정
└── package.json
```

## 빌드 옵션

### 폴더별 선택적 빌드

프로젝트는 두 개의 독립적인 애플리케이션으로 구성되어 있습니다:

1. **constellation**: 별자리 운세 애플리케이션
2. **fortune**: 오늘의 운세 애플리케이션

각각을 독립적으로 빌드할 수 있어 개발 시간을 단축하고 리소스를 절약할 수 있습니다.

### 빌드 스크립트

- `npm run build`: 전체 프로젝트 빌드
- `npm run build:constellation`: 별자리 운세만 빌드
- `npm run build:fortune`: 오늘의 운세만 빌드

### 빌드 결과

빌드된 파일들은 `dist/` 폴더에 각각의 하위 폴더로 구성됩니다:

```
dist/
├── constellation/
│   ├── constellation.html
│   ├── horoscope-[hash].min.js
│   ├── horoscope-[hash].min.css
│   ├── horoscope-data-[hash].json
│   └── manifest-[hash].json
└── fortune/
    ├── fortune.html
    ├── fortune-[hash].min.js
    ├── fortune-[hash].min.css
    ├── fortune-data-[hash].json
    └── manifest-[hash].json
```

## 기술 스택

- **Vite**: 빠른 빌드 도구
- **Vanilla JavaScript**: 순수 자바스크립트
- **CSS3**: 모던 CSS 스타일링
- **JSON**: 데이터 저장

## 개발 가이드

### 새로운 운세 데이터 추가

1. `constellation/horoscope-data.json` 또는 `fortune/fortune-data.json` 파일 수정
2. 빌드 실행: `npm run build` 또는 해당 폴더만 빌드

### 스타일 수정

1. `constellation/horoscope.css` 또는 `fortune/fortune.css` 파일 수정
2. 개발 서버에서 실시간 확인: `npm run dev`

## 라이선스

MIT License

## 기여

프로젝트에 기여하고 싶으시다면 Pull Request를 보내주세요.
