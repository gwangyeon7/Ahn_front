import React, { useState } from "react";
import { fileUploadStyles as s } from "../styles/fileUpload";
import FileInputBox from "../components/FileDropInput";
import { fileUploadApiCall } from "../services/_private/FileUpload/FileUpApi";

export default function FileUploadScreen() {
  const [files,setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFilesChange = (next: File[]) => {
    setFiles(next);
    console.log("선택된 파일들:", next);
  };
  const handleSubmit = async () => {
    if (!files.length) {
      alert("업로드할 파일을 선택 해 주세요.");
      return;
    }
    try {
      setLoading(true);
      const result = await fileUploadApiCall(files);
      alert("파일 업로드 완료!");
    } catch (e) {
      console.error(e);
      alert("파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false)
    } 
  };
    
    
    return (
    <section style={s.container}>
      <div style={s.content}>
        <h1 style={s.title}>보안 구성요소 분석</h1>
        <p style={s.subTitle}>
          SBOM/의존성 파일을 업로드하면 구성요소를 식별하고,
          알려진 취약점(CVE)·라이선스 위험·공급망 리스크를 한 번에 점검합니다.
        </p>

        <FileInputBox
          multiple //한번에 파일 여러개 선택 가능
          onFilesChange={handleFilesChange} //여긴 파일체이지 저게 실행
          onSubmit={handleSubmit} //분석시작 버츤을 누르면 handlesubmit이 실행
        />

        {loading && <div style= {{ color: "#fff", marginTop: 12}}> 업로드 중...</div>}
      </div> //여긴 이제 조건이 트루일때만 랜더링 먼말이냐 그냥 트루면 업로드중이 나오고 펄스면 암것도 안나옴
    </section>
  );
}
