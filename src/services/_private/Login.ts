import axios from "axios";

// 백엔드 주소 (리더님의 서버 주소 + /api)
const BASE_URL = "https://zerocheck-sbom.store/api";

export const requestLogin = async (id: string, pass: string) => {
  try {
    // 1. 백엔드 Map<String, String>이 기다리는 이름표로 봉투 만들기
    const loginData = {
      membId: id,
      membPwd: pass,
    };

    // 2. 서버로 전달
    const response = await axios.post(`${BASE_URL}/login`, loginData);

    // 3. 백엔드의 ApiResponse.java (success, message) 구조 확인
    if (response.data && response.data.success === true) {
      console.log("로그인 성공 메시지:", response.data.message);
      return response.data; // 성공 시 데이터 반환
    } else {
      console.log("로그인 실패:", response.data.message);
      return response.data; // 실패 시에도 메시지 확인 위해 반환
    }
  } catch (error) {
    console.error("서버 연결 실패:", error);
    return { success: false, message: "서버와 통신할 수 없습니다." };
  }
};
