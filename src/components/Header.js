import React from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context';
import transcription from '../transcription';

function Header({user}) {
    const {setLoginMethod, isAuthorize, currentLang, setCurrentLang} = React.useContext(AppContext)

    const closeSwitchLang = () => {
        document.querySelector('.langDropDown').classList.toggle('visible')
    }

    return (
        <header>
            <div className="header-logo">
                <Link to="/">
                    <img className="logo" src="/img/logo.png" alt="Green Peace"/>
                </Link>
            </div>
            <div className="righSideWrapper">
                {/* <div>
                    <Link to="/admin">Админка</Link>
                </div> */}
                <div className="headerNavBtn">
                    <Link to="catalog" className="navBtn">{transcription[currentLang].btnCatalog}</Link>
                </div>
                
                {isAuthorize && user
                ? <div className="btns-wrapper">
                    <div className="header-btn">
                        <div className="btn">{user.login}</div>
                    </div>
                </div>
                : <div className="btns-wrapper">
                    <div className="header-btn" onClick={() => setLoginMethod('signIn')}>
                        <div className="btn auth-btn">{transcription[currentLang].btnLogin}</div>
                    </div>
                    <div className="header-btn" onClick={() => setLoginMethod('signUp')}>
                        <div className="btn register-btn">{transcription[currentLang].btnRegister}</div>
                    </div>
                </div>
                }
                <div className="langSelector">
                    <div className="langSelectorWrapper" onClick={closeSwitchLang}>
                        <p>{currentLang.toUpperCase()}</p>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            fill="none"
                            viewBox="0 0 15 15"
                            >
                            <g clipPath="url(#clip0)">
                                <path
                                    fill="#333"
                                    d="M7.496 11.415a.325.325 0 01-.231-.095L.09 4.146a.326.326 0 01.461-.46l6.944 6.942 6.942-6.944a.326.326 0 01.47.454l-.008.008-7.174 7.173a.326.326 0 01-.23.096z"
                                ></path>
                            </g>
                        </svg>
                    </div>
                    <div className="langDropDown">
                        <div className={`lang langRu ${currentLang === 'ru' ? 'selectedLang' : ''}`} onClick={() => (setCurrentLang('ru'), document.querySelector('.langDropDown').classList.toggle('visible'))}>Ru</div>
                        <div className={`lang langEn ${currentLang === 'en' ? 'selectedLang' : ''}`} onClick={() => (setCurrentLang('en'), document.querySelector('.langDropDown').classList.toggle('visible'))}>En</div>
                        <div className={`lang langEn ${currentLang === 'ua' ? 'selectedLang' : ''}`} onClick={() => (setCurrentLang('ua'), document.querySelector('.langDropDown').classList.toggle('visible'))}>Ua</div>
                    </div>
                </div>
            </div>
            
        </header>
    )
}

export default Header;