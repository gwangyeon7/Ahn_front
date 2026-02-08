import React from "react";
import Topbar from "./Topbar";
import Middle from "./Middle";
import Bottom from "./Bottom";

export default function Introduce() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Topbar />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Middle />
      </div>
      <Bottom /> {/* ← height 160px */}
    </div>
  );
}