import { Link } from 'react-router-dom';

function Main() {
    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC'>
            <div className=''>
                <h2 className=''>언제 어디서나! 간편하게!</h2>
                <h1 className='el_lv1Head hp_fontGmarket'>AI 가상 면접 서비스 : Interview Explorer</h1>
                <div className='hp_mt50'>
                    <div className='el_box el_box__main'>
                        <div className='el_box__txt'>면접관 ver</div>
                        <div className='el_box__icon el_icon__interviewer'></div>
                        <Link to="/getInfo" className='el_btnM el_btn0Back hp_br99 hp_alignC'>시작하기</Link>
                    </div>
                    <div className='el_box el_box__main hp_ml30'>
                        <div className='el_box__txt'>지원자 ver</div>
                        <div className='el_box__icon el_icon__interviewee'></div>
                        <Link to="/getInfo" className='el_btnM el_btn0Back hp_br99 hp_alignC'>시작하기</Link>
                        {/* <Link to="/getInfo_uh">우현 시작</Link> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;