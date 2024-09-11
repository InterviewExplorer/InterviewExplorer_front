import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import GetInfo from "./pages/GetInfo";
import Interview_technical from "./pages/Interview_technical";
import Report from "./pages/Report";
import Interview from "./pages/Interview";
import Guide from "./pages/Guide";

function App() {
  return (
    <>
      <BrowserRouter >
        <Routes >
          <Route path="/" element={<Main />}/>
          <Route path="/getInfo" element={<GetInfo />} />
          <Route path="/interview" element={<Interview />} />
          {/* <Route path="/interview_technical" element={<Interview_technical />} /> */}
          <Route path="/report" element={<Report />} />
          <Route path="/guide" element={<Guide/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
