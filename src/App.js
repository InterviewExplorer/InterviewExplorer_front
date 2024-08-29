import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Pdf from "./pages/Pdf";
import GetInfo from "./pages/GetInfo";
import Interview_technical from "./pages/Interview_technical";
import Report from "./pages/Report";

function App() {
  return (
    <>
      <BrowserRouter >
        <Routes >
          <Route path="/" element={<Main />}/>
          <Route path="/pdf" element={<Pdf />} />
          <Route path="/getInfo" element={<GetInfo />} />
          <Route path="/interview_technical" element={<Interview_technical />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
