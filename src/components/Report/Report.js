import React from 'react'

function Report() {
    return (
        <div className="reportModal">
            <div className="reportTitle">
                <p className="reportTitleText">Жалоба</p>
                <img className={styles.companyClose} width="10" src="/img/cancel.png" alt="close"/>
            </div>
            <form>
                <div className="reasonBlock">
                    <span className="reasonBlockTitle">Пожалуйста, укажите причину:</span>
                    <ul className="reasons">
                        <input type="radio" id="contactChoice1"
                        name="contact" value="companyClose"/>
                        <label for="contactChoice1">Пункт закрыт</label>

                        <input type="radio" id="contactChoice2"
                        name="contact" value="fakeDescription"/>
                        <label for="contactChoice2">Неточность в описании</label>

                        <input type="radio" id="contactChoice3"
                        name="contact" value="other"/>
                        <label for="contactChoice3">Другая</label>
                    </ul>
                </div>
                <div className="reasonText">
                    <textarea placeholder="Текст жалобы"></textarea>
                </div>
                <div>
                    <span>Ваши контакты:</span>
                    <input placeholder="Телефон" type="text"/>
                </div>
                <button>Отправить</button>
            </form>
        </div>
    )
}

export default Report