import { axiosInstance } from "../ApiConfig";


export const loginApiCall = async (id: string, pw: string) => {
  // 1. 엔드포인트: @RequestMapping("/api") + @PostMapping("/login") = /login
  // (axiosInstance의 baseURL에 이미 /api가 포함되어 있다면 '/login'만 적으면 됩니다)
  const endpoint = "/login";

  // 2. 데이터 이름표(Key): 컨트롤러의 loginData.get("membId")와 정확히 일치시켜야 함
  const data = {
    membId: id, // 'id'라고 보내면 백엔드가 못 읽습니다. 반드시 'membId'!
    membPwd: pw, // 'pw'가 아니라 'membPwd'!
  };

  try {
    console.log("로그인 요청 데이터:", data);
    const response = await axiosInstance.post(endpoint, data);
// 여기까진 벡엔드 logincontroller 부분

    // 3. 백엔드의 ApiResponse 구조에 따라 성공 여부 판단
    // 보통 ApiResponse에 status나 success 필드가 있을 겁니다.
    if (response.data) {
      console.log("서버 응답:", response.data);
      return response.data; // 성공 시 응답 객체 반환
    }
    return null;
  } catch (error: any) {
    console.error(
      "로그인 통신 중 에러 발생:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
