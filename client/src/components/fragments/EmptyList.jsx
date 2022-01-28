import React from "react";
import { withTranslation, useTranslation } from "react-i18next";

function EmptyList() {
    const { t } = useTranslation();

    return (
        <div>
            <p>{t('emptyList')}</p>
        </div>
    );
}

export default withTranslation()(EmptyList)