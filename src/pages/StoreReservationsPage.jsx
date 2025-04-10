import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Navigation from '../components/layout/Navigation'
import { useAuth } from '../context/AuthContext'
import { formatDateTime } from '../utils/dateUtils'
import {
  getStoreReservations,
  updateReservationStatus,
} from '../api/reservationApi'
import { getMyStore } from '../api/storeApi'

const ReservationStatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-200'
  let textColor = 'text-gray-700'
  let statusText = '대기중'

  switch (status) {
    case 'CONFIRMED':
      bgColor = 'bg-green-100'
      textColor = 'text-green-700'
      statusText = '승인됨'
      break
    case 'CANCELED':
      bgColor = 'bg-red-100'
      textColor = 'text-red-700'
      statusText = '취소됨'
      break
    case 'COMPLETED':
      bgColor = 'bg-blue-100'
      textColor = 'text-blue-700'
      statusText = '완료'
      break
    default:
      break
  }

  return (
    <span
      className={`${bgColor} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded`}
    >
      {statusText}
    </span>
  )
}

const StoreReservationsPage = () => {
  const { storeId } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, user, checkCurrentAuthStatus } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL') // 'ALL', 'PENDING', 'CONFIRMED', 'CANCELED'
  const [error, setError] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success') // 'success' or 'error'
  const [expandedReservationId, setExpandedReservationId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [storeData, setStoreData] = useState(null)

  useEffect(() => {
    const verifyAuth = async () => {
      const isValid = await checkCurrentAuthStatus()
      if (!isValid) {
        navigate('/login')
        return
      }

      try {
        // 가게 정보 확인
        const storeResponse = await getMyStore();
        if (!storeResponse.success || !storeResponse.data || !storeResponse.data.id) {
          // 가게 정보가 없는 경우 안내 페이지로 리디렉션
          navigate('/no-registered-store');
          return;
        }
        
        setStoreData(storeResponse.data);
        
        if (!storeId) {
          setError('가게 정보를 찾을 수 없습니다.')
          setLoading(false)
          return
        }

        fetchReservations()
      } catch (error) {
        console.error('가게 정보 조회 중 오류:', error);
        navigate('/no-registered-store');
      }
    }

    verifyAuth()
  }, [navigate, storeId, checkCurrentAuthStatus])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await getStoreReservations(storeId)

      if (response.success) {
        // 최신순으로 정렬 (createdAt 기준 내림차순)
        const sortedReservations = [...response.data].sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
        setReservations(sortedReservations)
        setError(null)
      } else {
        setError(response.message || '예약 목록을 불러오는데 실패했습니다.')
        setReservations([])
      }
    } catch (err) {
      console.error('예약 목록 조회 오류:', err)
      setError('예약 목록을 불러오는데 실패했습니다.')
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const handleReservationStatus = async (reservationId, status) => {
    try {
      setLoading(true)

      const statusData = {
        reservationId,
        status,
      }

      const response = await updateReservationStatus(statusData)

      if (response.success) {
        const message =
          status === 'CONFIRMED'
            ? '예약이 승인되었습니다'
            : '예약이 거절되었습니다'

        const toastType = status === 'CONFIRMED' ? 'success' : 'error'
        showToastMessage(message, toastType)

        setReservations((prev) =>
          prev.map((reservation) =>
            reservation.id === reservationId
              ? { ...reservation, status: status }
              : reservation,
          ),
        )
      } else {
        showToastMessage(
          response.message || '예약 상태 변경에 실패했습니다',
          'error',
        )
      }
    } catch (error) {
      console.error('예약 상태 변경 중 오류:', error)
      showToastMessage('예약 상태 변경 중 오류가 발생했습니다', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const toggleReservationDetails = (reservationId) => {
    setExpandedReservationId(
      expandedReservationId === reservationId ? null : reservationId,
    )
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setActiveFilter(newFilter)
  }

  const filteredReservations =
    filter === 'ALL'
      ? reservations
      : reservations.filter((r) => r.status === filter)

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return '대기중'
      case 'CONFIRMED':
        return '승인됨'
      case 'CANCELED':
        return '거절됨'
      case 'COMPLETED':
        return '완료됨'
      default:
        return '상태 미정'
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="예약 목록" onBack={() => navigate('/business')} />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F7B32B]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <Header title="예약 목록" onBack={() => navigate('/business')} />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="예약 목록" onBack={() => navigate('/business')} />

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white p-4 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            가게 예약 목록
          </h1>
          <p className="text-sm text-gray-600">
            모든 예약 내역을 확인하고 관리할 수 있습니다.
          </p>
        </div>

        <div className="px-3 pt-3 pb-3">
          <div className="bg-white rounded-lg shadow-sm p-2 flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeFilter === 'ALL'
                  ? 'bg-[#F7B32B] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleFilterChange('ALL')}
            >
              전체
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeFilter === 'PENDING'
                  ? 'bg-[#F7B32B] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleFilterChange('PENDING')}
            >
              대기중
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeFilter === 'CONFIRMED'
                  ? 'bg-[#F7B32B] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleFilterChange('CONFIRMED')}
            >
              승인됨
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeFilter === 'CANCELED'
                  ? 'bg-[#F7B32B] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleFilterChange('CANCELED')}
            >
              거절됨
            </button>
          </div>
        </div>

        <div className="p-3">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#F7B32B]"></div>
            </div>
          ) : filteredReservations.length > 0 ? (
            <div className="space-y-4">
              {filteredReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-lg shadow overflow-hidden cursor-pointer"
                  onClick={() => toggleReservationDetails(reservation.id)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          {reservation.userNickname ||
                            reservation.customerName ||
                            '고객'}
                          {reservation.isZerowaste && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              제로웨이스트
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {reservation.productName || '상품'}{' '}
                          {reservation.quantity || 1}개
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(reservation.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <ReservationStatusBadge status={reservation.status} />
                        <div className="ml-2 text-gray-500">
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expandedReservationId === reservation.id
                                ? 'transform rotate-180'
                                : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {expandedReservationId === reservation.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium text-gray-700">
                              예약 번호:
                            </span>{' '}
                            <span className="text-gray-600">
                              {reservation.id}
                            </span>
                          </p>
                          {reservation.notes && (
                            <p className="text-sm">
                              <span className="font-medium text-gray-700">
                                요청사항:
                              </span>{' '}
                              <span className="text-gray-600">
                                {reservation.notes}
                              </span>
                            </p>
                          )}
                        </div>

                        {reservation.status === 'PENDING' && (
                          <div className="mt-4 flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReservationStatus(
                                  reservation.id,
                                  'CANCELED',
                                )
                              }}
                              className="flex-1 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition"
                            >
                              거절
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReservationStatus(
                                  reservation.id,
                                  'CONFIRMED',
                                )
                              }}
                              className="flex-1 py-2 bg-[#F7B32B] hover:bg-[#E09D18] text-white rounded-lg transition"
                            >
                              승인
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <p className="text-gray-500 text-sm">
                {filter === 'ALL'
                  ? '예약 내역이 없습니다.'
                  : `${getStatusText(filter)} 상태의 예약이 없습니다.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div
          className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 ${
            toastType === 'error' ? 'bg-red-500' : 'bg-green-500'
          } text-white`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default StoreReservationsPage
