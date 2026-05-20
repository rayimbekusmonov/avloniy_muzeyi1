'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { figureService } from '@/lib/services';
import { HistoricalFigure } from '@/lib/types';

export default function HomePage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || 'uz';

    const [figures, setFigures] = useState<HistoricalFigure[]>([]);
    const [filteredFigures, setFilteredFigures] = useState<HistoricalFigure[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    // Ko'p tillilik lug'ati (Sodda integratsiya, sarlavhalar va filtrlar uchun)
    const t: Record<string, Record<string, string>> = {
        title: {
            uz: 'Jadidlar Maʼrifatparvarlik Harakati',
            ru: 'Просветительское движение джадидов',
            en: 'The Jadid Enlightenment Movement'
        },
        subtitle: {
            uz: '“Haq olinur, berilmas!” — Millat taraqqiyoti, matbuot, teatr va maorif fidoiylari merosi.',
            ru: 'История, труды, биографии и наследие великих просветителей Туркестана.',
            en: 'The history, works, biographies, and legacy of the great educators of Turkestan.'
        },
        searchPlaceholder: {
            uz: 'Jadidlarni ism boʻyicha qidirish...',
            ru: 'Поиск джадидов по имени...',
            en: 'Search figures by name...'
        },
        noData: {
            uz: 'Hech qanday maʼlumot topilmadi.',
            ru: 'Ничего не найдено.',
            en: 'No figures found.'
        },
        btnMore: {
            uz: 'Batafsil maʼlumot',
            ru: 'Подробнее',
            en: 'Learn more'
        },
        regionLabel: {
            uz: 'Jadidlik maktablari:',
            ru: 'Школы джадидизма:',
            en: 'Jadid schools:'
        }
    };

    const regionsTranslated: Record<string, Record<string, string>> = {
        ALL: { uz: 'Barchasi', ru: 'Все', en: 'All' },
        TOSHKENT: { uz: 'Toshkent', ru: 'Ташкент', en: 'Tashkent' },
        BUXORO: { uz: 'Buxoro', ru: 'Бухара', en: 'Bukhara' },
        SAMARQAND: { uz: 'Samarqand', ru: 'Самарканд', en: 'Samarkand' },
        XIVA: { uz: 'Xiva', ru: 'Хива', en: 'Khiva' },
        FARGONA: { uz: 'Fargʻona', ru: 'Фергана', en: 'Fergana' },
    };

    // Ma'lumotlarni backenddan yuklash
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await figureService.getAll(locale);
                // figureService.getAll axios response obyektini qaytargani uchun .data ni olamiz
                const data = (response as any).data || response;
                setFigures(data);
                setFilteredFigures(data);
            } catch (error) {
                console.error('Maʼlumot yuklashda xatolik yuz berdi:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [locale]);

    // Filtrlar kombinatsiyasi logikasi
    useEffect(() => {
        let result = figures;

        // 1. Hudud (Region) bo'yicha saralash
        if (selectedRegion !== 'ALL') {
            result = result.filter(
                f => f.region && f.region.toLowerCase() === regionsTranslated[selectedRegion]['uz'].toLowerCase()
            );
        }

        // 2. Qidiruv matni bo'yicha saralash
        if (searchQuery.trim() !== '') {
            result = result.filter(f =>
                f.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredFigures(result);
    }, [selectedRegion, searchQuery, figures]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-stone-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
                    <span className="text-stone-600 font-serif text-sm">Sahifa yuklanmoqda...</span>
                </div>
            </div>
        );
    }

    // "Featured" (Asosiy/Tanlangan) jadidni topish (Masalan Avloniy yoki Behbudiy boshida ajralib turishi uchun)
    const featuredJadid = figures.find(f => f.featured);

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">

            {/* Katta Elegant Sarlavha (Hero Banner) */}
            <div className="relative bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950 text-stone-100 py-20 px-4 text-center border-b border-amber-900/30">
                <div className="absolute inset-0 bg-[radial-gradient(#2c1a04_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                <div className="relative max-w-4xl mx-auto">
          <span className="text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3 block">
            1895 — 1938 · Xotira va Qadrlash
          </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-wide mb-6 leading-tight text-amber-50">
                        {t.title[locale]}
                    </h1>
                    <div className="h-0.5 w-24 bg-amber-600 mx-auto mb-6"></div>
                    <p className="text-stone-300 max-w-2xl mx-auto text-base md:text-lg italic font-light leading-relaxed">
                        {t.subtitle[locale]}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">

                {/* Qidiruv va Filtrlash Paneli */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-md mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                        {/* Qidiruv darchasi */}
                        <div className="w-full lg:max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t.searchPlaceholder[locale]}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-5 pr-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 bg-stone-50 transition-all text-sm shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Hudud tugmalari */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-serif font-semibold text-stone-500 uppercase tracking-wider">
                {t.regionLabel[locale]}
              </span>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(regionsTranslated).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedRegion(key)}
                                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                                            selectedRegion === key
                                                ? 'bg-amber-800 text-white border-amber-800 shadow-md shadow-amber-900/10 scale-102'
                                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                                        }`}
                                    >
                                        {regionsTranslated[key][locale]}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* JADIDLAR CARD GRID */}
                {filteredFigures.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 text-stone-500 font-serif">
                        {t.noData[locale]}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredFigures.map((jadid) => (
                            <div
                                key={jadid.id}
                                onClick={() => router.push(`/${locale}/jadidlar/${jadid.id}`)}
                                className="group bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                            >
                                <div>
                                    {/* Rasm hududi */}
                                    <div className="relative h-80 w-full bg-stone-100 overflow-hidden border-b border-stone-100">
                                        <img
                                            src={jadid.imageUrl || '/logo.jpg'}
                                            alt={jadid.name}
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-500"
                                        />
                                        {jadid.region && (
                                            <span className="absolute top-4 right-4 bg-stone-900/85 backdrop-blur-sm text-amber-400 text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-md border border-amber-500/20">
                        {jadid.region}
                      </span>
                                        )}
                                    </div>

                                    {/* Kontent hududi */}
                                    <div className="p-6">
                    <span className="text-amber-800 font-serif font-bold text-xs tracking-wider block mb-2">
                      {jadid.years}
                    </span>
                                        <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors duration-200 leading-snug">
                                            {jadid.name}
                                        </h3>
                                        <p className="text-stone-500 text-xs mt-1.5 line-clamp-1 italic font-light">
                                            {jadid.title}
                                        </p>

                                        {/* Yangi qo'shilgan Retro Shior (Motto) */}
                                        {jadid.motto && (
                                            <div className="mt-4 p-3 bg-stone-50 border-l-2 border-amber-800 text-stone-700 text-xs rounded-r-xl italic line-clamp-2 relative">
                                                “{jadid.motto}”
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Pastki Harakat Tugmasi */}
                                <div className="px-6 pb-6 pt-2">
                                    <div className="w-full text-center text-xs font-medium py-3 bg-stone-50 border border-stone-200 rounded-xl group-hover:bg-amber-800 group-hover:text-white group-hover:border-amber-800 transition-all duration-300 uppercase tracking-wider">
                                        {t.btnMore[locale]} →
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}