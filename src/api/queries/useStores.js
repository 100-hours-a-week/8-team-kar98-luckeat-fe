import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../config/apiConfig';

/**
 * 가게 목록 조회를 위한 쿼리 훅
 * 
 * @param {Object} options - 가게 목록 조회 옵션
 * @param {boolean} options.showDiscountOnly - 할인 중인 가게만 표시 여부
 * @param {string} options.categoryFilter - 카테고리 필터 (예: '전체', '한식', '중식', ...)
 * @param {string} options.searchQuery - 검색어
 * @param {string} options.sortOption - 정렬 옵션 (예: '가까운 순', '리뷰 많은 순', ...)
 * @param {Object} options.userLocation - 사용자 위치 (위도, 경도)
 * @param {number} options.storesPerPage - 페이지당 가게 수
 * @param {Array} options.categoryOptions - 카테고리 옵션 배열
 * @returns {Object} 쿼리 결과
 */
export function useStoresQuery({
  showDiscountOnly,
  categoryFilter,
  searchQuery,
  sortOption,
  userLocation,
  storesPerPage = 10,
  categoryOptions,
}) {
  return useQuery({
    queryKey: ['stores', { showDiscountOnly, categoryFilter, searchQuery, sortOption, userLocation, storesPerPage }],
    queryFn: async () => {
      // API_BASE_URL 사용
      let url = `${API_BASE_URL}/stores`;
      let queryParams = new URLSearchParams();

      // 페이지네이션 파라미터 추가
      queryParams.append('page', 0);
      queryParams.append('size', storesPerPage);

      // 필터 1: 할인 중인 가게만 보기
      if (showDiscountOnly) {
        queryParams.append('isDiscountOpen', true);
      }

      // 필터 2: 카테고리 필터링
      if (categoryFilter && categoryFilter !== '전체') {
        const category = categoryOptions?.find(opt => opt.name === categoryFilter);
        if (category && category.id !== 'all') {
          queryParams.append('categoryId', category.id);
        }
      }

      // 검색어 필터링
      if (searchQuery) {
        queryParams.append('storeName', searchQuery);
      }

      // 필터 3: 정렬 옵션 (4가지 중 하나만 선택 가능)
      let sort = '';
      
      switch (sortOption) {
        case '가까운 순':
          sort = 'distance';
          // 가까운 순 정렬일 때만 위치 정보 추가
          queryParams.append('lat', userLocation?.lat);
          queryParams.append('lng', userLocation?.lng);
          break;
        case '리뷰 많은 순':
          sort = 'review';
          break;
        case '공유 많은 순':
          sort = 'share';
          break;
        case '별점 높은 순':
          sort = 'rating';
          break;
        default:
          sort = 'distance';
          // 기본 정렬(가까운 순)일 때도 위치 정보 추가
          queryParams.append('lat', userLocation?.lat);
          queryParams.append('lng', userLocation?.lng);
          break;
      }
      
      // 정렬 파라미터 추가
      queryParams.append('sort', sort);
      
      // 쿼리 파라미터가 있으면 URL에 추가
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      // API 요청
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API 응답 오류: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 데이터 반환
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
}

/**
 * 무한 스크롤을 위한 가게 목록 조회 쿼리 훅
 * 
 * @param {Object} options - 가게 목록 조회 옵션
 * @param {boolean} options.showDiscountOnly - 할인 중인 가게만 표시 여부
 * @param {string} options.categoryFilter - 카테고리 필터 (예: '전체', '한식', '중식', ...)
 * @param {string} options.searchQuery - 검색어
 * @param {string} options.sortOption - 정렬 옵션 (예: '가까운 순', '리뷰 많은 순', ...)
 * @param {Object} options.userLocation - 사용자 위치 (위도, 경도)
 * @param {number} options.storesPerPage - 페이지당 가게 수
 * @param {Array} options.categoryOptions - 카테고리 옵션 배열
 * @returns {Object} 무한 쿼리 결과
 */
export function useInfiniteStoresQuery({
  showDiscountOnly,
  categoryFilter,
  searchQuery,
  sortOption,
  userLocation,
  storesPerPage = 10,
  categoryOptions,
}) {
  return useInfiniteQuery({
    queryKey: ['stores', 'infinite', { showDiscountOnly, categoryFilter, searchQuery, sortOption, userLocation, storesPerPage }],
    queryFn: async ({ pageParam = 0 }) => {
      // API_BASE_URL 사용
      let url = `${API_BASE_URL}/stores`;
      let queryParams = new URLSearchParams();

      // 페이지네이션 파라미터 추가
      queryParams.append('page', pageParam);
      queryParams.append('size', storesPerPage);

      // 필터 1: 할인 중인 가게만 보기
      if (showDiscountOnly) {
        queryParams.append('isDiscountOpen', true);
      }

      // 필터 2: 카테고리 필터링
      if (categoryFilter && categoryFilter !== '전체') {
        const category = categoryOptions?.find(opt => opt.name === categoryFilter);
        if (category && category.id !== 'all') {
          queryParams.append('categoryId', category.id);
        }
      }

      // 검색어 필터링
      if (searchQuery) {
        queryParams.append('storeName', searchQuery);
      }

      // 필터 3: 정렬 옵션 (4가지 중 하나만 선택 가능)
      let sort = '';
      
      switch (sortOption) {
        case '가까운 순':
          sort = 'distance';
          // 가까운 순 정렬일 때만 위치 정보 추가
          queryParams.append('lat', userLocation?.lat);
          queryParams.append('lng', userLocation?.lng);
          break;
        case '리뷰 많은 순':
          sort = 'review';
          break;
        case '공유 많은 순':
          sort = 'share';
          break;
        case '별점 높은 순':
          sort = 'rating';
          break;
        default:
          sort = 'distance';
          // 기본 정렬(가까운 순)일 때도 위치 정보 추가
          queryParams.append('lat', userLocation?.lat);
          queryParams.append('lng', userLocation?.lng);
          break;
      }
      
      // 정렬 파라미터 추가
      queryParams.append('sort', sort);
      
      // 쿼리 파라미터가 있으면 URL에 추가
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      // API 요청
      console.log(`가게 목록 요청: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API 응답 오류: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 데이터 반환
      return data;
    },
    getNextPageParam: (lastPage) => {
      // 마지막 페이지인지 확인
      if (lastPage.last) {
        return undefined;
      }
      
      // 다음 페이지 번호 반환
      return lastPage.number + 1;
    },
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
}

/**
 * 특정 가게 상세 정보 조회 쿼리 훅
 * 
 * @param {string} storeId - 가게 ID
 * @returns {Object} 쿼리 결과
 */
export function useStoreQuery(storeId) {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      // API 요청
      const url = `${API_BASE_URL}/stores/${storeId}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API 응답 오류: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 데이터 반환
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
    enabled: !!storeId, // storeId가 있을 때만 쿼리 실행
  });
} 