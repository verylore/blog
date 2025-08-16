import { defineConfig } from 'vite';

export default defineConfig({
  // 개발 서버 설정
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // 빌드 설정
  build: {
    // 출력 디렉토리
    outDir: 'dist',
    
    // 압축 및 난독화 설정
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // console.log 제거
        drop_debugger: true,     // debugger 제거
        pure_funcs: ['console.log', 'console.warn'], // 특정 함수 제거
        passes: 3                // 압축 패스 수
      },
      mangle: {
        properties: {
          regex: /^_/            // _로 시작하는 속성명 난독화
        }
      },
      format: {
        comments: false          // 주석 제거
      }
    },
    
    // CSS 압축
    cssMinify: true,
    
    // 소스맵 비활성화 (배포용)
    sourcemap: false,
    
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 1000,
    
    // 빌드 시 기존 파일 정리
    emptyOutDir: true,
    
    // 롤업 옵션
    rollupOptions: {
      input: {
        'constellation/constellation': 'constellation/constellation.html'
      },
      output: {
        // 파일들을 constellation 폴더에 배치
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'constellation/constellation' 
            ? 'constellation/horoscope.min.js' 
            : 'constellation/[name].min.js';
        },
        chunkFileNames: 'constellation/horoscope-data.min.js', 
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'horoscope.css') {
            return 'constellation/horoscope.min.css';
          }
          return `constellation/[name].[ext]`;
        },
        
        // 코드 분할
        manualChunks: {
          'horoscope-data': ['constellation/horoscope-data.json']
        }
      }
    },
    
    // 자산 인라인 임계값 (작은 파일들은 인라인으로)
    assetsInlineLimit: 4096
  },
  
  // 공용 디렉토리
  publicDir: 'public',
  
  // 베이스 경로
  base: './',
  
  // 플러그인
  plugins: [],
  
  // CSS 전처리기 옵션
  css: {
    devSourcemap: true
  }
});
