// src/services/_private/Login/LoginApi.ts
import axios from 'axios';

// 공통 주소 (api까지 포함)
const BASE_URL = "https://zerocheck-sbom.store/api";

/**
 * [로그인 기능]
 * 화면에서 넘겨받은 id와 pass를 백엔드가 원하는 '이름표'를 붙여서 보냅니다.
 */
export const requestLogin = async (id: string, pass: string) => {
  try {
    const loginData = {
      membId: id,   // 백엔드 .get("membId")와 이름 맞춤
      membPwd: pass // 백엔드 .get("membPwd")와 이름 맞춤
    };

    const response = await axios.post(`${BASE_URL}/login`, loginData);

    // 리더님의 ApiResponse { success, message } 구조 확인
    if (response.data && response.data.success) {
      console.log("로그인 성공!");
      return response.data;
    } else {
      console.log("로그인 실패:", response.data.message);
      return response.data;
    }
  } catch (error) {
    console.error("로그인 서버 통신 에러:", error);
    return { success: false, message: "서버 연결에 실패했습니다." };
  }
};