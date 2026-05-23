import { axiosInstance } from "./ApiConfig";

export type ScanResult = {
  resultSeq: number;
  fileSeq: number;
  vulnId?: string;
  cveId?: string;
  source?: string;
  pkgName: string;
  pkgType?: string;
  pkgVersion: string;
  severity: string;
  fixedVer?: string;
  scanDt?: string;
};

export const uploadSbomFile = async (file: File, membSeq: number) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("membSeq", String(membSeq));

  try {
    const response = await axiosInstance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "업로드 실패",
    };
  }
};

export const getScanResults = async (fileSeq: string | number) => {
  const response = await axiosInstance.get(`/files/${fileSeq}/scan-results`);
  return response.data;
};
