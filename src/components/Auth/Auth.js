import React from 'react';

import styles from './Auth.module.scss';

function Auth(props) {
    console.log(props);
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.container}>
                    <form action="#" method="POST">
                        <p>
                            <span>Email</span>
                            <input id="email-field" placeholder="Введите Email" type="text"></input>
                        </p>
                        <p>
                            <span>Пароль</span>
                            <input id="password-field" placeholder="Введите пароль" type="password"></input>
                        </p>
                        <button method="POST">Войти</button>
                    </form>
                    <div className={styles.otherLogin}>
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
                        </div>
                        <p className={styles.noAccount}>
                            Нет аккаунта?
                            <a href="/">Зарегистрироватсья</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth;