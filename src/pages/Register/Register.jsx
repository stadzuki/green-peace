import React from 'react';
import { Link } from 'react-router-dom';

import checkInput from '../../utils/checkInput';
import Notif from '../../components/Notif';
import styles from './Register.module.scss';

function Register() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [rePassword, setRePassword] = React.useState('')
    const [isValid, setIsValid] = React.useState({})
    const [displayNotif, setDisplayNotif] = React.useState(false)

    const inputHandler = (evt) => {
        if(!checkInput(evt.target.value, evt.target.name)) {
            evt.target.style.border = '0.5px solid #b8233c';
            setIsValid((prev) => setIsValid({...prev, [`${evt.target.name}`]: false}));
        } else {
            evt.target.style.border = '0.5px solid #23b839';
            setIsValid((prev) => setIsValid({...prev, [`${evt.target.name}`]: true}));
        }

        if(evt.target.name === 're-password') {
            if(evt.target.value !== password) {
                evt.target.style.border = '0.5px solid #b8233c';
                setIsValid((prev) => setIsValid({...prev, [`${evt.target.name}`]: false}));
            } else {
                evt.target.style.border = '0.5px solid #23b839';
                setIsValid((prev) => setIsValid({...prev, [`${evt.target.name}`]: true}));  
            }
        }

        if(evt.target.name === 'email') {
            setEmail(evt.target.value)
        } else if(evt.target.name === 'password') {
            setPassword(evt.target.value)
        } else {
            setRePassword(evt.target.value)
        }
    }

    const registerHandler = (evt) => {
        evt.preventDefault();
        
        if(rePassword !== password) {
            setIsValid((prev) => setIsValid({...prev, [`${evt.target.name}`]: false}));
        } else {
            setIsValid((prev) => setIsValid({...prev, [`${evt.target.name}`]: true}));  
        }

        if(Object.values(isValid).includes(false)) {
            setDisplayNotif(true)
            setTimeout(() => {
                setDisplayNotif(false)
            }, 2000)
        } else {
            console.log('reg');
        }
    }

    return (
        <div className={`${styles.overlay}`}>
            <div className={styles.modal}>
                {displayNotif ? <Notif title="Поля заполнены некорректно"/> : null}
                <Link to="/">
                    <div className={styles.closeWrapper}>
                        <img src="/img/cancel.png" width="15" alt="close"/>
                    </div>
                </Link>
                <div className={styles.container}>
                    <form action="#" method="POST">
                        <p>
                            <span>Email</span>
                            <input name="email" value={email} placeholder="Введите Email" type="text" onChange={inputHandler}></input>
                        </p>
                        <p>
                            <span>Пароль</span>
                            <input name="password" value={password} placeholder="Введите пароль" type="password" onChange={inputHandler}></input>
                        </p>
                        <p>
                            <span>Повторите Пароль</span>
                            <input name="re-password" value={rePassword} placeholder="Повторите пароль" type="password" onChange={inputHandler}></input>
                        </p>
                        <button method="POST" onClick={registerHandler}>Зарегистрироватсья</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;