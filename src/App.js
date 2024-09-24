import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Loading from "./pages/Loading";

// ver1
import GetInfo from "./pages/GetInfo";
import Guide from "./pages/Guide";
import Interview from "./pages/Interview";
import Report from "./pages/Report";

// ver2
import GetInfo2 from "./v2/GetInfo2";
import Guide2 from "./v2/Guide2";
import Interview2 from "./v2/Interview2";
import Report2 from "./v2/Report2";

function App() {
  return (
    <>
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Main />}/>
          <Route path="/loading" element={<Loading/>}/>
          
          {/* ver1 */}
          {/* <Route path="/getInfo" element={<GetInfo />} />
          <Route path="/guide" element={<Guide/>}/>
          <Route path="/interview" element={<Interview />} />
          <Route path="/report" element={<Report />} /> */}

          {/* ver2: 5가지 분석요소 + LLM */}
          <Route path="/getInfo" element={<GetInfo2 />} />
          <Route path="/guide" element={<Guide2/>}/>
          <Route path="/interview" element={<Interview2 />} />
          <Route path="/report" element={<Report2 />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
