import {getRequestConfig} from 'next-intl/server';
import {requestLocale} from 'next-intl/server';

export default getRequestConfig(async () => {
    const locale = await requestLocale();
    const validLocale = ['uz', 'ru', 'en'].includes(locale as string) ? locale as string : 'uz';

    return {
        locale: validLocale,
        messages: (await import(`../messages/${validLocale}.json`)).default
    };
});