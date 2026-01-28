import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const { user, logout } = useAuth();

  const items = useMemo(
    () => [
      { label: "대시보드", path: "/app/dashboard" },
      { label: "전체 라이브러리", path: "/app/libraries" },
      { label: "취약점 관리", path: "/app/vulnerabilities" },
      { label: "검사 이력", path: "/app/scans" },
    ],
    []
  );

  const go = (path: string) => {
    nav(path);
    setDrawerOpen(false); // 이동하면 자동으로 닫기
  };

  return (
    <div style={s.shell}>
      {/* Topbar */}
      <header style={s.topbar}>
        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          style={s.hamburger}
          aria-label="메뉴 열기"
        >
          ≡
        </button>

        <div style={s.topbarSpacer} />

        <div style={s.userBox}>
          <div style={s.avatar}>{user?.name?.slice(0, 1) ?? "U"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={s.userName}>{user?.name}</div>
            <div style={s.userRole}>{user?.role}</div>
          </div>
        </div>

        <button
          type="button"
          style={s.logoutBtn}
          onClick={() => {
            logout();
            nav("/login");
          }}
        >
          로그아웃
        </button>
      </header>

      {/* Drawer Backdrop */}
      {drawerOpen && (
        <div
          style={s.backdrop}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside style={{ ...s.drawer, transform: drawerOpen ? "translateX(0)" : "translateX(-110%)" }}>
        <div style={s.brandRow}>
          <div style={s.brandIcon}>SB</div>
          <div>
            <div style={s.brandTitle}>SBOM</div>
            <div style={s.brandSub}>공급망 보안 대시보드</div>
          </div>
        </div>

        <nav style={s.nav}>
          {items.map((it) => {
            const active = loc.pathname === it.path;
            return (
              <button
                key={it.path}
                type="button"
                onClick={() => go(it.path)}
                style={{ ...s.navItem, ...(active ? s.navItemActive : null) }}
              >
                {it.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main style={s.main}>
        <div style={s.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const s: Record<string, any> = {
  shell: { minHeight: "100vh", background: "#0b0f14", color: "#e5e7eb" },

  topbar: {
    height: 64,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 16px",
    background: "#0b0f14",
    borderBottom: "1px solid #1f2937",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  hamburger: {
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "1px solid #1f2937",
    background: "#0b1220",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: 22,
    fontWeight: 900,
  },
  topbarSpacer: { flex: 1 },

  userBox: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: "#0b1220",
    border: "1px solid #1f2937",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
  },
  userName: { fontWeight: 900, fontSize: 13 },
  userRole: { fontSize: 12, color: "#94a3b8" },

  logoutBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #1f2937",
    background: "#0b1220",
    color: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 900,
  },

  main: { padding: 20 },
  content: { maxWidth: 1200, margin: "0 auto" },

  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    zIndex: 90,
  },

  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: 280,
    background: "#020617",
    borderRight: "1px solid #1f2937",
    padding: 16,
    zIndex: 100,
    transition: "transform 0.22s ease",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  brandRow: { display: "flex", alignItems: "center", gap: 12, padding: 8 },
  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#2563eb",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    color: "#fff",
  },
  brandTitle: { fontWeight: 950 },
  brandSub: { fontSize: 12, color: "#94a3b8", marginTop: 2 },

  nav: { display: "flex", flexDirection: "column", gap: 8 },
  navItem: {
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid transparent",
    background: "transparent",
    cursor: "pointer",
    color: "#cbd5e1",
  },
  navItemActive: {
    background: "#0b1220",
    borderColor: "#1f2937",
    color: "#60a5fa",
    fontWeight: 900,
  },
};
