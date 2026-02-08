// src/services/_private/Regi/SignUpApi.ts
import axios from "axios";

const BASE_URL = "https://zerocheck-sbom.store/api";

/**
 * [회원가입 기능]
 * 사용자가 입력한 모든 정보(memberData)를 통째로 봉투에 넣어 보냅니다.
 */
export const requestSignUp = async (memberData: any) => {
  try {
    // memberData 안에는 이미 membId, membPwd 등이 엔티티 이름과 똑같이 들어있어야 함!
    const response = await axios.post(`${BASE_URL}/signup`, memberData);

    if (response.data && response.data.success) {
      console.log("회원가입 성공!");
      return response.data;
    } else {
      console.log("회원가입 실패:", response.data.message);
      return response.data;
    }
  } catch (error) {
    console.error("회원가입 서버 통신 에러:", error);
    return { success: false, message: "서버 연결에 실패했습니다." };
  }
};
