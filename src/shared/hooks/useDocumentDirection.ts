import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useDocumentDirection = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const lang = i18n.language || 'en';
        const dir = lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr';

        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
    }, [i18n.language]);
};
