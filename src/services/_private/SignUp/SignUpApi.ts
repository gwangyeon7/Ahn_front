import { axiosInstance } from "../ApiConfig";

/**
 * 회원가입 API 호출 함수
 * @param userData - SignUp 컴포넌트에서 전달받은 사용자 입력 데이터
 */
export const signUpApiCall = async (userData: any) => {
  // 백엔드 SecurityConfig에서 허용한 /api/signup 경로와 맞춤
  // 만약 axiosInstance의 baseURL에 '/api'가 포함되어 있다면 '/signup'만 적으세요!
  const endpoint = "/signup";

  // 백엔드 Member 엔티티의 변수명과 100% 일치시켜야 @RequestBody가 제대로 작동합니다.
  const data = {
    membId: userData.id, // 프론트 ID -> 백엔드 membId
    membPwd: userData.password, // 프론트 PW -> 백엔드 membPwd
    membNm: userData.name, // 프론트 이름 -> 백엔드 membNm
    membEmail: userData.email, // 프론트 이메일 -> 백엔드 membEmail
  };

  try {
    console.log("🚀 회원가입 요청 전송:", data);
    const response = await axiosInstance.post(endpoint, data);

    // 백엔드 ApiResponse 객체 { status: "success", message: "..." } 반환
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
    // 에러 발생 시에도 구조를 맞춰서 리턴해주면 컴포넌트에서 처리하기 편합니다.
    return {
      status: "error",
      message:
        error.response?.data?.message || "서버 통신 오류가 발생했습니다.",
    };
  }
};
