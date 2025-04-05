import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

function StoreList({ sortBy = 'distance', showDiscountOnly = false }) {
  const [stores, setStores] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef(null)

  const fetchStores = async (pageNum) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/v1/stores?page=${pageNum}&size=20`)
      const newStores = response.data.content
      
      if (pageNum === 0) {
        setStores(newStores)
      } else {
        setStores(prev => [...prev, ...newStores])
      }
      
      setHasMore(!response.data.last)
    } catch (error) {
      console.error('가게 목록을 불러오는데 실패했습니다:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores(0)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage(prev => prev + 1)
          fetchStores(page + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [loading, hasMore, page])

  // 필터링
  const filteredStores = showDiscountOnly
    ? stores.filter((store) => store.isDiscounted)
    : stores

  // 정렬
  const sortedStores = [...filteredStores].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distance - b.distance
      case 'reviews':
        return b.reviews - a.reviews
      case 'shares':
        return b.shares - a.shares
      default:
        return 0
    }
  })

  return (
    <div className="flex-1 overflow-auto">
      {sortedStores.map((store) => (
        <div key={store.id} className="p-4 border-b flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-3xl">
            {store.image}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{store.name}</h3>
            <div className="flex gap-2 text-sm text-gray-500">
              <span>{store.distance}km</span>
              <span>•</span>
              <span>리뷰 {store.reviews}</span>
              <span>•</span>
              <span>공유 {store.shares}</span>
            </div>
            {store.status && (
              <span className="text-sm text-gray-500 block mt-1">
                {store.status}
              </span>
            )}
            {store.isDiscounted && (
              <span className="text-sm text-blue-600 block mt-1">
                마감 할인중
              </span>
            )}
          </div>
        </div>
      ))}
      <div ref={observerTarget} className="h-10" />
      {loading && (
        <div className="p-4 text-center text-gray-500">
          로딩중...
        </div>
      )}
      {!hasMore && stores.length > 0 && (
        <div className="p-4 text-center text-gray-500">
          더 이상 표시할 가게가 없습니다
        </div>
      )}
    </div>
  )
}

export default StoreList
