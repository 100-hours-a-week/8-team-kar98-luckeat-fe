import apiClient from './apiClient'

// 리뷰 작성
export const createReview = async (reviewData) => {
  try {
    const response = await apiClient.post('/reviews', reviewData)
    return response.data
  } catch (error) {
    console.error('리뷰 작성 중 오류:', error)
    throw error
  }
}

// 모든 리뷰 목록 조회
export const getReviews = async (params = {}) => {
  try {
    const response = await apiClient.get('/reviews', { params })
    return response
  } catch (error) {
    console.error('리뷰 조회 중 오류:', error)
    return { data: { reviews: [], totalPages: 0 } }
  }
}

// 리뷰 id로 리뷰 조회
export const getReviewById = async (reviewId) => {
  try {
    const response = await apiClient.get(`/reviews/${reviewId}`)
    return response
  } catch (error) {
    console.error('리뷰 상세 조회 중 오류:', error)
    throw error
  }
}

// 가게 id로 리뷰 조회
export const getStoreReviews = async (storeId) => {
  try {
    const response = await apiClient.get(`/reviews/store/${storeId}`)
    return response
  } catch (error) {
    console.error('가게 리뷰 조회 중 오류:', error)
    return { data: { reviews: [], totalPages: 0 } }
  }
}

// 사용자 id로 리뷰 조회 (내 리뷰)
export const getMyReviews = async () => {
  try {
    console.log('내 리뷰 불러오기 요청 시작')
    const response = await apiClient.get('/reviews/my-reviews')
    console.log('내 리뷰 응답 받음:', response)
    return response
  } catch (error) {
    console.error('내 리뷰 조회 중 오류:', error)
    return { data: { reviews: [], totalPages: 0 } }
  }
}

// 리뷰 수정
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData)
    return response.data
  } catch (error) {
    console.error('리뷰 수정 중 오류:', error)
    throw error
  }
}

// 리뷰 삭제
export const deleteReview = async (reviewId) => {
  try {
    const response = await apiClient.delete(`/reviews/${reviewId}`)
    return response.data
  } catch (error) {
    console.error('리뷰 삭제 중 오류:', error)
    throw error
  }
}
