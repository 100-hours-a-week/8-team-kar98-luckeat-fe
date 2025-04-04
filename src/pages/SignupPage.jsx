import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import { useAuth } from '../context/AuthContext'
import Header from '../components/layout/Header'

function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [userType, setUserType] = useState('일반')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  // 디버깅용 - 팝업 표시 상태 변경 감지
  useEffect(() => {
    console.log('팝업 표시 상태 변경:', showSuccessPopup)
  }, [showSuccessPopup])

  // 이메일 입력 처리 - 공백 제거 및 소문자 변환
  const handleEmailInput = (e) => {
    // 입력값에서 모든 공백 제거 후 소문자로 변환
    const value = e.target.value.replace(/\s+/g, '').toLowerCase()
    setEmail(value)
  }

  // 닉네임 입력 처리 - 앞뒤 공백 제거
  const handleNicknameInput = (e) => {
    // 입력값에서 앞뒤 공백 제거
    const value = e.target.value.trim()
    setNickname(value)
  }

  // 한글 입력을 막는 함수
  const handlePasswordInput = (e) => {
    // 정규식을 사용하여 한글 입력 감지
    const isHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(e.target.value)
    if (isHangul) {
      // 한글이 입력되면 이전 상태를 유지 (한글 입력 차단)
      return
    }
    // 모든 공백 제거
    const value = e.target.value.replace(/\s+/g, '')
    // 한글이 아닌 경우 상태 업데이트
    setPassword(value)
  }

  // 한글 입력을 막는 함수 (비밀번호 확인용)
  const handleConfirmPasswordInput = (e) => {
    // 정규식을 사용하여 한글 입력 감지
    const isHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(e.target.value)
    if (isHangul) {
      // 한글이 입력되면 이전 상태를 유지 (한글 입력 차단)
      return
    }
    // 모든 공백 제거
    const value = e.target.value.replace(/\s+/g, '')
    // 한글이 아닌 경우 상태 업데이트
    setConfirmPassword(value)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    
    // 폼 유효성 검사 강화
    if (!email) {
      setError('이메일을 입력해주세요.')
      return
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('유효한 이메일 형식이 아닙니다.\n올바른 이메일 주소를 입력해주세요.')
      return
    }
    
    if (!nickname) {
      setError('닉네임을 입력해주세요.')
      return
    }

    // 닉네임 길이 검사
    if (nickname.length < 2 || nickname.length > 10) {
      setError('닉네임은 2자 이상 10자 이하로 입력해주세요.')
      return
    }
    
    if (!password) {
      setError('비밀번호를 입력해주세요.')
      return
    }
    
    // 비밀번호 길이 검사
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    
    // 비밀번호 복잡성 검사 (최소한 하나의 문자와 숫자)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/
    if (!passwordRegex.test(password)) {
      setError(
        '비밀번호는 최소 8자 이상이며,\n영문자와 숫자를 모두 포함해야 합니다.'
      )
      return
    }
    
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다. 다시 확인해주세요.')
      return
    }
    
    if (!userType) {
      setError('회원 유형을 선택해주세요.')
      return
    }

    try {
      setLoading(true)
      
      const userData = {
        email,
        password,
        nickname,
        userType,
      }
      
      console.log('회원가입 요청 데이터:', userData)
      
      const response = await signup(userData)
      console.log('회원가입 응답:', response)
      
      if (response.success) {
        // 성공 팝업 표시
        setShowSuccessPopup(true)
        // 폼 초기화
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setNickname('')
        setUserType('일반')
      } else {
        // 오류 메시지 개선
        if (response.message.includes('이미 존재')) {
          if (response.message.includes('이메일')) {
            setError('이미 가입된 이메일입니다.\n다른 이메일로 시도하거나 로그인해 주세요.')
          } else if (response.message.includes('닉네임')) {
            setError('이미 사용 중인 닉네임입니다.\n다른 닉네임을 입력해 주세요.')
          } else {
            setError(response.message)
          }
        } else if (response.message.includes('필수')) {
          setError('모든 필수 정보를 입력해주세요.\n누락된 정보가 없는지 확인하세요.')
        } else {
          setError(
            response.message || '회원가입에 실패했습니다.\n다시 시도해주세요.'
          )
        }
      }
    } catch (error) {
      console.error('회원가입 오류:', error)
      setError(
        '회원가입 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.'
      )
    } finally {
      setLoading(false)
    }
  }

  // 로그인 페이지로 이동
  const goToLogin = () => {
    console.log('로그인 페이지로 이동')
    setShowSuccessPopup(false) // 팝업 닫기
    navigate('/login')
  }

  // 홈 화면으로 이동
  const goToHome = () => {
    console.log('홈 화면으로 이동')
    setShowSuccessPopup(false) // 팝업 닫기
    navigate('/')
  }

  // 회원가입 성공 팝업 렌더링
  const renderSuccessPopup = () => {
    console.log('팝업 렌더링 함수 호출됨, 상태:', showSuccessPopup)

    if (!showSuccessPopup) return null

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">회원가입 완료!</h3>
            <p className="text-gray-600 mb-6">
              럭키트 회원가입이 성공적으로 완료되었습니다.
              <br />
              로그인 후 다양한 서비스를 이용해보세요.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={goToLogin}
                className="w-full py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors"
              >
                로그인하러 가기
              </button>
              <button
                onClick={goToHome}
                className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
              >
                홈 화면으로 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  console.log('SignupPage 렌더링, 팝업 상태:', showSuccessPopup)

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <Header title="회원가입" />

      <div className="flex-1 p-4 overflow-y-auto">
        {/* 회원가입 안내 */}
        <div className="mb-4 text-center">
          <p className="text-gray-600">
            럭키트에 오신 것을 환영합니다!<br />
            아래 정보를 입력하여 회원가입을 완료해주세요.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2 mb-4">
            <p className="font-medium">회원가입 오류</p>
            {error.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}

        {/* 회원가입 폼 */}
        <form onSubmit={handleSignup} className="space-y-6 mt-4">
          {/* 회원 유형 선택 */}
          <div className="border rounded-lg p-4 bg-yellow-50">
            <label className="block text-sm font-medium mb-2">회원 유형 선택</label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="일반"
                  checked={userType === '일반'}
                  onChange={() => setUserType('일반')}
                  className="mr-2 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="flex items-center">
                  <span className="w-4 h-4 bg-yellow-500 rounded-full mr-1"></span>
                  일반 사용자
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="사업자"
                  checked={userType === '사업자'}
                  onChange={() => setUserType('사업자')}
                  className="mr-2 text-yellow-500 focus:ring-yellow-500"
                />
                <span>사업자</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              사업자로 가입하시면 가게 등록 및 상품 관리가 가능합니다.
            </p>
          </div>

          {/* 나머지 폼 필드들 */}
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                이메일 주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="이메일 주소를 입력해주세요."
                value={email}
                onChange={handleEmailInput}
                className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                로그인 시 사용할 이메일 주소를 입력하세요. (예: example@example.com)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="닉네임을 입력해주세요."
                value={nickname}
                onChange={handleNicknameInput}
                className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                2~10자 이내로 입력해주세요. 서비스 내에서 표시될 이름입니다.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={handlePasswordInput}
                className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">안전한 비밀번호 조건:</span> 8자 이상, 영문 소문자, 숫자를 각각 최소 1개 포함해야 합니다.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="비밀번호를 다시 입력해주세요."
                value={confirmPassword}
                onChange={handleConfirmPasswordInput}
                className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                위에서 입력한 비밀번호와 동일하게 입력해주세요.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors"
            disabled={loading}
          >
            {loading ? '처리 중...' : '회원가입 완료하기'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">이미 럭키트 회원이신가요?</p>
          <button
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => navigate('/login')}
          >
            로그인하기
          </button>
        </div>
      </div>
      
      {/* 회원가입 성공 팝업 - renderSuccessPopup 함수 사용 */}
      {renderSuccessPopup()}

      <Navigation />
    </div>
  )
}

export default SignupPage
