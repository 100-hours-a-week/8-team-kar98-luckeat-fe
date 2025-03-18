import apiClient from './apiClient'
import { processImageData } from './uploadApi'

// 가게 등록 (이미지 업로드 지원)
export const registerStore = async (storeData, storeImage) => {
  try {
    // 이미지 처리
    const processedData = await processImageData(
      storeData,
      storeImage,
      'storeImg',
      '/store-images',
    )

    // 가게 등록 API 호출
    const response = await apiClient.post('/stores', processedData)
    return response.data
  } catch (error) {
    throw error
  }
}

// 가게 목록 조회 (필터링 및 정렬 옵션 지원)
export const getStores = async (params = {}) => {
  try {
    // 파라미터 처리
    // categoryId: 특정 카테고리 필터링
    // store_name: 가게명 검색
    // lat, lng, radius: 위치 기반 검색
    // sort: 정렬 옵션
    const response = await apiClient.get('/stores', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// 특정 가게 상세 조회
export const getStoreById = async (storeId) => {
  try {
    const response = await apiClient.get(`/stores/${storeId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// 가게 정보 수정 (이미지 업로드 지원)
export const updateStore = async (storeId, storeData, storeImage) => {
  try {
    // 이미지 처리
    const processedData = await processImageData(
      storeData,
      storeImage,
      'storeImg',
      '/store-images',
    )

    const response = await apiClient.put(`/stores/${storeId}`, processedData)
    return response.data
  } catch (error) {
    throw error
  }
}

// 가게 공유수 증가
export const increaseStoreShare = async (storeId) => {
  try {
    const response = await apiClient.post(`/stores/${storeId}/share`)
    return response.data
  } catch (error) {
    throw error
  }
}

// 가게 삭제
export const deleteStore = async (storeId) => {
  try {
    const response = await apiClient.delete(`/stores/${storeId}`)
    return response.data
  } catch (error) {
    throw error
  }
}
