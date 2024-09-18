import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import GetInfo from "./pages/GetInfo";
import Report from "./pages/Report";
import Interview from "./pages/Interview";
import Guide from "./pages/Guide";
import Chart from "./pages/Chart";
import Loading from "./pages/Loading";

// 우현 면접
import GetInfo_uh from "./pages/GetInfo_uh";
import Guide_uh from "./pages/Guide_uh";
import Interview_uh from "./pages/Interview_uh";

function App() {
  return (
    <>
      <BrowserRouter >
        <Routes >
          <Route path="/" element={<Main />}/>
          <Route path="/getInfo" element={<GetInfo />} />
          <Route path="/getInfo_uh" element={<GetInfo_uh />} /> {/* 우현 면접 시작 */}
          <Route path="/interview" element={<Interview />} />
          <Route path="/interview_uh" element={<Interview_uh />} /> {/* 우현 면접 */}
          <Route path="/report" element={<Report />} />
          <Route path="/guide" element={<Guide/>}/>
          <Route path="/chart" element={<Chart/>}/>
          <Route path="/loading" element={<Loading/>}/>
          <Route path="/guide_uh" element={<Guide_uh/>}/> {/* 우현 면접 가이드 */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
