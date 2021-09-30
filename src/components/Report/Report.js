import axios from 'axios';
import React from 'react'

const url = 'https://9810-78-163-110-172.ngrok.io'

function Report({onClose, companyId}) {
    const [reason, setReason] = React.useState('');
    const [reportText, setReportText] = React.useState('');
    const [userPhone, setUserPhone] = React.useState('');
    const [error, setError] = React.useState('');

    const sendReport = () => {
        if(!reason) {
            return setError('Вы не указали причину')
        }

        if(!reportText) {
            return setError('Вы не указали текст жалобы')
        }

        if(!userPhone) {
            return setError('Вы не указали телефон')
        }

        if(userPhone.search( /^\+[0-9]+$/) === -1) {
            return setError('Телефон указан некорректно')
        }


        axios.post(`${url}/api/Company/AddReport`, {
            id: 0,
            text: reportText,
            reason: reason,
            phone: userPhone,
            companyId: companyId
        })
        .catch(e => console.log(e))

        onClose()
    }

    return (
        <div className="reportModal">
            <div className="reportTitle">
                <p className="reportTitleText">Жалоба</p>
                <div style={{cursor: 'pointer'}} onClick={onClose}>
                    <img className="companyClose" width="10" src="/img/cancel.png" alt="close"/>
                </div>
            </div>
            <form>
                <div className="reasonBlock">
                    <p className="reasonBlockTitle">Пожалуйста, укажите причину:</p>
                    <ul className="reasons">
                        <li>
                            <input type="radio" id="contactChoice1"
                            name="contact" value="companyClose" onChange={() => setReason('companyClose')}/>
                            <label htmlFor="contactChoice1">Пункт закрыт</label>
                        </li>
                        <li>
                            <input type="radio" id="contactChoice2"
                            name="contact" value="fakeDescription" onChange={() => setReason('fakeDescription')}/>
                            <label htmlFor="contactChoice2">Неточность в описании</label>
                        </li>
                        <li>
                            <input type="radio" id="contactChoice3"
                            name="contact" value="other" onChange={() => setReason('other')}/>
                            <label htmlFor="contactChoice3">Другая</label>
                        </li>
                    </ul>
                </div>
                <div className="reasonText">
                    <textarea placeholder="Текст жалобы" value={reportText} onChange={(e) => setReportText(e.target.value)}></textarea>
                </div>
                <div className="contacter">
                    <span>Ваши контакты:</span>
                    <input placeholder="Телефон" type="text" onChange={(e) => setUserPhone(e.target.value)}/>
                </div>
                <small style={{textAlign: 'center', color: '#ff002b'}}>{error}</small>
                <button onClick={(e) => {e.preventDefault(); sendReport()}}>Отправить</button>
            </form>
        </div>
    )
}

export default Report