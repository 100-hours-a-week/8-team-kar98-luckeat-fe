// 카테고리 데이터
export const categories = [
  { id: 1, name: '전체', icon: '🍽️' },
  { id: 2, name: '한식', icon: '🍚' },
  { id: 3, name: '정육', icon: '🥩' },
  { id: 4, name: '수산', icon: '🐟' },
  { id: 5, name: '분식', icon: '🍜' },
  { id: 6, name: '야채/과일', icon: '🥬' },
  { id: 7, name: '카페/디저트', icon: '🍰' },
  { id: 8, name: '기타', icon: '🛒' },
]

// 현재 위치 (제주도 구름스퀘어)
export const currentPosition = {
  lat: 33.450705,
  lng: 126.570677,
}

// 가게 데이터 (제주도 구름스퀘어 근처로 위치 조정)
export const stores = [
  {
    id: 1,
    name: '에드윈 부산 돼지국밥',
    category: '한식',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=150&h=150&fit=crop',
    distance: '0.3km',
    discount: '30%',
    phone: '064-123-4567',
    lat: 33.450936,
    lng: 126.569477,
    address: '제주특별자치도 제주시 중앙로 123',
    products: [
      {
        id: 1,
        name: '돼지국밥',
        originalPrice: 10000,
        discountPrice: 7000,
        discountRate: '30%',
        image: 'https://source.unsplash.com/150x150/?koreanfood',
        isSoldOut: false,
      },
    ],
    reviews: [
      {
        id: 1,
        userName: '맛있게먹는사람',
        rating: 4,
        content: '돼지국밥이 정말 맛있어요! 다음에 또 방문할게요.',
        date: '2023.05.15',
      },
    ],
  },
  {
    id: 2,
    name: '현현 수산물',
    category: '수산',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150&h=150&fit=crop',
    distance: '0.5km',
    discount: '20%',
    phone: '064-234-5678',
    lat: 33.451393,
    lng: 126.571892,
    address: '제주특별자치도 제주시 서해안로 456',
    products: [
      {
        id: 3,
        name: '생선회 세트',
        originalPrice: 30000,
        discountPrice: 24000,
        discountRate: '20%',
        image:
          'https://images.unsplash.com/photo-1553621042-f6e147245754?w=100&h=100&fit=crop',
        isSoldOut: false,
      },
    ],
    reviews: [],
  },
  {
    id: 3,
    name: '시에나 분식',
    category: '분식',
    image:
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=150&h=150&fit=crop',
    distance: '0.7km',
    discount: '15%',
    phone: '064-345-6789',
    lat: 33.450432,
    lng: 126.572282,
    address: '제주특별자치도 제주시 남쪽길 789',
    products: [
      {
        id: 5,
        name: '떡볶이',
        originalPrice: 5000,
        discountPrice: 4250,
        discountRate: '15%',
        image:
          'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=100&h=100&fit=crop',
        isSoldOut: false,
      },
    ],
    reviews: [],
  },
  {
    id: 4,
    name: '코비 정육점',
    category: '정육',
    image:
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=150&h=150&fit=crop',
    distance: '0.9km',
    discount: '25%',
    phone: '064-456-7890',
    lat: 33.449857,
    lng: 126.569235,
    address: '제주특별자치도 제주시 동쪽길 101',
    products: [],
    reviews: [],
  },
  {
    id: 5,
    name: '구름 청과',
    category: '야채/과일',
    image:
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=150&h=150&fit=crop',
    distance: '1.1km',
    discount: '10%',
    phone: '064-567-8901',
    lat: 33.452123,
    lng: 126.570563,
    address: '제주특별자치도 제주시 북쪽길 202',
    products: [],
    reviews: [],
  },
  {
    id: 6,
    name: '에이븐 카페',
    category: '카페/디저트',
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&h=150&fit=crop',
    distance: '1.3km',
    discount: '15%',
    phone: '064-678-9012',
    lat: 33.450378,
    lng: 126.574585,
    address: '제주특별자치도 제주시 카페거리 303',
    products: [],
    reviews: [],
  },
  {
    id: 7,
    name: '카부캠 도시락 가게',
    category: '기타',
    image:
      'https://images.unsplash.com/photo-1530649159659-1e2c1f0f5ac7?w=150&h=150&fit=crop',
    distance: '1.5km',
    discount: '5%',
    phone: '064-789-0123',
    lat: 33.448662,
    lng: 126.571738,
    address: '제주특별자치도 제주시 도시락길 404',
    products: [],
    reviews: [],
  },
  {
    id: 8,
    name: '제주도 한식',
    category: '한식',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=150&h=150&fit=crop',
    distance: '0.8km',
    discount: '25%',
    phone: '064-890-1234',
    lat: 33.451768,
    lng: 126.568975,
    address: '제주특별자치도 제주시 흑돼지거리 505',
    products: [],
    reviews: [],
  },
]
