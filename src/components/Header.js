import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <div className="header-logo">
                <Link to="/">
                    <img className="logo" src="/img/logo.png" alt="Green Peace"/>
                </Link>
            </div>
            <div className="header-btn">
                <Link to="/auth">
                    <div className="auth-btn">Войти</div>
                </Link>
            </div>
        </header>
    )
}

export default Header;