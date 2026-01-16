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

const tabs = ["Charts", "Risk Assessment", "Mitigation", "Tasks", "Files", "Users", "Summary"];

const areaData = [
  { name: "P", a: 20, b: 10, c: 6 },
  { name: "K", a: 35, b: 22, c: 10 },
  { name: "B", a: 28, b: 18, c: 12 },
  { name: "E", a: 48, b: 30, c: 14 },
  { name: "I", a: 40, b: 26, c: 16 },
  { name: "L", a: 55, b: 34, c: 18 },
  { name: "S", a: 42, b: 28, c: 15 },
];

const risks = [
  { threat: "Crime", category: "Smash and Grab", threatLevel: "EXTREME", riskLevel: "HIGH", reduction: "11%" },
  { threat: "Air Strike", category: "Armed Conflict", threatLevel: "EXTREME", riskLevel: "HIGH", reduction: "15%" },
  { threat: "Sexual Assault", category: "Manmade Hazards", threatLevel: "EXTREME", riskLevel: "HIGH", reduction: "8%" },
  { threat: "Crime", category: "Physical Assault", threatLevel: "EXTREME", riskLevel: "HIGH", reduction: "11%" },
];

function Badge({ variant, children }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

function ProgressRing({ value = 140, max = 500 }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 54;
  const c = 2 * Math.PI * r;
  const dash = c * pct;

  return (
    <div className="ringWrap">
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
        <div className="ringScore">{value}<span>/{max}</span></div>
        <div className="ringLabel">Overall Site Risk</div>
      </div>
    </div>
  );
}

export default function App() {
  const activeTab = "Charts";

  return (
    <div className="page">
      <div className="topbar">
        <div className="crumb">
          <button className="linkBtn">← Back to Dashboard</button>
          <span className="divider" />
          <span className="pageTitle">“SSS name” page</span>
        </div>

        <div className="userBox">
          <div className="avatar" />
          <div className="userMeta">
            <div className="userName">Maison Robertson</div>
            <div className="userRole">Manager plus</div>
          </div>
          <button className="iconBtn">▾</button>
        </div>
      </div>

      <div className="headerRow">
        <div>
          <h1 className="h1">Bangkok Head office</h1>
          <div className="subRow">
            <Badge variant="warn">IN PROCESS</Badge>
            <span className="muted">Next Audit Day: <b>11.29.2019</b></span>
          </div>
        </div>

        <button className="primaryBtn">Edit SSS</button>
      </div>

      <div className="grid">
        {/* LEFT COLUMN */}
        <div className="colLeft">
          <div className="card">
            <div className="cardHeader">
              <div className="cardTitle">SSS details</div>
              <button className="iconBtn">⋯</button>
            </div>

            <div className="kvGrid">
              <div className="kv">
                <div className="k">Assessor</div>
                <div className="v">Tayler Haas</div>
              </div>
              <div className="kv">
                <div className="k">Country</div>
                <div className="v">Thailand</div>
              </div>
              <div className="kv">
                <div className="k">Province</div>
                <div className="v">Phayao</div>
              </div>
              <div className="kv">
                <div className="k">Site Type</div>
                <div className="v">Residence</div>
              </div>
              <div className="kv">
                <div className="k">Purpose of Assessment</div>
                <div className="v">High</div>
              </div>
              <div className="kv">
                <div className="k">Address</div>
                <div className="v">514 Wang, Phetchabun 67240</div>
              </div>
            </div>

            <div className="miniProgress">
              <div className="miniTitle">SSS manual completeness</div>
              <div className="miniBar">
                <div className="miniFill" style={{ width: "80%" }} />
              </div>
              <div className="miniPct">80%</div>
            </div>
          </div>

          <div className="card">
            <div className="cardTitle">Changes log</div>
            <div className="log">
              <div className="logRow">
                <div className="logMain">Edited by Tayler Haas</div>
                <div className="muted">29.11.2019</div>
              </div>
              <div className="logRow">
                <div className="logMain">Edited by Maison Robertson</div>
                <div className="muted">28.11.2019</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="colRight">
          <div className="card">
            <div className="tabs">
              {tabs.map((t) => (
                <button
                  key={t}
                  className={`tab ${t === activeTab ? "tabActive" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="chartRow">
              <div className="chartCard">
                <div className="sectionTitle">Site Risk by Layer</div>
                <div className="chartBox">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="a" stackId="1" stroke="var(--accent)" fill="rgba(47,128,237,0.35)" />
                      <Area type="monotone" dataKey="b" stackId="1" stroke="var(--accent2)" fill="rgba(242,153,74,0.30)" />
                      <Area type="monotone" dataKey="c" stackId="1" stroke="var(--accent3)" fill="rgba(235,87,87,0.26)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="scoreCard">
                <div className="sectionTitle">Overall Site Risk Score</div>
                <ProgressRing value={140} max={500} />
              </div>
            </div>

            <div className="tableCard">
              <div className="tableHead">
                <div>Threat</div>
                <div>Category</div>
                <div>Assessed Threat Level</div>
                <div>Assessed Risk Level</div>
                <div>Vulnerability Reductions</div>
              </div>

              {risks.map((r, idx) => (
                <div className="tableRow" key={idx}>
                  <div>{r.threat}</div>
                  <div className="muted">{r.category}</div>
                  <div><Badge variant="danger">{r.threatLevel}</Badge></div>
                  <div><Badge variant="warn">{r.riskLevel}</Badge></div>
                  <div className="muted">{r.reduction}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
