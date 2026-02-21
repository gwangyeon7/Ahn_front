import React from 'react';
const Login = {
  //1. 색상
  colors: {
    mainNavy: "#1B263B", //이건 ZCS로고 쓸때 사용할 색
    darkNavy: "#0D1B2A",
    background: "#F0F2F5",
    white: "#FFFFFF",
    border: "#D1D5DB",
    textGray: "#64748B",
    divider: "#E2E8F0",
    error: "#E63946", //  로그인 실패시 빨간색
  },

  // 2. 둥근 모서리 규격
  Radius: {
    small: "4px",
    input: "8px", // 입력창용
    button: "12px", // 버튼용
    card: "20px", // 큰 박스용
  },
};
export default Login; // 맨 마지막에 export defalut로 받아야지 나중에 가져올때 이름으로 찾을수 있음 
