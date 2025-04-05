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
          secure: false,
          onError: (err, req, res) => {
            // 프록시 에러 처리
          },
          onProxyReq: (proxyReq, req, res) => {
            // 프록시 요청 처리
          },
          onProxyRes: (proxyRes, req, res) => {
            // 프록시 응답 처리
          }
        },
      },
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
      }
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
        },
      },
    },
  }
}) 