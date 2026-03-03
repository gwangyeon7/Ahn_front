import { axiosInstance } from "../ApiConfig";

/**
 * 회원가입 API 호출 함수
 */
export const signUpApiCall = async (userData: any) => {
  const endpoint = "signup";

  try {
    // 1. 백엔드 규격에 맞게 데이터 payload에 넣기
    const payload = {
      membId: userData.id,
      membPwd: userData.password,
      membNm: userData.name,
      membEmail: userData.email,
    }; // 여기가 이제 엔티티에서 정한 이름 프론트쪽에서도 지정하는곳

    console.log("🚀 회원가입 요청 전송 데이터:", payload);

    // 2. 가공된 payload를 post에 실어서 보냅니다.
    const response = await axiosInstance.post(endpoint, payload); // 이게 음 프론트에서 json형식으로 우리가 만든 컨트롤러쪽 주소로 데이터를 보낸다는 뜻

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
