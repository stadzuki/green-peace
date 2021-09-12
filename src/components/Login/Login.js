import React from 'react';
import AppContext from '../../context';
import GoogleLogin from 'react-google-login';
import Notif from '../../components/Notif';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import styles from './Login.module.scss';
import Loader from '../Loader';

function Login({method, onClose}) {
    const url = 'https://e6bd-188-119-45-172.ngrok.io';

    const {setLoginMethod, setUser, setIsAuthorize} = React.useContext(AppContext)

    const [notifTitle, setNotifTitle] = React.useState('Поля заполнены некорректно')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [rePassword, setRePassword] = React.useState('')
    const [isValid, setIsValid] = React.useState({})
    const [displayNotif, setDisplayNotif] = React.useState(false)
    const [isLoader, setIsLoader] = React.useState(false)

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

    const defineUser = (id, token) => {

        axios.get(`${url}/Users/${id}`, { headers: {"Authorization" : `${token}`}})
        .then(response => {
            setUser({
                id: response.data.id,
                email: response.data.email,
                login: response.data.name,
                icon: response.data.avatarUrl,
            })
        })
        .catch(error => {
          console.log(error);
        })

        localStorage.setItem("token", JSON.stringify(token))

        setIsAuthorize(true);
        setIsLoader(false)
        closeHandler();
    }

    const responseFacebook = (reponse) => {
        console.log(reponse);
    }

    const responseGoogle = (response) => {
        setIsLoader(true);
        axios.post(`${url}/Users/LogWithGoogle`, {
                tokenId:response.tokenId
            })
            .then(function (servResponse) {
                defineUser(
                    servResponse.data.id,
                    servResponse.data.token
                )
            })
            .catch(function (error) {
                console.log(error);
        });
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
            if(method === 'signUp') {
                axios.post(`${url}/Users/register`, {
                    "login": email,
                    "password": password,
                    "repeatPassword": rePassword
                }).then(response => {
                    defineUser(
                        response.data.id,
                        response.data.token
                    )
                }).catch(error => {
                    console.log(error);
                }) 
            } else if(method === 'signIn') {
                axios.post(`${url}/Users/authenticate`, {
                    username: email,
                    password: password
                }).then(response => {
                    defineUser(
                        response.data.id,
                        response.data.token
                    )
                }).catch(error => {
                    console.log(error);
                }) 
            }

            closeHandler();
        }
    }
    

    const closeHandler = () => {
        setEmail('');
        setPassword('');
        setRePassword('');

        onClose();
    }

    const overlayClose = (e) => {
        console.log(e)
        console.log(e.target)
        if(e.target.matches('.Login_overlay__1KxoY')) {
            closeHandler();
        }
    }

    return (
        <div className={`${styles.overlay} ${method ? styles.visible : ''}`} onClick={overlayClose}>
            {isLoader ? <Loader/>  : ''}
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
                            : <button className={styles.signUpBtn} method="POST" onClick={loginHandler}>Зарегистрироваться</button>
                        }
                    </form>
                    {method === 'signIn' 
                        ? <div className={styles.otherLogin}>
                            <p className={styles.loginLine}>Войти с помощью</p>
                            <div className={styles.optionLogin}>
                                <GoogleLogin
                                    clientId="293452950583-o9jgfohsd00vkrd4glf92g2q6pa9gk9i.apps.googleusercontent.com"
                                    render={renderProps => (
                                        <button 
                                            className={styles.loginWith}
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}
                                        >
                                            <img src="/img/google-icon.png" width="25" alt="icon" />
                                            Google
                                        </button>
                                    )}
                                    buttonText="Login"
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                    cookiePolicy={'single_host_origin'}
                                />
                                <FacebookLogin
                                    appId="1088597931155576"
                                    autoLoad
                                    callback={responseFacebook}
                                    render={renderProps => (
                                        <button 
                                            className={styles.loginWith}
                                            onClick={renderProps.onClick}>
                                            <img src="/img/facebook-icon.png" width="25" alt="icon" />
                                            Facebook
                                        </button>
                                    )}
                                />
                                {/* <button className={styles.loginWith}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png" width="25" alt="icon" />
                                    Instagram
                                </button>
                                <button className={styles.loginWith}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Telegram_Messenger.png" width="25" alt="icon" />
                                    Telegram
                                </button> */}
                            </div>
                            <p className={styles.noAccount}>
                                Нет аккаунта?
                                <span onClick={() => setLoginMethod('signUp')}>Зарегистрироваться</span>
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
