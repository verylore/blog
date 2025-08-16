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
      name: 'copy-json-with-manifest',
      generateBundle() {
        // JSON 파일을 빌드 출력에 포함 (해시코드 생성)
        const jsonContent = readFileSync('constellation/horoscope-data.json', 'utf8');
        const hash = createHash('md5').update(jsonContent).digest('hex').slice(0, 8);
        const hashedFileName = `horoscope-data-${hash}.json`;
        
        // JSON 파일 생성
        this.emitFile({
          type: 'asset',
          fileName: `constellation/${hashedFileName}`,
          source: jsonContent
        });
        
        // 매니페스트 파일 생성 (파일명 매핑 정보 + 타임스탬프)
        const timestamp = Date.now();
        const manifest = {
          "horoscope-data.json": hashedFileName,
          "timestamp": timestamp,
          "version": hash // JSON 해시를 버전으로 사용
        };
        
        // 매니페스트 파일도 해시 포함
        const manifestContent = JSON.stringify(manifest, null, 2);
        const manifestHash = createHash('md5').update(manifestContent).digest('hex').slice(0, 8);
        
        this.emitFile({
          type: 'asset',
          fileName: `constellation/manifest-${manifestHash}.json`,
          source: manifestContent
        });
        
                      // 타임스탬프를 파일명에 직접 포함하여 완전한 캐시 무효화
              const manifestInfo = {
                "manifest": `manifest-${manifestHash}.json`,
                "data": hashedFileName,
                "timestamp": timestamp,
                "version": manifestHash
              };
              
              // 타임스탬프를 파일명에 포함하여 고정 파일 제거
              this.emitFile({
                type: 'asset',
                fileName: `constellation/build-${timestamp}.json`,
                source: JSON.stringify(manifestInfo, null, 2)
              });
        
        // 현재 빌드의 타임스탬프를 기록하는 간단한 텍스트 파일
        this.emitFile({
          type: 'asset',
          fileName: 'constellation/build-timestamp.txt',
          source: timestamp.toString()
        });
      }
    }
  ],
  
  // CSS 전처리기 옵션
  css: {
    devSourcemap: true
  }
});
