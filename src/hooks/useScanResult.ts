import { useEffect, useState } from "react";
import {
  downloadFixedZip,
  getComponents,
  getFixPlan,
  getScanResults,
  type FixPlanItem,
  type SbomComponent,
  type ScanResult,
} from "../services/_private/SbomApi";

export const useScanResult = (fileSeq?: string) => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [components, setComponents] = useState<SbomComponent[]>([]);
  const [fixPlan, setFixPlan] = useState<FixPlanItem[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!fileSeq) return;

    const loadResults = async () => {
      try {
        setLoading(true);
        const [scanResponse, componentResponse] = await Promise.all([
          getScanResults(fileSeq),
          getComponents(fileSeq),
        ]);
        setResults(scanResponse.data?.results ?? []);
        setComponents(componentResponse.data?.components ?? []);

        try {
          const fixPlanResponse = await getFixPlan(fileSeq);
          setFixPlan(fixPlanResponse.data?.fixes ?? []);
        } catch (fixPlanError) {
          console.warn("수정안 생성 API를 불러오지 못했습니다.", fixPlanError);
          setFixPlan([]);
        }
      } catch (e) {
        console.error(e);
        setError("분석 결과를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [fileSeq]);

  const downloadFixedProjectZip = async () => {
    if (!fileSeq || isDownloading) return;

    try {
      setIsDownloading(true);
      const response = await downloadFixedZip(fileSeq);
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `fixed-project-${fileSeq}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (downloadError) {
      console.error(downloadError);
      alert(
        "수정된 ZIP을 만들지 못했습니다. ZIP 파일 업로드인지, 자동 수정 가능한 npm 항목이 있는지 확인해주세요.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    results,
    components,
    fixPlan,
    isDownloading,
    loading,
    error,
    downloadFixedProjectZip,
  };
};
