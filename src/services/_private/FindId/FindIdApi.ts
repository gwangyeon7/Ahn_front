import { axiosInstance } from "../ApiConfig";

/**
 * 이름 + 이메일로 아이디 찾기 요청.
 * 백엔드는 일치하는 회원이 있으면 마스킹된 membId를 반환 (예: "ab****yz").
 */
export const findIdApiCall = async (name: string, email: string) => {
  const endpoint = "/find-id";

  try {
    const response = await axiosInstance.post(endpoint, {
      membNm: name,
      membEmail: email,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "아이디 찾기 요청 중 에러 발생:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "요청 처리 중 오류가 발생했습니다.",
    };
  }
};
