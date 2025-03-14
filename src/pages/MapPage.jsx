<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import Header from '../components/layout/Header'
import { stores } from '../data/storeData'
import CategoryList from '../components/store/CategoryList'
=======
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import Header from '../components/layout/Header'
import { stores, categories, currentPosition } from '../data/storeData'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import StoreMarker from '../components/map/StoreMarker'
import MapController from '../components/map/MapController'
>>>>>>> 938344b4 (chore: Restore project files)

function MapPage() {
  const navigate = useNavigate()
  const [showDiscountOnly, setShowDiscountOnly] = useState(false)
  const [filteredStores, setFilteredStores] = useState(stores)
  const [selectedCategory, setSelectedCategory] = useState('전체')
<<<<<<< HEAD
=======
  const [selectedStoreId, setSelectedStoreId] = useState(null)
  const [mapCenter, setMapCenter] = useState(currentPosition)
  const [mapLevel, setMapLevel] = useState(3)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef(null)

  // 카카오맵 로드 확인
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        setMapLoaded(true)
      } else {
        console.log('카카오맵 SDK를 로드합니다...')
        const script = document.createElement('script')
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=053712efa761d6d8afaa725cfb56bf0e&libraries=services,clusterer,drawing&autoload=false`
        script.async = true

        script.onload = () => {
          window.kakao.maps.load(() => {
            console.log('카카오맵 로드 완료')
            setMapLoaded(true)
          })
        }

        document.head.appendChild(script)
      }
    }

    loadKakaoMap()
  }, [])
>>>>>>> 938344b4 (chore: Restore project files)

  // 할인 필터와 카테고리 변경 시 가게 목록 필터링
  useEffect(() => {
    let result = [...stores]

    if (showDiscountOnly) {
      result = result.filter((store) =>
        store.products.some((product) => !product.isSoldOut),
      )
    }

    if (selectedCategory !== '전체') {
      result = result.filter((store) => store.category === selectedCategory)
    }

    setFilteredStores(result)
  }, [showDiscountOnly, selectedCategory])

<<<<<<< HEAD
=======
  // 마커 클릭 핸들러
  const handleMarkerClick = (storeId) => {
    setSelectedStoreId(storeId === selectedStoreId ? null : storeId)
  }

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

>>>>>>> 938344b4 (chore: Restore project files)
  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <Header title="지도" />

      {/* 카테고리 */}
<<<<<<< HEAD
      <div className="border-b">
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
=======
      <div className="border-b overflow-x-auto whitespace-nowrap">
        <div className="inline-flex p-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex flex-col items-center px-3 ${
                selectedCategory === category.name
                  ? 'text-yellow-500'
                  : 'text-gray-700'
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 ${
                  selectedCategory === category.name
                    ? 'bg-yellow-100'
                    : 'bg-gray-200'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
              </div>
              <span className="text-xs">{category.name}</span>
            </button>
          ))}
        </div>
>>>>>>> 938344b4 (chore: Restore project files)
      </div>

      {/* 검색바 */}
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full p-2 pr-10 border rounded-lg"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </button>
        </div>
      </div>

      {/* 지도 영역 */}
<<<<<<< HEAD
      <div className="flex-1 relative bg-gray-100 overflow-hidden">
        {/* 지도가 들어갈 자리 */}
        <div className="absolute inset-0 h-2/3">
          {/* 실제 지도는 나중에 구현 */}
        </div>
=======
      <div
        className="flex-1 relative bg-gray-100 overflow-hidden"
        style={{ minHeight: '400px' }}
      >
        {/* 카카오 지도 */}
        {mapLoaded ? (
          <Map
            center={mapCenter}
            level={mapLevel}
            style={{ width: '100%', height: '100%' }}
            ref={mapRef}
          >
            {/* 현재 위치 마커 */}
            <MapMarker
              position={currentPosition}
              image={{
                src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                size: { width: 40, height: 44 },
                options: { offset: { x: 20, y: 44 } },
              }}
            />

            {/* 가게 마커 */}
            {filteredStores.map((store) => (
              <StoreMarker
                key={store.id}
                store={store}
                isSelected={selectedStoreId === store.id}
                onClick={() => handleMarkerClick(store.id)}
              />
            ))}
          </Map>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>지도를 로딩 중입니다...</p>
          </div>
        )}
>>>>>>> 938344b4 (chore: Restore project files)

        {/* 마감 할인 필터 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <button
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
              showDiscountOnly
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-700 border'
            }`}
            onClick={() => setShowDiscountOnly(!showDiscountOnly)}
          >
            <span>마감 할인중만</span>
            {showDiscountOnly && <span>✓</span>}
          </button>
        </div>

        {/* 확대/축소 버튼 */}
<<<<<<< HEAD
        <div className="absolute right-4 top-1/3 -translate-y-1/2 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center">
            +
          </button>
          <button className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center">
            -
          </button>
        </div>
=======
        <MapController onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
>>>>>>> 938344b4 (chore: Restore project files)

        {/* 가게 목록 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-white rounded-t-2xl shadow-lg overflow-y-auto">
          <div className="p-4">
            <h3 className="font-bold mb-2">
              주변 가게 ({filteredStores.length})
            </h3>
            <div className="space-y-3">
              {filteredStores.slice(0, 3).map((store) => (
                <div
                  key={store.id}
                  className="flex items-center p-2 border rounded-lg"
                  onClick={() => navigate(`/store/${store.id}`)}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-md mr-3">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover rounded-md"
<<<<<<< HEAD
=======
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src =
                          'https://via.placeholder.com/150/CCCCCC?text=이미지없음'
                      }}
>>>>>>> 938344b4 (chore: Restore project files)
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{store.name}</h4>
                    <p className="text-xs text-gray-500">{store.distance}</p>
                    <p className="text-xs text-gray-700 font-bold">
                      {store.discount} 할인
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}

export default MapPage
