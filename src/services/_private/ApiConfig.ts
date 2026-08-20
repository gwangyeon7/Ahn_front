// src/services/Api.config.ts

// 1. 서버 주소를 변수로 선언 (나중에 여기만 고치면 끝!) 현재 내 인텔주소
export const BASE_URL = import.meta.env.PROD
  ? "/api"
  : "http://localhost:18080/api";

import axios from "axios";

// 2. 공용 트럭 생성
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  withCredentials: true, // 로그인 세션 쿠키(JSESSIONID)를 요청마다 자동으로 실어 보낸다
  withXSRFToken: true, // 백엔드가 다른 origin(포트)이라 axios가 XSRF-TOKEN 쿠키를 자동으로 못 읽는데, 이걸 켜야 읽어서 X-XSRF-TOKEN 헤더로 보내준다
});
