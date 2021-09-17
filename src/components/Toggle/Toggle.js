import React from 'react'

import styles from './Toggle.module.scss'


function Toggle({isToggle, toggleClick}) {
    return (
        <div className={styles.toggleWrapper}>
            <p className={styles.toggleTitle}>Показать пункты, которые принимают сразу всё выбранное</p>
            <div className={styles.inputWrapper}>
                <input type="checkbox" name="toggle" className={styles.mobileToggle} id="toggle" checked={isToggle} onChange={toggleClick}/>
                <label htmlFor="toggle"></label>
            </div>
        </div>
    )
}

export default Toggle;