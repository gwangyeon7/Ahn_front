import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ScanResult, SbomComponent } from "../services/_private/SbomApi";

const SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGLIGIBLE", "UNKNOWN"];

const severityColor = (severity: string): [number, number, number] => {
  switch (severity?.toUpperCase()) {
    case "CRITICAL": return [220, 38, 38];
    case "HIGH":     return [234, 88, 12];
    case "MEDIUM":   return [202, 138, 4];
    case "LOW":      return [37, 99, 235];
    default:         return [107, 114, 128];
  }
};

export const generatePdfReport = (
  fileSeq: string | undefined,
  results: ScanResult[],
  components: SbomComponent[],
) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  // ── Header ───────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("SafeLink SBOM Analysis Report", 14, 13);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`File #${fileSeq ?? "-"}   |   Generated: ${now}`, 14, 22);

  // ── Summary Cards ─────────────────────────────────────────
  let y = 38;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Vulnerability Summary", 14, y);
  y += 6;

  const counts: Record<string, number> = {};
  for (const r of results) {
    const s = (r.severity ?? "UNKNOWN").toUpperCase();
    counts[s] = (counts[s] ?? 0) + 1;
  }

  const cardW = (pageW - 28 - 12) / 5;
  const severities = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGLIGIBLE"];
  severities.forEach((sev, i) => {
    const x = 14 + i * (cardW + 3);
    const [r, g, b] = severityColor(sev);
    doc.setFillColor(r, g, b);
    doc.roundedRect(x, y, cardW, 16, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(String(counts[sev] ?? 0), x + cardW / 2, y + 8, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(sev, x + cardW / 2, y + 14, { align: "center" });
  });

  y += 24;

  // Total / Components
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Total Vulnerabilities: ${results.length}   |   Total Components: ${components.length}`,
    14,
    y,
  );
  y += 10;

  // ── Vulnerability Table ───────────────────────────────────
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Vulnerability Details", 14, y);
  y += 4;

  const sorted = [...results].sort(
    (a, b) =>
      SEVERITY_ORDER.indexOf((a.severity ?? "UNKNOWN").toUpperCase()) -
      SEVERITY_ORDER.indexOf((b.severity ?? "UNKNOWN").toUpperCase()),
  );

  autoTable(doc, {
    startY: y,
    head: [["CVE ID", "Package", "Version", "Severity", "Fix Version"]],
    body: sorted.map((r) => [
      r.cveId ?? r.vulnId ?? "-",
      r.pkgName,
      r.pkgVersion,
      (r.severity ?? "UNKNOWN").toUpperCase(),
      r.fixedVer ?? "N/A",
    ]),
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7.5 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 48 },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 32 },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 3) {
        const sev = String(data.cell.raw).toUpperCase();
        const [r, g, b] = severityColor(sev);
        data.cell.styles.textColor = [r, g, b];
        data.cell.styles.fontStyle = "bold";
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Component Table ───────────────────────────────────────
  const afterVuln = (doc as any).lastAutoTable?.finalY ?? 200;
  let y2 = afterVuln + 10;

  if (y2 > 260) {
    doc.addPage();
    y2 = 20;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Component List", 14, y2);
  y2 += 4;

  autoTable(doc, {
    startY: y2,
    head: [["Package Name", "Version", "Type", "License"]],
    body: components.map((c) => [
      c.pkgName,
      c.pkgVersion ?? "-",
      c.pkgType ?? "-",
      c.license ?? "-",
    ]),
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7.5 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14 },
  });

  // ── Footer ────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `SafeLink Security Report  |  Page ${i} of ${pageCount}`,
      pageW / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: "center" },
    );
  }

  doc.save(`safelink-report-${fileSeq ?? "unknown"}.pdf`);
};
