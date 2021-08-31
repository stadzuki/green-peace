import React from 'react';
import AppContext from '../../context';

import Notif from '../../components/Notif';

import styles from './Login.module.scss';

function Login({method, onClose}) {
    const {setLoginMethod} = React.useContext(AppContext)

    const [notifTitle, setNotifTitle] = React.useState('Поля заполнены некорректно')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [rePassword, setRePassword] = React.useState('')
    const [isValid, setIsValid] = React.useState({})
    const [displayNotif, setDisplayNotif] = React.useState(false)

    const fields = [
        {
            name: 'email',
            value: email,
            setValue: setEmail,
            type: 'text',
            title: 'Email', 
            placeholder: 'Введите Email', 
            regex: /^[a-zA-Z.\-_0-9]{1,64}@[a-zA-Z0-9]{3,12}\.[a-zA-Z]{2,12}$/
        },
        {
            name: 'password',
            value: password,
            setValue: setPassword,
            type: 'password',
            title: 'Пароль',
            placeholder: 'Введите Пароль', 
            regex: /^[a-zA-Z0-9]{6,16}$/
        },
        {
            name: 'rePassword',
            value: rePassword,
            setValue: setRePassword,
            type: 'password',
            title: 'Повторите пароль',
            placeholder: 'Повторите пароль', 
            regex: /^[a-zA-Z0-9]{6,16}$/
        },
    ]

    let pageFields = [];

    if(method === 'signIn') {
        pageFields = [fields[0], fields[1]]
    } else if(method === 'signUp') {
        pageFields = [...fields]
    }

    const inputHandler = (evt, field) => {
        const {target} = evt;

        if(target.value.search(field.regex) === -1) {
            target.style.border = '0.5px solid #b8233c';
            setIsValid((prev) => setIsValid({...prev, [`${evt.target.name}`]: false}));
        } else {
            target.style.border = '0.5px solid #23b839';
            setIsValid((prev) => setIsValid({...prev, [`${evt.target.name}`]: true}));
        }

        field.setValue(target.value)
    }

    const loginHandler = (evt) => {
        evt.preventDefault();
        console.log(password);
        console.log(rePassword);
        if(method === 'signUp' ) {
            if(rePassword !== password) {
                setNotifTitle('Пароли не совпадают')
                setDisplayNotif(true);
                setTimeout(() => {
                    setDisplayNotif(false)
                }, 3000)
                return;
            }
        }

        if(Object.values(isValid).includes(false)) {
            setDisplayNotif(true);
            setTimeout(() => {
                setDisplayNotif(false)
            }, 2000)
        } else {
            console.log('auth');
            closeHandler();
        }
    }
    

    const closeHandler = () => {
        setEmail('');
        setPassword('');
        setRePassword('');

        onClose();
    }

    return (
        <div className={`${styles.overlay} ${method ? styles.visible : ''}`}>
            <div className={styles.modal}>
                {displayNotif ? <Notif title={notifTitle}/> : null}
                    <div className={styles.closeWrapper} onClick={closeHandler}>
                        <img src="/img/cancel.png" width="15" alt="close"/>
                    </div>
                <div className={styles.container}>
                    <form action="#" method="POST">
                        {pageFields.map((field, idx) => {
                            return (
                                <p key={idx}>
                                    <span>{field.title}</span>
                                    <input 
                                        name={field.name} 
                                        value={field.value} 
                                        placeholder={field.placeholder} 
                                        type={field.type}
                                        onChange={(e) => inputHandler(e, field)}
                                    ></input>
                                </p>
                            )
                        })}
                        {method === 'signIn' 
                            ? <button className={styles.signInBtn} method="POST" onClick={loginHandler}>Войти</button>
                            : <button className={styles.signUpBtn} method="POST" onClick={loginHandler}>Зарегистрироватсья</button>
                        }
                    </form>
                    {method === 'signIn' 
                        ? <div className={styles.otherLogin}>
                            <p className={styles.loginLine}>Войти с помощью</p>
                            <div className={styles.optionLogin}>
                                <button className={styles.loginWith}>
                                    <img src="/img/google-icon.png" width="25" alt="icon" />
                                    Google
                                </button>
                                <button className={styles.loginWith}>
                                    <img src="/img/facebook-icon.png" width="25" alt="icon" />
                                    Facebook
                                </button>
                                <button className={styles.loginWith}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png" width="25" alt="icon" />
                                    Instagram
                                </button>
                                <button className={styles.loginWith}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Telegram_Messenger.png" width="25" alt="icon" />
                                    Telegram
                                </button>
                            </div>
                            <p className={styles.noAccount}>
                                Нет аккаунта?
                                <span onClick={() => setLoginMethod('signUp')}>Зарегистрироватсья</span>
                            </p>
                        </div>
                        : ''
                    }
                </div>
            </div>
        </div>
    )
}

export default Login
