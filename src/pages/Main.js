import { Link } from 'react-router-dom';

function Main() {
    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC'>
            <div className='ly_flexC ly_fitemC'>
                {/* <h3 className='el_logo fascinate'>in</h3> */}
                {/* <h3 className='el_logo2 fascinate'>i</h3> */}
                <div className='hp_ml70'>
                    <h2 className='el_lv2Head hp_fontGmarket hp_mb5'>언제 어디서나! 간편하게!</h2>
                    <h1 className='el_lv1Head hp_fontGmarket'>AI 면접 도우미 : Interview Explorer</h1>
                    <div className='hp_mt30'>
                        <div className='el_box el_box__main'>
                            <div className='el_box__txt'>면접관 ver</div>
                            <div className='el_box__icon el_icon__interviewer'></div>
                            <Link to="/" className='el_btnS el_btn0Back hp_w100'>시작하기</Link>
                        </div>
                        <div className='el_box el_box__main hp_ml30'>
                            <div className='el_box__txt'>지원자 ver</div>
                            <div className='el_box__icon el_icon__interviewee'></div>
                            <Link to="/getInfo" className='el_btnS el_btn0Back hp_w100'>시작하기</Link>
                            {/* <Link to="/getInfo_uh">우현 시작</Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <div className='ly_main'>
        //     <div className='bl_main__logoBack'>
        //         <div className='bl_main__logo fascinate'>i</div>
        //     </div>
        //     <div className='bl_main__headBack'>
        //         <div className='bl_main__headWrap'>
        //             <h2 className='el_lv2Head hp_fontGmarket hp_mb5'>언제 어디서나! 간편하게!</h2>
        //             <h1 className='el_lv1Head hp_fontGmarket'>AI 면접 도우미 : Interview Explorer</h1>
        //         </div>
        //     </div>
        //     <div className='bl_main__cont'>
        //         <div className='el_box el_box__main'>
        //             <div className='el_box__txt'>면접관 ver</div>
        //             <div className='el_box__icon el_icon__interviewer'></div>
        //             <Link to="/" className='el_btnS el_btn0Back hp_w100'>시작하기</Link>
        //         </div>
        //         <div className='el_box el_box__main hp_ml30'>
        //             <div className='el_box__txt'>지원자 ver</div>
        //             <div className='el_box__icon el_icon__interviewee'></div>
        //             <Link to="/getInfo" className='el_btnS el_btn0Back hp_w100'>시작하기</Link>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Main;