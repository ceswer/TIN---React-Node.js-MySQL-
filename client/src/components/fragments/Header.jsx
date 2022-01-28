import React from "react";
import { withTranslation, useTranslation } from "react-i18next";

function Header() {
    const { t } = useTranslation();
    return (
        <header>
            <h1>{t('header')}</h1>
            <img src="/img/logo.png" id="logo" alt="Medical help issuer logo" />
        </header>
    );
}

export default withTranslation()(Header);