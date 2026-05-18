import { axiosInstance } from "../ApiConfig";

// 파일 업로드 API 함수
export const fileUploadApiCall = async (files: File[]) => {
  if (!files.length) {
    throw new Error("파일이 없습니다."); // 파일을 아무것도 안넘겨주면 실패
  }

  const formData = new FormData();
  formData.append("file", files[0]); // 첫 번째 파일만 전송 (ZIP 가정) ㄱㅡ니까 하나만?

  const endpoint = "/files/upload"; // 백엔드 엔드포인트에 맞게 조정

  try {
    console.log("파일 업로드 요청:", files[0].name, files[0].size);
    const response = await axiosInstance.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("업로드 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("파일 업로드 오류:", error.response?.data || error.message);
    throw error;
  }
};
