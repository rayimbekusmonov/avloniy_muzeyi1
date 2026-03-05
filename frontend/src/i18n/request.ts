import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({requestLocale}) => {
    const locale = (await requestLocale) ?? 'uz';
    const validLocale = ['uz', 'ru', 'en'].includes(locale) ? locale : 'uz';

    return {
        locale: validLocale,
        messages: (await import(`../messages/${validLocale}.json`)).default
    };
});