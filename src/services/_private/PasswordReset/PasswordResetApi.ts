import { axiosInstance } from "../ApiConfig";

/**
 * 비밀번호 재설정 메일 발송 요청.
 * 보안상 이메일이 존재하지 않아도 서버는 항상 success:true 형태로 응답하는 것을 권장
 * (가입 여부 노출 방지). 실제 발송 성공 여부와 무관하게 동일한 안내 문구를 보여줌.
 */
export const requestPasswordReset = async (email: string) => {
  const endpoint = "/password-reset/request";

  try {
    const response = await axiosInstance.post(endpoint, { email });
    return response.data;
  } catch (error: any) {
    console.error(
      "비밀번호 재설정 요청 중 에러 발생:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message: error.response?.data?.message || "요청 처리 중 오류가 발생했습니다.",
    };
  }
};

/**
 * 이메일로 받은 토큰 + 새 비밀번호로 실제 비밀번호 변경.
 */
export const confirmPasswordReset = async (
  token: string,
  newPassword: string,
) => {
  const endpoint = "/password-reset/confirm";

  try {
    const response = await axiosInstance.post(endpoint, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "비밀번호 변경 중 에러 발생:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message: error.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.",
    };
  }
};
