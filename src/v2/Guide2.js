import MicTest from "../pages/MicTest";
import CamTest from "../pages/CamTest";
import { useLocation, useNavigate } from 'react-router-dom';

function Guide2() {

    const location = useLocation();
    const navigate = useNavigate();
    const { questions: data, job, years, interviewer: data2, type: interviewType } = location.state || {};

    const handleInteviewSummit = () => {
        navigate('/interview', { state: { questions: data, job, years, interviewer: data2, type: interviewType } });
    }

    return (
        <div style={{ display: 'flex'}}>
            <CamTest/>
            <MicTest/>
            <button type="submit" onClick={handleInteviewSummit}>건너 뛰기</button>
        </div>
    );
}

export default Guide2;