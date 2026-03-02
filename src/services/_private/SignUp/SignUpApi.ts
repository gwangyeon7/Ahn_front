import { axiosInstance } from "../ApiConfig";

/**
 * 회원가입 API 호출 함수
 */
export const signUpApiCall = async (userData: any) => {
  const endpoint = "signup";

  try {
    // 1. 백엔드 규격에 맞게 데이터 매핑 (이 박스를 보내야 합니다!)
    const payload = {
      membId: userData.id,
      membPwd: userData.password,
      membNm: userData.name,
      membEmail: userData.email,
    };

    console.log("🚀 회원가입 요청 전송 데이터:", payload);

    // 2. 가공된 payload를 post에 실어서 보냅니다.
    const response = await axiosInstance.post(endpoint, payload);

    // 3. 서버 응답 반환
    if (response.data) {
      console.log("✅ 서버 응답 완료:", response.data);
      return response.data;
    }

    return null;
  } catch (error: any) {
    console.error(
      "❌ 회원가입 통신 중 에러 발생:",
      error.response?.data || error.message,
    );

    return {
      status: "error",
      message:
        error.response?.data?.message || "서버 통신 오류가 발생했습니다.",
    };
  }
};
