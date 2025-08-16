import { defineConfig } from 'vite';
import { readFileSync, existsSync, renameSync } from 'fs';
import { createHash } from 'crypto';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 환경 변수에 따른 빌드 설정
  const buildTarget = mode === 'constellation' ? 'constellation' : 
                     mode === 'fortune' ? 'fortune' : 'all';
  
  // 빌드할 입력 파일들을 결정
  const buildInputs = {};
  
  if (buildTarget === 'all' || buildTarget === 'constellation') {
    buildInputs['constellation/constellation'] = 'constellation/constellation.html';
  }
  
  if (buildTarget === 'all' || buildTarget === 'fortune') {
    buildInputs['fortune/fortune'] = 'fortune/fortune.html';
  }
  
  // 빌드할 JSON 파일들을 결정
  const jsonFiles = [];
  if (buildTarget === 'all' || buildTarget === 'constellation') {
    jsonFiles.push('constellation');
  }
  if (buildTarget === 'all' || buildTarget === 'fortune') {
    jsonFiles.push('fortune');
  }

  return {
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
        input: buildInputs,
        external: [],
        output: {
          // 파일들을 각 폴더에 배치 (해시코드 포함)
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'constellation/constellation') {
              return 'constellation/horoscope-[hash].min.js';
            } else if (chunkInfo.name === 'fortune/fortune') {
              return 'fortune/fortune-[hash].min.js';
            }
            return '[name]-[hash].min.js';
          },
          chunkFileNames: '[name]-[hash].min.js', 
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || '';
            
            // HTML 파일 처리
            if (name.includes('constellation.html')) {
              return 'constellation/constellation.html';
            } else if (name.includes('fortune.html')) {
              return 'fortune/fortune.html';
            }
            
            // CSS 파일은 빌드 후 수동으로 이동하거나 각 폴더에 배치
            if (name === 'horoscope.css') {
              return 'constellation/horoscope-[hash].min.css';
            } else if (name === 'fortune.css') {
              return 'fortune/fortune-[hash].min.css';
            }
            
            return `[name]-[hash].[ext]`;
          },
          
          // 코드 분할 (JSON 파일 제외)
          manualChunks: undefined
        }
      },
      
      // 자산 인라인 임계값 (작은 파일들은 인라인으로)
      assetsInlineLimit: 4096,
      
      // 모듈 프리로드 비활성화 (단순한 프로젝트이므로 불필요)
      modulePreload: false
    },
    
    // 공용 디렉토리
    publicDir: 'public',
    
    // 베이스 경로
    base: './',
    
    // 플러그인
    plugins: [
      {
        name: 'move-css-files',
        writeBundle(options, bundle) {
          // CSS 파일들을 적절한 폴더로 이동
          Object.keys(bundle).forEach(fileName => {
            if (fileName.endsWith('.css')) {
              const fullPath = path.join(options.dir, fileName);
              
              if (fileName.includes('constellation') && !fileName.startsWith('constellation/')) {
                const newPath = path.join(options.dir, 'constellation', path.basename(fileName));
                if (existsSync(fullPath)) {
                  renameSync(fullPath, newPath);
                  console.log(`Moved ${fileName} to constellation/`);
                }
              }
              
              if (fileName.includes('fortune') && !fileName.startsWith('fortune/')) {
                const newPath = path.join(options.dir, 'fortune', path.basename(fileName));
                if (existsSync(fullPath)) {
                  renameSync(fullPath, newPath);
                  console.log(`Moved ${fileName} to fortune/`);
                }
              }
            }
          });
        }
      },
      {
        name: 'copy-json-with-manifest',
        generateBundle() {
          const timestamp = Date.now();
          
          // Constellation JSON 처리
          if (jsonFiles.includes('constellation')) {
            const constellationJsonContent = readFileSync('constellation/horoscope-data.json', 'utf8');
            const constellationHash = createHash('md5').update(constellationJsonContent).digest('hex').slice(0, 8);
            const constellationHashedFileName = `horoscope-data-${constellationHash}.json`;
            
            this.emitFile({
              type: 'asset',
              fileName: `constellation/${constellationHashedFileName}`,
              source: constellationJsonContent
            });
            
            const constellationManifest = {
              "horoscope-data.json": constellationHashedFileName,
              "timestamp": timestamp,
              "version": constellationHash
            };
            
            const constellationManifestContent = JSON.stringify(constellationManifest, null, 2);
            const constellationManifestHash = createHash('md5').update(constellationManifestContent).digest('hex').slice(0, 8);
            
            this.emitFile({
              type: 'asset',
              fileName: `constellation/manifest-${constellationManifestHash}.json`,
              source: constellationManifestContent
            });
            
            const constellationManifestInfo = {
              "manifest": `manifest-${constellationManifestHash}.json`,
              "data": constellationHashedFileName,
              "timestamp": timestamp,
              "version": constellationManifestHash
            };
            
            this.emitFile({
              type: 'asset',
              fileName: `constellation/build-${timestamp}.json`,
              source: JSON.stringify(constellationManifestInfo, null, 2)
            });
            
            this.emitFile({
              type: 'asset',
              fileName: 'constellation/build-timestamp.txt',
              source: timestamp.toString()
            });
          }
          
          // Fortune JSON 처리
          if (jsonFiles.includes('fortune')) {
            const fortuneJsonContent = readFileSync('fortune/fortune-data.json', 'utf8');
            const fortuneHash = createHash('md5').update(fortuneJsonContent).digest('hex').slice(0, 8);
            const fortuneHashedFileName = `fortune-data-${fortuneHash}.json`;
            
            this.emitFile({
              type: 'asset',
              fileName: `fortune/${fortuneHashedFileName}`,
              source: fortuneJsonContent
            });
            
            const fortuneManifest = {
              "fortune-data.json": fortuneHashedFileName,
              "timestamp": timestamp,
              "version": fortuneHash
            };
            
            const fortuneManifestContent = JSON.stringify(fortuneManifest, null, 2);
            const fortuneManifestHash = createHash('md5').update(fortuneManifestContent).digest('hex').slice(0, 8);
            
            this.emitFile({
              type: 'asset',
              fileName: `fortune/manifest-${fortuneManifestHash}.json`,
              source: fortuneManifestContent
            });
            
            const fortuneManifestInfo = {
              "manifest": `manifest-${fortuneManifestHash}.json`,
              "data": fortuneHashedFileName,
              "timestamp": timestamp,
              "version": fortuneManifestHash
            };
            
            this.emitFile({
              type: 'asset',
              fileName: `fortune/build-${timestamp}.json`,
              source: JSON.stringify(fortuneManifestInfo, null, 2)
            });
            
            this.emitFile({
              type: 'asset',
              fileName: 'fortune/build-timestamp.txt',
              source: timestamp.toString()
            });
          }
        }
      }
    ],
    
    // CSS 전처리기 옵션
    css: {
      devSourcemap: true
    }
  };
});
