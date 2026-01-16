// 1. 경로에서 ./src/를 빼고, 파일명 frontDashboard를 정확히 입력합니다.
import FrontDashboard from './components/frontDashboard.jsx'; 

function App() {
  return (
    <div className="App">
      {/* 2. 위에서 import한 이름인 'FrontDashboard'를 태그로 사용합니다. */}
      <FrontDashboard />
    </div>
  );
}

export default App;