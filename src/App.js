import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Pdf from "./pages/Pdf";

function App() {
  return (
    <>
      <BrowserRouter >
        <Routes >
          <Route path="/" element={<Main />}/>
          <Route path="/pdf" element={<Pdf />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
