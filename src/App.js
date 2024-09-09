import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import GetInfo from "./pages/GetInfo";
import Interview_technical from "./pages/Interview_technical";
import Report from "./pages/Report";
import Follow from "./pages/Follow";
import Interview_behavioral from "./pages/Interview_behavioral";
import Interview from "./pages/Interview";

function App() {
  return (
    <>
      <BrowserRouter >
        <Routes >
          <Route path="/" element={<Main />}/>
          <Route path="/getInfo" element={<GetInfo />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/interview_technical" element={<Interview_technical />} />
          <Route path="/interview_behavioral" element={<Interview_behavioral />} />
          <Route path="/report" element={<Report />} />
          <Route path="/follow" element={<Follow />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
