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
        topic: "Neurotechnologies and Artificial Intelligence in Kindergarten as a Means of Cognitive Development",
        bio: "Head of the Resource Center, Kindergarten No. 21, Ekibastuz",
      },
      {
        name: "Tatiana Migunova",
        topic: "Innovative Approaches in School Management Based on Artificial Intelligence",
        bio: "Director of the Baytursynuly Innovative School",
      },
      {
        name: "Gaukhar Babykova",
        topic: "The Role of a Leader in Creating a School Environment that Supports Growth and Initiative",
        bio: "Director of Lyceum No. 8 for Gifted Children",
      },
      {
        name: "Saltanat Shabazhanova",
        topic: "New Forms of Educational Work in a Digital Society: AI-Based Methods",
        bio: "Director of Abay Gymnasium for Gifted Children",
      },
      {
        name: "Anara Sadykova",
        topic: "Educational Leadership in the Era of Artificial Intelligence",
        bio: "Deputy Dean, Senior Lecturer at the Faculty of Computer Science, Toraigyrov University",
      },
      {
        name: "Victoria Romadina",
        topic: "AI Tools for Reducing Routine Workload and Increasing Engagement",
        bio: "Director of ToriPro Kz, Master of Pedagogical Sciences, International AI Trainer",
      },
      {
        name: "Aigul Nurlanova",
        topic: "Digital Technologies in Education",
        bio: "Expert in Educational Technologies with 15 Years of Experience",
      },
      {
        name: "Marat Seitkaziev",
        topic: "Innovations in Professional Education",
        bio: "Director of the Innovation Center, Specialist in Modern Teaching Methods",
      },
      {
        name: "Dina Abdrakhmanova",
        topic: "International Cooperation in Education",
        bio: "Coordinator of International Programs, Expert in Academic Mobility",
      },
    ],
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
        topic: "Нейротехнологии и искусственный интеллект в детском саду как средство познавательного развития ребёнка",
        bio: "Руководитель Ресурсного центра, детский сад №21, г. Экибастуз",
      },
      {
        name: "Татьяна Мигунова",
        topic: "Инновационные подходы в школьном менеджменте на основе искусственного интеллекта",
        bio: "Директор школы инновационного типа им. Байтұрсынұлы",
      },
      {
        name: "Гаухар Бабыкова",
        topic: "Роль руководителя в создании школьной среды, поддерживающей рост и инициативу",
        bio: "Директор лицея №8 для одарённых детей",
      },
      {
        name: "Салтанат Шабажанова",
        topic: "Новые формы воспитательной работы в условиях цифрового общества: методы на основе искусственного интеллекта",
        bio: "Директор гимназии им. Абая для одарённых детей",
      },
      {
        name: "Анара Садыкова",
        topic: "Образовательное лидерство в эпоху искусственного интеллекта",
        bio: "Заместитель декана, старший преподаватель факультета Computer Science, Торайгыров университет",
      },
      {
        name: "Виктория Ромадина",
        topic: "Инструменты ИИ для снижения рутинной нагрузки и повышения вовлечённости",
        bio: "Директор ToriPro Kz, магистр педагогических наук, международный тренер по ИИ",
      },
      {
        name: "Айгуль Нурланова",
        topic: "Цифровые технологии в образовании",
        bio: "Эксперт в области образовательных технологий с 15-летним опытом работы",
      },
      {
        name: "Марат Сейтказиев",
        topic: "Инновации в профессиональном образовании",
        bio: "Директор инновационного центра, специалист по современным методам обучения",
      },
      {
        name: "Дина Абдрахманова",
        topic: "Международное сотрудничество в образовании",
        bio: "Координатор международных программ, эксперт по академической мобильности",
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
      },
      {
        name: "Татьяна Мигунова",
        topic: "Жасанды интеллект негізінде мектеп менеджментіндегі инновациялық тәсілдер",
        bio: "Байтұрсынұлы атындағы инновациялық мектеп директоры",
      },
      {
        name: "Гаухар Бабыкова",
        topic: "Өсу мен бастаманы қолдайтын мектеп ортасын құрудағы басшының рөлі",
        bio: "Дарынды балаларға арналған №8 лицей директоры",
      },
      {
        name: "Салтанат Шабажанова",
        topic: "Цифрлық қоғам жағдайында тәрбие жұмысының жаңа түрлері: жасанды интеллект негізіндегі әдістер",
        bio: "Абай атындағы дарынды балаларға арналған гимназия директоры",
      },
      {
        name: "Анара Садыкова",
        topic: "Жасанды интеллект дәуіріндегі білім беру көшбасшылығы",
        bio: "Деканның орынбасары, Торайғыров университетінің Компьютерлік ғылымдар факультетінің аға оқытушысы",
      },
      {
        name: "Виктория Ромадина",
        topic: "Күнделікті жүктемені азайту және қатысуды арттыру үшін жасанды интеллект құралдары",
        bio: "ToriPro Kz директоры, педагогикалық ғылымдар магистрі, халықаралық ЖИ тренері",
      },
      {
        name: "Айгуль Нурланова",
        topic: "Білім берудегі цифрлық технологиялар",
        bio: "Білім беру технологиялары саласындағы 15 жылдық тәжірибесі бар сарапшы",
      },
      {
        name: "Марат Сейтказиев",
        topic: "Кәсіби білім берудегі инновациялар",
        bio: "Инновациялық орталық директоры, заманауи оқыту әдістерінің мам gas"
      },
      {
        name: "Дина Абдрахманова",
        topic: "Білім берудегі халықаралық ынтымақтастық",
        bio: "Халықаралық бағдарламалар үйлестірушісі, академиялық мобильділік жөніндегі сарапшы",
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
