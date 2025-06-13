"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Language = "en" | "ru" | "kz";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
}

const translations = {
  en: {
    welcome: "Welcome to the Event",
    eventDescription:
      "Join our educational event and become part of the professional community",
    participants: "Participants",
    participantsDesc: "Register and get a unique participant number",
    program: "Program",
    programDesc: "Check out the full event program",
    speakers: "Speakers",
    speakersDesc: "Meet experts in your field",
    networking: "Networking",
    networkingDesc: "Expand your professional network",
    register: "Register",
    freeEvent: "Free participation",
    registration: "Registration",
    lastName: "Last Name",
    firstName: "First Name",
    middleName: "Middle Name",
    region: "Region",
    position: "Position",
    registerButton: "Register",
    registering: "Registering...",
    registrationSuccess: "Registration successful!",
    login: "Login",
    password: "Password",
    continue: "Continue",
    back: "Back",
    eventProgram: "Event Program",
    collegeGallery: "College Photo Gallery",
    downloadPhotos: "Download Photos",
    photosAvailable:
      "Photos from the event will be available after its completion",
    availableAfterEvent: "Available after the event",
    socialMedia: "Social Media",
    links: "Links",
    gallery: "Gallery",
    selectLanguage: "Select Language",
    chooseLanguage: "Choose your preferred language to continue",
    loginButton: "Login",
    loggingIn: "Logging in...",
    loginSuccess: "Login Successful",
    loginError: "Login Error",
    welcomeBack: "Welcome back!",
    loginDescription: "Enter your credentials to access the event",
    noAccount: "Don't have an account?",
    registerHere: "Register here",
    alreadyRegistered: "Already registered?",
    clickHereToLogin: "Click here to login",
    saveCredentials: "Save these credentials for future login",
    registrationError: "Registration Error",
  },
  ru: {
    welcome: "Добро пожаловать на мероприятие",
    eventDescription:
      "Присоединяйтесь к нашему образовательному мероприятию и станьте частью профессионального сообщества",
    participants: "Участники",
    participantsDesc: "Зарегистрируйтесь и получите уникальный номер участника",
    program: "Программа",
    programDesc: "Ознакомьтесь с полной программой мероприятия",
    speakers: "Спикеры",
    speakersDesc: "Встретьтесь с экспертами в своей области",
    networking: "Нетворкинг",
    networkingDesc: "Расширьте свою профессиональную сеть",
    register: "Зарегистрироваться",
    freeEvent: "Участие бесплатное",
    registration: "Регистрация",
    lastName: "Фамилия",
    firstName: "Имя",
    middleName: "Отчество",
    region: "Регион",
    position: "Должность",
    registerButton: "Зарегистрироваться",
    registering: "Регистрация...",
    registrationSuccess: "Регистрация успешна!",
    login: "Логин",
    password: "Пароль",
    continue: "Продолжить",
    back: "Назад",
    eventProgram: "Программа мероприятия",
    collegeGallery: "Фотогалерея колледжа",
    downloadPhotos: "Скачать фотографии",
    photosAvailable:
      "Фотографии с мероприятия будут доступны после его завершения",
    availableAfterEvent: "Доступно после проведения мероприятия",
    socialMedia: "Социальные сети",
    links: "Ссылки",
    gallery: "Галерея",
    selectLanguage: "Выберите язык",
    chooseLanguage: "Выберите предпочитаемый язык для продолжения",
    loginButton: "Войти",
    loggingIn: "Вход...",
    loginSuccess: "Вход выполнен успешно",
    loginError: "Ошибка входа",
    welcomeBack: "Добро пожаловать обратно!",
    loginDescription: "Введите ваши данные для доступа к мероприятию",
    noAccount: "Нет аккаунта?",
    registerHere: "Зарегистрируйтесь здесь",
    alreadyRegistered: "Уже зарегистрированы?",
    clickHereToLogin: "Нажмите здесь для входа",
    saveCredentials: "Сохраните эти данные для будущего входа",
    registrationError: "Ошибка регистрации",
  },
  kz: {
    welcome: "Іс-шараға қош келдіңіз",
    eventDescription:
      "Біздің білім беру іс-шарасына қосылыңыз және кәсіби қауымдастықтың бөлігі болыңыз",
    participants: "Қатысушылар",
    participantsDesc: "Тіркеліңіз және бірегей қатысушы нөмірін алыңыз",
    program: "Бағдарлама",
    programDesc: "Іс-шараның толық бағдарламасымен танысыңыз",
    speakers: "Спикерлер",
    speakersDesc: "Өз саласындағы сарапшылармен кездесіңіз",
    networking: "Желілесу",
    networkingDesc: "Кәсіби желіңізді кеңейтіңіз",
    register: "Тіркелу",
    freeEvent: "Қатысу тегін",
    registration: "Тіркеу",
    lastName: "Тегі",
    firstName: "Аты",
    middleName: "Әкесінің аты",
    region: "Аймақ",
    position: "Лауазымы",
    registerButton: "Тіркелу",
    registering: "Тіркелуде...",
    registrationSuccess: "Тіркеу сәтті өтті!",
    login: "Логин",
    password: "Құпия сөз",
    continue: "Жалғастыру",
    back: "Артқа",
    eventProgram: "Іс-шара бағдарламасы",
    collegeGallery: "Колледж фотогалереясы",
    downloadPhotos: "Фотосуреттерді жүктеп алу",
    photosAvailable:
      "Іс-шарадан фотосуреттер оның аяқталуынан кейін қол жетімді болады",
    availableAfterEvent: "Іс-шара өткізілгеннен кейін қол жетімді",
    socialMedia: "Әлеуметтік желілер",
    links: "Сілтемелер",
    gallery: "Галерея",
    selectLanguage: "Тілді таңдаңыз",
    chooseLanguage: "Жалғастыру үшін қалаған тіліңізді таңдаңыз",
    loginButton: "Кіру",
    loggingIn: "Кіруде...",
    loginSuccess: "Кіру сәтті өтті",
    loginError: "Кіру қатесі",
    welcomeBack: "Қайтып келуіңізбен!",
    loginDescription: "Іс-шараға қол жеткізу үшін деректеріңізді енгізіңіз",
    noAccount: "Аккаунт жоқ па?",
    registerHere: "Мұнда тіркеліңіз",
    alreadyRegistered: "Әлдеқашан тіркелдіңіз бе?",
    clickHereToLogin: "Кіру үшін мұнда басыңыз",
    saveCredentials: "Болашақ кіру үшін осы деректерді сақтаңыз",
    registrationError: "Тіркеу қатесі",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ru");

  const value = {
    language,
    setLanguage,
    translations: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
