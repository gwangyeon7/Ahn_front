import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Box, Activity, AlertTriangle, ChevronRight } from 'lucide-react';

const SecurityDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const mockData = {
      "metadata": {
        "project_name": "SBOM-security-project",
        "inspector": "JeonYouwe",
        "scan_date": "2026-01-17 03:10:00" // 나중에 실제 데이터로 교체
      },
      "summary": {
        "total_libraries": 124,
        "total_vulnerabilities": 7,
        "severity_summary": { "critical": 1, "high": 1, "medium": 3, "low": 2 }
      }
    };
    setData(mockData);
  }, []);

  if (!data) return <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#0f172a', color: '#94a3b8', height: '100vh' }}>데이터를 불러오는 중...</div>;

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        .dashboard-body { font-family: 'Inter', sans-serif; color: #f1f5f9; }
        .stat-card:hover { transform: translateY(-5px); background-color: #1e293b !important; transition: all 0.3s ease; }
        .advisory-row:hover { background-color: #1e293b; border-radius: 12px; }
      `}</style>

      <div className="dashboard-body">
        {/* 상단 헤더 */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Security <span style={{ color: '#3b82f6' }}>Report</span></h1>
            <p style={styles.subtitle}>Project: {data.metadata.project_name} | Inspector: {data.metadata.inspector}</p>
          </div>
          <div style={styles.headerRight}>
            <p style={styles.scanLabel}>LAST SCANNED</p>
            <p style={styles.scanDate}>{data.metadata.scan_date}</p>
          </div>
        </header>

        {/* 요약 카드 그리드 */}
        <div style={styles.cardGrid}>
          <StatCard title="Total Libraries" value={data.summary.total_libraries} icon={<Box size={24} color="#60a5fa"/>} iconBg="rgba(59, 130, 246, 0.1)" />
          <StatCard title="Total Vulns" value={data.summary.total_vulnerabilities} icon={<ShieldAlert size={24} color="#f87171"/>} iconBg="rgba(239, 68, 68, 0.1)" />
          <StatCard title="Health Score" value="92/100" icon={<Activity size={24} color="#34d399"/>} iconBg="rgba(16, 185, 129, 0.1)" />
          <StatCard title="Status" value="Protected" icon={<ShieldCheck size={24} color="#818cf8"/>} iconBg="rgba(99, 102, 241, 0.1)" />
        </div>

        {/* 상세 섹션 */}
        <div style={styles.bottomGrid}>
          {/* 심각도 분석 */}
          <section style={styles.sectionCard}>
            <h2 style={styles.sectionTitle}><AlertTriangle size={20} color="#fbbf24"/> Severity Analysis</h2>
            <div style={styles.severityList}>
              <SeverityRow label="Critical" count={data.summary.severity_summary.critical} color="#ef4444" />
              <SeverityRow label="High" count={data.summary.severity_summary.high} color="#f97316" />
              <SeverityRow label="Medium" count={data.summary.severity_summary.medium} color="#fbbf24" />
              <SeverityRow label="Low" count={data.summary.severity_summary.low} color="#10b981" />
            </div>
          </section>

          {/* 알림 리스트 */}
          <section style={styles.sectionCard}>
            <h2 style={styles.sectionTitle}>Security Advisories</h2>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="advisory-row" style={styles.advisoryRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f97316' }}></div>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px', color: '#f1f5f9' }}>CVE-2024-012{i}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Vulnerability found in system libraries</p>
                  </div>
                </div>
                <ChevronRight size={16} color="#475569" />
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '40px 20px' },
  header: { maxWidth: '1100px', margin: '0 auto 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  title: { fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-1px', color: '#fff' },
  subtitle: { color: '#94a3b8', margin: 0, fontWeight: '500' },
  headerRight: { textAlign: 'right' },
  scanLabel: { fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '2px', margin: '0 0 4px 0' },
  scanDate: { fontSize: '14px', color: '#cbd5e1', fontWeight: '600', margin: 0 },
  cardGrid: { maxWidth: '1100px', margin: '0 auto 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
  bottomGrid: { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
  sectionCard: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '24px', border: '1px solid #334155' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#f1f5f9' },
  severityList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  advisoryRow: { padding: '15px 10px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s' }
};

const StatCard = ({ title, value, icon, iconBg }) => (
  <div className="stat-card" style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '24px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ padding: '15px', backgroundColor: iconBg, borderRadius: '16px', display: 'flex' }}>{icon}</div>
    <div>
      <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', margin: '0 0 4px 0', textTransform: 'uppercase' }}>{title}</p>
      <p style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f1f5f9' }}>{value}</p>
    </div>
  </div>
);

const SeverityRow = ({ label, count, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span style={{ color: '#f1f5f9' }}>{count}</span>
    </div>
    <div style={{ height: '8px', width: '100%', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: count > 0 ? '60%' : '0%', backgroundColor: color, boxShadow: `0 0 10px ${color}66` }}></div>
    </div>
  </div>
);

export default SecurityDashboard;