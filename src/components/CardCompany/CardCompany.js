import React from 'react';

import styles from './CardCompany.module.scss'

function CardCompany({company, onClose}) {

    const categoriesToString = () => {
        let outStr = '';
        for(let category of company.categoriesId) {
            switch(category) {
                case 1:
                    outStr += ' бумага'
                    break;
                case 2:
                    outStr += ' стекло'
                    break;
                case 3:
                    outStr += ' пластик'
                    break;
                case 4:
                    outStr += ' металл'
                    break;
                case 5:
                    outStr += ' одежда'
                    break;
                case 6:
                    outStr += ' иное'
                    break;
                case 7:
                    outStr += ' опасные отходы'
                    break;
                case 8:
                    outStr += ' батарейки'
                    break;
                case 9:
                    outStr += ' лампочки'
                    break;
                case 10:
                    outStr += ' бытовая техника'
                    break;
                case 11:
                    outStr += ' тетра пак'
                    break;
                case 12:
                    outStr += ' крышечки'
                    break;
                case 13:
                    outStr += ' шины'
                    break;
            }
        }

        return outStr;
    }

    return (
        <div className={`${styles.companyCard}`}>
            <p className={styles.companyTitle}>{company.title}</p>
            <img className={styles.companyClose} width="10" src="/img/cancel.png" alt="close" onClick={onClose}/>
            <div className={styles.companyImage}>
                <img src={company.imageUrl} alt="company photo"/>
            </div>
            <div className={styles.companyMark}>
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
            </div>
            <div className={styles.communicate}>
                <ul className={styles.communicateList}>
                    <li className={styles.communicateItem}>
                        <img src="/img/report.png" width="35" height="35" alt="report icon"/>
                        <p>Жалоба</p>
                    </li>
                    <li className={styles.communicateItem}>
                        <img src="/img/phone.png" width="35" height="35" alt="phone icon"/>
                        <p>Позвонить</p>
                    </li>
                    <li className={styles.communicateItem}>
                        <img src="/img/route.png" width="35" height="35" alt="route icon"/>
                        <p>Маршрут</p>
                    </li>
                    <li className={styles.communicateItem}>
                        <img src="/img/comment.png" width="35" height="35" alt="comment icon"/>
                        <p>Комментарии</p>
                    </li>
                </ul>
            </div>
            <div className={styles.companyLocate}>{company.address}</div>
            <div className={styles.specialize}><span>Принимают:</span>{categoriesToString()}</div>
            <div className={styles.generalInfo}>
                <div className={styles.generalTitle}>Общая информация</div>
                <p className={styles.generalDescription}>{company.description}</p>
            </div>
        </div>
    )
}

export default CardCompany;