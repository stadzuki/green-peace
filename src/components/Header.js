import React from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context';

function Header() {
    const {setLoginMethod, isAuthorize, user} = React.useContext(AppContext)

    return (
        <header>
            <div className="header-logo">
                <Link to="/">
                    <img className="logo" src="/img/logo.png" alt="Green Peace"/>
                </Link>
            </div>
            {isAuthorize 
            ? <div className="btns-wrapper">
                <div className="header-btn">
                    <div className="btn">{user.login}</div>
                </div>
            </div>
            : <div className="btns-wrapper">
                <div className="header-btn" onClick={() => setLoginMethod('signIn')}>
                    <div className="btn auth-btn">Войти</div>
                </div>
                <div className="header-btn" onClick={() => setLoginMethod('signUp')}>
                    <div className="btn register-btn">Зарегистрироваться</div>
                </div>
            </div>
            }
        </header>
    )
}

export default Header;