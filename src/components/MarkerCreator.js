import React from 'react';
import transcription from '../transcription'

function MarkerCreator({changeTarget, currentLang}) {
    return (
        <div className="markerContainer">
            <div className="markerHover">{transcription[currentLang].MarkerCreatorTitle}</div>
            <div className="markerCreator" onClick={() => changeTarget()}>
                <img src="/img/markerBtn.png" width="37" height="37" alt="create marker"/>
            </div>
        </div>
    )
}

export default MarkerCreator;