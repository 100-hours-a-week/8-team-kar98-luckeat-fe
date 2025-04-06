import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import Header from '../components/layout/Header'
import { useAuth } from '../context/AuthContext'
import { getUserInfo } from '../api/userApi'
import { getMyStore } from '../api/storeApi'
import { getStorePendingReservations, updateReservationStatus } from '../api/reservationApi'
import StoreCard from '../components/store/StoreCard'
import { formatDate, formatTime } from '../utils/dateUtils'

function BusinessPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [userData, setUserData] = useState(null)
  const [storeData, setStoreData] = useState(null)
  const [pendingReservations, setPendingReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success') // 'success' or 'error'
  const [reservationStatuses, setReservationStatuses] = useState({}) // 예약 상태 저장
  const [error, setError] = useState(null)
  const [reservationError, setReservationError] = useState(null)
  const [logoutError, setLogoutError] = useState(null)

  // 사용자 역할 체크
  useEffect(() => {
    if (user && user.role === 'BUYER') {
      navigate('/mypage')
    }
  }, [user, navigate])

  // 예약 더미 데이터
  const dummyReservations = [
    {
      id: 1,
      customerName: '김고객',
      quantity: 2,
      reservationDate: '2023-05-15',
      reservationTime: '18:00',
      isZeroWaste: true
    },
    {
      id: 2,
      customerName: '박손님',
      quantity: 1,
      reservationDate: '2023-05-15',
      reservationTime: '19:30',
      isZeroWaste: false
    },
    {
      id: 3,
      customerName: '이방문',
      quantity: 3,
      reservationDate: '2023-05-16',
      reservationTime: '12:00',
      isZeroWaste: true
    },
    // 추가 데이터 (스크롤 테스트용)
    {
      id: 4,
      customerName: '강고객',
      quantity: 2,
      reservationDate: '2023-05-17',
      reservationTime: '13:00',
      isZeroWaste: true
    },
    {
      id: 5,
      customerName: '윤손님',
      quantity: 3,
      reservationDate: '2023-05-17',
      reservationTime: '14:30',
      isZeroWaste: false
    },
    {
      id: 6,
      customerName: '임방문',
      quantity: 1,
      reservationDate: '2023-05-17',
      reservationTime: '16:00',
      isZeroWaste: true
    },
    {
      id: 7,
      customerName: '한손님',
      quantity: 2,
      reservationDate: '2023-05-18',
      reservationTime: '12:30',
      isZeroWaste: false
    },
    {
      id: 8,
      customerName: '오방문',
      quantity: 4,
      reservationDate: '2023-05-18',
      reservationTime: '18:30',
      isZeroWaste: true
    }
  ]

  // 사용자 정보와 가게 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 사용자 정보 가져오기
        const userResponse = await getUserInfo()
        if (!userResponse.success) {
          setError('사용자 정보를 불러오는데 실패했습니다')
          return
        }

        // 가게 정보 가져오기 (판매자인 경우)
        if (userResponse.data.role === 'SELLER') {
          // 가게 정보 요청
          const storeResponse = await getMyStore()
          if (storeResponse.success) {
            setStoreData(storeResponse.data)

            // 대기 중인 예약 가져오기
            const pendingResponse = await getStorePendingReservations(storeResponse.data.id)
            if (pendingResponse.success) {
              setPendingReservations(pendingResponse.data)
            } else {
              // 대기 중인 예약 조회 실패 로그 제거
            }
          }
        }

        setUserData(userResponse.data)
      } catch (error) {
        // 데이터 로딩 중 오류 로그 제거
        setError('데이터를 불러오는데 실패했습니다')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 예약 상태 업데이트 (승인/거절)
  const handleReservationStatus = async (reservationId, status) => {
    try {
      const response = await updateReservationStatus(reservationId, {
        status: status,
      })

      if (response.success) {
        // 성공 시 상태 업데이트
        setPendingReservations((prevReservations) =>
          prevReservations.filter((res) => res.id !== reservationId),
        )
        // 새로운 알림 목록 가져오기
        if (storeData) {
          const pendingResponse = await getStorePendingReservations(storeData.id)
          if (pendingResponse.success) {
            setPendingReservations(pendingResponse.data)
          }
        }
      } else {
        setReservationError(response.message)
      }
    } catch (error) {
      // 예약 상태 변경 중 오류 로그 제거
      setReservationError('예약 상태 변경 중 오류가 발생했습니다')
    }
  }

  // 토스트 메시지 표시 함수
  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const handleLogout = async () => {
    try {
      const result = await logout()
      if (result.success) {
        // 로그아웃 성공 시 처리
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        navigate('/login')
      } else {
        // 로그아웃 실패 로그 제거
        setLogoutError(result.message)
      }
    } catch (error) {
      // 로그아웃 중 오류 발생 로그 제거
      setLogoutError('로그아웃 처리 중 오류가 발생했습니다')
    }
  }

  // API에서 가져온 사용자 정보가 없으면, 로컬 상태의 사용자 정보 사용
  const displayUser = userData || user || {}

  // 가게 상세보기 이동
  const handleStoreDetail = () => {
    if (storeData && storeData.id) {
      // 가게 상세보기 이동 로그 제거
      navigate(`/stores/${storeData.id}`)
    }
  }

  // 럭키트 관리 페이지 이동
  const handleProductManagement = () => {
    if (storeData && storeData.id) {
      // 럭키트 관리 이동 로그 제거
      navigate(`/stores/${storeData.id}/products`)
    }
  }

  // 가게 예약 리스트 페이지 이동
  const handleReservationsList = () => {
    if (storeData && storeData.id) {
      // 가게 예약 리스트 이동 로그 제거
      navigate(`/stores/${storeData.id}/reservations`)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <Header title="사업자 페이지" />

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F7B32B]"></div>
          </div>
        ) : (
          <>
            {/* 사업자 페이지 제목 */}
            <div className="p-6 text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                사업자 페이지
              </h1>
              <p className="text-gray-600 mt-2">
                사장님의 승인을 기다리는 예약목록들이 있어요
              </p>
            </div>
            
            {/* 펜딩 예약 목록 */}
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-gray-700">대기 중인 예약</h2>
                {pendingReservations.length > 3 && (
                  <span className="text-xs text-gray-500">
                    스크롤하여 더 많은 예약을 확인하세요 ↓
                  </span>
                )}
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 overflow-y-auto" style={{ maxHeight: '180px' }}>
                {pendingReservations.length > 0 ? (
                  <div className="divide-y">
                    {pendingReservations.map((reservation) => (
                      <div key={reservation.id} className="py-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{reservation.userNickname || reservation.userId || '고객'}</p>
                          <p className="text-xs text-gray-500">{reservation.productName || '상품'} {reservation.quantity || 1}개</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(reservation.createdAt)} {formatTime(reservation.createdAt)}
                          </p>
                          {reservation.isZerowaste && (
                            <p className="text-xs text-green-600 font-medium">
                              제로웨이스트 손님 (포장용기 지참)
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleReservationStatus(reservation.id, 'CONFIRMED')}
                            className={`px-3 py-1 text-white text-sm rounded transition-colors ${
                              reservationStatuses[reservation.id] === 'CONFIRMED'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-gray-400 hover:bg-gray-500'
                            }`}
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleReservationStatus(reservation.id, 'CANCELED')}
                            className={`px-3 py-1 text-white text-sm rounded transition-colors ${
                              reservationStatuses[reservation.id] === 'CANCELED'
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-gray-400 hover:bg-gray-500'
                            }`}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">대기 중인 예약이 없습니다</p>
                )}
              </div>
            </div>
            
            <div className="mt-2">
              {/* 메뉴 목록 */}
              <div className="p-4 space-y-4">
                <div className="border-b pb-2">
                  <button
                    className="w-full text-left font-bold text-gray-700 flex justify-between items-center"
                    onClick={handleStoreDetail}
                    disabled={!storeData}
                  >
                    <span>가게 상세보기</span>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>

                <div className="border-b pb-2">
                  <button
                    className="w-full text-left font-bold text-gray-700 flex justify-between items-center"
                    onClick={handleProductManagement}
                    disabled={!storeData}
                  >
                    <span>럭키트 관리</span>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>

                <div className="border-b pb-2">
                  <button
                    className="w-full text-left font-bold text-gray-700 flex justify-between items-center"
                    onClick={handleReservationsList}
                    disabled={!storeData}
                  >
                    <span>가게 예약 리스트</span>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>

                <div className="border-b pb-2">
                  <button
                    className="w-full text-left font-bold text-gray-700 flex justify-between items-center"
                    onClick={() => navigate('/edit-store')}
                  >
                    <span>가게 정보 수정</span>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>

                <div className="border-b pb-2">
                  <button
                    className="w-full text-left font-bold text-gray-700 flex justify-between items-center"
                    onClick={() => navigate('/edit-profile')}
                  >
                    <span>내 정보 수정</span>
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
                    <span className="text-gray-500 font-bold">고객 문의</span>
                    <span className="text-gray-400">example@example.com</span>
                  </div>
                </div>
              </div>
            </div>
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

      {/* 토스트 메시지 */}
      {showToast && (
        <div
          className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 ${
            toastType === 'error' ? 'bg-red-500' : 'bg-green-500'
          } text-white`}
        >
          {toastMessage}
        </div>
      )}

      <Navigation />
    </div>
  )
}

export default BusinessPage
