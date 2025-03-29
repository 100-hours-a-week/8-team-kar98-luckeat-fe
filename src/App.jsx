import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import StoreDetailPage from './pages/StoreDetailPage'
import EditProfilePage from './pages/EditProfilePage'
import ReviewManagementPage from './pages/ReviewManagementPage'
import BusinessPage from './pages/BusinessPage'
import ProductManagementPage from './pages/ProductManagementPage'
import EditStorePage from './pages/EditStorePage'
import { AuthProvider, useAuth } from './context/AuthContext'
import * as Sentry from '@sentry/react'
import { hasValidAccessToken } from './utils/jwtUtils'

// 오류 발생 시 보여줄 폴백 컴포넌트
const FallbackComponent = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-bread-light">
      <div className="w-[390px] h-[775px] bg-white flex flex-col border border-gray-200 rounded-2xl overflow-hidden relative p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          앗! 문제가 발생했습니다.
        </h2>
        <p className="mb-6">
          죄송합니다. 예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나
          나중에 다시 시도해보세요.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="jeju-btn jeju-btn-primary"
        >
          페이지 새로고침
        </button>
      </div>
    </div>
  )
}

// 토큰 유효성 검사 래퍼 컴포넌트
function AuthWrapper({ children }) {
  const { checkCurrentAuthStatus } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 모든 사용자가 모든 페이지에 접근할 수 있도록 변경
    // 단, 토큰이 있는 경우 토큰 유효성 검사는 그대로 수행 (로그인 상태 유지용)
    if (localStorage.getItem('accessToken')) {
      checkCurrentAuthStatus()
    }
    // 주의: 이 변경으로 모든 사용자가 모든 페이지에 접근할 수 있게 됩니다.
    // 필요한 경우 원래 코드로 되돌리세요.
  }, [location.pathname, checkCurrentAuthStatus, navigate, location])

  return children
}

function AppRoutes() {
  return (
    <AuthWrapper>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/store/:id" element={<StoreDetailPage />} />
        <Route path="/reviews" element={<ReviewManagementPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route
          path="/store/:storeId/products"
          element={<ProductManagementPage />}
        />
        <Route path="/edit-store" element={<EditStorePage />} />
      </Routes>
    </AuthWrapper>
  )
}

function App() {
  return (
    <AuthProvider>
      <Sentry.ErrorBoundary fallback={<FallbackComponent />}>
        <Router>
          <div className="flex justify-center items-center min-h-screen bg-bread-light">
            <div className="w-[390px] h-[775px] bg-white flex flex-col  overflow-hidden relative shadow-hover border border-jeju-stone-light">
              <AppRoutes />
            </div>
          </div>
        </Router>
      </Sentry.ErrorBoundary>
    </AuthProvider>
  )
}

export default Sentry.withProfiler(App)
