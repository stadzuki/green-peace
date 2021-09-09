import React from 'react';

function MarkerCreator({changeTarget}) {
    return (
        <div className="markerContainer">
            <div className="markerHover">Добавить новый пункт</div>
            <div className="markerCreator" onClick={() => changeTarget()}>
                <img src="/img/markerBtn.png" width="37" height="37" alt="create marker"/>
            </div>
        </div>
    )
}

export default MarkerCreator;