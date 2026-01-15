export default function App() {
  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Ahn_front React 예시 화면</h1>
      <p>이 화면이 보이면 React + Vite + GitHub 연결 정상</p>

      <div
        style={{
          marginTop: 20,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 8,
          maxWidth: 400,
        }}
      >
        <h2>테스트 카드</h2>
        <p>현재 시간:</p>
        <strong>{new Date().toLocaleString()}</strong>
      </div>
    </div>
  );
}