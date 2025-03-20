import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import Header from '../components/layout/Header'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import StoreMarker from '../components/map/StoreMarker'
import MapController from '../components/map/MapController'
import { getStores } from '../api/storeApi'
import { getCategories } from '../api/categoryApi'
import defaultImage from '../assets/images/luckeat-default.png'
import axios from 'axios'

function MapPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDiscountOnly, setShowDiscountOnly] = useState(false)
  const [stores, setStores] = useState([])
  const [filteredStores, setFilteredStores] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedStoreId, setSelectedStoreId] = useState(null)
  const [mapCenter, setMapCenter] = useState({
    lat: 33.450705,
    lng: 126.570677,
  }) // 기본 위치(제주도 구름스퀘어)
  const [mapLevel, setMapLevel] = useState(3)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const mapRef = useRef(null)
  const storeListRef = useRef(null)

  // 선택된 가게 아이템의 ref들을 저장
  const storeItemRefs = useRef({})

  // API 기본 URL 직접 설정
  const API_BASE_URL = 'http://3.34.255.222:8080'

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log('사용자 위치:', latitude, longitude)
          setUserLocation({ lat: latitude, lng: longitude })
          setMapCenter({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error('위치 정보를 가져오는데 실패했습니다:', error)
        },
      )
    } else {
      console.error('이 브라우저에서는 위치 정보를 지원하지 않습니다.')
    }
  }, [])

  // 백엔드에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 카테고리 데이터 가져오기
        const categoriesData = await getCategories()
        console.log('카테고리 데이터:', categoriesData)

        const categoriesList = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData?.data || []

        // 전체 카테고리 추가
        const allCategories = [
          { id: 0, name: '전체', icon: '🍽️' },
          ...categoriesList,
        ]

        setCategories(allCategories)

        // 가게 데이터 가져오기
        console.log('가게 정보 불러오는 중...')
        try {
          // 직접 axios로 API 호출
          const response = await axios.get(`${API_BASE_URL}/api/v1/stores`)
          const storesData = response.data
          console.log('가게 데이터:', storesData)

          if (!storesData || storesData.length === 0) {
            console.log('가게 데이터가 없습니다.')
            setLoading(false)
            return
          }

          // 가게 목록에 있는 고유 카테고리 추출
          const uniqueCategories = new Set()
          storesData.forEach((store) => {
            if (store.category) {
              uniqueCategories.add(store.category)
            }
          })
          console.log('추출된 고유 카테고리:', Array.from(uniqueCategories))

          // 더미 카테고리 설정 (API에서 카테고리가 없을 경우)
          if (uniqueCategories.size === 0) {
            // 화면에 표시된 가게들의 이름을 기반으로 더미 카테고리 할당
            const dummyCategories = {
              김재훈고사리육개장: '한식',
              플베버거: '패스트푸드',
              철판요리: '중식',
              카페브브: '카페',
              맛있겠다: '일식',
              호식이두마리치킨: '치킨',
              농심가락: '편의점',
              맥도날드: '패스트푸드',
              롯데리아: '패스트푸드',
              스타벅스: '카페',
              와플대학: '디저트',
              아리랑: '한식',
            }

            console.log('더미 카테고리 할당 시작')

            // 유효한 위치 정보가 있는 매장만 처리
            const storesWithValidLocation = storesData.map((store) => {
              // 가게 이름으로 카테고리 매칭
              const storeName = store.name || store.storeName || ''
              let category = store.category

              if (!category) {
                // 카테고리가 없으면 더미 카테고리에서 찾거나 기본값 설정
                for (const [keyword, cat] of Object.entries(dummyCategories)) {
                  if (storeName.includes(keyword)) {
                    category = cat
                    break
                  }
                }

                // 여전히 없으면 가게 ID에 따라 랜덤 카테고리 할당
                if (!category) {
                  const availableCategories = [
                    '한식',
                    '중식',
                    '일식',
                    '양식',
                    '카페',
                    '디저트',
                    '패스트푸드',
                  ]
                  const index = store.id % availableCategories.length
                  category = availableCategories[index]
                }

                console.log(
                  `가게 [${store.id}] ${storeName}에 카테고리 할당: ${category}`,
                )
              }

              // lat, lng가 문자열이면 숫자로 변환, null이면 랜덤 위치 생성
              let lat = store.lat ? parseFloat(store.lat) : null
              let lng = store.lng ? parseFloat(store.lng) : null

              // 유효하지 않은 좌표인 경우 (null, NaN, 0)
              if (
                !lat ||
                isNaN(lat) ||
                !lng ||
                isNaN(lng) ||
                (lat === 0 && lng === 0)
              ) {
                // 사용자 위치를 기준으로 랜덤한 위치 생성 (반경 500m 이내)
                console.log(
                  `매장 ${store.id}(${storeName}): 유효한 좌표 없음, 랜덤 위치 생성`,
                )
                const baseLocation = userLocation || mapCenter
                const randomLat =
                  baseLocation.lat + (Math.random() - 0.5) * 0.01 // 약 ±500m
                const randomLng =
                  baseLocation.lng + (Math.random() - 0.5) * 0.01
                return {
                  ...store,
                  lat: randomLat,
                  lng: randomLng,
                  hasRandomLocation: true, // 랜덤 위치 표시
                  category: category, // 수정된 카테고리 적용
                }
              }

              console.log(
                `매장 ${store.id}(${storeName}): 좌표 확인 - 위도 ${lat}, 경도 ${lng}, 카테고리: ${category}`,
              )
              return {
                ...store,
                lat: lat,
                lng: lng,
                hasRandomLocation: false,
                category: category, // 수정된 카테고리 적용
              }
            })

            // 더미 카테고리 메뉴 항목 생성
            const availableCategories = [
              '한식',
              '중식',
              '일식',
              '양식',
              '카페',
              '디저트',
              '패스트푸드',
              '치킨',
              '편의점',
            ]
            const dummyCategoryList = availableCategories.map((cat, index) => ({
              id: index + 1,
              name: cat,
              icon: getCategoryIcon(cat),
            }))

            const allDummyCategories = [
              { id: 0, name: '전체', icon: '🍽️' },
              ...dummyCategoryList,
            ]

            setCategories(allDummyCategories)
            console.log('더미 카테고리 메뉴 생성:', allDummyCategories)

            console.log(
              `총 ${storesWithValidLocation.length}개 매장 정보 로드 완료`,
            )
            setStores(storesWithValidLocation)
            setFilteredStores(storesWithValidLocation)
          } else {
            // API에서 카테고리가 있는 경우 정상 처리
            const storesWithValidLocation = storesData.map((store) => {
              // lat, lng가 문자열이면 숫자로 변환, null이면 랜덤 위치 생성
              let lat = store.lat ? parseFloat(store.lat) : null
              let lng = store.lng ? parseFloat(store.lng) : null

              // 유효하지 않은 좌표인 경우 (null, NaN, 0)
              if (
                !lat ||
                isNaN(lat) ||
                !lng ||
                isNaN(lng) ||
                (lat === 0 && lng === 0)
              ) {
                // 사용자 위치를 기준으로 랜덤한 위치 생성 (반경 500m 이내)
                console.log(
                  `매장 ${store.id}(${store.name || store.storeName}): 유효한 좌표 없음, 랜덤 위치 생성`,
                )
                const baseLocation = userLocation || mapCenter
                const randomLat =
                  baseLocation.lat + (Math.random() - 0.5) * 0.01 // 약 ±500m
                const randomLng =
                  baseLocation.lng + (Math.random() - 0.5) * 0.01
                return {
                  ...store,
                  lat: randomLat,
                  lng: randomLng,
                  hasRandomLocation: true, // 랜덤 위치 표시
                }
              }

              console.log(
                `매장 ${store.id}(${store.name || store.storeName}): 좌표 확인 - 위도 ${lat}, 경도 ${lng}`,
              )
              return {
                ...store,
                lat: lat,
                lng: lng,
                hasRandomLocation: false,
              }
            })

            console.log(
              `총 ${storesWithValidLocation.length}개 매장 정보 로드 완료`,
            )
            setStores(storesWithValidLocation)
            setFilteredStores(storesWithValidLocation)
          }
        } catch (error) {
          console.error('가게 정보 로드 실패:', error)
          // 오류가 있으면 getStores 함수로 재시도
          try {
            const storesData = await getStores()
            console.log('getStores 함수로 재시도:', storesData)
            const storeList = Array.isArray(storesData)
              ? storesData
              : storesData?.data || []
            setStores(storeList)
            setFilteredStores(storeList)
          } catch (retryError) {
            console.error('getStores 함수 재시도 실패:', retryError)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [userLocation])

  // 카카오맵 로드 확인
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        setMapLoaded(true)
      } else {
        console.log('카카오맵 SDK를 로드합니다...')
        const script = document.createElement('script')

        // API 키 설정
        const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services,clusterer,drawing&autoload=false`
        script.async = true

        script.onload = () => {
          window.kakao.maps.load(() => {
            console.log('카카오맵 로드 완료')
            setMapLoaded(true)
          })
        }

        script.onerror = (error) => {
          console.error('카카오맵 로드 실패:', error)
          alert(
            '지도 로딩에 실패했습니다. 카카오 개발자 센터에서 현재 도메인이 등록되어 있는지 확인해주세요.',
          )
        }

        document.head.appendChild(script)
      }
    }

    loadKakaoMap()
  }, [])

  // 검색어, 할인 필터, 카테고리가 변경될 때 가게 목록 필터링
  useEffect(() => {
    if (stores.length === 0) return

    let result = [...stores]
    console.log('필터링 전 가게 수:', result.length)

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((store) => {
        const storeName = store.storeName || store.name || ''
        const address = store.address || ''
        return (
          storeName.toLowerCase().includes(query) ||
          address.toLowerCase().includes(query)
        )
      })
      console.log('검색 필터링 후 가게 수:', result.length)
    }

    // 할인 필터링
    if (showDiscountOnly) {
      result = result.filter((store) => {
        const hasDiscountProducts =
          store.products &&
          Array.isArray(store.products) &&
          store.products.some(
            (product) => !product.isSoldOut && product.discountRate > 0,
          )

        // 원래 조건이 맞지 않으면 discount 필드로 확인
        return (
          hasDiscountProducts || (store.discount && store.discount !== '0%')
        )
      })
      console.log('할인 필터링 후 가게 수:', result.length)
    }

    // 카테고리 필터링
    if (selectedCategory && selectedCategory !== '전체') {
      result = result.filter((store) => {
        // categoryId 또는 category 필드 검사
        const storeCategory = store.category || store.categoryId || ''
        console.log(
          `가게 [${store.storeName || store.name}] 카테고리:`,
          storeCategory,
          '선택된 카테고리:',
          selectedCategory,
        )

        // 카테고리 이름으로 비교 (대소문자 구분 없이)
        if (typeof storeCategory === 'string') {
          return storeCategory.toLowerCase() === selectedCategory.toLowerCase()
        }

        // 카테고리 ID로 비교 (ID가 숫자인 경우)
        return String(storeCategory) === String(selectedCategory)
      })
      console.log('카테고리 필터링 후 가게 수:', result.length)
    }

    setFilteredStores(result)
  }, [searchQuery, showDiscountOnly, selectedCategory, stores])

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (store) => {
      console.log('마커 클릭:', store.id, store.name || store.storeName)

      // 선택된 가게 ID 설정
      setSelectedStoreId(selectedStoreId === store.id ? null : store.id)

      // 선택된 가게로 지도 중심 이동
      if (selectedStoreId !== store.id) {
        setMapCenter({ lat: store.lat, lng: store.lng })
      }

      // 선택된 가게로 목록 스크롤
      if (storeItemRefs.current[store.id] && storeListRef.current) {
        // 약간의 지연을 두고 스크롤 (UI 업데이트 후에 실행되도록)
        setTimeout(() => {
          storeItemRefs.current[store.id].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }, 100)
      }
    },
    [selectedStoreId],
  )

  // 지도 확대
  const handleZoomIn = () => {
    if (mapLevel > 1) {
      setMapLevel(mapLevel - 1)
    }
  }

  // 지도 축소
  const handleZoomOut = () => {
    if (mapLevel < 14) {
      setMapLevel(mapLevel + 1)
    }
  }

  // 카테고리 아이콘 매핑 함수
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      전체: '🍽️',
      한식: '🍚',
      중식: '🥢',
      일식: '🍣',
      양식: '🍝',
      디저트: '🍰',
      패스트푸드: '🍔',
      분식: '🍜',
      베이커리: '🥖',
      카페: '☕',
      퓨전음식: '🍲',
      정육: '🥩',
      수산: '🐟',
      '야채/과일': '🥬',
      '카페/디저트': '🍰',
      기타: '🛒',
    }

    return iconMap[categoryName] || '🍽️'
  }

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <Header title="지도" />

      {/* 카테고리 */}
      <div className="border-b overflow-x-auto whitespace-nowrap">
        <div className="inline-flex p-2">
          {categories.map((category) => {
            const categoryName =
              category.name || category.categoryName || '카테고리'
            return (
              <button
                key={category.id}
                className={`flex flex-col items-center px-3 ${
                  selectedCategory === categoryName
                    ? 'text-blue-500'
                    : 'text-gray-700'
                }`}
                onClick={() => setSelectedCategory(categoryName)}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 ${
                    selectedCategory === categoryName
                      ? 'bg-blue-100'
                      : 'bg-gray-200'
                  }`}
                >
                  <span className="text-2xl">
                    {getCategoryIcon(categoryName)}
                  </span>
                </div>
                <span className="text-xs">{categoryName}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 검색바 */}
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="가게 이름 또는 주소 검색"
            className="w-full p-2 pl-10 pr-4 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* 지도 영역 */}
      <div
        className="flex-1 relative bg-gray-100 overflow-hidden"
        style={{ minHeight: '400px' }}
      >
        {/* 로딩 표시 */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20">
            <div className="text-blue-500 font-bold flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              데이터 로딩 중...
            </div>
          </div>
        )}

        {/* 카카오 지도 */}
        {mapLoaded ? (
          <Map
            center={mapCenter}
            level={mapLevel}
            style={{ width: '100%', height: '100%' }}
            ref={mapRef}
          >
            {/* 현재 위치 마커 */}
            {userLocation && (
              <MapMarker
                position={userLocation}
                image={{
                  src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                  size: { width: 24, height: 35 },
                }}
                title="내 위치"
              />
            )}

            {/* 가게 마커 */}
            {filteredStores.map((store) => (
              <StoreMarker
                key={store.id}
                store={store}
                isSelected={selectedStoreId === store.id}
                onClick={() => handleMarkerClick(store)}
              />
            ))}
          </Map>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>지도를 로딩 중입니다...</p>
          </div>
        )}

        {/* 마감 할인 필터 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <button
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
              showDiscountOnly
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border'
            }`}
            onClick={() => setShowDiscountOnly(!showDiscountOnly)}
          >
            <span>마감 할인중만</span>
            {showDiscountOnly && <span>✓</span>}
          </button>
        </div>

        {/* 확대/축소 버튼 */}
        <MapController onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />

        {/* 가게 목록 */}
        <div
          ref={storeListRef}
          className="absolute bottom-0 left-0 right-0 h-1/3 bg-white rounded-t-2xl shadow-lg overflow-y-auto z-10 scroll-container"
        >
          <div className="p-4">
            <h3 className="font-bold mb-2">
              주변 가게 ({filteredStores.length})
            </h3>
            <div className="space-y-3">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <div
                    key={store.id}
                    ref={(el) => (storeItemRefs.current[store.id] = el)}
                    className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedStoreId === store.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleMarkerClick(store)}
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3">
                      <img
                        src={store.imageUrl || defaultImage}
                        alt={store.name || store.storeName}
                        className="w-full h-full object-cover rounded-md"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = defaultImage
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">
                        {store.storeName || store.name}
                      </h4>
                      <div className="flex items-center flex-wrap gap-1 mt-1">
                        {store.category && (
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {store.category}
                          </span>
                        )}
                        {store.discount && (
                          <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            {store.discount} 할인
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {store.address || '주소 정보 없음'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {loading
                    ? '가게 정보를 불러오는 중...'
                    : '표시할 가게가 없습니다.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}

export default MapPage
