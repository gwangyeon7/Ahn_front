// src/services/Api.config.ts

// 1. 서버 주소를 변수로 선언 (나중에 여기만 고치면 끝!) 현재 내 인텔주소
export const BASE_URL = "http://localhost:18080/api";

import axios from "axios";

// 2. 공용 트럭 생성
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
});
