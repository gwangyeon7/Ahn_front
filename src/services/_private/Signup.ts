import axios from "axios";

const BASE_URL = "https://zerocheck-sbom.store/api";

export const requestSignUp = async (userData: any) => {
  try {
    // 백엔드 @RequestBody Member member 주소로 데이터 전송
    const response = await axios.post(`${BASE_URL}/signup`, userData);

    if (response.data && response.data.success === true) {
      console.log("회원가입 성공!");
      return response.data;
    } else {
      console.log("회원가입 실패:", response.data.message);
      return response.data;
    }
  } catch (error) {
    console.error("회원가입 통신 에러:", error);
    return { success: false, message: "회원가입 중 서버 에러가 발생했습니다." };
  }
};
