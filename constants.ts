import { AnalysisProject, Review } from './types';

// Helper to generate mock reviews
const generateMockReviews = (prefix: string, count: number, fileId: string): Review[] => {
    const texts = [
        "Автобус 404 опять не пришел по расписанию! Ждал 20 минут.",
        "Очень удобный новый маршрут, спасибо.",
        "Водитель курил в окно, запах шел в салон.",
        "Обычная поездка, ничего особенного.",
        "В салоне очень холодно, печка не работает.",
        "Чистый автобус, приехал вовремя.",
        "Почему отменили остановку у метро?",
        "Грязно в салоне, пыльно.",
        "Кондиционер работает слишком сильно.",
        "Вежливый водитель, подождал пассажиров.",
        "Не работает валидатор на входе.",
        "Контролеры были очень грубы.",
        "Прекрасный вид из окна парка.",
        "Сломана скамейка на остановке.",
        "Слишком долго ждать пересадки."
    ];
    
    return Array.from({ length: count }).map((_, i) => ({
        id: `${prefix}-${i + 1}`,
        text: texts[i % texts.length] + (i > texts.length ? ` (дубль ${Math.floor(i / texts.length)})` : ''),
        source: ['vk', 'mos.ru', 'portal', 'telegram'][i % 4] as any,
        fileId: fileId,
        sentiment: ['negative', 'positive', 'negative', 'neutral', 'negative', 'positive', 'negative', 'negative', 'negative', 'positive'][i % 10] as any,
        confidence: 0.6 + (Math.random() * 0.39),
        date: '2023-11-20'
    }));
};

export const MOCK_PROJECTS: AnalysisProject[] = [
  {
    id: '1',
    title: 'Жалобы: Транспорт (Ноябрь)',
    description: 'Анализ обращений по автобусным маршрутам ЦАО',
    kpi: {
      totalReviews: 1240,
      nps: -15,
      npsDelta: -2,
      avgConfidence: 89,
    },
    files: [
      { id: 'f1', name: 'export_vk_comments_nov.csv', uploadDate: '20.11.2023', rowCount: 600 },
      { id: 'f2', name: 'mos_ru_feedbacks.csv', uploadDate: '21.11.2023', rowCount: 640 }
    ],
    aiInsights: [
      "Аномалия: Резкий всплеск негатива (40%) в источнике vk.com. Основные ключевые слова: холодно, печка, автобус 404.",
      "Позитив: Пользователи хвалят обновление приложения (28.11). Индекс удовлетворенности вырос на 5%."
    ],
    keywords: [
      { 
        name: 'Опоздание', count: 120, sentiment: 'negative', 
        relatedWord: 'Маршрут 404', aiContext: 'Жалобы коррелируют с утренними часами пик (8:00-9:30).' 
      },
      { 
        name: 'Холодно', count: 85, sentiment: 'negative', 
        relatedWord: 'Печка', aiContext: 'В 70% случаев упоминается старый парк автобусов ЛиАЗ.' 
      },
      { 
        name: 'Грязь', count: 45, sentiment: 'negative', 
        relatedWord: 'Салон', aiContext: 'Чаще всего упоминается маршрут м19.' 
      },
      { 
        name: 'Быстро', count: 90, sentiment: 'positive', 
        relatedWord: 'Выделенка', aiContext: 'Позитивный отклик на введение новой полосы на Ленинском.' 
      },
      { 
        name: 'Комфорт', count: 60, sentiment: 'positive', 
        relatedWord: 'Новые автобусы', aiContext: 'Высокая оценка USB-зарядок в салоне.' 
      },
      { 
        name: 'Чисто', count: 50, sentiment: 'positive', 
        relatedWord: 'Уборка', aiContext: 'Замечено улучшение после смены подрядчика по клинингу.' 
      },
    ],
    reviews: [
      ...generateMockReviews('100', 30, 'f1'),
      ...generateMockReviews('101', 20, 'f2')
    ]
  },
  {
    id: '2',
    title: 'Отзывы: Парки МСК',
    description: 'Мониторинг состояния парковых зон',
    kpi: {
      totalReviews: 850,
      nps: 42,
      npsDelta: 5,
      avgConfidence: 92,
    },
    files: [
      { id: 'f3', name: 'parks_survey_q3.csv', uploadDate: '15.11.2023', rowCount: 850 }
    ],
    aiInsights: [
      "Успех: Реконструкция парка 'Сокольники' получила 90% положительных отзывов.",
      "Проблема: Жалобы на недостаточное освещение в вечернее время в Парке Горького."
    ],
    keywords: [
      { name: 'Темно', count: 30, sentiment: 'negative', relatedWord: 'Фонари', aiContext: 'Локализовано в зоне прудов.' },
      { name: 'Красиво', count: 150, sentiment: 'positive', relatedWord: 'Осень', aiContext: 'Много фото-контента в соцсетях.' },
    ],
    reviews: generateMockReviews('200', 12, 'f3')
  }
];
