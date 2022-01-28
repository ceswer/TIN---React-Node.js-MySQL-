import '../styles.css';
import React, { useState} from "react";
import { NavLink as Link, useNavigate, useLocation } from "react-router-dom";
import { checkEmail, checkRequired, checkTextLengthRange } from "../../../../js/validationCommon";
import { useTranslation } from "react-i18next";


export default function Signup(props) {
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const login = pathname === '/login' ? t('login') : t('signup');
    const signup = pathname === '/signup' ? t('login') : t('signup');
    const link = pathname === '/signup' ? '/login' : '/signup';

    const [user, setUser] = useState({
        email: '',
        password: '',
        mock: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        mock: ''
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [token, setToken] = useState(null);

    const validateForm = () => {
        const ers = { ...errors };
        for (const name in user) {
            const value = user[name];
            const msg = validateField(name, value);
            ers[name] = t(msg);
        }

        setErrors(ers);
        return !hasErrors();
    }

    const hasErrors = () => {
        for (const name in errors) {
            if (errors[name].length > 0)
                return true;
        }

        return false;
    }

    const handleChange = async (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const usr = { ...user };
        usr[name] = value;

        const errorMessage = validateField(name, value);
        const ers = { ...errors };
        ers[name] = t(errorMessage);

        setUser(usr);
        setErrors(ers);
    }


    const validateField = (name, value) => {
        let msg = '';
        if (name === 'email') {
            if (!checkRequired(value)) {
                msg = 'r';
            } else if (!checkEmail(value)) {
                msg = 'ne';
            }
        }

        if (name === 'password') {
            if (!checkRequired(value)) {
                msg = 'r';
            } else if (!checkTextLengthRange(value, 6, 36)) {
                msg = 'r_6_36';
            }   
        }        
        
        return msg;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let isValid = validateForm();

        let er = { ...errors }
        if (pathname === '/signup') {
            if (user.mock != user.password) {
                er['password'] = t('same');
                setErrors(er);
                isValid = false;
            }
        }

        if (isValid) {
            let response;
            fetchCall().then(res => {
                response = res;
                return res.json();
            }).then(data => {
                if (response.status == 200 && data.token) {
                    props.handleLogin(data);
                    setToken(data.token);
                } else if (response.status == 500) {
                    let ers = { ...errors };
                    data.errors.map(err => {
                        const pth = err.path;
                        const msg = t(err.message);
                        ers[pth] = msg;
                    });
                    setErrors(ers);
                }

            }, err => {
                setError(err);
            });
        }
    }

    const fetchCall = () => {
        const string = JSON.stringify(user);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: string
        }
        return fetch(`http://localhost:3000/api/auth${pathname}`, options);
    }

    const fetchError = error ? `${t('error')} ${error}` : "";
    const globalError = fetchError || message;

    const block = pathname === "/login" ? "block" : "";
    const pwd = pathname === "/signup" ? "pwd" : "";

    if (token)
        navigate("/");
    
    let clas = "accountBlueBtn";
    if (hasErrors())
        clas += ' gray'
    
    
    return (
        <div className="accountContainer">
            <div className="accountWrapper">
                <div className="accountLeft">
                    <h3 className="accountLogo">{t('header')}</h3>
                    <span className="accountDescription">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel reprehenderit vero obcaecati similique provident nisi voluptatibus a error.</span>
                </div>
                <div className="accountRight">
                    <form action="post" className='accountForm' onSubmit={handleSubmit} onSubmitCapture={handleSubmit}>
                        <input type="text" className="accountInput" name="email" placeholder={t('email')} onChange={handleChange} />
                        <span className="accountErrors">{errors.email}</span>

                        <div className={`accountBox ${block}`}>
                            <input type="password" className={`accountInput ${pwd}`} name="password" placeholder={t('password')} onChange={handleChange} />
                            {pathname === "/signup" ? <input type="password" className={`accountInput ${pwd}`} name="mock" placeholder={t('password')} onChange={handleChange} /> : ""}
                        </div>
                        <span className="accountErrors">{errors.password || errors.mock}</span>

                        <span className="accountErrors">{globalError}</span>
                        <input type="submit" className={clas} value={login} />
                        <Link to={link} className="accountGreenBtn">{signup}</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}