import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';

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
      external: [],
      output: {
        // 파일들을 constellation 폴더에 배치 (해시코드 포함)
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'constellation/constellation' 
            ? 'constellation/horoscope-[hash].min.js' 
            : 'constellation/[name]-[hash].min.js';
        },
        chunkFileNames: 'constellation/[name]-[hash].min.js', 
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'horoscope.css') {
            return 'constellation/horoscope-[hash].min.css';
          }
          return `constellation/[name]-[hash].[ext]`;
        },
        
        // 코드 분할 (JSON 파일 제외)
        manualChunks: undefined
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
  plugins: [
    {
      name: 'copy-json',
      generateBundle() {
        // JSON 파일을 빌드 출력에 포함 (해시코드 생성)
        const jsonContent = readFileSync('constellation/horoscope-data.json', 'utf8');
        const hash = createHash('md5').update(jsonContent).digest('hex').slice(0, 8);
        
        this.emitFile({
          type: 'asset',
          fileName: `constellation/horoscope-data-${hash}.json`,
          source: jsonContent
        });
      }
    }
  ],
  
  // CSS 전처리기 옵션
  css: {
    devSourcemap: true
  }
});
