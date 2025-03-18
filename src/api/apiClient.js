import axios from 'axios'

// API 기본 URL 설정
const API_BASE_URL = '/api/v1'

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      const { status, data } = error.response

      // 인증 에러 (401)
      if (status === 401) {
        // 토큰 제거 및 로그인 페이지로 리다이렉션
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      // 권한 에러 (403)
      else if (status === 403) {
        console.error('권한이 없습니다:', data.message)
      }

      // 리소스 없음 (404)
      else if (status === 404) {
        console.error('요청한 리소스를 찾을 수 없습니다:', data.message)
      }

      // 유효성 검사 실패 (400)
      else if (status === 400) {
        console.error('잘못된 요청입니다:', data.message)
      }

      // 중복 에러 (409)
      else if (status === 409) {
        console.error('리소스 중복 오류:', data.message)
      }

      // 서버 에러 (500)
      else if (status === 500) {
        console.error('서버 오류가 발생했습니다:', data.message)
      }
    } else if (error.request) {
      console.error('응답을 받지 못했습니다. 네트워크 연결을 확인하세요.')
    } else {
      console.error('요청 설정 중 오류가 발생했습니다:', error.message)
    }

    return Promise.reject(error)
  },
)

export default apiClient
