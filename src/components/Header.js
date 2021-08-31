import React from 'react';
import { Link } from 'react-router-dom';

function Header({onClickSignUp, onClickSignIn}) {
    return (
        <header>
            <div className="header-logo">
                <Link to="/">
                    <img className="logo" src="/img/logo.png" alt="Green Peace"/>
                </Link>
            </div>
            <div className="btns-wrapper">
                <div className="header-btn" onClick={onClickSignIn}>
                    <div className="btn auth-btn">Войти</div>
                </div>
                <div className="header-btn" onClick={onClickSignUp}>
                    <div className="btn register-btn">Зарегистрироваться</div>
                </div>
            </div>
        </header>
    )
}

export default Header;