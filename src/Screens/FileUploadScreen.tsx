import React, { useState } from "react";
import { fileUploadStyles as s } from "../styles/fileUpload";
import FileInputBox from "../components/FileDropInput";
import { fileUploadApiCall } from "../services/_private/FileUpload/FileUpApi";

export default function FileUploadScreen() {
  const [files,setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFilesChange = (next: File[]) => {
    // 1. 파일이 아예 안 들어왔으면 그냥 리턴
    if (next.length === 0) return;
  
    const file = next[0];
  
    // 2. 확장자 검사 (이 부분이 중요!)
    if (!file.name.toLowerCase().endsWith('.zip')) {
      // 여기에 alert를 넣어줘야 사용자가 알 수 있어요!
      alert(" ZIP 압축 파일만 업로드할 수 있습니다."); 
      
      // 상태를 비워서 화면에 잘못된 파일이 남지 않게 합니다.
      setFiles([]); 
      return;
    }
  
    // 3. ZIP 파일일 때만 실행되는 구간
    console.log("정상적인 ZIP 파일 선택됨:", file.name);
    setFiles([file]); 
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
      alert("파일 업로드 중 오류가 발생했습니다."); // 현재 zip폴더 용량이 너무 커서 오류 413
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
         accept=".zip"
          onFilesChange={handleFilesChange} //여긴 파일체이지 저게 실행
          onSubmit={handleSubmit} //분석시작 버츤을 누르면 handlesubmit이 실행
          multiple={false}

        />

        {loading && <div style= {{ color: "#fff", marginTop: 12}}> 업로드 중...</div>}
      </div> 
    </section> //여긴 이제 조건이 트루일때만 랜더링 먼말이냐 그냥 트루면 업로드중이 나오고 펄스면 암것도 안나옴
  );
}
