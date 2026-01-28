import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// 1. 리더님의 DB 데이터 구조
interface Library {
  id: number;
  name: string;
  version: string;
  status: string;
  license: string;
  description: string;
}

// 친구가 만든 타입들
type Tab =
  | "Charts"
  | "Risk Assessment"
  | "Mitigation"
  | "Tasks"
  | "Files"
  | "Users"
  | "Summary";
const tabs: Tab[] = [
  "Charts",
  "Risk Assessment",
  "Mitigation",
  "Tasks",
  "Files",
  "Users",
  "Summary",
];

// 친구가 만든 차트 데이터/컴포넌트들 (생략 없이 그대로 유지)
const areaData = [
  { name: "All", a: 22, b: 12, c: 6 },
  { name: "Perimeter", a: 36, b: 20, c: 10 },
  { name: "Parking", a: 28, b: 18, c: 12 },
  { name: "Exterior", a: 50, b: 28, c: 14 },
  { name: "Interior", a: 42, b: 26, c: 16 },
  { name: "Life", a: 58, b: 34, c: 18 },
  { name: "Other", a: 44, b: 28, c: 15 },
];

function Badge({
  variant,
  children,
}: {
  variant: "warn" | "danger" | "neutral";
  children: React.ReactNode;
}) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

function ProgressRing({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 54;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  return (
    <div className="ringWrap">
      <div className="ringStack">
        <svg width="140" height="140" viewBox="0 0 140 140" className="ring">
          <circle cx="70" cy="70" r={r} className="ringTrack" />
          <circle
            cx="70"
            cy="70"
            r={r}
            className="ringValue"
            strokeDasharray={`${dash} ${c - dash}`}
          />
        </svg>
        <div className="ringCenter">
          <div className="ringScore">
            {value}
            <span>/{max}</span>
          </div>
          <div className="ringLabel">Overall Site Risk</div>
        </div>
      </div>
    </div>
  );
}

// 2. 통합된 메인 App 컴포넌트
export default function App() {
  // 리더님의 데이터 상태 관리
  const [libraries, setLibraries] = useState<Library[]>([]);
  const activeTab: Tab = "Charts";

  useEffect(() => {
    // 리더님의 DB 데이터 가져오기 로직
    fetch("http://localhost:8080/api/libraries/libraries")
      .then((res) => res.json())
      .then((data) => {
        console.log("DB 데이터 수신 성공:", data);
        setLibraries(data);
      })
      .catch((err) => console.error("데이터 연결 실패:", err));
  }, []);

  return (
    <div className="page">
      {/* 친구의 헤더 디자인 */}
      <div className="topbar">
        <div className="crumb">
          <button className="linkBtn">← Back to Dashboard</button>
          <span className="divider" />
          <span className="pageTitle">SBOM Security Analysis</span>
        </div>
      </div>

      <div className="headerRow">
        <div>
          <h1 className="h1">Security Dashboard</h1>
          <div className="subRow">
            <Badge variant="warn">LIVE DATA</Badge>
          </div>
        </div>
      </div>

      <div className="grid">
        {/* 친구의 차트 영역 */}
        <div className="colRight" style={{ width: "100%" }}>
          <div className="card">
            <div className="chartRow">
              <div className="chartCard">
                <div className="sectionTitle">Security Risk Trends</div>
                <div className="chartBox">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={areaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="a"
                        stackId="1"
                        stroke="#2F80ED"
                        fill="rgba(47,128,237,0.3)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="scoreCard">
                <div className="sectionTitle">Risk Score</div>
                <ProgressRing value={140} max={500} />
              </div>
            </div>

            {/* 3. 리더님의 실제 DB 데이터 테이블 출력 부분 */}
            <div className="tableCard">
              <div className="sectionTitle">DB Library List</div>
              <div className="tableHead">
                <div>ID</div>
                <div>Name</div>
                <div>Version</div>
                <div>Status</div>
                <div>License</div>
              </div>
              {libraries.map((lib) => (
                <div className="tableRow" key={lib.id}>
                  <div>{lib.id}</div>
                  <div style={{ fontWeight: "bold" }}>{lib.name}</div>
                  <div>{lib.version}</div>
                  <div>
                    <Badge
                      variant={lib.status === "위험" ? "danger" : "neutral"}
                    >
                      {lib.status}
                    </Badge>
                  </div>
                  <div className="muted">{lib.license}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
