import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import GetInfo from "./pages/GetInfo";
import Report from "./pages/Report";
import Interview from "./pages/Interview";
import Guide from "./pages/Guide";
import Chart from "./pages/Chart";
import Loading from "./pages/Loading";

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
          <Route path="/chart" element={<Chart/>}/>
          <Route path="/loading" element={<Loading/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
