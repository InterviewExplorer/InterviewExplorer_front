import { Link } from 'react-router-dom';

function Main() {
    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC'>
            <div className='ly_flexC ly_fitemC hp_pr50'>
                <div className='el_img hp_mr20'></div>
                <div className='hp_ml70'>
                    <h2 className='el_lv2Head hp_fontGmarket hp_mb5'>언제 어디서나! 간편하게!</h2>
                    <h1 className='el_lv1Head hp_fontGmarket'>AI 면접 도우미 : Interview Explorer</h1>
                    <div className='hp_mt50'>
                        <div className='el_box el_box__main'>
                            <div className='el_box__txt'>면접관 ver</div>
                            <div className='el_box__icon el_icon__interviewer'></div>
                            <Link to="/interviewer" className='el_btnS el_btn0Back hp_w100'>시작하기</Link>
                        </div>
                        <div className='el_box el_box__main hp_ml30'>
                            <div className='el_box__txt'>지원자 ver</div>
                            <div className='el_box__icon el_icon__interviewee'></div>
                            <Link to="/getInfo" className='el_btnS el_btn0Back hp_w100'>시작하기</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;