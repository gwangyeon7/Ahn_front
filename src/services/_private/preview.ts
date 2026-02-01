// src/services/_private/Api.ts

// 1. 서버 주소 설정 (일단 예시입니다)
const BASE_URL = "http://localhost:18080";

// 2. 데이터 가져오는 기본 함수 (이걸 짜야 리더님이 '데이터 요새'의 주인이 됩니다)
export const getDashboardData = async () => {
  try {
    // 여기에 나중에 서버 호출 로직이 들어갑니다.
    console.log("데이터 호출 시작!");
  } catch (error) {
    console.error("에러 발생:", error);
  }
};
