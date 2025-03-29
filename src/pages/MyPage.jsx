import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import Header from '../components/layout/Header'
import { useAuth } from '../context/AuthContext'
import { getUserInfo } from '../api/userApi'
import { getMyReviews } from '../api/reviewApi'
import bakerDefaultImage from '../assets/images/제빵사디폴트이미지.png'

function MyPage() {
  const navigate = useNavigate()
  const { user, logout, isLoggedIn } = useAuth()
  const [userData, setUserData] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // 사용자 정보와 리뷰 목록 가져오기
  useEffect(() => {
    // 로그인한 경우에만 데이터를 가져옵니다
    // 기존 코드 주석 처리
    // const fetchUserData = async () => {
    //   try {
    //     setLoading(true)

    //     // 사용자 정보 가져오기
    //     const userResponse = await getUserInfo()
    //     if (userResponse.success) {
    //       setUserData(userResponse.data)
    //     }

    //     // 사용자 리뷰 가져오기
    //     const reviewsResponse = await getMyReviews()
    //     if (reviewsResponse && reviewsResponse.data) {
    //       setReviews(reviewsResponse.data.reviews || [])
    //     }
    //   } catch (error) {
    //     console.error('사용자 데이터 로딩 중 오류:', error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    // if (user) {
    //   fetchUserData()
    // }
    
    // 새로운 코드: 로그인 상태 확인 후 데이터 가져오기
    const fetchUserData = async () => {
      try {
        setLoading(true)

        if (isLoggedIn && user) {
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
        }
      } catch (error) {
        console.error('사용자 데이터 로딩 중 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
    // 로그인하지 않은 경우 로딩 상태 해제
    if (!isLoggedIn) {
      setLoading(false)
    }
  }, [user, isLoggedIn])

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
            {isLoggedIn ? (
              // 로그인 상태일 때 기존 UI 표시
              <>
                {/* 사용자 정보 */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      <img
                        src={bakerDefaultImage}
                        alt="프로필"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold">
                        {displayUser.nickname || '사용자'}님, 반갑수다~
                      </h3>
                      <p className="text-sm text-gray-500">
                        {displayUser.email || '이메일 정보가 없습니다'}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-[#F7B32B] font-bold">
                          {reviews.length}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          개의 리뷰
                        </span>
                      </div>
                      {displayUser.createdAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          가입일:{' '}
                          {new Date(displayUser.createdAt).toLocaleDateString()}
                        </p>
                      )}
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
              </>
            ) : (
              // 비로그인 상태일 때 표시할 UI
              <div className="p-8 flex flex-col items-center justify-center space-y-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={bakerDefaultImage}
                    alt="프로필"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">
                    로그인이 필요합니다
                  </h3>
                  <p className="text-gray-500 mb-6">
                    마이페이지를 이용하려면 로그인이 필요합니다.
                    <br />
                    로그인하고 제빵사의 다양한 기능을 사용해보세요!
                  </p>
                  <button
                    className="py-3 px-6 bg-[#F7B32B] hover:bg-[#E09D18] text-white font-bold rounded-lg transition-colors"
                    onClick={() => navigate('/login')}
                  >
                    로그인하러 가기
                  </button>
                </div>
                
                <div className="mt-8 w-full border-t pt-4 text-center">
                  <p className="text-gray-500 mb-2">아직 계정이 없으신가요?</p>
                  <button
                    className="text-[#F7B32B] font-medium"
                    onClick={() => navigate('/signup')}
                  >
                    회원가입하기
                  </button>
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
