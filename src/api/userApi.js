import apiClient from './apiClient';

// 회원 가입
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 로그인
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/users/login', credentials);
    // 로그인 성공 시 토큰 저장
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 로그아웃
export const logout = async () => {
  try {
    const response = await apiClient.post('/users/logout');
    // 로그아웃 성공 시 토큰 제거
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 이메일 중복 확인
export const checkEmailDuplicate = async (email) => {
  try {
    const response = await apiClient.get(`/users/emailValid?email=${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 닉네임 중복 확인
export const checkNicknameDuplicate = async (nickname) => {
  try {
    const response = await apiClient.get(`/users/nicknameVaild?nickname=${nickname}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 회원 정보 조회
export const getUserInfo = async () => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 닉네임 수정
export const updateNickname = async (nickname) => {
  try {
    const response = await apiClient.patch('/users/nickname', { nickname });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 비밀번호 수정
export const updatePassword = async (passwordData) => {
  try {
    const response = await apiClient.patch('/users/password', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 회원 탈퇴
export const deleteAccount = async () => {
  try {
    const response = await apiClient.delete('/users');
    return response.data;
  } catch (error) {
    throw error;
  }
}; 