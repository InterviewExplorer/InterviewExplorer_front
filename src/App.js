import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import GetInfo from "./pages/GetInfo";
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
          <Route path="/report" element={<Report />} />
          <Route path="/guide" element={<Guide/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
