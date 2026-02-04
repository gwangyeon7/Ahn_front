import React from "react";
import { middleStyles } from "../../styles/middle";

export default function Middle() {
  const onReadMore = () => {
    // 나중에 라우팅/스크롤로 바꿔도 됨
    alert("READ MORE");
  };

  return (
    <section style={middleStyles.container}>
      <div style={middleStyles.content}>
        <h1 style={middleStyles.title}>ZERO CHECK - SBOM</h1>
        <p style={middleStyles.subTitle}>Security service for home and office</p>

        <button style={middleStyles.button} onClick={onReadMore}>
          READ MORE
        </button>
      </div>
    </section>
  );
}