import axios from 'axios'
import { handleErrorResponse, ERROR_MESSAGES } from '../utils/apiMessages'
import { API_BASE_URL } from '../config/apiConfig'

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    console.log('요청 전송:', config.method.toUpperCase(), config.url)
    console.log('요청 헤더:', JSON.stringify(config.headers, null, 2))
    if (config.data) {
      console.log('요청 데이터:', JSON.stringify(config.data, null, 2))
    }
    return config
  },
  (error) => {
    console.error('요청 오류:', error)
    return Promise.reject(error)
  },
)

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      '응답 수신:',
      response.status,
      response.config.method.toUpperCase(),
      response.config.url,
      response.data,
    )
    return response
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      const { status, data, config } = error.response
      console.error(
        `응답 오류 [${status}]:`,
        config.method.toUpperCase(),
        config.url,
        data,
      )

      // 인증 에러 (401)
      if (status === 401) {
        const errorMessage = data.message || ERROR_MESSAGES.UNAUTHORIZED

        // 토큰 만료인 경우
        if (errorMessage === ERROR_MESSAGES.TOKEN_EXPIRED) {
          // 토큰 제거 및 로그인 페이지로 리다이렉션
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }

      // 권한 에러 (403)
      else if (status === 403) {
        console.error(
          '권한이 없습니다:',
          data.message || ERROR_MESSAGES.FORBIDDEN,
        )
      }

      // 리소스 없음 (404)
      else if (status === 404) {
        const notFoundMessage =
          data.message || '요청한 리소스를 찾을 수 없습니다.'
        console.error(notFoundMessage)
      }

      // 유효성 검사 실패 (400)
      else if (status === 400) {
        console.error(
          '잘못된 요청입니다:',
          data.message || ERROR_MESSAGES.BAD_REQUEST,
        )
      }

      // 중복 에러 (409)
      else if (status === 409) {
        console.error('리소스 중복 오류:', data.message)
      }

      // 서버 에러 (500)
      else if (status === 500) {
        console.error(
          '서버 오류가 발생했습니다:',
          data.message || ERROR_MESSAGES.SERVER_ERROR,
        )
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
