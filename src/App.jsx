import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { Provider as JotaiProvider } from 'jotai'
import { useAtom, useAtomValue } from 'jotai'
import {
  authAtom,
  isLoggedInAtom,
  checkAuthStatusAction,
} from './atoms/authAtom'
import * as Sentry from '@sentry/react'
// useAuthStore 사용하는 라우트 추가에 필요할 경우 추가
// import useAuthStore from './store/authStore'

// 네비게이션 컴포넌트는 대부분의 페이지에서 사용되므로 미리 로드
const Navigation = lazy(() => import('./components/layout/Navigation'))

// 지연 로딩을 위한 페이지 컴포넌트 lazy 임포트 - 우선순위에 따라 분리
// 1. 자주 접근하는 핵심 페이지
const HomePage = lazy(() => 
  import('./pages/HomePage').then((module) => ({
    default: module.default,
  }))
)

const MapPage = lazy(() => 
  import('./pages/MapPage').then((module) => ({
    default: module.default,
  }))
)

// 2. 인증 관련 페이지
const LoginPage = lazy(() => 
  import('./pages/LoginPage').then((module) => ({
    default: module.default,
  }))
)

const SignupPage = lazy(() => 
  import('./pages/SignupPage').then((module) => ({
    default: module.default,
  }))
)

// 3. 자주 방문하는 세컨더리 페이지
const MyPage = lazy(() => 
  import('./pages/MyPage').then((module) => ({
    default: module.default,
  }))
)

const StoreDetailPage = lazy(() => 
  import('./pages/StoreDetailPage').then((module) => ({
    default: module.default,
  }))
)

// 4. 덜 자주 방문하는 페이지
const EditProfilePage = lazy(() => 
  import('./pages/EditProfilePage').then((module) => ({
    default: module.default,
  }))
)

const UserReservationsPage = lazy(() => 
  import('./pages/UserReservationsPage').then((module) => ({
    default: module.default,
  }))
)

// 5. 비즈니스 기능 관련 페이지 (사업자 전용)
const BusinessPage = lazy(() => 
  import('./pages/BusinessPage').then((module) => ({
    default: module.default,
  }))
)

const ProductManagementPage = lazy(() => 
  import('./pages/ProductManagementPage').then((module) => ({
    default: module.default,
  }))
)

const EditStorePage = lazy(() => 
  import('./pages/EditStorePage').then((module) => ({
    default: module.default,
  }))
)

const StoreReservationsPage = lazy(() => 
  import('./pages/StoreReservationsPage').then((module) => ({
    default: module.default,
  }))
)

// 6. 리뷰 관련 페이지
const ReviewManagementPage = lazy(() => 
  import('./pages/ReviewManagementPage').then((module) => ({
    default: module.default,
  }))
)

// 7. 오류 및 특수 페이지
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const NoRegisteredStorePage = lazy(() => import('./pages/NoRegisteredStorePage'))

// 로딩 컴포넌트
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen bg-bread-light">
    <div className="w-[390px] h-[775px] bg-white flex flex-col border border-gray-200 rounded-2xl overflow-hidden relative p-6 shadow-soft">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  </div>
)

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

// 사파리 감지 함수
const detectSafari = () => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  if (isSafari) {
    document.body.classList.add('safari-browser')
  }
}

// 토큰 유효성 검사 래퍼 컴포넌트
function AuthWrapper({ children }) {
  const [authState] = useAtom(authAtom)
  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 현재 경로가 인증이 필요하지 않은 경로인지 확인
    const publicPaths = ['/login', '/signup', '/', '/home', '/map']
    const isStoreDetailPath = /^\/store\/[^/]+$/.test(location.pathname)
    const isPublicPath = publicPaths.includes(location.pathname) || isStoreDetailPath

    // 인증이 필요한 경로에서만 토큰 유효성 검사
    if (!isPublicPath) {
      const isValid = checkAuthStatusAction(authState)

      // 유효하지 않은 토큰을 가진 경우 로그인 페이지로 리다이렉션
      if (!isValid && location.pathname !== '/login') {
        navigate('/login', {
          replace: true,
          state: {
            from: location.pathname,
            message: '로그인이 필요하거나 로그인 세션이 만료되었습니다. 다시 로그인해 주세요.'
          },
        })
      }
    }
  }, [location.pathname, isLoggedIn, authState, navigate, location])

  return children
}

// 네비게이션 바가 필요한지 확인하는 함수
const shouldShowNavigation = (pathname) => {
  // 네비게이션 바를 표시하지 않을 경로 목록
  const hideNavigationPaths = []
  return !hideNavigationPaths.includes(pathname)
}

function AppRoutes() {
  const location = useLocation()
  
  return (
    <AuthWrapper>
      <Suspense fallback={<LoadingFallback />}>
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
          <Route
            path="/store/:storeId/reservation"
            element={<StoreReservationsPage />}
          />
          <Route path="/reservation" element={<UserReservationsPage />} />
          <Route
            path="/no-registered-store"
            element={<NoRegisteredStorePage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      {shouldShowNavigation(location.pathname) && (
        <Suspense fallback={<div className="h-[50px] bg-white border-t border-gray-200"></div>}>
          <Navigation />
        </Suspense>
      )}
    </AuthWrapper>
  )
}

function AppContent() {
  useEffect(() => {
    detectSafari()
  }, [])

  return (
    <Sentry.ErrorBoundary
      fallback={<FallbackComponent />}
      showDialog
      beforeCapture={(scope) => {
        scope.setTag('location', window.location.href)
        scope.setExtra('state', 'error_boundary_triggered')
      }}
    >
      <Router>
        <div className="flex justify-center items-center min-h-screen h-full bg-bread-light">
          <div className="w-[390px] md:h-screen h-[100vh] max-h-[100vh] md:max-h-screen sm:max-h-[775px] bg-white flex flex-col overflow-auto relative shadow-hover border border-jeju-stone-light app-container pb-[50px]">
            <AppRoutes />
          </div>
        </div>
      </Router>
    </Sentry.ErrorBoundary>
  )
}

function App() {
  return (
    <JotaiProvider>
      <AppContent />
    </JotaiProvider>
  )
}

export default Sentry.withProfiler(App, { name: 'LuckEatApp' })
