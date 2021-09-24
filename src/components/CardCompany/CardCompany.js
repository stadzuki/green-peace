import React from 'react';

import styles from './CardCompany.module.scss'
import transcription from '../../utils/transcription';

function CardCompany({company, userPos, onClose, isCommentVisible}) {

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    //график работы перерыв контакты
    const categoriesToString = () => {
        let outStr = '';
        for(let category of company.categoriesId) {
            switch(+category) {
                case 1:
                    outStr += ' бумага,'
                    break;
                case 2:
                    outStr += ' стекло,'
                    break;
                case 3:
                    outStr += ' пластик,'
                    break;
                case 4:
                    outStr += ' металл,'
                    break;
                case 5:
                    outStr += ' одежда,'
                    break;
                case 6:
                    outStr += ' иное,'
                    break;
                case 7:
                    outStr += ' опасные отходы,'
                    break;
                case 8:
                    outStr += ' батарейки,'
                    break;
                case 9:
                    outStr += ' лампочки,'
                    break;
                case 10:
                    outStr += ' бытовая техника,'
                    break;
                case 11:
                    outStr += ' тетра пак,'
                    break;
                case 12:
                    outStr += ' крышечки,'
                    break;
                case 13:
                    outStr += ' шины'
                    break;
            }
        }

        if(outStr.endsWith(',')) {
            outStr = outStr.slice(0, outStr.length - 1)
        }
        
        return outStr
    }

    const createRoute = () => {
        console.log(userPos);
    }

    const getCurrentDay = (days) => {
        const weekday = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6,  6: 0}
        const today = new Date().getDay();

        const current = {};
        
        for(let i = 0; i < days.length; i++) {
            if(weekday[`${i}`] === today) {
                days[i] === 'none-none' ? current.time = 'Выходной' : current.time = days[i];
                current.day = i;
                break;
            }
        }

        return current;
    }

    return (
        <div className={`${styles.companyCard}`}>
            <p className={styles.companyTitle}>{company.title}</p>
            {onClose ? <img className={styles.companyClose} width="10" src="/img/cancel.png" alt="close" onClick={onClose}/> : ''}
            <div className={styles.companyImage}>
                <img src={"data:image/jpeg;base64," + company.imageUrl} alt="company photo"/>
            </div>
            {onClose ? <div className={styles.companyMark}>
                <div className={styles.markCount}>
                    <div className={styles.markNumber}>1</div>
                    <p className={styles.markText}>1 оценка</p>
                </div>
                <div className={styles.markAction}>
                    <div className={`${styles.selectedLike} ${styles.markEst}`}>
                        <img src="/img/like.png" width="25" height="25" alt="like"/>
                    </div>
                    <div className={`${styles.markEst}`}>
                        <img src="/img/dislike.png" width="25" height="25" alt="dislike"/>
                    </div>
                </div>
            </div> : ''}
            {onClose ? <div className={styles.communicate}>
                <ul className={styles.communicateList}>
                    <li className={styles.communicateItem}>
                        <img src="/img/report.png" width="35" height="35" alt="report icon"/>
                        <p>Жалоба</p>
                    </li>
                    <a href={`tel:${company.phoneNumber}`}>
                        <li className={styles.communicateItem}>
                            <img src="/img/phone.png" width="35" height="35" alt="phone icon"/>
                            <p>Позвонить</p>
                        </li>
                    </a>
                    <li className={styles.communicateItem} onClick={createRoute}>
                        <img src="/img/route.png" width="35" height="35" alt="route icon"/>
                        <p>Маршрут</p>
                    </li>
                    <li className={styles.communicateItem}>
                        <img src="/img/comment.png" width="35" height="35" alt="comment icon"/>
                        <p>Комментарии</p>
                    </li>
                </ul>
            </div> : ''}
            <div className={styles.companyLocate}>{company.city}, {company.address}</div>
            <div className={styles.specialize}><span>Принимают:</span>{categoriesToString()}</div>
            <div className={styles.generalInfo}>
                <div className={styles.generalTitle}>Общая информация</div>
                <p className={styles.generalDescription}>{company.description}</p>
            </div>
            {company.isAllTime
                ? <div className={styles.workTimeContainer}>
                    <p className={styles.workTimeToday}>Круглосуточно</p>
                </div> 
                : <div className={styles.workTimeContainer}>
                    <p className={styles.workTimeToday}>Сегодня: <span className={styles.small}>{getCurrentDay(company.workTime.split('+')).time}</span></p>
                    <div className={styles.table}>
                        {company.workTime.split('+').map((time, idx) => {
                            const timeArr = time.split('-');
                            const startWork = timeArr[0];
                            const finishWork = timeArr[1];

                            return (
                                <div key={idx} className={styles.tableDay}>
                                    <span className={`${styles.tableDayTitle} ${idx === getCurrentDay(company.workTime.split('+')).day ? styles.tableDayActive : ''}`}>{weekDays[idx]}</span>
                                    <p className={styles.tableDayTime}>
                                        {startWork == 'none'
                                            ? <span className={styles.tableDayTimeStart}>-</span>
                                            : <div>
                                                <p className={styles.tableDayTimeStart}>{startWork}</p>
                                                <p className={styles.tableDayTimeFinish}>{finishWork}</p>
                                            </div>
                                        }
                                        
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
            
            <div className={styles.coffeeTime}>
                Перерыв: <span className={styles.small}>{company.coffeTime ? company.coffeTime : 'без перерыва'}</span>
            </div>
            <div className={styles.contactContainer}>
                <p className={styles.contactTitle}>Контакты:</p>
                <p className={styles.contact}>Номер телефона: <span>{company.phoneNumber}</span></p>
                <p className={styles.contact}>Сайт: <a href={`https://${company.webSiteUrl}`}>{company.webSiteUrl}</a></p>
            </div>
            {isCommentVisible 
                ? <div className={styles.commentContainer}>
                    <p className={styles.commentTitle}>Последние комментарии</p>
                    <div className={styles.commentBlock}>
                        <p className={styles.commentAuthor}>Имя</p>
                        <p className={styles.commentDate}>21.12.2021</p>
                        <p className={styles.comment}>Просто коммент</p>
                    </div>
                    <div className={styles.commentBtn}>Комментировать</div>
                </div>
                : ''
            }
        </div>
    )
}

export default CardCompany;