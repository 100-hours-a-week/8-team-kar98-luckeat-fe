import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// 환경 변수에 따라 개발/프로덕션 모드 구분
const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development'

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd())
  
  // 기본 API URL 설정 (환경변수가 없으면 클라우드프론트 URL 사용)
  const apiUrl = env.VITE_API_URL || 'https://dxa66rf338pjr.cloudfront.net'
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: true,
          ws: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('프록시 에러:', err)
            })
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('프록시 요청:', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('프록시 응답:', proxyRes.statusCode, req.url)
            })
          },
        },
      },
    },
    build: {
      outDir: `dist/${mode}`,
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
          manualChunks: (id) => {
            // 핵심 리액트 라이브러리
            if (id.includes('node_modules/react/') || 
                id.includes('node_modules/react-dom/') ||
                id.includes('node_modules/scheduler/')) {
              return 'react-core';
            }
            
            // 라우팅 관련 라이브러리
            if (id.includes('node_modules/react-router') || 
                id.includes('node_modules/@remix-run/router')) {
              return 'routing';
            }
            
            // 상태 관리 라이브러리
            if (id.includes('node_modules/zustand')) {
              return 'state-zustand';
            }

            if (id.includes('node_modules/jotai')) {
              return 'state-jotai';
            }
            
            // TanStack Query 라이브러리 (코어와 유틸리티 분리)
            if (id.includes('node_modules/@tanstack/react-query/build/lib')) {
              return 'tanstack-query-core';
            }
            
            if (id.includes('node_modules/@tanstack/react-query')) {
              return 'tanstack-query';
            }
            
            // UI 컴포넌트/아이콘 라이브러리 (더 세분화)
            if (id.includes('node_modules/@fortawesome')) {
              return 'ui-icons';
            }
            
            if (id.includes('node_modules/react-hot-toast') || 
                id.includes('node_modules/react-toastify')) {
              return 'ui-notifications';
            }
            
            // 지도 관련 라이브러리
            if (id.includes('node_modules/react-kakao-maps-sdk')) {
              return 'maps';
            }
            
            // 모니터링 관련 라이브러리
            if (id.includes('node_modules/@sentry')) {
              return 'monitoring';
            }
            
            // 유틸리티 라이브러리 세분화
            if (id.includes('node_modules/axios')) {
              return 'utils-axios';
            }
            
            if (id.includes('node_modules/lodash')) {
              return 'utils-lodash';
            }
            
            // 페이지별 청크 분리
            if (id.includes('/src/pages/HomePage')) {
              return 'page-home';
            }
            if (id.includes('/src/pages/StoreDetail')) {
              return 'page-store-detail';
            }
            if (id.includes('/src/pages/Map')) {
              return 'page-map';
            }
            if (id.includes('/src/pages/Login') || id.includes('/src/pages/Signup')) {
              return 'page-auth';
            }
            if (id.includes('/src/pages/MyPage') || id.includes('/src/pages/EditProfile')) {
              return 'page-user-profile';
            }
            if (id.includes('/src/pages/Business') || id.includes('/src/pages/ProductManagement') || 
                id.includes('/src/pages/EditStore') || id.includes('/src/pages/StoreReservations')) {
              return 'page-business';
            }
            
            // API 및 쿼리 관련 코드
            if (id.includes('/src/api/')) {
              return 'api-client';
            }

            // 공통 컴포넌트
            if (id.includes('/src/components/')) {
              return 'components';
            }
          }
        },
      },
      // 이미지 압축 및 최적화
      assetsInlineLimit: 4096, // 4KB 이하 파일은 인라인 처리
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      chunkSizeWarningLimit: 1500 // 청크 사이즈 경고 제한 높이기 (1.5MB)
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'zustand', '@tanstack/react-query']
    }
  }
})
