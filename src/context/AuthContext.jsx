import { createContext, useContext, useState, useEffect } from 'react'
import * as userApi from '../api/userApi'

// 인증 컨텍스트 생성
const AuthContext = createContext()

// 인증 컨텍스트 제공자 컴포넌트
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  // 컴포넌트 마운트 시 로컬 스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')

        if (token) {
          // 토큰이 있으면 사용자 정보 요청
          try {
            const userData = await userApi.getUserInfo()
            setUser(userData)
            setIsLoggedIn(true)
          } catch (error) {
            // 토큰이 유효하지 않은 경우
            console.error('인증 오류:', error)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        }
      } catch (error) {
        console.error('인증 상태 확인 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // 로그인 함수
  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await userApi.login(credentials)

      if (response && response.message === '로그인 성공') {
        // 로그인 성공 후 사용자 정보 가져오기
        const userData = await userApi.getUserInfo()
        setUser(userData)
        setIsLoggedIn(true)
        localStorage.setItem('user', JSON.stringify(userData))
        return { success: true }
      }
      return { success: false, message: '로그인에 실패했습니다.' }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || '로그인에 실패했습니다.'
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 회원가입 함수
  const signup = async (userData) => {
    try {
      setLoading(true)
      const response = await userApi.register(userData)

      if (response && response.message === '회원가입 성공') {
        return { success: true, message: '회원가입에 성공했습니다.' }
      }
      return { success: false, message: '회원가입에 실패했습니다.' }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || '회원가입에 실패했습니다.'
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 로그아웃 함수
  const logout = async () => {
    try {
      setLoading(true)
      await userApi.logout()
      setUser(null)
      setIsLoggedIn(false)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { success: true }
    } catch (error) {
      console.error('로그아웃 오류:', error)
      return { success: false, message: '로그아웃에 실패했습니다.' }
    } finally {
      setLoading(false)
    }
  }

  // 닉네임 수정 함수
  const updateNickname = async (nickname) => {
    try {
      setLoading(true)
      const response = await userApi.updateNickname(nickname)

      if (response && response.message === '사용자 정보 수정 성공') {
        // 사용자 정보 업데이트
        const userData = await userApi.getUserInfo()
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return { success: true }
      }
      return { success: false, message: '닉네임 수정에 실패했습니다.' }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || '닉네임 수정에 실패했습니다.'
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 비밀번호 수정 함수
  const updatePassword = async (passwordData) => {
    try {
      setLoading(true)
      const response = await userApi.updatePassword(passwordData)

      if (response && response.message === '사용자 정보 수정 성공') {
        return { success: true }
      }
      return { success: false, message: '비밀번호 수정에 실패했습니다.' }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || '비밀번호 수정에 실패했습니다.'
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 회원 탈퇴 함수
  const deleteAccount = async () => {
    try {
      setLoading(true)
      const response = await userApi.deleteAccount()

      if (response && response.message === '회원 탈퇴 성공') {
        setUser(null)
        setIsLoggedIn(false)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return { success: true }
      }
      return { success: false, message: '회원 탈퇴에 실패했습니다.' }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || '회원 탈퇴에 실패했습니다.'
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        signup,
        logout,
        updateNickname,
        updatePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 인증 컨텍스트 사용을 위한 커스텀 훅
export function useAuth() {
  return useContext(AuthContext)
}
