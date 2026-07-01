import { axiosInstance } from "../ApiConfig";

/**
 * 구글 ID 토큰을 백엔드로 전달해 로그인/자동 가입 처리.
 * 백엔드 응답 형태는 기존 로그인 API와 동일하게 맞춤:
 * { success: boolean, data?: { membSeq: number, membNm?: string }, message?: string }
 */
export const googleLoginApiCall = async (idToken: string) => {
  const endpoint = "/auth/google";

  try {
    const response = await axiosInstance.post(endpoint, { idToken });
    return response.data;
  } catch (error: any) {
    console.error(
      "구글 로그인 통신 중 에러 발생:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
