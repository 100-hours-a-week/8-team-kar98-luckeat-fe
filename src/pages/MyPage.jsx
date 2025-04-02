import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import Header from '../components/layout/Header'
import { useAuth } from '../context/AuthContext'
import { getUserInfo } from '../api/userApi'
import { getMyReviews } from '../api/reviewApi'
import { getUserCompletedReservations } from '../api/reservationApi'
import { 
  calculateSavedCO2,
  calculatePlantedTrees,
  calculateSavedMoney,
  formatCurrency,
} from '../utils/ecoUtils'
import bakerDefaultImage from '../assets/images/제빵사디폴트이미지.png'

function MyPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [userData, setUserData] = useState(null)
  const [reviews, setReviews] = useState([])
  const [completedOrders, setCompletedOrders] = useState([])
  const [ecoStats, setEcoStats] = useState({
    savedMoney: 0,
    savedCO2: 0,
    plantedTrees: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // 사용자 정보와 리뷰 목록 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // 사용자 정보 가져오기
        const userResponse = await getUserInfo()
        if (userResponse.success) {
          setUserData(userResponse.data)
        }

        // 사용자 리뷰 가져오기
        const reviewsResponse = await getMyReviews()
        if (reviewsResponse && reviewsResponse.data) {
          setReviews(reviewsResponse.data.reviews || [])
        }

        // 사용자의 완료된 주문 가져오기
        const ordersResponse = await getUserCompletedReservations()
        if (ordersResponse && ordersResponse.success) {
          const orders = ordersResponse.data.completedOrders || []
          setCompletedOrders(orders)
          
          // 환경 지표 계산을 위한 데이터 매핑
          const mappedOrders = orders.map((order) => ({
            originalPrice: order.originalPrice || order.product?.price || 0,
            discountPrice: 
              order.discountPrice || 
              order.product?.price - 
                (order.product?.price * (order.product?.discountRate || 0)) / 
                  100 || 
              0,
            quantity: order.quantity || 1
          }))
          
          // 환경 지표 계산
          const savedMoney = calculateSavedMoney(mappedOrders)
          const orderCount = orders.length
          const savedCO2 = calculateSavedCO2(orderCount)
          const plantedTrees = calculatePlantedTrees(savedCO2)
          
          setEcoStats({
            savedMoney,
            savedCO2,
            plantedTrees
          })
        }
      } catch (error) {
        console.error('사용자 데이터 로딩 중 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  const handleLogout = async () => {
    try {
      const result = await logout()
      if (result.success) {
        navigate('/')
      } else {
        console.error('로그아웃 실패:', result.message)
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
    } finally {
      setShowLogoutModal(false)
    }
  }

  // API에서 가져온 사용자 정보가 없으면, 로컬 상태의 사용자 정보 사용
  const displayUser = userData || user || {}

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <Header title="마이페이지" />

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F7B32B]"></div>
          </div>
        ) : (
          <>
            {/* 프로필 카드 */}

            <div className="m-4 p-6 bg-[#ffe985cc] rounded-2xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-black">
                    {displayUser.nickname || '럭킷'}
                  </h2>
                  <div className="text-base text-gray-800">
                    {displayUser.email || 'luckeat@example.com'}
                  </div>
                  <div className="mt-1 text-sm text-gray-800">
                    <span className="font-bold">{reviews.length || 0}</span>
                    <span className="ml-1">개의 리뷰</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-800">
                    <span className="font-bold">{completedOrders.length || 0}</span>
                    <span className="ml-1">개의 주문 완료</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-1 border-t border-black border-opacity-20">
                <div className="grid grid-cols-3 gap-1">
                  <div className="rounded-xl p-1 text-center">
                    <div className="text-lg mb-0">💵</div>
                    <div className="text-base font-bold text-black">{formatCurrency(ecoStats.savedMoney)}원</div>
                    <div className="text-xs text-gray-700">아낀 금액</div>
                  </div>
                  <div className="rounded-xl p-1 text-center">
                    <div className="text-lg mb-0">🌎</div>
                    <div className="text-base font-bold text-black">{ecoStats.savedCO2}kg</div>
                    <div className="text-xs text-gray-700">절약한 CO2</div>
                  </div>
                  <div className="rounded-xl p-1 text-center">
                    <div className="text-lg mb-0">🌳</div>
                    <div className="text-base font-bold text-black">{ecoStats.plantedTrees}그루</div>
                    <div className="text-xs text-gray-700">심은 나무</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 메뉴 목록 */}
            <div className="p-4 space-y-4">
              <div className="border-b pb-2">
                <button
                  className="w-full text-left font-bold text-gray-700 flex justify-between items-center"
                  onClick={() => navigate('/reviews')}
                >
                  <span>리뷰 관리</span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>

              <div className="border-b pb-2">
                <button
                  className="w-full text-left font-bold text-gray-700 flex justify-between items-center"
                  onClick={() => navigate('/reservation')}
                >
                  <span>예약 확인</span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>

              <div className="border-b pb-2">
                <button
                  className="w-full text-left font-bold text-gray-700 flex justify-between items-center"
                  onClick={() => navigate('/edit-profile')}
                >
                  <span>회원 정보 수정</span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>

              <div className="border-b pb-2">
                <button
                  className="w-full text-left font-bold text-gray-700 flex justify-between items-center"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <span>로그아웃</span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>

              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">고객 문의</span>
                  <span className="text-gray-400">luckeat@example.com</span>
                </div>
              </div>
            </div>
            
            {/* 환경 기여 섹션 */}
            {completedOrders.length > 0 && (
              <div className="p-4">
                <h3 className="font-bold text-lg mb-3">나의 환경 기여</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    럭키트를 통해 음식물 쓰레기를 줄이고 환경을 보호하고 있어요!
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">주문 횟수</p>
                      <p className="font-bold text-green-600">{completedOrders.length}회</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">절약 금액</p>
                      <p className="font-bold text-green-600">{formatCurrency(ecoStats.savedMoney)}원</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">CO2 감소</p>
                      <p className="font-bold text-green-600">{ecoStats.savedCO2}kg</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 푸터 */}
        <div className="p-4 mt-auto">
          <p className="text-center text-sm text-gray-400">
            Copyright @MYRO Corp. All Rights Reserved
          </p>
        </div>
      </div>

      {/* 로그아웃 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 w-4/5 max-w-xs">
            <h3 className="font-bold text-lg text-center mb-4">로그아웃</h3>
            <p className="text-center mb-4">로그아웃 하시겠습니까?</p>
            <div className="flex space-x-2">
              <button
                className="flex-1 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg"
                onClick={() => setShowLogoutModal(false)}
              >
                취소
              </button>
              <button
                className="flex-1 py-2 bg-[#F7B32B] hover:bg-[#E09D18] text-white font-bold rounded-lg transition-colors"
                onClick={handleLogout}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  )
}

export default MyPage
