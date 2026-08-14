import { request } from './api'

/**
 * Direct fallback in browser if backend endpoint is unavailable
 */
async function directBrowserTranslate(text: string, sourceLang: string, targetLang: string): Promise<string> {
    if (!text || !text.trim()) return ''
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLang)}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`
        const res = await fetch(url)
        if (res.ok) {
            const data = await res.json()
            if (data && Array.isArray(data[0])) {
                return data[0].map((item: any) => item[0] || '').join('')
            }
        }
    } catch {
        // Fallback returns original text if network is down
    }
    return text
}

/**
 * Translates a single text from Uzbek to a target language (Russian or English)
 */
export async function translateText(
    text: string,
    targetLang: 'ru' | 'en',
    sourceLang = 'uz'
): Promise<string> {
    if (!text || !text.trim()) return ''

    try {
        const res = await request<{ translations: Record<string, string> }>('/api/translate', {
            method: 'POST',
            body: JSON.stringify({
                text,
                sourceLang,
                targetLangs: [targetLang],
            }),
        })
        if (res?.translations?.[targetLang]) {
            return res.translations[targetLang]
        }
    } catch {
        // Backend not responding or failed, try direct fallback
    }

    return directBrowserTranslate(text, sourceLang, targetLang)
}

/**
 * Translates a dictionary of Uzbek fields to Russian and English in parallel.
 * e.g. { name: "Abdulla Avloniy", title: "Pedagog va shoir", bio: "..." }
 * returns { ru: { name: "...", ... }, en: { name: "...", ... } }
 */
export async function translateBatch(
    fields: Record<string, string>,
    targetLangs: ('ru' | 'en')[] = ['ru', 'en'],
    sourceLang = 'uz'
): Promise<{ ru: Record<string, string>; en: Record<string, string> }> {
    const result: { ru: Record<string, string>; en: Record<string, string> } = {
        ru: {},
        en: {},
    }

    // Try backend batch endpoint first
    try {
        const res = await request<{ batchTranslations: Record<string, Record<string, string>> }>('/api/translate', {
            method: 'POST',
            body: JSON.stringify({
                texts: fields,
                sourceLang,
                targetLangs,
            }),
        })

        if (res?.batchTranslations) {
            if (res.batchTranslations.ru) result.ru = res.batchTranslations.ru
            if (res.batchTranslations.en) result.en = res.batchTranslations.en
            return result
        }
    } catch {
        // Fallback to client-side parallel translation
    }

    const fieldKeys = Object.keys(fields)

    // Translate all fields in parallel for RU
    const ruPromises = fieldKeys.map(async key => {
        const text = fields[key]
        if (!text || !text.trim()) return { key, val: '' }
        const translated = await directBrowserTranslate(text, sourceLang, 'ru')
        return { key, val: translated }
    })

    // Translate all fields in parallel for EN
    const enPromises = fieldKeys.map(async key => {
        const text = fields[key]
        if (!text || !text.trim()) return { key, val: '' }
        const translated = await directBrowserTranslate(text, sourceLang, 'en')
        return { key, val: translated }
    })

    const [ruResults, enResults] = await Promise.all([
        Promise.all(ruPromises),
        Promise.all(enPromises),
    ])

    ruResults.forEach(({ key, val }) => {
        result.ru[key] = val
    })
    enResults.forEach(({ key, val }) => {
        result.en[key] = val
    })

    return result
}
