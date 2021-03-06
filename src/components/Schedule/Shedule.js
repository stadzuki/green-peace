import React from 'react';
import Toggle from '../Toggle/Toggle';
import InputMask from 'react-input-mask';
import styles from './Schedule.module.scss';

function Schedule({
    scheduleChangeHandler,
    scheduleToggleClick,
    schedule,
    weekday,
    lang,
    idx,
}) {

    const inputs = [
        {value: schedule.firstFieldValue, placeholder: '08:00', field: 'first'},
        {value: schedule.secondFieldValue, placeholder: '22:00', field: 'second'}
    ]

    return (
        <div className={styles.scheduleItem}>
            <div className={styles.scheduleTitle}>
                <p>{weekday}</p>
                <Toggle
                    lang={lang}
                    id={idx}
                    isToggle={schedule.isToggle}
                    toggleClick={() => scheduleToggleClick(idx)}
                    isText={false}
                />
            </div>
            <div className={styles.scheduleFields}>
                {inputs.map((input, id) => {
                    return (
                        <span key={id}>
                            <InputMask 
                                className={styles.workTimeInput}
                                type="text"
                                value={input.value}
                                mask="99:99"
                                placeholder={input.placeholder}
                                disabled={!schedule.isToggle}
                                onChange={(e) => scheduleChangeHandler(e, idx, input.field, weekday + '_' + input.field)}
                            />
                            {id === 0 ? <span>-</span> : ''}
                        </span>
                    )
                })}
            </div>
        </div>
    )
}

export default Schedule