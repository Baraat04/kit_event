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
speakers: [
      {
        name: "Tatiana Schmidt",
        topic: "Neurotechnologies and artificial intelligence in kindergarten as a tool for the cognitive development of a child",
        bio: "Head of the Resource Center, kindergarten No. 21, Ekibastuz",
        image: "/tatyanashmidt.jpg", // Replace with actual path
      },
      {
        name: "Tatyana Migunova",
        topic: "Innovative Approaches to school management based on artificial intelligence",
        bio: "Director of the Baitursynov Innovation School",
        image: "/migunova.jpg", // Replace with actual path
      },
      {
        name: "Gaukhar Babykova",
        topic: "The role of the leader in creating a school environment that supports growth and initiative",
        bio: "Director of Lyceum No. 8 for Gifted Children",
        image: "/gauharbabykova.jpg", // Replace with actual path
      },
      {
        name: "Saltanat Shabazhanova",
        topic: "New types of educational work in the context of a digital society: methods based on artificial intelligence",
        bio: "Director of the gymnasium for gifted children named after Abai",
        image: "/saltanatshabazhanova.jpg", // Replace with actual path
      },
      {
        name: "Anara Sadykova",
        topic: "Educational leadership in the age of artificial intelligence",
        bio: "Deputy Dean, Senior Lecturer of the Faculty of Computer Sciences of Toraigyrov University",
        image: "/sadykova.jpg", // Replace with actual path
      },
      {
        name: "Victoria Romadina",
        topic: "Artificial intelligence tools to reduce daily workload and increase participation",
        bio: "ToriPro Kz Director, Master of Pedagogical Sciences, International AI trainer",
        image: "/romadinavictoria.jpg", // Replace with actual path
      },
    ],
    zapomnite: "REMEMBER!",
cvet: "your color of the tour group",
     famPlace:"Enter surname",
    namePlace:"Enter name",
    otcPlace:"Enter middlename",
    regPlace:"Enter region",
    dolPlace:"Enter position",
    welcome: "Welcome to the Event",
    eventDescription:
      "Join our educational event and become part of the professional community",
    participants: "Participants",
    participantsDesc: "Register and get a unique participant number",
    program: "Program",
    programDesc: "Check out the full event program",
    speakersLabel: "Speakers",
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
    login: "Registration",
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
  speakers: [
      {
        name: "Татьяна Шмидт",
        topic: "Нейротехнологии и искусственный интеллект в детском саду как инструмент когнитивного развития ребенка",
        bio: "Руководитель Ресурсного центра, детский сад №21, г. Экибастуз",
        image: "/tatyanashmidt.jpg", // Replace with actual path
      },
      {
        name: "Татьяна Мигунова",
        topic: "Инновационные подходы в школьном менеджменте на основе искусственного интеллекта",
        bio: "Директор инновационной школы имени Байтурсынова",
        image: "/migunova.jpg", // Replace with actual path
      },
      {
        name: "Гаухар Бабыкова",
        topic: "Роль руководителя в создании школьной среды, поддерживающей рост и инициативу",
        bio: "Директор лицея №8 для одаренных детей",
        image: "/gauharbabykova.jpg", // Replace with actual path
      },
      {
        name: "Салтанат Шабажанова",
        topic: "Новые формы воспитательной работы в условиях цифрового общества: методы на основе искусственного интеллекта",
        bio: "Директор гимназии для одаренных детей имени Абая",
        image: "/saltanatshabazhanova.jpg", // Replace with actual path
      },
      {
        name: "Анара Садыкова",
        topic: "Образовательное лидерство в эпоху искусственного интеллекта",
        bio: "Заместитель декана, старший преподаватель факультета компьютерных наук Торайгыровского университета",
        image: "/sadykova.jpg", // Replace with actual path
      },
      {
        name: "Виктория Ромадина",
        topic: "Инструменты искусственного интеллекта для снижения повседневной нагрузки и увеличения вовлеченности",
        bio: "Директор ToriPro Kz, магистр педагогических наук, международный тренер ИИ",
        image: "/romadinavictoria.jpg", // Replace with actual path
      },
    ],
    zapomnite:"ЗАПОМНИТЕ!",
    cvet:"ваш цвет экскурсионной группы",
    welcome: "Добро пожаловать на мероприятие",
    famPlace:"Введите фамилию",
    namePlace:"Введите имя",
    otcPlace:"Введите отчество",
    regPlace:"Введите регион",
    dolPlace:"Введите должность",
    eventDescription:
      "Присоединяйтесь к нашему образовательному мероприятию и станьте частью профессионального сообщества",
    participants: "Участники",
    participantsDesc: "Зарегистрируйтесь и получите уникальный номер участника",
    program: "Программа",
    programDesc: "Ознакомьтесь с полной программой мероприятия",
    speakersLabel: "Спикеры",
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
    login: "Регистрация",
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
      zapomnite:"Есіңізде болсын!",
    cvet:"сіздің экскурсиялық топтың түсі",
      famPlace:"Тегіні Енгізіңіз",
    namePlace:"Атын енгізіңіз",
    otcPlace:"Әкесінің аты енгізіңіз",
    regPlace:"Аймақты енгізіңіз",
    dolPlace:"Лауазымды енгізіңіз",
    welcome: "Іс-шараға қош келдіңіз",
    eventDescription:
    "Біздің білім беру іс-шарасына қосылыңыз және кәсіби қауымдастықтың бөлігі болыңыз",
    participants: "Қатысушылар",
    participantsDesc: "Тіркеліңіз және бірегей қатысушы нөмірін алыңыз",
    program: "Бағдарлама",
    programDesc: "Іс-шараның толық бағдарламасымен танысыңыз",
    speakersLabel: "Спикерлер",
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
    login: "Тiркеу",
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
    speakers: [
      {
        name: "Татьяна Шмидт",
        topic: "Балабақшадағы нейротехнологиялар мен жасанды интеллект баланың танымдық дамуының құралы ретінде",
        bio: "Ресурстық орталықтың басшысы, №21 балабақша, Екібастұз қаласы",
        image: "/tatyanashmidt.jpg", // Replace with actual path
      },
      {
        name: "Татьяна Мигунова",
        topic: "Жасанды интеллект негізінде мектеп менеджментіндегі инновациялық тәсілдер",
        bio: "Байтұрсынұлы атындағы инновациялық мектеп директоры",
        image: "/migunova.jpg", // Replace with actual path
      },
      {
        name: "Гаухар Бабыкова",
        topic: "Өсу мен бастаманы қолдайтын мектеп ортасын құрудағы басшының рөлі",
        bio: "Дарынды балаларға арналған №8 лицей директоры",
        image: "/gauharbabykova.jpg", // Replace with actual path
      },
      {
        name: "Салтанат Шабажанова",
        topic: "Цифрлық қоғам жағдайында тәрбие жұмысының жаңа түрлері: жасанды интеллект негізіндегі әдістер",
        bio: "Абай атындағы дарынды балаларға арналған гимназия директоры",
        image: "/saltanatshabazhanova.jpg", // Replace with actual path
      },
      {
        name: "Анара Садыкова",
        topic: "Жасанды интеллект дәуіріндегі білім беру көшбасшылығы",
        bio: "Деканның орынбасары, Торайғыров университетінің Компьютерлік ғылымдар факультетінің аға оқытушысы",
        image: "/sadykova.jpg", // Replace with actual path
      },
      {
        name: "Виктория Ромадина",
        topic: "Күнделікті жүктемені азайту және қатысуды арттыру үшін жасанды интеллект құралдары",
        bio: "ToriPro Kz директоры, педагогикалық ғылымдар магистрі, халықаралық ЖИ тренері",
        image: "/romadinavictoria.jpg", // Replace with actual path
      },
    ],
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
