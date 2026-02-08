import React from "react";
import { fileUploadStyles as s } from "../styles/fileUpload";
import FileInputBox from "../components/FileDropInput";

export default function FileUploadScreen() {
  return (
    <section style={s.container}>
      <div style={s.content}>
        <h1 style={s.title}>보안 구성요소 분석</h1>
        <p style={s.subTitle}>
          SBOM/의존성 파일을 업로드하면 구성요소를 식별하고,
          알려진 취약점(CVE)·라이선스 위험·공급망 리스크를 한 번에 점검합니다.
        </p>

        <FileInputBox
          multiple
          onFilesChange={(files: File[]) => {
            console.log("선택 파일:", files);
          }}
        />
      </div>
    </section>
  );
}
