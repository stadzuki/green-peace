import React from 'react';

function Popup({clickTrue, clickFalse}) {
    return (
        <div className="loaderWrapper">
            <div className="popup">
                <div className="popupContainer">
                    <p>Компания создана.</p>
                    <div className="popupBtns">
                        <a className="popupNew popupBtn" onClick={clickTrue}>Хотите создать еще?</a>
                        <a className="popupClose popupBtn" onClick={clickFalse}>Закрыть</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Popup