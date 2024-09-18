import MicTest from "./MicTest";
import CamTest from "./CamTest";
import { useLocation, useNavigate } from 'react-router-dom';

function Guide() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions: data, job, years, interviewer: data2, type: interviewType } = location.state || {};

    const handleInteviewSummit = () => {
        navigate('/interview', { state: { questions: data, job, years, interviewer: data2, type: interviewType } });
    }

    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC'>
            <div className="hp_relative">
                <div className="hp_dpInblock hp_ValignT">
                    <CamTest/>
                </div>
                <div className="hp_dpInblock hp_ValignT el_box el_box__mic hp_ml30 hp_alignC">
                    <MicTest/>                    
                </div>
                <button type="submit" onClick={handleInteviewSummit} className="el_btnL el_btnGradation el_skipBtn el_shqdowBasic">건너 뛰기</button>
            </div>
        </div>
    );
}

export default Guide;