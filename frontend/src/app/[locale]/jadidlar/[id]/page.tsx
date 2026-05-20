'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { figureService } from '@/lib/services';
import { HistoricalFigure, WorkItem } from '@/lib/types';

export default function JadidProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id ? Number(params.id) : null;
    const locale = (params?.locale as string) || 'uz';

    const [jadid, setJadid] = useState<HistoricalFigure | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'OWN_WORK' | 'ABOUT_WORK'>('OWN_WORK');

    // Ko'p tillilik lug'ati
    const t: Record<string, Record<string, string>> = {
        backBtn: { uz: '← Orqaga qaytish', ru: '← Назад', en: '← Go Back' },
        biography: { uz: 'Biografiya va Faoliyat xronologiyasi', ru: 'Биография и Хронология', en: 'Biography & Timeline' },
        sources: { uz: 'Ilmiy va Adabiy Meros (Manbalar)', ru: 'Научное и литературное наследие', en: 'Scientific and Literary Heritage' },
        ownWorksTab: { uz: 'Jadidning oʻz asarlari', ru: 'Trudy jaddida (Собственные труды)', en: 'Own Works' },
        aboutWorksTab: { uz: 'U haqida yozilgan manbalar', ru: 'Literatura o nem (Литература о нем)', en: 'Sources About Him' },
        noWorks: { uz: 'Bu boʻlimda hozircha asarlar mavjud emas.', ru: 'В tomto razdele poka net proizvedeniy.', en: 'No works available in this section.' },
        readBook: { uz: 'Asarni oʻqish (PDF)', ru: 'Читать произведение (PDF)', en: 'Read Work (PDF)' },
        publishedYear: { uz: 'Nashr yili:', ru: 'Год издания:', en: 'Published year:' },
        error: { uz: 'Maʼlumot topilmadi.', ru: 'Данные не найдены.', en: 'Data not found.' }
    };

    useEffect(() => {
        if (!id) return;

        const fetchJadidData = async () => {
            try {
                setLoading(true);
                const response = await figureService.getById(id, locale);
                // axios instance response qaytargani sababli .data ni olamiz
                const data = (response as any).data || response;
                setJadid(data);
            } catch (error) {
                console.error('Jadid maʼlumotlarini yuklashda xatolik:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJadidData();
    }, [id, locale]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-stone-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
                    <span className="text-stone-600 font-serif text-sm">Maʼlumotlar yuklanmoqda...</span>
                </div>
            </div>
        );
    }

    if (!jadid) {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center font-serif text-stone-600">
                <p className="text-xl mb-4">{t.error[locale]}</p>
                <button onClick={() => router.push(`/${locale}`)} className="text-amber-800 underline">
                    {t.backBtn[locale]}
                </button>
            </div>
        );
    }

    // Asarlarni toifalarga qarab ajratish
    const filteredWorks = jadid.figureWorks?.filter(w => w.workType === activeTab) || [];

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 pb-24">
            {/* Yuqori navigatsiya paneli */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <button
                    onClick={() => router.push(`/${locale}`)}
                    className="flex items-center text-xs font-medium uppercase tracking-wider text-amber-900 hover:text-amber-700 transition-colors bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-sm"
                >
                    {t.backBtn[locale]}
                </button>
            </div>

            {/* Profil Asosiy qismi (Header Block) */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-3xl border border-stone-200/80 shadow-md p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#854d0e_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>

                    {/* Sifatli Surat */}
                    <div className="w-56 h-72 md:w-64 md:h-80 bg-stone-100 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-stone-200">
                        <img
                            src={jadid.imageUrl || '/logo.jpg'}
                            alt={jadid.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Shaxsiy qisqacha matn */}
                    <div className="flex-1 text-center md:text-left relative z-10">
            <span className="inline-block bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold font-serif tracking-widest px-3 py-1 rounded-md mb-3">
              {jadid.years}
            </span>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2 leading-tight">
                            {jadid.name}
                        </h1>
                        <p className="text-amber-800 font-serif italic text-sm md:text-base mb-4">
                            {jadid.title}
                        </p>
                        {jadid.region && (
                            <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-4">
                                {locale === 'uz' ? 'Markaz:' : 'Центр:'} <span className="text-stone-800">{jadid.region} jadidlik maktabi</span>
                            </p>
                        )}
                        <div className="h-px bg-stone-200 my-4 w-20 mx-auto md:mx-0"></div>

                        {/* Shior iqtibosi */}
                        {jadid.motto && (
                            <div className="p-4 bg-stone-50 border-l-4 border-amber-800 rounded-r-2xl italic text-stone-800 text-sm md:text-base leading-relaxed bg-gradient-to-r from-stone-50 to-amber-50/20 shadow-inner">
                                “{jadid.motto}”
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Biografiya (Vaqt Chizig'i / Timeline) */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <h2 className="text-2xl font-serif font-bold text-stone-900 border-b-2 border-amber-800 pb-2 mb-8 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-800"></span>
                    {t.biography[locale]}
                </h2>

                {/* RichText kontentni xavfsiz chiqarish */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-10 shadow-sm leading-relaxed text-stone-800 prose prose-stone max-w-none">
                    <div
                        className="font-sans text-base space-y-4"
                        dangerouslySetInnerHTML={{ __html: jadid.bio }}
                    />
                </div>
            </div>

            {/* Manbalar va Asarlar (TABS & LIST) */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <h2 className="text-2xl font-serif font-bold text-stone-900 border-b-2 border-amber-800 pb-2 mb-8 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-800"></span>
                    {t.sources[locale]}
                </h2>

                {/* Tab tugmalari */}
                <div className="flex border-b border-stone-200 mb-6 gap-2">
                    <button
                        onClick={() => setActiveTab('OWN_WORK')}
                        className={`pb-3 px-4 font-serif text-sm md:text-base font-semibold transition-all duration-200 relative ${
                            activeTab === 'OWN_WORK'
                                ? 'text-amber-800 border-b-2 border-amber-800'
                                : 'text-stone-500 hover:text-stone-800'
                        }`}
                    >
                        {t.ownWorksTab[locale]}
                    </button>
                    <button
                        onClick={() => setActiveTab('ABOUT_WORK')}
                        className={`pb-3 px-4 font-serif text-sm md:text-base font-semibold transition-all duration-200 relative ${
                            activeTab === 'ABOUT_WORK'
                                ? 'text-amber-800 border-b-2 border-amber-800'
                                : 'text-stone-500 hover:text-stone-800'
                        }`}
                    >
                        {t.aboutWorksTab[locale]}
                    </button>
                </div>

                {/* Asarlar ro'yxati kontenti */}
                {filteredWorks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-500 font-sans text-sm">
                        {t.noWorks[locale]}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredWorks.map((work) => (
                            <div
                                key={work.id}
                                className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                            >
                                <div>
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <h3 className="font-serif font-bold text-stone-900 text-lg leading-snug">
                                            {work.title}
                                        </h3>
                                        {work.year && (
                                            <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0">
                        {work.year}
                      </span>
                                        )}
                                    </div>

                                    {work.description && (
                                        <p className="text-stone-600 text-xs font-sans font-light leading-relaxed mb-4 line-clamp-3">
                                            {work.description}
                                        </p>
                                    )}
                                </div>

                                {/* PDF yuklash tugmasi */}
                                {work.pdfUrl && (
                                    <a
                                        href={work.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-center w-full py-2.5 bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-800 hover:text-white hover:border-amber-800 rounded-xl transition-all uppercase tracking-wider"
                                    >
                                        <span>📄</span> {t.readBook[locale]}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}