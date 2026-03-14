import React, { useMemo, useRef, useState } from "react";
import { fileUploadStyles as s } from "../styles/fileUpload";

type Props = {
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  onSubmit?: (files: File[]) => void;
};

export default function FileInputBox({
  accept = ".json,.xml,.spdx,.cdx,.pdf,.zip",
  multiple = true,
  onFilesChange,
  onSubmit,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const zoneStyle = useMemo(
    () => ({ ...s.dropZone, ...(isDragging ? s.dropZoneActive : {}) }),
    [isDragging]
  );

  const addFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);

    // 중복(이름+사이즈) 제거
    const next = [...files];
    for (const f of list) {
      const exists = next.some((x) => x.name === f.name && x.size === f.size);
      if (!exists) next.push(f);
    }

    const finalFiles = multiple ? next : next.slice(0, 1);
    setFiles(finalFiles);
    onFilesChange?.(finalFiles);
  };

  const onPick = () => inputRef.current?.click();

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    addFiles(e.target.files);
    e.target.value = "";
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files?.length) return;
    addFiles(e.dataTransfer.files);
  };

  const removeAt = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onFilesChange?.(next);
  };

  const clearAll = () => {
    setFiles([]);
    onFilesChange?.([]);
  };

  return (
    <div style={s.dropCard}>
      <div
        style={zoneStyle}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <button type="button" style={s.bigBtn} onClick={onPick}>
          분석 파일 선택 (SBOM / 보고서 / 압축)
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onInputChange}
          style={{ display: "none" }}
        />

        <div style={s.helper}>또는 파일을 여기로 드래그해서 놓으세요</div>
        <div style={s.note}>
          권장 형식: SPDX(.spdx/.json), CycloneDX(.cdx/.xml), 보고서(PDF), 압축(ZIP)
          <br />
          업로드된 파일은 취약 구성요소 탐지, 라이선스/리스크 점검, 의존성 트리 분석에
          사용됩니다.
        </div>
      </div>

      {files.length > 0 && (
        <>
          <div style={s.fileList}>
            {files.map((f, idx) => {
              const isLast = idx === files.length - 1;
              return (
                <div
                  key={`${f.name}-${f.size}-${idx}`}
                  style={{ ...s.fileRow, ...(isLast ? s.fileRowLast : {}) }}
                >
                  <div style={s.fileMeta}>
                    <div style={s.fileName}>{f.name}</div>
                    <div style={s.fileSize}>
                      {(f.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>

                  <button
                    type="button"
                    style={s.removeBtn}
                    onClick={() => removeAt(idx)}
                  >
                    제거
                  </button>
                </div>
              );
            })}
          </div>

          <div style={s.actionRow}>
            <button type="button" style={s.secondaryBtn} onClick={clearAll}>
              전체 비우기
            </button>
            <button
              type="button"
              style={s.secondaryBtn}
              onClick={() => onSubmit?.(files)}
            >
              분석 시작
            </button>
          </div>
        </>
      )}
    </div>
  );
}

