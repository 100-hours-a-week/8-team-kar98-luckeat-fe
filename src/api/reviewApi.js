import apiClient from './apiClient';

// 리뷰 작성
export const createReview = async (reviewData) => {
  try {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 모든 리뷰 목록 조회
export const getAllReviews = async (page = 1) => {
  try {
    const response = await apiClient.get('/reviews', { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 리뷰 ID로 특정 리뷰 조회
export const getReviewById = async (reviewId) => {
  try {
    const response = await apiClient.get(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 가게 ID로 리뷰 목록 조회
export const getReviewsByStoreId = async (storeId, page = 1) => {
  try {
    const response = await apiClient.get(`/reviews/store/${storeId}`, { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 내 리뷰 목록 조회
export const getMyReviews = async (page = 1) => {
  try {
    const response = await apiClient.get('/reviews/my-reviews', { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 리뷰 수정
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 리뷰 삭제
export const deleteReview = async (reviewId) => {
  try {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 