import { Link } from 'react-router-dom';

function Main() {
    return (
        <>
            <h1>메인페이지</h1>
            <Link to="/getInfo">면접 시작</Link>
            <br/>
            <Link to="/getInfo_uh">우현 시작</Link>
        </>
    )
}

export default Main;