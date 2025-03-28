// API 설정 파일
const isDevelopment = process.env.NODE_ENV === 'development'

const API_BASE_URL = isDevelopment 
  ? 'https://dxa66rf338pjr.cloudfront.net/api/v1'
  : 'https://dxa66rf338pjr.cloudfront.net/api/v1'

const API_DIRECT_URL = isDevelopment
  ? 'https://dxa66rf338pjr.cloudfront.net'
  : 'https://dxa66rf338pjr.cloudfront.net'

// API 엔드포인트
const API_ENDPOINTS = {
  // 사용자 관련
  REGISTER: '/users/register',
  LOGIN: '/users/login',
  LOGOUT: '/users/logout',
  USER_INFO: '/users/info',
  UPDATE_NICKNAME: '/users/nickname',

  // 가게 관련
  STORES: '/stores',
  STORE_DETAIL: (id) => `/stores/${id}`,

  // 상품 관련
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,

  // 카테고리
  CATEGORIES: '/categories',

  // 리뷰
  REVIEWS: '/reviews',
  REVIEW_DETAIL: (id) => `/reviews/${id}`,
}

// API URL 생성 함수 (프록시 사용)
const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`

// 직접 API URL 생성 함수 (프록시 우회)
const getDirectApiUrl = (endpoint) => `${API_DIRECT_URL}/api/v1${endpoint}`

export {
  API_BASE_URL,
  API_DIRECT_URL,
  API_ENDPOINTS,
  getApiUrl,
  getDirectApiUrl,
}
