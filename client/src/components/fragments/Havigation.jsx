import React, { useState, useEffect} from "react";
import { NavLink as Link, useNavigate } from "react-router-dom";
import { withTranslation, useTranslation } from "react-i18next";

const languages = {
    en: 'en',
    pl: 'pl',
    ua: 'ua'
}

function Navigation(props) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : languages.en);
    const [redirect, setRedirect] = useState(false);
    
    const link = localStorage.getItem('token') ? <button onClick={() => { props.handleLogout(); setRedirect(true) }} className="authButton">{t('logout')}</button> : <Link to="login">{t('login')}</Link>

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language])

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        i18n.changeLanguage(lang);
        setLanguage(lang);
        localStorage.setItem('lang', lang);
    }

    let links = [];
    if (localStorage.getItem('token')) {
        links.push(<li><Link to="/doctors">{t('doctors')}</Link></li>,
            <li><Link to="/patients">{localStorage.getItem('user') === 'user' ? t('accountPatient') : t('patients')}</Link></li>,
            <li><Link to="/drugs">{t('drugs')}</Link></li>);
        if (localStorage.getItem('user') !== 'user')
            links.push(<li><Link to="/prescriptions">{t('prescriptions')}</Link></li>);
    }

    if (redirect) {
        setRedirect(false);
        navigate('/login');
    }

    return (
        <nav>
            <ul>
                <li><Link to="/">{t('mainPage')}</Link></li>
                {links.map(l => l)}
                <li>
                    {link}
                </li>
                <li>
                    <select className="lang" defaultValue={language.en} value={language} onChange={handleLanguageChange}>
                        <option value={languages.ua} key={languages.ua}>{t('ukrainian')}</option>
                        <option value={languages.pl} key={languages.pl}>{t('polish')}</option>
                        <option value={languages.en} key={languages.en}>{t('english')}</option>
                    </select>
                </li>
                
            </ul>
        </nav>
    );
}

export default withTranslation()(Navigation);