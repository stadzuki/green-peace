import React from 'react'

import transcription from '../../utils/transcription'
import styles from './Toggle.module.scss'


function Toggle({isToggle, toggleClick, lang, isText, id}) {
    return (
        <div className={styles.toggleWrapper}>
            {isText !== false ? <p className={styles.toggleTitle}>{transcription[lang]?.toggleTitle}</p> : ''}
                {id !== undefined 
                    ? <div className={styles.inputWrapper}>
                        <input type="checkbox" name="toggle" className={styles.mobileToggle} id={`toggle-${id}`} checked={isToggle} onChange={toggleClick}/>
                        <label htmlFor={`toggle-${id}`}></label>
                    </div>
                    : <div className={styles.inputWrapper}>
                        <input type="checkbox" name="toggle" className={styles.mobileToggle} id="toggle" checked={isToggle} onChange={toggleClick}/>
                        <label htmlFor="toggle"></label>
                    </div>
                }
            
        </div>
    )
}

export default Toggle;