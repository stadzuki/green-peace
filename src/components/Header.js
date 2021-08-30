import React from 'react';
import { Link } from 'react-router-dom';

function Header(props) {
    return (
        <header>
            <div className="header-logo">
                <Link to="/">
                    <img className="logo" src="/img/logo.png" alt="Green Peace"/>
                </Link>
            </div>
            <div className="btns-wrapper">
                <div className="header-btn">
                    <Link to="/auth">
                        <div className="btn auth-btn">Войти</div>
                    </Link>
                </div>
                <div className="header-btn">
                    <Link to="/register">
                        <div className="btn register-btn">Зарегистрироваться</div>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header;