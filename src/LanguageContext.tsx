import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'hy' | 'en' | 'ru';

export const translations = {
  hy: {
    slogan: "«Սեր, որը սկսվեց երկրի վրա և կտևի հավերժ...»",
    introTitle: "Բարեկամներ և Հարազատներ,",
    introText: "Սիրով հրավիրում ենք Ձեզ մեր կյանքի ամենակարևոր տոնակատարությանը:\nՕր, որտեղ հիմք կդրվի նոր ընտանիքի:",
    countdownTitle: "Մինչև մեր մեծ օրը մնացել է...",
    days: "ՕՐ",
    hours: "ԺԱՄ",
    minutes: "ՐՈՊԵ",
    seconds: "ՎԱՅՐԿՅԱՆ",
    scheduleTitle: "Օրվա ծրագիրը",
    ceremony: "ՊՍԱԿԱԴՐՈՒԹՅՈՒՆ",
    church: "Սբ․ Գայանե եկեղեցի",
    churchAddress: "Հասցե՝ ք․ Էջմիածին",
    reception: "ՀԱՐՍԱՆՅԱՑ ԽՆՋՈՒՅՔ",
    restaurant: "ALGA GRANDE",
    restaurantAddress: "Հասցե՝ ք․ Երևան, Քոչինյան փ․",
    map: "ՔԱՐՏԵԶ",
    dressCode: "Հարգելի՜ հյուրեր, խնդրում ենք խուսափել սպիտակ երանգներից՝ թողնելով այդ առանձնահատուկ գույնը հարսնացուին։",
    rsvpTitle: "RSVP",
    rsvpSubtitle: "Խնդրում ենք հաստատել Ձեր ներկայությունը մինչև 01 Սեպտեմբերի 2026",
    rsvpDeadline: "ՎԵՐՋՆԱԺԱՄԿԵՏԻՆ ՄՆԱՑԵԼ Է",
    nameLabel: "Անուն Ազգանուն *",
    namePlaceholder: "Մուտքագրեք Ձեր անունը",
    attendanceLabel: "Կկարողանա՞ք ներկա գտնվել *",
    attendYes: "Սիրով կգամ",
    attendNo: "Չեմ կարող",
    guestsLabel: "Քանի՞ հոգի կներկայանա (ներառյալ Ձեզ) *",
    guestsPlaceholder: "Նշեք քանակը",
    sideLabel: "Ո՞ւմ կողմից եք հրավիրված *",
    sideBride: "Հարսի",
    sideGroom: "Փեսայի",
    wishesLabel: "Բարեմաղթանքներ",
    wishesPlaceholder: "Գրեք Ձեր բարեմաղթանքը...",
    submit: "ՀԱՍՏԱՏԵԼ",
    thankYou: "Շնորհակալություն!",
    thankYouText: "Ձեր պատասխանը գրանցված է:",
    footerText: "Սիրով կսպասենք Ձեզ",
    clickToOpen: "ՍԵՂՄԵՔ ԲԱՑԵԼՈՒ ՀԱՄԱՐ",
    names: "Դավիդ և Գայանե",
    month: "Սեպտեմբեր"
  },
  en: {
    slogan: "\"A love that began on earth and will last for eternity...\"",
    introTitle: "Dear Family and Friends,",
    introText: "We cordially invite you to celebrate the most important milestone of our lives—the day our new family begins.",
    countdownTitle: "Days until our big day...",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
    seconds: "SECONDS",
    scheduleTitle: "Wedding Schedule",
    ceremony: "HOLY MATRIMONY",
    church: "St. Gayane Church",
    churchAddress: "Address: Ejmiatsin",
    reception: "WEDDING RECEPTION",
    restaurant: "ALGA GRANDE",
    restaurantAddress: "Address: Yerevan, Kochinyan St.",
    map: "MAP",
    dressCode: "Dear guests, we kindly request you to avoid wearing white tones, leaving this special color exclusively for the bride.",
    rsvpTitle: "RSVP",
    rsvpSubtitle: "Please confirm your attendance by September 1, 2026",
    rsvpDeadline: "TIME LEFT TO CONFIRM",
    nameLabel: "Full Name *",
    namePlaceholder: "Enter your name",
    attendanceLabel: "Will you be attending? *",
    attendYes: "Joyfully accept",
    attendNo: "Regretfully decline",
    guestsLabel: "Number of guests (including yourself) *",
    guestsPlaceholder: "Enter number",
    sideLabel: "Whose guest are you? *",
    sideBride: "Bride's",
    sideGroom: "Groom's",
    wishesLabel: "Best Wishes",
    wishesPlaceholder: "Write your wishes here...",
    submit: "CONFIRM",
    thankYou: "Thank You!",
    thankYouText: "Your response has been recorded.",
    footerText: "We look forward to celebrating with you",
    clickToOpen: "CLICK TO OPEN",
    names: "David & Gayane",
    month: "September"
  },
  ru: {
    slogan: "«Любовь, которая началась на земле и продлится вечно...»",
    introTitle: "Дорогие родные и близкие!",
    introText: "С большой радостью приглашаем вас разделить с нами самый важный день в нашей жизни — день рождения нашей семьи.",
    countdownTitle: "До нашего важного дня осталось...",
    days: "ДНЕЙ",
    hours: "ЧАСОВ",
    minutes: "МИНУТ",
    seconds: "СЕКУНД",
    scheduleTitle: "Программа дня",
    ceremony: "ВЕНЧАНИЕ",
    church: "Церковь Святой Гаяне",
    churchAddress: "Адрес: г. Эчмиадзин",
    reception: "СВАДЕБНЫЙ БАНКЕТ",
    restaurant: "ALGA GRANDE",
    restaurantAddress: "Адрес: г. Ереван, ул. Кочиняна",
    map: "КАРТА",
    dressCode: "Дорогие гости, убедительная просьба избегать белых оттенков в одежде, оставив этот особенный цвет исключительно для невесты.",
    rsvpTitle: "RSVP",
    rsvpSubtitle: "Пожалуйста, подтвердите ваше присутствие до 1 сентября 2026 года",
    rsvpDeadline: "ДО КОНЦА РЕГИСТРАЦИИ ОСТАЛОСЬ",
    nameLabel: "Имя Фамилия *",
    namePlaceholder: "Введите ваше имя",
    attendanceLabel: "Сможете ли вы присутствовать? *",
    attendYes: "С удовольствием приду",
    attendNo: "Не смогу прийти",
    guestsLabel: "Количество гостей (включая вас) *",
    guestsPlaceholder: "Укажите количество",
    sideLabel: "С чьей стороны вы приглашены? *",
    sideBride: "Невесты",
    sideGroom: "Жениха",
    wishesLabel: "Пожелания",
    wishesPlaceholder: "Напишите ваши пожелания...",
    submit: "ПОДТВЕРДИТЬ",
    thankYou: "Спасибо!",
    thankYouText: "Ваш ответ записан.",
    footerText: "С любовью ждем вас",
    clickToOpen: "НАЖМИТЕ, ЧТОБЫ ОТКРЫТЬ",
    names: "Давид и Гаяне",
    month: "Сентябрь"
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['hy'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('hy');
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
