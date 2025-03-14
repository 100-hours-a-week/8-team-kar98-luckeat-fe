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

<<<<<<< HEAD
=======
// 현재 위치 (구름스퀘어)
export const currentPosition = {
  lat: 33.450705,
  lng: 126.570677,
}

>>>>>>> 938344b4 (chore: Restore project files)
// 가게 데이터
export const stores = [
  {
    id: 1,
    name: '에이븐 한식당',
    category: '한식',
    image: 'https://via.placeholder.com/150?text=Korean',
    distance: '0.3km',
    discount: '30%',
    phone: '02-123-4567',
<<<<<<< HEAD
=======
    lat: 33.450936,
    lng: 126.569477,
>>>>>>> 938344b4 (chore: Restore project files)
    products: [
      {
        id: 1,
        name: '김치찌개',
        originalPrice: 10000,
        discountPrice: 7000,
        discountRate: '30%',
        image: 'https://via.placeholder.com/100?text=Kimchi',
        isSoldOut: false,
      },
      {
        id: 2,
        name: '된장찌개',
        originalPrice: 9000,
        discountPrice: 6300,
        discountRate: '30%',
        image: 'https://via.placeholder.com/100?text=Doenjang',
        isSoldOut: true,
      },
    ],
    reviews: [
      {
        id: 1,
        userName: '맛있게먹는사람',
        rating: 4,
        content: '김치찌개가 정말 맛있어요! 다음에 또 방문할게요.',
        date: '2023.05.15',
      },
      {
        id: 2,
        userName: '푸드러버',
        rating: 5,
        content: '가격도 저렴하고 양도 많아서 좋았습니다.',
        date: '2023.05.10',
      },
    ],
  },
  {
    id: 2,
<<<<<<< HEAD
    name: '에드윈 정육점',
    category: '정육',
    image: 'https://via.placeholder.com/150?text=Meat',
    distance: '0.5km',
    discount: '20%',
    phone: '02-234-5678',
=======
    name: '바다향 수산물',
    category: '수산',
    image: 'https://via.placeholder.com/150?text=Seafood',
    distance: '0.5km',
    discount: '20%',
    phone: '02-234-5678',
    lat: 33.451393,
    lng: 126.571892,
>>>>>>> 938344b4 (chore: Restore project files)
    products: [
      {
        id: 3,
        name: '한우 등심',
        originalPrice: 25000,
        discountPrice: 20000,
        discountRate: '20%',
        image: 'https://via.placeholder.com/100?text=Beef',
        isSoldOut: false,
      },
    ],
    reviews: [
      {
        id: 3,
        userName: '고기러버',
        rating: 5,
        content: '고기 퀄리티가 정말 좋아요! 신선하고 맛있습니다.',
        date: '2023.05.18',
      },
    ],
  },
  {
    id: 3,
<<<<<<< HEAD
    name: '시에나 수산',
    category: '수산',
    image: 'https://via.placeholder.com/150?text=Fish',
    distance: '0.7km',
    discount: '25%',
    phone: '02-345-6789',
=======
    name: '행복한 분식',
    category: '분식',
    image: 'https://via.placeholder.com/150?text=Snack',
    distance: '0.7km',
    discount: '15%',
    phone: '02-345-6789',
    lat: 33.450432,
    lng: 126.572282,
>>>>>>> 938344b4 (chore: Restore project files)
    products: [
      {
        id: 4,
        name: '생선회 세트',
        originalPrice: 30000,
        discountPrice: 22500,
        discountRate: '25%',
        image: 'https://via.placeholder.com/100?text=Sashimi',
        isSoldOut: false,
      },
      {
        id: 5,
        name: '새우 튀김',
        originalPrice: 12000,
        discountPrice: 9000,
        discountRate: '25%',
        image: 'https://via.placeholder.com/100?text=Shrimp',
        isSoldOut: false,
      },
    ],
    reviews: [],
  },
  {
    id: 4,
<<<<<<< HEAD
    name: '현 분식',
    category: '분식',
    image: 'https://via.placeholder.com/150?text=StreetFood',
    distance: '0.2km',
    discount: '15%',
    phone: '02-456-7890',
=======
    name: '쫄깃정육점',
    category: '정육',
    image: 'https://via.placeholder.com/150?text=Meat',
    distance: '0.9km',
    discount: '25%',
    phone: '02-456-7890',
    lat: 33.449857,
    lng: 126.569235,
>>>>>>> 938344b4 (chore: Restore project files)
    products: [
      {
        id: 6,
        name: '떡볶이',
        originalPrice: 5000,
        discountPrice: 4250,
        discountRate: '15%',
        image: 'https://via.placeholder.com/100?text=Tteokbokki',
        isSoldOut: true,
      },
      {
        id: 7,
        name: '김밥',
        originalPrice: 3500,
        discountPrice: 2975,
        discountRate: '15%',
        image: 'https://via.placeholder.com/100?text=Kimbap',
        isSoldOut: true,
      },
    ],
    reviews: [
      {
        id: 4,
        userName: '분식매니아',
        rating: 4,
        content: '떡볶이가 맛있어요! 소스가 일반 분식집과 달라요.',
        date: '2023.05.20',
      },
    ],
  },
  {
    id: 5,
<<<<<<< HEAD
    name: '코비 과일가게',
    category: '야채/과일',
    image: 'https://via.placeholder.com/150?text=Fruits',
    distance: '1.0km',
    discount: '40%',
    phone: '02-567-8901',
=======
    name: '싱싱청과',
    category: '야채/과일',
    image: 'https://via.placeholder.com/150?text=Fruits',
    distance: '1.1km',
    discount: '10%',
    phone: '02-567-8901',
    lat: 33.452123,
    lng: 126.570563,
>>>>>>> 938344b4 (chore: Restore project files)
    products: [
      {
        id: 8,
        name: '사과 1kg',
        originalPrice: 8000,
        discountPrice: 4800,
        discountRate: '40%',
        image: 'https://via.placeholder.com/100?text=Apple',
        isSoldOut: false,
      },
      {
        id: 9,
        name: '바나나 1송이',
        originalPrice: 5000,
        discountPrice: 3000,
        discountRate: '40%',
        image: 'https://via.placeholder.com/100?text=Banana',
        isSoldOut: false,
      },
    ],
    reviews: [],
  },
  {
    id: 6,
<<<<<<< HEAD
    name: '에이븐 카페',
    category: '카페/디저트',
    image: 'https://via.placeholder.com/150?text=Cafe',
    distance: '0.4km',
    discount: '35%',
    phone: '02-678-9012',
=======
    name: '달콤 카페',
    category: '카페/디저트',
    image: 'https://via.placeholder.com/150?text=Cafe',
    distance: '1.3km',
    discount: '15%',
    phone: '02-678-9012',
    lat: 33.450378,
    lng: 126.574585,
>>>>>>> 938344b4 (chore: Restore project files)
    products: [
      {
        id: 10,
        name: '아메리카노',
        originalPrice: 4500,
        discountPrice: 2925,
        discountRate: '35%',
        image: 'https://via.placeholder.com/100?text=Americano',
        isSoldOut: false,
      },
      {
        id: 11,
        name: '치즈케이크',
        originalPrice: 6000,
        discountPrice: 3900,
        discountRate: '35%',
        image: 'https://via.placeholder.com/100?text=Cheesecake',
        isSoldOut: false,
      },
    ],
    reviews: [
      {
        id: 5,
        userName: '카페홀릭',
        rating: 5,
        content: '케이크가 정말 맛있어요! 커피와 함께 먹으니 더 맛있네요.',
        date: '2023.05.22',
      },
      {
        id: 6,
        userName: '디저트러버',
        rating: 4,
        content: '가격 대비 퀄리티가 좋아요. 다양한 디저트가 있어서 좋습니다.',
        date: '2023.05.19',
      },
    ],
  },
  {
    id: 7,
<<<<<<< HEAD
    name: '현 마트',
    category: '기타',
    image: 'https://via.placeholder.com/150?text=Mart',
    distance: '1.2km',
    discount: '10%',
    phone: '02-789-0123',
=======
    name: '만물상회',
    category: '기타',
    image: 'https://via.placeholder.com/150?text=Others',
    distance: '1.5km',
    discount: '5%',
    phone: '02-789-0123',
    lat: 33.448662,
    lng: 126.571738,
>>>>>>> 938344b4 (chore: Restore project files)
    products: [
      {
        id: 12,
        name: '즉석 도시락',
        originalPrice: 7000,
        discountPrice: 6300,
        discountRate: '10%',
        image: 'https://via.placeholder.com/100?text=Lunchbox',
        isSoldOut: true,
      },
    ],
    reviews: [
      {
        id: 7,
        userName: '알뜰쇼핑',
        rating: 3,
        content: '가격은 저렴한데 품질이 조금 아쉬워요.',
        date: '2023.05.17',
      },
    ],
  },
  {
    id: 8,
    name: '에드윈 부산 돼지국밥',
    category: '한식',
    image: 'https://via.placeholder.com/150?text=PorkSoup',
    distance: '0.8km',
    discount: '25%',
    phone: '02-890-1234',
    products: [],
    reviews: [],
  },
]
