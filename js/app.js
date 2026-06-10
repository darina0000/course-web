// Адрес JSON Server, с которым сайт работает как с простой локальной базой данных.
const API_URL = 'http://localhost:3001';
const FALLBACK_DB = 'data/db.json';
const TOP_PASSWORDS = [
  '123456', '123456789', 'qwerty', 'password', '12345', 'qwerty123', '1q2w3e',
  '12345678', '111111', '123123', 'admin', 'letmein', 'welcome', 'iloveyou',
  'Password1!', 'Admin123!', 'Qwerty123!', '11111111'
];
const DEMO_PASSWORDS = {
  'anna@logos.by': 'Student1!',
  'ilya@logos.by': 'Student1!',
  'maria@logos.by': 'Student1!',
  'denis@logos.by': 'Student1!',
  'eva@logos.by': 'Student1!',
  'artem@logos.by': 'Student1!',
  'ksenia@logos.by': 'Student1!',
  'pavel@logos.by': 'Student1!',
  'olga.admin@logos.by': 'Admin123!',
  'darina.admin@logos.by': 'DarinaAdmin1!',
  'sergey.admin@logos.by': 'Admin123!'
};
// Общее состояние интерфейса: курсы, текущая страница, корзина, избранное и настройки.
const state = {
  courses: [],
  page: 1,
  perPage: 6,
  cart: [],
  favorites: [],
  settings: {
    theme: localStorage.getItem('theme') || 'light',
    lang: localStorage.getItem('lang') || 'ru',
    fontSize: localStorage.getItem('fontSize') || 'normal',
    visionScheme: localStorage.getItem('visionScheme') || 'light',
    hideImages: localStorage.getItem('hideImages') === 'true'
  }
};
let loadingCounter = 0;

// Короткие переводы для общих элементов интерфейса.
const dict = {
  ru: {
    navHome: 'Главная', navCourses: 'Курсы', navTeachers: 'Преподаватели', navAbout: 'О центре', navContacts: 'Контакты',
    login: 'Войти', register: 'Регистрация', heroTitle: 'Центр подготовки к ЦТ "Логос"', heroLead: 'Готовим школьников к поступлению через понятную систему занятий, диагностику прогресса и сильных преподавателей.',
    chooseCourse: 'Выбрать курс', consult: 'Получить консультацию', popular: 'Популярные направления', allCourses: 'Все курсы', enroll: 'Записаться',
    coursesTitle: 'Каталог курсов', coursesLead: 'Фильтруйте, сортируйте и ищите занятия по предмету, уровню и формату.', search: 'Поиск',
    subject: 'Предмет', level: 'Уровень', format: 'Формат', sort: 'Сортировка', reset: 'Сброс', any: 'Любой',
    settings: 'Настройки', theme: 'Тема', language: 'Язык', fontSize: 'Размер', scheme: 'Схема', hideImages: 'Без изображений',
    saved: 'Настройки сохранены', cleared: 'Настройки сброшены', requestSent: 'Заявка отправлена', registerSuccess: 'Регистрация прошла успешно. Вы вошли в кабинет', invalidForm: 'Проверьте поля формы',
    profileStudent: 'Кабинет ученика', profileAdmin: 'Панель администратора'
  },
  en: {
    navHome: 'Home', navCourses: 'Courses', navTeachers: 'Teachers', navAbout: 'About', navContacts: 'Contacts',
    login: 'Sign in', register: 'Sign up', heroTitle: 'Logos CT preparation center', heroLead: 'We prepare students for admission with clear lessons, progress diagnostics, and strong teachers.',
    chooseCourse: 'Choose course', consult: 'Get advice', popular: 'Popular subjects', allCourses: 'All courses', enroll: 'Enroll',
    coursesTitle: 'Course catalog', coursesLead: 'Filter, sort, and search lessons by subject, level, and format.', search: 'Search',
    subject: 'Subject', level: 'Level', format: 'Format', sort: 'Sort', reset: 'Reset', any: 'Any',
    settings: 'Settings', theme: 'Theme', language: 'Language', fontSize: 'Size', scheme: 'Scheme', hideImages: 'No images',
    saved: 'Settings saved', cleared: 'Settings cleared', requestSent: 'Request sent', registerSuccess: 'Registration completed. You are signed in', invalidForm: 'Check form fields',
    profileStudent: 'Student dashboard', profileAdmin: 'Admin panel'
  }
};

// Переводы для главной страницы и повторяющихся блоков макета.
const referenceTranslations = {
  ru: {
    account: 'Кабинет',
    nav: ['О центре', 'Курсы', 'Преподаватели', 'Результаты', 'Контакты'],
    hero: 'Подготовка к ЦТ',
    features: ['Готовим на баллы 80+', 'Подготовка очно и онлайн', 'Более 10 лет опыта', 'Лицензионные программы'],
    heroLead: 'Центр "Логос" приглашает на курсы ЦТ по всем предметам. Подготовка с гарантией 20+ баллов к вашему результату.',
    details: 'Подробнее',
    stats: 'Центр “Логос” готовит к ЦТ с 2009 года',
    statsLabels: ['Преподавателей', 'Баллов к вашему результату', 'Учеников поступают в вуз на бюджет', 'Выпускников за все время работы'],
    parents: 'Почему родители выпускников выбирают “Логос”?',
    parentScores: ['баллов средний результат учеников в ЛОГОСе', 'баллов к своему начальному уровню', 'балла выше результат, чем в среднем по стране'],
    checkTitles: ['Поддержка 24/7', 'Гарантия результата', 'Индивидуальный подход', 'Отслеживание результата'],
    checkTexts: ['Наставник ученика, который всегда на связи с ним и родителями.', 'Продуманная система сопровождения помогает получить гарантированный рост.', 'Фиксируем цель подготовки и определяем понятный маршрут.', 'Показываем усвоение материала на каждом этапе обучения.'],
    courses: 'Форматы обучения в Центре',
    courseTitles: ['Математика', 'Физика', 'Русский язык', 'Английский язык'],
    courseDescriptions: ['Интенсив для поступления в технические специальности', 'Решение задач повышенной сложности', 'Разбор тестов и написание эссе', 'Подготовка к ЦТ и международным экзаменам'],
    testTitle: 'Не знаешь, что выбрать?',
    testLead: 'Пройди тест за 1 минуту',
    startTest: 'Начать тест',
    allCourses: 'Смотреть все курсы',
    useful: 'Чем полезны курсы в центре “Логос”?',
    usefulItems: ['Подготовиться к ЦТ на высокие баллы', 'Подготовиться в условиях дистанционного обучения', 'Поступить в вузы страны на бюджет'],
    teachers: 'Наши преподаватели',
    teacherDetails: 'Подробнее',
    teacherStats: ['лет опыта подготовки к ЦТ', 'лет работает в Центре “Логос”'],
    reviews: 'Отзывы наших учеников',
    readFull: 'Читать полностью',
    resultsPage: 'К полному списку результатов',
    reviewModalTitle: 'ОТЗЫВ',
    reviewSubject: 'Предмет',
    reviewTutor: 'Тьютор',
    callout: 'Пора готовиться с Логосом!',
    calloutText: 'Запишитесь на курс 2026/2027 учебного года и начните подготовку заранее',
    enroll: 'Записаться'
  },
  en: {
    account: 'Account',
    nav: ['About', 'Courses', 'Teachers', 'Results', 'Contacts'],
    hero: 'CT Exam Preparation',
    features: ['Prepare for scores of 80+', 'In-person and online classes', 'More than 10 years of experience', 'Licensed programs'],
    heroLead: 'Logos offers CT preparation courses in every subject, helping students improve their result by 20+ points.',
    details: 'Learn more',
    stats: 'Logos has prepared students for CT since 2009',
    statsLabels: ['Teachers', 'Points added to your result', 'Students admitted to state-funded places', 'Graduates throughout our history'],
    parents: 'Why do graduates’ parents choose Logos?',
    parentScores: ['average score of Logos students', 'points added to the starting level', 'points above the national average'],
    checkTitles: ['24/7 support', 'Guaranteed progress', 'Individual approach', 'Progress tracking'],
    checkTexts: ['A student mentor is always in touch with the student and parents.', 'A thoughtful support system helps students achieve steady growth.', 'We define the preparation goal and build a clear learning route.', 'We show how well the material is mastered at every stage.'],
    courses: 'Learning Formats at Logos',
    courseTitles: ['Mathematics', 'Physics', 'Russian', 'English'],
    courseDescriptions: ['Intensive preparation for technical majors', 'Advanced problem-solving practice', 'Test practice and essay writing', 'CT and international exam preparation'],
    testTitle: 'Not sure what to choose?',
    testLead: 'Take the one-minute test',
    startTest: 'Start test',
    allCourses: 'View all courses',
    useful: 'How are Logos courses useful?',
    usefulItems: ['Prepare for a high CT score', 'Study effectively online', 'Enter a state-funded university place'],
    teachers: 'Our Teachers',
    teacherDetails: 'Learn more',
    teacherStats: ['years of CT prep experience', 'years at Logos'],
    reviews: 'Student Reviews',
    readFull: 'Read full review',
    resultsPage: 'Full results list',
    reviewModalTitle: 'REVIEW',
    reviewSubject: 'Subject',
    reviewTutor: 'Tutor',
    callout: 'Get ready with Logos!',
    calloutText: 'Enroll for the 2026/2027 academic year and start preparing early',
    enroll: 'Enroll'
  }
};

const courseQuizCopy = {
  ru: {
    title: 'Мини-тест подбора курса',
    goal: 'Что тебе ближе?',
    format: 'Как удобнее заниматься?',
    level: 'Какой сейчас уровень?',
    submit: 'Показать рекомендацию',
    required: 'Выберите направление, чтобы получить рекомендацию.',
    resultTitle: 'Рекомендуем курс:',
    resultText: 'Подойдёт формат: {format}. Уровень: {level}.',
    openCourses: 'Смотреть подходящие курсы',
    options: {
      math: 'Точные науки и технические специальности',
      physics: 'Задачи, формулы и эксперименты',
      russian: 'Тесты, текст и грамотная речь',
      english: 'Языки и международные экзамены',
      offline: 'Очно в центре',
      online: 'Онлайн',
      base: 'Нужно подтянуть базу',
      advanced: 'Хочу высокий балл'
    },
    subjects: {
      math: 'Математика',
      physics: 'Физика',
      russian: 'Русский язык',
      english: 'Английский язык'
    }
  },
  en: {
    title: 'Quick course matching test',
    goal: 'What suits you best?',
    format: 'How would you like to study?',
    level: 'What is your current level?',
    submit: 'Show recommendation',
    required: 'Choose a direction to get a recommendation.',
    resultTitle: 'Recommended course:',
    resultText: 'Suggested format: {format}. Level: {level}.',
    openCourses: 'View matching courses',
    options: {
      math: 'Exact sciences and technical majors',
      physics: 'Problems, formulas, and experiments',
      russian: 'Tests, writing, and clear language',
      english: 'Languages and international exams',
      offline: 'In-person at the center',
      online: 'Online',
      base: 'I need to strengthen the basics',
      advanced: 'I want a high score'
    },
    subjects: {
      math: 'Mathematics',
      physics: 'Physics',
      russian: 'Russian',
      english: 'English'
    }
  }
};

const referenceAboutTranslations = {
  ru: {
    breadcrumb: ['Главная', 'О центре'],
    title: 'Центр “Логос” готовит к ЦТ с 2009 года',
    stats: ['Преподавателей', 'Баллов к вашему результату', 'Учеников поступают в вуз на бюджет', 'Выпускников за все время работы'],
    story: [
      'Центр “Логос” — организатор ЦТ-Марафона, в котором приняли участие 100 школ.',
      'Более 300 учеников проверили свою готовность к экзамену, потренировались и бесплатно получили консультации экспертов ЦТ, чтобы улучшить свои баллы на экзамене.'
    ],
    testing: [
      'Что нужно сделать для успешного старта подготовки к ЦТ?',
      'Самое первое и самое важное — определиться с предметами и определить текущий уровень знаний по ним! Мы ежегодно тестируем более 2 500 учеников и даём персональные рекомендации по результатам тестов. Причём мы делаем это абсолютно бесплатно.',
      'Запишитесь прямо сейчас и получите исчерпывающие рекомендации по подготовке.'
    ],
    testingButton: 'Записаться на тестирование',
    benefitsTitle: 'Чем полезны курсы в центре “Логос”?',
    benefits: [
      'Подготовиться к ЦТ на высокие баллы',
      'Понять способности и предрасположенность ребёнка',
      'Знание всех нюансов экзамена',
      'Подготовиться в условиях дистанционного обучения',
      'Поступление в вузы страны на бюджет',
      'Подготовка с преподавателями — экспертами ЦТ',
      'Повышение школьной оценки',
      'Подготовка в условиях реального экзамена и помощь со стрессом'
    ],
    aside: 'Мы не даём волшебную таблетку и не проводим нудных психологических тестов. Мы готовим гармоничную личность для перехода во взрослую жизнь.'
  },
  en: {
    breadcrumb: ['Home', 'About'],
    title: 'Logos has prepared students for CT since 2009',
    stats: ['Teachers', 'Points added to your result', 'Students admitted to state-funded places', 'Graduates throughout our history'],
    story: [
      'Logos organizes the CT Marathon, which has brought together 100 schools.',
      'More than 300 students tested their exam readiness, practiced, and received free advice from CT experts to improve their scores.'
    ],
    testing: [
      'What should you do to make a successful start in CT preparation?',
      'The first and most important step is choosing your subjects and identifying your current knowledge level. Every year we test more than 2,500 students and provide personal recommendations completely free of charge.',
      'Register now and receive detailed preparation recommendations.'
    ],
    testingButton: 'Register for testing',
    benefitsTitle: 'How are Logos courses useful?',
    benefits: [
      'Prepare for a high CT score',
      'Understand a child’s strengths and aptitudes',
      'Learn every important exam detail',
      'Prepare effectively through distance learning',
      'Enter a state-funded university place',
      'Study with experienced CT experts',
      'Improve school grades',
      'Practice real exam conditions and learn to manage stress'
    ],
    aside: 'We do not promise a magic pill or rely on tedious psychological tests. We help students grow into confident, well-rounded adults.'
  }
};

const referenceTeachersPageTranslations = {
  ru: {
    breadcrumb: ['Главная', 'Преподаватели'],
    title: 'Команда центра «Логос»',
    education: 'Образование',
    achievements: 'Достижения',
    results: 'Результаты учеников',
    experienceText: 'опыт подготовки к ЦТ',
    centerText: 'работает в Центре “Логос”'
  },
  en: {
    breadcrumb: ['Home', 'Teachers'],
    title: 'The Logos Team',
    education: 'Education',
    achievements: 'Achievements',
    results: 'Student Results',
    experienceText: 'CT preparation experience',
    centerText: 'works at Logos Center'
  }
};

const referenceResultsTranslations = {
  ru: {
    breadcrumb: ['Главная', 'Результаты'],
    heroTitle: 'Центр “Логос”',
    heroAccent: 'готовит к ЦТ с 2009 года',
    stats: ['баллов к вашему результату', 'учеников поступают в вуз на бюджет', 'выпускников за все время работы'],
    universities: 'Наши ученики поступают',
    cases: 'Кейсы учеников',
    testLabel: 'Баллов на тесте',
    examLabel: 'Баллов на экзамене',
    ctaTitle: 'Хочешь стать следующим нашим отличником?',
    ctaText: 'Запишись на подбор курса, и мы поможем выбрать программу именно для тебя',
    enroll: 'Записаться'
  },
  en: {
    breadcrumb: ['Home', 'Results'],
    heroTitle: 'Logos Center',
    heroAccent: 'has prepared students since 2009',
    stats: ['points added to your result', 'students enter state-funded places', 'graduates throughout our history'],
    universities: 'Our students enter',
    cases: 'Student cases',
    testLabel: 'Test score',
    examLabel: 'Exam score',
    ctaTitle: 'Want to become our next top student?',
    ctaText: 'Sign up for course selection, and we will help choose the right program for you',
    enroll: 'Enroll'
  }
};

// Тексты каталога курсов: фильтры, кнопки и сообщения пустого результата.
const referenceCoursesPageTranslations = {
  ru: {
    title: 'Курсы - Логос',
    breadcrumb: ['Главная', 'Каталог'],
    catalogTitle: 'Каталог курсов',
    filters: 'Фильтры',
    reset: 'Сбросить ×',
    searchPlaceholder: 'Поиск по предмету',
    format: 'Формат обучения',
    any: 'Любой',
    subject: 'Предмет',
    allSubjects: 'Все предметы',
    subjects: ['Математика', 'Русский язык', 'Английский язык', 'Физика', 'Химия', 'Биология', 'История', 'Обществоведение'],
    priceFrom: 'Цена от',
    priceTo: 'до',
    learningTitle: 'Как проходит обучение\nв центре “Логос”?',
    blocks: [
      ['Бесплатная диагностика знаний', 'У каждого есть шанс сдать экзамен на высокий балл. ЦТ - это стандарт. Диагностика перед обучением позволяет точечно выстроить маршрут подготовки, определив разрыв между текущим и желаемым результатом.'],
      ['Подготовка в формате экзамена', 'Наша методика строится на технологии “перевернутого обучения”, когда учащиеся самостоятельно осваивают теорию, а на занятии тратят время на практическую отработку. Наша основная задача - научить ребёнка виртуозно применять теоретический материал в обстановке реального экзамена.'],
      ['Обучение онлайн', 'Мы создали удобную онлайн-систему, которая позволяет качественно готовиться в режиме “онлайн” и не терять темп подготовки, если вдруг ваш ребёнок не смог посетить какое-то занятие, либо вновь объявили карантин. Занятия проходят только в “живом” режиме.'],
      ['Клуб Абитуриента', 'Экзамены - первый шаг во взрослой жизни. Мы психологически готовимся к этому шагу. Чтобы сделать его осознано, ответственно, самостоятельно. Как избавится от стресса? Ученики обучаются методикам управления стрессом как при подготовке, так и на самом экзамене. В сложный период жизни важно не остаться одному. В Клубе мы находим единомышленников и друзей. Общаемся и проводим совместные мероприятия.']
    ],
    details: 'Подробнее',
    noCourses: 'Курсы не найдены.',
    authRequiredTitle: 'Нужен вход',
    authRequiredText: 'Добавлять курсы в корзину могут только зарегистрированные пользователи.',
    authRequiredLogin: 'Войти',
    authRequiredRegister: 'Регистрация',
    online: 'Онлайн',
    offline: 'Офлайн'
  },
  en: {
    title: 'Courses - Logos',
    breadcrumb: ['Home', 'Catalog'],
    catalogTitle: 'Course catalog',
    filters: 'Filters',
    reset: 'Reset ×',
    searchPlaceholder: 'Search by subject',
    format: 'Learning format',
    any: 'Any',
    subject: 'Subject',
    allSubjects: 'All subjects',
    subjects: ['Mathematics', 'Russian', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Social studies'],
    priceFrom: 'Price from',
    priceTo: 'to',
    learningTitle: 'How learning works\nat Logos',
    blocks: [
      ['Free knowledge diagnostics', 'Every student has a chance to pass the exam with a strong score. Diagnostics before training help us build a precise route from the current level to the desired result.'],
      ['Exam-format preparation', 'Our method uses flipped learning: students study theory in advance and spend class time practicing tasks. Our main goal is to teach each student to confidently apply theory in real exam conditions.'],
      ['Online learning', 'We created a convenient online system that helps students prepare effectively online and keep pace if they miss a class or quarantine returns. Classes are held only live.'],
      ['Applicant Club', 'Exams are the first step into adult life. We prepare for this step psychologically so it feels conscious, responsible, and independent. Students learn stress-management techniques for preparation and exam day, find support, communicate, and take part in joint events.']
    ],
    details: 'Learn more',
    noCourses: 'No courses found.',
    authRequiredTitle: 'Sign in required',
    authRequiredText: 'Only registered users can add courses to the cart.',
    authRequiredLogin: 'Sign in',
    authRequiredRegister: 'Registration',
    online: 'Online',
    offline: 'Offline'
  }
};

const referenceContactsTranslations = {
  ru: {
    title: 'Контакты - Логос',
    breadcrumb: ['Главная', 'Контакты'],
    heading: 'Удобно добираться',
    lead: 'Офис в центре города',
    labels: ['Адрес:', 'Телефон:', 'Почта:', 'Режим работы:'],
    values: [
      'улица Чайковского 11, Могилёв,\nМогилёвская область',
      '+375 (29) 123-45-67',
      'logos@gmail.com',
      'ПН-ПТ 8.00 - 19.00\nСБ - ВС 12.00 - 18.00'
    ]
  },
  en: {
    title: 'Contacts - Logos',
    breadcrumb: ['Home', 'Contacts'],
    heading: 'Easy to reach',
    lead: 'Office in the city center',
    labels: ['Address:', 'Phone:', 'Email:', 'Working hours:'],
    values: [
      '11 Tchaikovskogo Street, Mogilev,\nMogilev Region',
      '+375 (29) 123-45-67',
      'logos@gmail.com',
      'MON-FRI 8.00 - 19.00\nSAT-SUN 12.00 - 18.00'
    ]
  }
};

const referenceErrorTranslations = {
  ru: {
    title: '404 - Логос',
    heading: 'Страница не найдена',
    text: 'Такой страницы нет или ссылка устарела. Вернитесь на главную или откройте каталог курсов.',
    home: 'На главную',
    courses: 'К курсам'
  },
  en: {
    title: '404 - Logos',
    heading: 'Page not found',
    text: 'This page does not exist or the link is outdated. Go back to the homepage or open the course catalog.',
    home: 'Home',
    courses: 'Courses'
  }
};

// Тексты страниц входа, регистрации, кабинета ученика и панели администратора.
const referenceAuthTranslations = {
  ru: {
    loginTitle: 'Вход - Логос',
    registerTitle: 'Регистрация - Логос',
    home: 'Главная',
    loginCrumb: 'Вход',
    registerCrumb: 'Регистрация',
    loginHeading: 'Вход в кабинет',
    loginLead: 'Авторизуйтесь, чтобы открыть функции ученика или администратора.',
    loginCard: 'Авторизация',
    email: 'Email',
    password: 'Пароль',
    showPassword: 'Показать',
    hidePassword: 'Скрыть',
    role: 'Роль',
    student: 'Ученик',
    admin: 'Администратор',
    signIn: 'Войти',
    noAccount: 'Нет аккаунта?',
    signUp: 'Зарегистрироваться',
    registerHeading: 'Регистрация',
    registerLead: 'Заполните данные ученика. Обязательные поля отмечены красной линией.',
    createAccount: 'Создать аккаунт',
    fullName: 'ФИО',
    phone: 'Телефон РБ',
    birthDate: 'Дата рождения',
    nickname: 'Никнейм',
    passwordMode: 'Способ задания пароля',
    manual: 'Самостоятельно',
    auto: 'Автоматически',
    agreementText: 'Я прочитал(а)',
    agreementLink: 'Соглашение пользователя',
    agreementTail: 'и принимаю условия',
    haveAccount: 'Уже есть аккаунт?',
    agreementTitle: 'Соглашение пользователя',
    agreementBody: 'Пользователь подтверждает достоверность данных, согласен на обработку персональных данных для регистрации, записи на курсы и связи с центром подготовки “Логос”.',
    settingsTitle: 'Версия для слабовидящих',
    guestTitle: 'Гость',
    guestText: 'Войдите или зарегистрируйтесь, чтобы увидеть персональный кабинет.',
    studentPanel: 'Кабинет ученика',
    studentIntro: 'здесь можно оформить заказ на курсы и отслеживать выбранные занятия.',
    adminPanel: 'Панель администратора',
    adminIntro: 'Сводка по пользователям, курсам и заявкам на обучение.',
    logout: 'Выйти',
    cart: 'Корзина курсов',
    actions: 'Мои действия',
    chooseCourse: 'Выбрать курс',
    cartEmpty: 'Корзина пока пустая. Добавьте курс из каталога.',
    goCourses: 'Перейти к курсам',
    total: 'Итого',
    checkout: 'Оформить заказ',
    myOrders: 'Мои заявки',
    ordersEmpty: 'Оформленных заявок пока нет.',
    pay: 'Оплатить',
    paid: 'Оплачено',
    waiting: 'Ожидает оплаты',
    favorites: 'Избранное',
    favoritesEmpty: 'В избранном пока пусто. Нажмите сердечко у курса.',
    removeFavorite: 'Убрать',
    addFavoriteToCart: 'В корзину',
    profileData: 'Личные данные',
    saveProfile: 'Сохранить данные',
    profileSaved: 'Личные данные обновлены',
    profileError: 'Проверьте имя, телефон РБ, email и возраст 16+',
    studentReviewTitle: 'Мой отзыв',
    reviewCourse: 'Курс',
    reviewText: 'Текст отзыва',
    reviewSubmit: 'Отправить на проверку',
    reviewSent: 'Отзыв отправлен администратору',
    reviewNoPaidCourses: 'Отзыв можно оставить только по оплаченному курсу.',
    reviewNoCoursesLeft: 'По всем оплаченным курсам отзыв уже отправлен.',
    reviewPending: 'Ожидает модерации',
    reviewPublished: 'Опубликован',
    reviewError: 'Выберите курс и напишите отзыв от 20 символов',
    adminReviews: 'Отзывы учеников',
    publishReview: 'Опубликовать',
    deleteReview: 'Удалить',
    reviewDeleted: 'Отзыв удалён',
    noReviewRequests: 'Отзывов пока нет.',
    adminUsers: 'Пользователи',
    adminCatalog: 'Редактирование курсов',
    courseTitle: 'Название',
    courseDescription: 'Описание',
    coursePrice: 'Цена BYN',
    courseFormat: 'Формат',
    courseSubject: 'Предмет',
    selectCourse: 'Выберите курс',
    addCourse: 'Добавить новый курс',
    newCourseTitle: 'Новый курс',
    saveCourse: 'Сохранить курс',
    createCourse: 'Добавить курс',
    courseSaved: 'Карточка курса обновлена',
    courseCreated: 'Новый курс добавлен',
    deleteCourse: 'Удалить курс',
    courseDeleted: 'Курс удалён',
    deleteCourseConfirm: 'Удалить выбранный курс из каталога?',
    deleteCourseTitle: 'Удалить курс?',
    deleteCourseOk: 'Удалить',
    cancel: 'Отмена',
    courseError: 'Заполните название, описание и корректную цену',
    adminStudent: 'ученик',
    adminAdmin: 'админ',
    allRequests: 'Все заявки',
    userFallback: 'Пользователь',
    courseFallback: 'Курс',
    users: 'пользователей',
    courses: 'курсов',
    newRequests: 'новых заявок',
    activePayments: 'активных оплат',
    latest: 'Последние заявки',
    confirm: 'Подтвердить оплату',
    pendingBack: 'Вернуть в ожидание',
    requestUpdated: 'Статус заявки обновлён',
    enrollmentServerError: 'Запустите JSON Server, чтобы изменить заявку из базы'
  },
  en: {
    loginTitle: 'Sign in - Logos',
    registerTitle: 'Registration - Logos',
    home: 'Home',
    loginCrumb: 'Sign in',
    registerCrumb: 'Registration',
    loginHeading: 'Sign in',
    loginLead: 'Sign in to open student or administrator tools.',
    loginCard: 'Authorization',
    email: 'Email',
    password: 'Password',
    showPassword: 'Show',
    hidePassword: 'Hide',
    role: 'Role',
    student: 'Student',
    admin: 'Administrator',
    signIn: 'Sign in',
    noAccount: 'No account?',
    signUp: 'Register',
    registerHeading: 'Registration',
    registerLead: 'Fill in student details. Required fields are marked with a red line.',
    createAccount: 'Create account',
    fullName: 'Full name',
    phone: 'Belarus phone',
    birthDate: 'Birth date',
    nickname: 'Nickname',
    passwordMode: 'Password setup',
    manual: 'Manual',
    auto: 'Automatic',
    agreementText: 'I have read',
    agreementLink: 'User agreement',
    agreementTail: 'and accept the terms',
    haveAccount: 'Already have an account?',
    agreementTitle: 'User agreement',
    agreementBody: 'The user confirms the accuracy of the data and agrees to personal data processing for registration, course enrollment and communication with Logos.',
    settingsTitle: 'Accessibility version',
    guestTitle: 'Guest',
    guestText: 'Sign in or register to see your personal dashboard.',
    studentPanel: 'Student dashboard',
    studentIntro: 'you can place course orders and track selected lessons here.',
    adminPanel: 'Admin panel',
    adminIntro: 'Overview of users, courses and enrollment requests.',
    logout: 'Log out',
    cart: 'Course cart',
    actions: 'Actions',
    chooseCourse: 'Choose course',
    cartEmpty: 'Your cart is empty. Add a course from the catalog.',
    goCourses: 'Go to courses',
    total: 'Total',
    checkout: 'Create order',
    myOrders: 'My orders',
    ordersEmpty: 'No course requests yet.',
    pay: 'Pay',
    paid: 'Paid',
    waiting: 'Awaiting payment',
    favorites: 'Favorites',
    favoritesEmpty: 'No favorites yet. Click the heart on a course.',
    removeFavorite: 'Remove',
    addFavoriteToCart: 'To cart',
    profileData: 'Personal data',
    saveProfile: 'Save data',
    profileSaved: 'Personal data updated',
    profileError: 'Check name, Belarus phone, email and age 16+',
    studentReviewTitle: 'My review',
    reviewCourse: 'Course',
    reviewText: 'Review text',
    reviewSubmit: 'Send for review',
    reviewSent: 'Review sent to administrator',
    reviewNoPaidCourses: 'You can leave a review only for a paid course.',
    reviewNoCoursesLeft: 'A review has already been sent for every paid course.',
    reviewPending: 'Awaiting moderation',
    reviewPublished: 'Published',
    reviewError: 'Choose a course and write at least 20 characters',
    adminReviews: 'Student reviews',
    publishReview: 'Publish',
    deleteReview: 'Delete',
    reviewDeleted: 'Review deleted',
    noReviewRequests: 'No reviews yet.',
    adminUsers: 'Users',
    adminCatalog: 'Course editor',
    courseTitle: 'Title',
    courseDescription: 'Description',
    coursePrice: 'Price BYN',
    courseFormat: 'Format',
    courseSubject: 'Subject',
    selectCourse: 'Choose course',
    addCourse: 'Add new course',
    newCourseTitle: 'New course',
    saveCourse: 'Save course',
    createCourse: 'Add course',
    courseSaved: 'Course card updated',
    courseCreated: 'New course added',
    deleteCourse: 'Delete course',
    courseDeleted: 'Course deleted',
    deleteCourseConfirm: 'Delete the selected course from the catalog?',
    deleteCourseTitle: 'Delete course?',
    deleteCourseOk: 'Delete',
    cancel: 'Cancel',
    courseError: 'Fill title, description, and a valid price',
    adminStudent: 'student',
    adminAdmin: 'admin',
    allRequests: 'All requests',
    userFallback: 'User',
    courseFallback: 'Course',
    users: 'users',
    courses: 'courses',
    newRequests: 'new requests',
    activePayments: 'active payments',
    latest: 'Latest requests',
    confirm: 'Confirm payment',
    pendingBack: 'Set pending',
    requestUpdated: 'Request status updated',
    enrollmentServerError: 'Start JSON Server to update a request from the database'
  }
};

const courseCardEnglish = {
  1: ['Mathematics: CT Algebra', 'Systematic preparation for advanced algebra problems.'],
  2: ['Mathematics: Basics from Scratch', 'Review of the school curriculum and standard tests.'],
  3: ['Russian: Test Section', 'Spelling, punctuation, and practice in the CT format.'],
  4: ['Russian: Intensive Course', 'Intensive preparation before mock testing.'],
  5: ['English: Grammar Boost', 'Grammar, vocabulary, and listening practice for CT.'],
  6: ['English: Advanced Practice', 'Complex texts and full practice tests.'],
  7: ['Physics: Mechanics', 'Formulas, graphs, and mechanics problems.'],
  8: ['Physics: Electricity', 'Advanced electrodynamics topics and calculations.'],
  9: ['Chemistry: General Chemistry', 'Stoichiometry, solutions, and structure of matter.'],
  10: ['Chemistry: Organic Chemistry', 'Reactions, conversion chains, and CT problems.'],
  11: ['Biology: Human Body', 'Anatomy and physiology through test practice.'],
  12: ['Biology: Genetics', 'Genetics problems, crossing schemes, and common mistakes.'],
  13: ['History of Belarus: Basics', 'Dates, people, events, and map practice.'],
  14: ['History of Belarus: Intensive', 'Full-course revision through test blocks.'],
  15: ['Social Studies: Theory', 'Law, economics, politics, and social institutions.'],
  16: ['Social Studies: Practice', 'Practice tests, argumentation, and error review.'],
  17: ['Mathematics: Geometry', 'Plane and solid geometry with clear algorithms.'],
  18: ['Mathematics: Mock CT Tests', 'Weekly tests, timing, and error analytics.'],
  19: ['Russian: Punctuation', 'Commas, dashes, complex sentences, and practice drills.'],
  20: ['Russian: Advanced Tasks', 'Focused practice on tasks where students lose points.'],
  21: ['English: Vocabulary', 'Topics, fixed expressions, and practice cards.'],
  22: ['English: Mock Tests', 'Full tests with strategy review.'],
  23: ['Physics: Optics', 'Lenses, mirrors, waves, and calculation tasks.'],
  24: ['Physics: Complete Course', 'Preparation across all sections with progress checks.'],
  25: ['Chemistry: Calculation Problems', 'Problem-solving algorithms and test practice.'],
  26: ['Chemistry: Olympiad Reserve', 'Complex reactions and advanced preparation.'],
  27: ['Biology: Botany', 'Plants, classification, and test tasks.'],
  28: ['Biology: Complete Course', 'All biology sections with regular diagnostics.'],
  29: ['History: Maps and Dates', 'Practice with maps, chronology, and historical figures.'],
  30: ['Social Studies: Express Course', 'Final revision and focused weak-point practice.']
};

function getCourseDisplayTitle(course) {
  if (!course) return '';
  const translatedCourse = state.settings.lang === 'en' ? courseCardEnglish[course.id] : null;
  return translatedCourse?.[0] || course.title || '';
}

function getCourseDisplayDescription(course) {
  if (!course) return '';
  const translatedCourse = state.settings.lang === 'en' ? courseCardEnglish[course.id] : null;
  return translatedCourse?.[1] || course.description || '';
}

// Кейсы учеников для страницы результатов.
const resultCases = {
  ru: [
    { name: 'Коршкина Настя', subject: 'Физика', test: '50', exam: '82', image: 'images/stud1.png' },
    { name: 'Смирнова София', subject: 'Русский', test: '53', exam: '85', image: 'images/stud2.png' },
    { name: 'Кузнецова Анна', subject: 'Математика', test: '49', exam: '87', image: 'images/stud3.png' },
    { name: 'Петрова Екатерина', subject: 'Химия', test: '54', exam: '86', image: 'images/stud4.png' },
    { name: 'Иванова Мария', subject: 'Английский', test: '57', exam: '89', image: 'images/stud5.png' },
    { name: 'Левченко София', subject: 'Биология', test: '52', exam: '84', image: 'images/stud6.png' }
  ],
  en: [
    { name: 'Nastya Korshkina', subject: 'Physics', test: '50', exam: '82', image: 'images/stud1.png' },
    { name: 'Sofia Smirnova', subject: 'Russian', test: '53', exam: '85', image: 'images/stud2.png' },
    { name: 'Anna Kuznetsova', subject: 'Mathematics', test: '49', exam: '87', image: 'images/stud3.png' },
    { name: 'Ekaterina Petrova', subject: 'Chemistry', test: '54', exam: '86', image: 'images/stud1.png' },
    { name: 'Maria Ivanova', subject: 'English', test: '57', exam: '89', image: 'images/stud2.png' },
    { name: 'Sofia Levchenko', subject: 'Biology', test: '52', exam: '84', image: 'images/stud3.png' }
  ]
};

// Данные преподавателей для карусели на главной и отдельной странице преподавателей.
const referenceTeachers = {
  ru: [
    { surname: 'ВОЛКОВА', name: 'Галина Семеновна', subject: 'Физика', experience: '15', center: '8', educationYears: '43', educationUnit: 'года', educationText: 'закончила аспирантуру', image: 'images/home-teacher.png', alt: 'Преподаватель физики Галина Семеновна', achievements: ['Эксперт ЦТ по физике с 2012 года', 'Разработчик учебно-методических материалов “Центра Логос”', 'Почётная грамота от министерства образования РФ'], results: ['+700 старшеклассников подготовила к сдаче экзамена', '98 максимальный балл учеников на ЕГЭ'] },
    { surname: 'ИВАНОВА', name: 'Марина Петровна', subject: 'Математика', experience: '12', center: '6', educationYears: '38', educationUnit: 'лет', educationText: 'преподаёт математику', image: 'images/home-teacher2.png', alt: 'Преподаватель математики Марина Петровна', achievements: ['Эксперт по заданиям повышенной сложности', 'Автор тренажёров по алгебре и геометрии', 'Куратор олимпиадной подготовки'], results: ['+520 учеников успешно сдали экзамен', '96 максимальный балл учеников'] },
    { surname: 'КОВАЛЕВА', name: 'Ольга Викторовна', subject: 'Русский язык', experience: '10', center: '5', educationYears: '29', educationUnit: 'лет', educationText: 'в филологическом образовании', image: 'images/home-teacher3.png', alt: 'Преподаватель русского языка Ольга Викторовна', achievements: ['Эксперт по сочинениям и тестовой части', 'Методист по развитию грамотной речи', 'Автор проверочных диктантов'], results: ['+430 выпускников улучшили результат', '94 максимальный балл учеников'] },
    { surname: 'СОКОЛОВА', name: 'Елена Андреевна', subject: 'Английский язык', experience: '11', center: '7', educationYears: '31', educationUnit: 'год', educationText: 'в языковой подготовке', image: 'images/home-teacher4.png', alt: 'Преподаватель английского языка Елена Андреевна', achievements: ['Специалист по международным экзаменам', 'Ведёт разговорные клубы', 'Разработчик тестовых модулей'], results: ['+460 учеников прошли подготовку', '95 максимальный балл учеников'] },
    { surname: 'МИХАЙЛОВА', name: 'Наталья Игоревна', subject: 'Химия', experience: '14', center: '9', educationYears: '35', educationUnit: 'лет', educationText: 'работает с выпускниками', image: 'images/home-teacher5.png', alt: 'Преподаватель химии Наталья Игоревна', achievements: ['Эксперт по расчётным задачам', 'Автор практических занятий', 'Наставник проектных работ'], results: ['+390 учеников подготовила к экзамену', '97 максимальный балл учеников'] }
  ],
  en: [
    { surname: 'VOLKOVA', name: 'Galina Semyonovna', subject: 'Physics', experience: '15', center: '8', educationYears: '43', educationUnit: 'years', educationText: 'completed postgraduate studies', image: 'images/home-teacher.png', alt: 'Physics teacher Galina Semyonovna', achievements: ['CT physics expert since 2012', 'Developer of Logos teaching materials', 'Honorary certificate from the Ministry of Education'], results: ['+700 senior students prepared for exams', '98 highest student exam score'] },
    { surname: 'IVANOVA', name: 'Marina Petrovna', subject: 'Mathematics', experience: '12', center: '6', educationYears: '38', educationUnit: 'years', educationText: 'teaches mathematics', image: 'images/home-teacher2.png', alt: 'Mathematics teacher Marina Petrovna', achievements: ['Advanced problem-solving expert', 'Author of algebra and geometry trainers', 'Olympiad preparation curator'], results: ['+520 students passed successfully', '96 highest student score'] },
    { surname: 'KOVALEVA', name: 'Olga Viktorovna', subject: 'Russian', experience: '10', center: '5', educationYears: '29', educationUnit: 'years', educationText: 'in language education', image: 'images/home-teacher3.png', alt: 'Russian language teacher Olga Viktorovna', achievements: ['Essay and test-part expert', 'Speech development methodologist', 'Author of practice dictations'], results: ['+430 graduates improved results', '94 highest student score'] },
    { surname: 'SOKOLOVA', name: 'Elena Andreevna', subject: 'English', experience: '11', center: '7', educationYears: '31', educationUnit: 'years', educationText: 'in language preparation', image: 'images/home-teacher4.png', alt: 'English teacher Elena Andreevna', achievements: ['International exam specialist', 'Conversation club teacher', 'Developer of test modules'], results: ['+460 students completed preparation', '95 highest student score'] },
    { surname: 'MIKHAILOVA', name: 'Natalia Igorevna', subject: 'Chemistry', experience: '14', center: '9', educationYears: '35', educationUnit: 'years', educationText: 'works with graduates', image: 'images/home-teacher5.png', alt: 'Chemistry teacher Natalia Igorevna', achievements: ['Calculation-task expert', 'Author of practical lessons', 'Project work mentor'], results: ['+390 students prepared for exams', '97 highest student score'] }
  ]
};

const courseTeacherNames = {
  ru: {
    101: 'Марина Петровна',
    102: 'Ольга Викторовна',
    103: 'Елена Андреевна',
    104: 'Галина Семеновна',
    105: 'Наталья Игоревна',
    106: 'Анна Сергеевна',
    107: 'Ольга Викторовна',
    108: 'Сергей Александрович'
  },
  en: {
    101: 'Marina Petrovna',
    102: 'Olga Viktorovna',
    103: 'Elena Andreevna',
    104: 'Galina Semyonovna',
    105: 'Natalia Igorevna',
    106: 'Anna Sergeevna',
    107: 'Olga Viktorovna',
    108: 'Sergey Alexandrovich'
  }
};

function getCourseTutorName(course) {
  const fallback = state.settings.lang === 'en' ? 'Logos teacher' : 'Преподаватель Логос';
  if (!course) return fallback;
  const names = courseTeacherNames[state.settings.lang] || courseTeacherNames.ru;
  return names[Number(course.teacherId)] || fallback;
}

const referenceReviews = {
  ru: [
    {
      name: 'Анастасия Алиева',
      date: '21.02.25',
      subject: 'Математика',
      tutor: 'Галина Михайловна',
      text: 'Здравствуйте, я бы хотела передать большое спасибо преподавателям, которые помогали на протяжении всего этого года. Я математику вообще не понимала, сейчас же я стала более менее ее понимать. Экзамены написаны уже и очень благодарна Галине Михайловне.',
      full: 'Здравствуйте! Хочу передать огромную благодарность преподавателям центра "Логос", которые помогали мне на протяжении всего этого года. Когда я пришла в центр, я математику вообще не понимала. Казалось, что это какой-то темный лес, и сдать ЦТ на высокий балл нереально. Но Галина Михайловна нашла подход: она объясняла сложные темы простым языком, мы разбирали каждую ошибку в тестах. Особенно хочу отметить атмосферу. Не было давления, только поддержка. Мы прорешали десятки вариантов прошлых лет, и я почувствовала уверенность. Результат: экзамены написаны отлично! Я набрала 86 баллов, чего сама от себя не ожидала. Теперь поступаю на бюджет. Спасибо вам за мою мечту!'
    },
    {
      name: 'Коржук Мария',
      date: '21.02.25',
      subject: 'Физика',
      tutor: 'Галина Семеновна',
      text: 'До этого мы занимались только в школе. В "Логосе" нравится индивидуальный подход к процессу. Ребенок доволен, значит, все хорошо. Ребенок заинтересован. Нравится преподаватель. В школе нет такого индивидуального подхода, здесь все более глубоко.',
      full: 'До этого мы занимались только в школе, и подготовки к экзамену явно не хватало. В "Логосе" понравился индивидуальный подход к процессу: преподаватель видел слабые места, объяснял спокойно и возвращался к сложным темам столько раз, сколько было нужно. Ребенок доволен, заинтересован и стал увереннее решать задания. В школе нет такого глубокого индивидуального подхода, а здесь все разобрали намного подробнее.'
    },
    {
      name: 'Полина Грабельникова',
      date: '21.02.25',
      subject: 'История и обществознание',
      tutor: 'Ольга Викторовна',
      text: 'История-88 Обществознание-76. Я очень рада, что обучалась в вашем Центре. Особенно благодарна учителям, которые всегда помогали нам в трудных ситуациях. Результатом в целом я довольна, но по обществознанию немного не добрала.',
      full: 'Я очень рада, что обучалась в вашем центре. Особенно благодарна учителям, которые всегда помогали нам в трудных ситуациях, поддерживали и объясняли непонятные темы простыми словами. По истории я набрала 88 баллов, по обществознанию 76. Результатом в целом довольна, а главное - теперь понимаю, как правильно готовиться и распределять силы перед экзаменом.'
    },
    {
      name: 'Екатерина Соколова',
      date: '12.03.25',
      text: 'Понравилось, что занятия проходили спокойно и понятно. На каждом этапе было видно, какие темы уже получаются, а где еще нужно потренироваться. Это очень помогло перед тестированием.'
    },
    {
      name: 'Даниил Мороз',
      date: '18.03.25',
      text: 'Пришел с большими пробелами по физике, но за несколько месяцев разобрал основные темы и начал решать задачи без страха. Отдельное спасибо за пробные варианты и разбор ошибок.'
    },
    {
      name: 'Алина Коваль',
      date: '02.04.25',
      text: 'Очень удобный формат подготовки. Преподаватель объяснял сложные темы простым языком, а домашние задания помогали закрепить материал. На экзамене чувствовала себя гораздо увереннее.'
    },
    {
      name: 'Максим Воронов',
      date: '16.04.25',
      text: 'Записался на подготовку по математике после первого репетиционного тестирования. Преподаватель помог разобраться с заданиями, на которых я постоянно терял баллы. Итоговый результат оказался выше, чем я ожидал.'
    },
    {
      name: 'София Левченко',
      date: '28.04.25',
      text: 'Спасибо преподавателю английского языка за поддержку и понятные объяснения. Особенно полезными были регулярные тесты и работа над ошибками. На занятиях всегда было интересно и комфортно.'
    }
  ],
  en: [
    {
      name: 'Anastasia Alieva',
      date: '21.02.25',
      subject: 'Mathematics',
      tutor: 'Galina Mikhailovna',
      text: 'I would like to thank the teachers who supported me throughout the year. I used to struggle with mathematics, but now I understand it much better. The exams went well, and I am very grateful.',
      full: 'Hello! I want to express my great gratitude to the teachers of Logos who helped me throughout the year. When I first came to the center, mathematics felt impossible. Galina Mikhailovna found the right approach: she explained difficult topics in simple language, and we carefully reviewed every mistake in the tests. There was no pressure, only support. I solved many practice papers and finally felt confident. My result was 86 points, which I did not expect from myself. Thank you for helping me reach my dream!'
    },
    {
      name: 'Maria Korzhuk',
      date: '21.02.25',
      subject: 'Physics',
      tutor: 'Galina Semyonovna',
      text: 'Before Logos, we only studied at school. Here we like the individual approach. The child is engaged, confident, and interested. The lessons go deeper than regular school classes.',
      full: 'Before Logos, we only studied at school, and it was not enough for confident exam preparation. Here we liked the individual approach: the teacher noticed weak points, explained calmly, and returned to difficult topics when needed. The child became more engaged and confident. The lessons go deeper than regular school classes, and that made the preparation much more effective.'
    },
    {
      name: 'Polina Grabelnikova',
      date: '21.02.25',
      subject: 'History and Social Studies',
      tutor: 'Olga Viktorovna',
      text: 'History 88, Social Studies 76. I am glad I studied at this center. The teachers helped us in difficult moments, and overall I am happy with the result.',
      full: 'I am very glad I studied at Logos. I am especially grateful to the teachers who helped us in difficult moments, supported us, and explained complicated topics clearly. I scored 88 in History and 76 in Social Studies. Overall, I am happy with the result, and most importantly, I now understand how to prepare properly and manage my energy before an exam.'
    },
    {
      name: 'Ekaterina Sokolova',
      date: '12.03.25',
      text: 'The lessons were calm and clear. At every stage I could see which topics I already understood and where I still needed practice. It helped a lot before the test.'
    },
    {
      name: 'Daniil Moroz',
      date: '18.03.25',
      text: 'I came with major gaps in physics, but in a few months I understood the main topics and became less afraid of problems. Trial tests and error reviews were especially helpful.'
    },
    {
      name: 'Alina Koval',
      date: '02.04.25',
      text: 'The preparation format was very convenient. The teacher explained difficult topics in simple language, and homework helped me reinforce the material. I felt much more confident during the exam.'
    },
    {
      name: 'Maksim Voronov',
      date: '16.04.25',
      text: 'I joined the math course after my first trial test. The teacher helped me understand the tasks where I kept losing points. My final result was higher than I expected.'
    },
    {
      name: 'Sofia Levchenko',
      date: '28.04.25',
      text: 'Thank you to the English teacher for support and clear explanations. Regular tests and work on mistakes were especially useful. The lessons were always interesting and comfortable.'
    }
  ]
};

// После загрузки страницы запускаются все нужные модули интерфейса.
document.addEventListener('DOMContentLoaded', () => {
  clearSensitiveLocalStorage();
  if (isHomePage()) setLoading(true);
  applySettings();
  bindCommonUi();
  initSlider();
  initTeacherCarousel();
  initReviewsCarousel();
  initCourseQuiz();
  initResultsCases();
  initCoursesPage();
  initFavorites();
  initAuthForms();
  initRolePanel();
  translatePage();
  if (isHomePage()) setTimeout(() => setLoading(false), 420);
});

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function setCurrentUser(user) {
  const safeUser = sanitizeUser(user);
  if (safeUser) sessionStorage.setItem('currentUser', JSON.stringify(safeUser));
  else sessionStorage.removeItem('currentUser');
}

function clearSensitiveLocalStorage() {
  localStorage.removeItem('registeredUsers');
  const oldUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; }
  })();
  if (oldUser && !sessionStorage.getItem('currentUser')) setCurrentUser(oldUser);
  localStorage.removeItem('currentUser');
}

// Загружает данные с JSON Server, а если сервер выключен, берет данные из data/db.json.
async function fetchData(resource, params = '') {
  setLoading(true);
  try {
    const response = await fetch(`${API_URL}/${resource}${params}`);
    if (!response.ok) throw new Error('API unavailable');
    return await response.json();
  } catch (error) {
    const fallback = await fetch(FALLBACK_DB).then((res) => res.json());
    let data = fallback[resource] || [];
    if (resource === 'courses') data = filterFallbackCourses(data);
    return data;
  } finally {
    setLoading(false);
  }
}

function getNextNumericId(items) {
  const ids = items.map((item) => Number(item.id)).filter(Number.isFinite);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

async function readUserItems(collection) {
  const user = getCurrentUser();
  if (!user) return [];
  try {
    const response = await fetch(`${API_URL}/${collection}?userId=${user.id}`);
    if (!response.ok) throw new Error('API unavailable');
    return await response.json();
  } catch {
    return [];
  }
}

async function writeUserItem(collection, courseId) {
  const user = getCurrentUser();
  if (!user) return;
  const item = {
    id: `${user.id}-${courseId}`,
    userId: user.id,
    courseId
  };
  try {
    await removeUserItem(collection, courseId);
    const response = await fetch(`${API_URL}/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!response.ok) throw new Error('API unavailable');
  } catch {
    // localStorage остается запасным вариантом, если JSON Server не запущен.
  }
}

async function removeUserItem(collection, courseId) {
  const user = getCurrentUser();
  if (!user) return;
  try {
    const response = await fetch(`${API_URL}/${collection}?userId=${user.id}&courseId=${courseId}`);
    if (!response.ok) throw new Error('API unavailable');
    const items = await response.json();
    await Promise.all(items.map((item) => fetch(`${API_URL}/${collection}/${encodeURIComponent(item.id)}`, { method: 'DELETE' })));
  } catch {
    // Удаление локальной копии сохраняет интерфейс согласованным даже без сервера.
  }
}

async function clearUserItems(collection) {
  const user = getCurrentUser();
  if (!user) return;
  try {
    const response = await fetch(`${API_URL}/${collection}?userId=${user.id}`);
    if (!response.ok) throw new Error('API unavailable');
    const items = await response.json();
    await Promise.all(items.map((item) => fetch(`${API_URL}/${collection}/${encodeURIComponent(item.id)}`, { method: 'DELETE' })));
  } catch {
    // Локальная копия очищается через saveCart/saveFavorites.
  }
}

function getLocalIds(key) {
  const user = getCurrentUser();
  if (!user) return [];
  try {
    return JSON.parse(localStorage.getItem(`${key}_${user.id}`) || '[]').map(Number).filter(Boolean);
  } catch {
    return [];
  }
}

function saveLocalIds(key, ids) {
  const user = getCurrentUser();
  if (!user) return;
  const unique = [...new Set(ids.map(Number).filter(Boolean))];
  localStorage.setItem(`${key}_${user.id}`, JSON.stringify(unique));
}

// Синхронизирует корзину и избранное пользователя между JSON Server и localStorage.
async function syncUserLists() {
  const user = getCurrentUser();
  if (!user || user.role === 'admin') {
    state.cart = [];
    state.favorites = [];
    return;
  }

  const [remoteCart, remoteFavorites] = await Promise.all([
    readUserItems('cartItems'),
    readUserItems('favorites')
  ]);
  const localCart = getLocalIds('cart');
  const localFavorites = getLocalIds('favorites');
  state.cart = [...new Set([...remoteCart.map((item) => Number(item.courseId)), ...localCart].filter(Boolean))];
  state.favorites = [...new Set([...remoteFavorites.map((item) => Number(item.courseId)), ...localFavorites].filter(Boolean))];
  saveLocalIds('cart', state.cart);
  saveLocalIds('favorites', state.favorites);

  await Promise.all([
    ...localCart.filter((id) => !remoteCart.some((item) => Number(item.courseId) === Number(id))).map((id) => writeUserItem('cartItems', id)),
    ...localFavorites.filter((id) => !remoteFavorites.some((item) => Number(item.courseId) === Number(id))).map((id) => writeUserItem('favorites', id))
  ]);
}

function filterFallbackCourses(data) {
  const search = document.querySelector('#search')?.value.trim().toLowerCase();
  const level = document.querySelector('#level')?.value;
  const format = document.querySelector('#format')?.value;
  let result = [...data];
  if (search) result = result.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(search));
  if (level) result = result.filter((item) => item.level === level);
  if (format) result = result.filter((item) => item.format === format);
  return result;
}

// Подключает общие обработчики: меню, модальные окна, язык, тему и настройки доступности.
function bindCommonUi() {
  document.querySelector('.burger')?.addEventListener('click', () => {
    document.querySelector('.site-nav')?.classList.toggle('open');
  });
  document.querySelectorAll('[data-setting]').forEach((control) => {
    const key = control.dataset.setting;
    if (control.type === 'checkbox') control.checked = state.settings[key];
    else control.value = state.settings[key];
    control.addEventListener('change', () => {
      state.settings[key] = control.type === 'checkbox' ? control.checked : control.value;
      localStorage.setItem(key, state.settings[key]);
      applySettings();
      translatePage();
      showToast(t('saved'));
    });
  });
  document.querySelector('[data-reset-settings]')?.addEventListener('click', () => {
    ['theme', 'lang', 'fontSize', 'visionScheme', 'hideImages'].forEach((key) => localStorage.removeItem(key));
    state.settings.theme = 'light';
    state.settings.lang = 'ru';
    state.settings.fontSize = 'normal';
    state.settings.visionScheme = 'light';
    state.settings.hideImages = false;
    syncSettingControls();
    applySettings();
    translatePage();
    showToast(t('cleared'));
    closeModal();
  });
  document.querySelectorAll('[data-modal-open]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.modalOpen));
  });
  document.querySelectorAll('[data-modal-close]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });
  document.querySelectorAll('[data-lang-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      state.settings.lang = button.dataset.langChoice;
      localStorage.setItem('lang', state.settings.lang);
      syncSettingControls();
      applySettings();
      translatePage();
      refreshAuthProfile();
      showToast(t('saved'));
    });
  });
  document.querySelectorAll('[data-theme-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      state.settings.theme = button.dataset.themeChoice;
      state.settings.visionScheme = 'light';
      localStorage.setItem('theme', state.settings.theme);
      localStorage.setItem('visionScheme', state.settings.visionScheme);
      syncSettingControls();
      applySettings();
      showToast(t('saved'));
    });
  });
}

// Применяет настройки темы, языка, размера шрифта и режима скрытия изображений к странице.
function applySettings() {
  if (!['light', 'dark', 'green'].includes(state.settings.visionScheme)) {
    state.settings.visionScheme = 'light';
    localStorage.setItem('visionScheme', state.settings.visionScheme);
  }
  document.documentElement.lang = state.settings.lang;
  document.documentElement.dataset.theme = state.settings.theme;
  document.documentElement.dataset.fontSize = state.settings.fontSize;
  document.documentElement.dataset.visionScheme = state.settings.visionScheme;
  document.documentElement.dataset.hideImages = state.settings.hideImages;
  updateImagePlaceholders();
  document.querySelectorAll('[data-lang-choice]').forEach((button) => {
    const active = button.dataset.langChoice === state.settings.lang;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-theme-choice]').forEach((button) => {
    const active = button.dataset.themeChoice === state.settings.theme;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const visionActive = state.settings.fontSize !== 'normal' || state.settings.visionScheme !== 'light' || state.settings.hideImages;
  document.querySelector('.ref-eye-button')?.setAttribute('aria-pressed', String(visionActive));
}

function isHomePage() {
  return document.body.classList.contains('reference-home')
    && ![...document.body.classList].some((className) => className.endsWith('-page'));
}

function updateImagePlaceholders() {
  document.querySelectorAll('.image-placeholder').forEach((node) => node.remove());
  if (!state.settings.hideImages) return;
  const label = state.settings.lang === 'en' ? 'Image disabled' : 'Изображение отключено';
  document.querySelectorAll('img, iframe').forEach((media) => {
    if (media.closest('.ref-header, .ref-footer, .settings-inner')) return;
    const text = media.getAttribute('alt') || media.getAttribute('title') || label;
    const placeholder = document.createElement('span');
    placeholder.className = 'image-placeholder';
    placeholder.textContent = `${label}: ${text}`;
    media.insertAdjacentElement('afterend', placeholder);
  });
}

function syncSettingControls() {
  document.querySelectorAll('[data-setting]').forEach((control) => {
    const key = control.dataset.setting;
    if (control.type === 'checkbox') control.checked = state.settings[key];
    else control.value = state.settings[key];
  });
}

// Вызывает перевод только для той страницы, которая сейчас открыта.
function translatePage() {
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  translateReferenceHome();
  translateAboutPage();
  translateTeachersPage();
  translateResultsPage();
  translateCoursesPage();
  translateContactsPage();
  translateErrorPage();
  translateAuthPage();
  syncFavoriteButtons();
}

function translateReferenceHome() {
  const page = document.querySelector('.reference-home');
  if (!page) return;
  const copy = referenceTranslations[state.settings.lang] || referenceTranslations.ru;
  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  };

  document.querySelectorAll('.ref-header .ref-nav a').forEach((link, index) => {
    link.textContent = copy.nav[index];
  });
  document.querySelectorAll('.ref-footer nav a').forEach((link, index) => {
    link.textContent = copy.nav[index];
  });
  document.querySelectorAll('.ref-feature strong').forEach((node, index) => {
    node.textContent = copy.features[index];
  });
  document.querySelectorAll('.ref-stats span').forEach((node, index) => {
    node.textContent = copy.statsLabels[index];
  });
  document.querySelectorAll('.ref-score-list span').forEach((node, index) => {
    node.textContent = copy.parentScores[index];
  });
  document.querySelectorAll('.ref-checks h3').forEach((node, index) => {
    node.textContent = copy.checkTitles[index];
  });
  document.querySelectorAll('.ref-checks p').forEach((node, index) => {
    node.textContent = copy.checkTexts[index];
  });
  document.querySelectorAll('.ref-course-list article h3').forEach((node, index) => {
    node.textContent = copy.courseTitles[index];
  });
  document.querySelectorAll('.ref-course-list article p').forEach((node, index) => {
    node.textContent = copy.courseDescriptions[index];
  });
  document.querySelectorAll('.ref-useful li').forEach((node, index) => {
    node.textContent = copy.usefulItems[index];
  });
  setText('.ref-account__text', copy.account);
  setText('.ref-hero h1', copy.hero);
  setText('.ref-hero__bottom p', copy.heroLead);
  setText('.ref-hero__bottom .ref-button', copy.details);
  setText('.ref-band--stats h2', copy.stats);
  setText('.ref-band--stats .ref-button', copy.details);
  setText('.ref-parents h2', copy.parents);
  setText('.ref-courses h2', copy.courses);
  setText('.ref-test-card h3', copy.testTitle);
  setText('.ref-test-card p', copy.testLead);
  setText('.ref-test-card button', copy.startTest);
  translateCourseQuiz();
  setText('.ref-course-list .ref-button', copy.allCourses);
  setText('.ref-useful h2', copy.useful);
  setText('.ref-useful .ref-button', copy.details);
  setText('.ref-teacher h2', copy.teachers);
  setText('.ref-teacher__info .ref-button', copy.teacherDetails);
  document.querySelectorAll('.ref-teacher__numbers span').forEach((node, index) => {
    node.textContent = copy.teacherStats[index];
  });
  document.querySelector('[data-teacher-carousel]')?.renderTeacher?.();
  setText('.ref-reviews h2', copy.reviews);
  setText('.ref-reviews__results-link', copy.resultsPage);
  setText('[data-review-modal-title]', copy.reviewModalTitle);
  setText('[data-review-modal-link]', copy.resultsPage);
  document.querySelector('[data-review-carousel]')?.renderReviews?.();
  setText('.ref-callout h2', copy.callout);
  setText('.ref-callout p', copy.calloutText);
  setText('.ref-callout .ref-button', copy.enroll);
}

function translateAboutPage() {
  const page = document.querySelector('.about-page');
  if (!page) return;
  const copy = referenceAboutTranslations[state.settings.lang] || referenceAboutTranslations.ru;
  const setText = (selector, value) => {
    const node = page.querySelector(selector);
    if (node) node.textContent = value;
  };

  document.title = state.settings.lang === 'en' ? 'About Logos' : 'О центре — Логос';
  setText('.about-breadcrumb a', copy.breadcrumb[0]);
  setText('.about-breadcrumb strong', copy.breadcrumb[1]);
  setText('.about-main-band h1', copy.title);
  document.querySelectorAll('.about-stats span').forEach((node, index) => {
    node.textContent = copy.stats[index];
  });
  document.querySelectorAll('.about-story-copy p').forEach((node, index) => {
    node.textContent = copy.story[index];
  });
  document.querySelectorAll('.about-testing p').forEach((node, index) => {
    node.textContent = copy.testing[index];
  });
  setText('.about-testing .ref-button', copy.testingButton);
  setText('.about-benefits h2', copy.benefitsTitle);
  document.querySelectorAll('.about-benefits li').forEach((node, index) => {
    node.textContent = copy.benefits[index];
  });
  setText('.about-benefits aside', copy.aside);
}

function translateTeachersPage() {
  const page = document.querySelector('.teachers-page');
  if (!page) return;
  const copy = referenceTeachersPageTranslations[state.settings.lang] || referenceTeachersPageTranslations.ru;
  const setText = (selector, value) => {
    const node = page.querySelector(selector);
    if (node) node.textContent = value;
  };

  document.title = state.settings.lang === 'en' ? 'Teachers - Logos' : 'Преподаватели - Логос';
  setText('.teachers-breadcrumb a', copy.breadcrumb[0]);
  setText('.teachers-breadcrumb strong', copy.breadcrumb[1]);
  setText('.teachers-band h1', copy.title);
  Object.entries(copy).forEach(([key, value]) => {
    const node = page.querySelector(`[data-teachers-label="${key}"]`);
    if (node) node.textContent = value;
  });
  setText('[data-teacher-experience-text]', copy.experienceText);
  setText('[data-teacher-center-text]', copy.centerText);
}

function translateResultsPage() {
  const page = document.querySelector('.results-page');
  if (!page) return;
  const copy = referenceResultsTranslations[state.settings.lang] || referenceResultsTranslations.ru;
  const setText = (selector, value) => {
    const node = page.querySelector(selector);
    if (node) node.textContent = value;
  };

  document.title = state.settings.lang === 'en' ? 'Results - Logos' : 'Результаты - Логос';
  setText('.results-breadcrumb a', copy.breadcrumb[0]);
  setText('.results-breadcrumb strong', copy.breadcrumb[1]);
  setText('.results-hero h1', copy.heroTitle);
  const heroTitle = page.querySelector('.results-hero h1');
  if (heroTitle) {
    heroTitle.innerHTML = `${copy.heroTitle} <span>${copy.heroAccent}</span>`;
  }
  document.querySelectorAll('.results-hero__stats span').forEach((node, index) => {
    node.textContent = copy.stats[index];
  });
  setText('.results-universities h2', copy.universities);
  setText('.student-cases h2', copy.cases);
  setText('.results-cta h2', copy.ctaTitle);
  setText('.results-cta p', copy.ctaText);
  setText('.results-cta .ref-button', copy.enroll);
  document.querySelector('[data-results-cases]')?.renderCases?.();
}

function translateCoursesPage() {
  const page = document.querySelector('.courses-page');
  if (!page) return;
  const copy = referenceCoursesPageTranslations[state.settings.lang] || referenceCoursesPageTranslations.ru;
  const setText = (selector, value) => {
    const node = page.querySelector(selector);
    if (node) node.textContent = value;
  };

  document.title = copy.title;
  setText('.courses-breadcrumb a', copy.breadcrumb[0]);
  setText('.courses-breadcrumb strong', copy.breadcrumb[1]);
  setText('.courses-catalog h1', copy.catalogTitle);
  setText('.course-filter-panel h2', copy.filters);
  setText('[data-courses-reset]', copy.reset);
  setText('.course-subjects p', copy.subject);
  setText('.course-price-row label:first-child span', copy.priceFrom);
  setText('.course-price-row label:last-child span', copy.priceTo);
  setText('[data-auth-required-title]', copy.authRequiredTitle);
  setText('[data-auth-required-text]', copy.authRequiredText);
  setText('[data-auth-required-login]', copy.authRequiredLogin);
  setText('[data-auth-required-register]', copy.authRequiredRegister);
  page.querySelector('.course-select > span').textContent = copy.format;

  const search = page.querySelector('#search');
  if (search) search.placeholder = copy.searchPlaceholder;
  const formatOptions = page.querySelectorAll('#format option');
  [copy.any, copy.offline, copy.online].forEach((text, index) => {
    if (formatOptions[index]) formatOptions[index].textContent = text;
  });
  page.querySelectorAll('.course-subjects label span').forEach((node, index) => {
    if (copy.subjects[index]) node.textContent = copy.subjects[index];
  });
  const learningTitle = page.querySelector('.course-learning h2');
  if (learningTitle) learningTitle.innerHTML = copy.learningTitle.replace('\n', '<br>');
  page.querySelectorAll('.course-learning article').forEach((article, index) => {
    const block = copy.blocks[index];
    if (!block) return;
    const heading = article.querySelector('h3');
    const paragraph = article.querySelector('p');
    if (heading) heading.textContent = block[0];
    if (paragraph) paragraph.textContent = block[1];
  });
  if (page.querySelector('#coursesList') && state.courses.length) renderCourses();
}

function translateContactsPage() {
  const page = document.querySelector('.contacts-page');
  if (!page) return;
  const copy = referenceContactsTranslations[state.settings.lang] || referenceContactsTranslations.ru;
  const setText = (selector, value) => {
    const node = page.querySelector(selector);
    if (node) node.textContent = value;
  };

  document.title = copy.title;
  setText('.contacts-breadcrumb a', copy.breadcrumb[0]);
  setText('.contacts-breadcrumb strong', copy.breadcrumb[1]);
  setText('.contacts-main h1', copy.heading);
  setText('.contacts-lead', copy.lead);
  page.querySelectorAll('.contacts-cards article').forEach((card, index) => {
    const label = card.querySelector('span');
    const value = card.querySelector('strong');
    if (label) label.textContent = copy.labels[index];
    if (value) value.innerHTML = (copy.values[index] || '').replace(/\n/g, '<br>');
  });
}

function translateErrorPage() {
  const page = document.querySelector('.error-page');
  if (!page) return;
  const copy = referenceErrorTranslations[state.settings.lang] || referenceErrorTranslations.ru;
  document.title = copy.title;
  const heading = page.querySelector('.error-card h1');
  const text = page.querySelector('.error-card p');
  const links = page.querySelectorAll('.error-actions a');
  if (heading) heading.textContent = copy.heading;
  if (text) text.textContent = copy.text;
  if (links[0]) links[0].textContent = copy.home;
  if (links[1]) links[1].textContent = copy.courses;
}

function translateAuthPage() {
  const page = document.querySelector('.auth-page');
  if (!page) return;
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  document.title = document.querySelector('#registerForm') ? copy.registerTitle : copy.loginTitle;
  page.querySelectorAll('[data-auth]').forEach((node) => {
    const value = copy[node.dataset.auth];
    if (value) node.textContent = value;
  });
  syncPasswordToggleLabels();
  const user = getCurrentUser();
  if (user) renderAuthProfile(user);
  else initRolePanel();
}

function t(key) {
  return dict[state.settings.lang]?.[key] || dict.ru[key] || key;
}

function initSlider() {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;
  const slides = [...slider.querySelectorAll('.slide')];
  let index = 0;
  const show = (next) => {
    slides[index].classList.remove('active');
    index = (next + slides.length) % slides.length;
    slides[index].classList.add('active');
  };
  slider.querySelector('[data-next]')?.addEventListener('click', () => show(index + 1));
  slider.querySelector('[data-prev]')?.addEventListener('click', () => show(index - 1));
  setInterval(() => show(index + 1), 5000);
}

// Управляет каруселью преподавателей и подставляет данные выбранного преподавателя.
function initTeacherCarousel() {
  const carousel = document.querySelector('[data-teacher-carousel]');
  if (!carousel) return;

  const image = carousel.querySelector('[data-teacher-image]');
  const surname = carousel.querySelector('[data-teacher-surname]');
  const name = carousel.querySelector('[data-teacher-name]');
  const subject = carousel.querySelector('[data-teacher-subject]');
  const experience = carousel.querySelector('[data-teacher-experience]');
  const center = carousel.querySelector('[data-teacher-center]');
  const educationYears = carousel.querySelector('[data-teacher-education-years]');
  const educationUnit = carousel.querySelector('[data-teacher-education-unit]');
  const educationText = carousel.querySelector('[data-teacher-education-text]');
  const experienceUnit = carousel.querySelector('[data-teacher-experience-unit]');
  const centerUnit = carousel.querySelector('[data-teacher-center-unit]');
  const achievements = carousel.querySelector('[data-teacher-achievements]');
  const results = carousel.querySelector('[data-teacher-results]');
  const thumbs = carousel.querySelector('[data-teacher-thumbs]');
  let index = 0;
  const getTeachers = () => referenceTeachers[state.settings.lang] || referenceTeachers.ru;

  const render = () => {
    const teachers = getTeachers();
    const teacher = teachers[index];
    const achievementIcons = ['images/vector-teacher.png', 'images/vector-teacher2.png', 'images/vector-teacher3.png'];
    image.src = teacher.image;
    image.alt = teacher.alt;
    surname.textContent = teacher.surname;
    name.textContent = teacher.name;
    subject.textContent = teacher.subject;
    experience.textContent = teacher.experience;
    center.textContent = teacher.center;
    if (educationYears) educationYears.textContent = teacher.educationYears;
    if (educationUnit) educationUnit.textContent = teacher.educationUnit;
    if (educationText) educationText.textContent = teacher.educationText;
    if (experienceUnit) experienceUnit.textContent = state.settings.lang === 'en' ? 'years' : 'лет';
    if (centerUnit) centerUnit.textContent = state.settings.lang === 'en' ? 'years' : 'лет';
    if (achievements) {
      achievements.innerHTML = teacher.achievements.map((item, itemIndex) => `
        <div>
          <img src="${achievementIcons[itemIndex] || achievementIcons[0]}" alt="" aria-hidden="true">
          <strong>${item}</strong>
        </div>
      `).join('');
    }
    if (results) {
      results.innerHTML = teacher.results.map((item) => {
        const parts = item.split(' ');
        const value = parts.shift();
        return `<div><strong>${value}</strong><span>${parts.join(' ')}</span></div>`;
      }).join('');
    }
    if (thumbs) {
      thumbs.innerHTML = teachers.map((item, itemIndex) => `
        <button class="${itemIndex === index ? 'is-active' : ''}" type="button" data-teacher-thumb="${itemIndex}" aria-label="${item.name}">
          <img src="${item.image}" alt="">
        </button>
      `).join('');
      thumbs.querySelectorAll('[data-teacher-thumb]').forEach((button) => {
        button.addEventListener('click', () => show(Number(button.dataset.teacherThumb)));
      });
    }
  };

  const show = (next) => {
    const teachers = getTeachers();
    index = (next + teachers.length) % teachers.length;
    render();
  };

  carousel.querySelector('[data-teacher-prev]')?.addEventListener('click', () => show(index - 1));
  carousel.querySelector('[data-teacher-next]')?.addEventListener('click', () => show(index + 1));
  carousel.renderTeacher = render;
}

// Рисует отзывы на главной странице и открывает полный текст в модальном окне.
function initReviewsCarousel() {
  const carousel = document.querySelector('[data-review-carousel]');
  if (!carousel) return;

  const list = carousel.querySelector('[data-review-list]');
  const dots = carousel.querySelector('[data-review-dots]');
  let page = 0;
  let publishedReviews = [];

  const getFallbackReviews = () => referenceReviews[state.settings.lang] || referenceReviews.ru;
  const getReviews = () => publishedReviews.length ? publishedReviews : getFallbackReviews();
  const getPerPage = () => window.matchMedia('(max-width: 560px)').matches ? 1 : 3;
  const getPages = () => Math.ceil(getReviews().length / getPerPage());

  const loadPublishedReviews = async () => {
    const [reviews, users, courses] = await Promise.all([getAllReviews(), fetchData('users'), getAllCourses()]);
    publishedReviews = reviews
      .filter((review) => review.status === 'published')
      .map((review) => {
        const user = users.find((item) => Number(item.id) === Number(review.userId));
        const course = courses.find((item) => Number(item.id) === Number(review.courseId));
        const courseTitle = course ? getCourseDisplayTitle(course) : (state.settings.lang === 'en' ? 'Course' : 'Курс');
        return {
          name: user?.name || (state.settings.lang === 'en' ? 'Logos student' : 'Ученик Логос'),
          date: formatReviewDate(review.createdAt),
          subject: courseTitle,
          tutor: getCourseTutorName(course),
          text: review.text,
          full: review.text
        };
      });
    render();
  };

  const render = () => {
    const reviews = getReviews();
    const copy = referenceTranslations[state.settings.lang] || referenceTranslations.ru;
    const perPage = getPerPage();
    const pages = getPages();
    page = Math.min(page, pages - 1);
    const visibleReviews = reviews.slice(page * perPage, page * perPage + perPage);

    list.innerHTML = visibleReviews.map((review) => `
      <article>
        <h3>${review.name}</h3>
        <time>${review.date}</time>
        <p>${review.text}</p>
        <button type="button" data-review-full="${reviews.indexOf(review)}">${copy.readFull}</button>
      </article>
    `).join('');

    dots.innerHTML = Array.from({ length: pages }, (_, index) => `
      <button class="${index === page ? 'active' : ''}" type="button" data-review-dot="${index}" aria-label="Показать страницу отзывов ${index + 1}"></button>
    `).join('');
  };

  const show = (nextPage) => {
    page = (nextPage + getPages()) % getPages();
    render();
  };

  dots.addEventListener('click', (event) => {
    const dot = event.target.closest('[data-review-dot]');
    if (!dot) return;
    show(Number(dot.dataset.reviewDot));
  });
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-review-full]');
    if (!button) return;
    const review = getReviews()[Number(button.dataset.reviewFull)];
    const copy = referenceTranslations[state.settings.lang] || referenceTranslations.ru;
    const defaultTutor = state.settings.lang === 'en' ? 'Logos teacher' : 'Преподаватель Логос';
    if (!review) return;
    document.querySelector('[data-review-modal-name]').textContent = review.name;
    document.querySelector('[data-review-modal-subject]').textContent = `${copy.reviewSubject}: ${review.subject || 'Математика'}`;
    document.querySelector('[data-review-modal-tutor]').textContent = `${copy.reviewTutor}: ${review.tutor || defaultTutor}`;
    document.querySelector('[data-review-modal-text]').textContent = `«${review.full || review.text}»`;
    openModal('review');
  });
  window.addEventListener('resize', debounce(render, 150));
  carousel.renderReviews = () => {
    render();
    loadPublishedReviews();
  };
  render();
  loadPublishedReviews();
}

function translateCourseQuiz() {
  const form = document.querySelector('[data-course-quiz]');
  if (!form) return;
  const copy = courseQuizCopy[state.settings.lang] || courseQuizCopy.ru;
  document.querySelector('[data-quiz="title"]').textContent = copy.title;
  form.querySelector('[data-quiz="goal"]').textContent = copy.goal;
  form.querySelector('[data-quiz="format"]').textContent = copy.format;
  form.querySelector('[data-quiz="level"]').textContent = copy.level;
  form.querySelector('[data-quiz="submit"]').textContent = copy.submit;
  Object.entries(copy.options).forEach(([key, value]) => {
    const node = form.querySelector(`[data-quiz-option="${key}"]`);
    if (node) node.textContent = value;
  });
  const result = form.querySelector('[data-quiz-result]');
  if (result && !result.hidden) renderCourseQuizResult(form);
}

// Запускает мини-тест, который подбирает подходящий курс по ответам пользователя.
function initCourseQuiz() {
  const form = document.querySelector('[data-course-quiz]');
  if (!form) return;
  form.addEventListener('change', () => {
    const result = form.querySelector('[data-quiz-result]');
    if (result) result.hidden = true;
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderCourseQuizResult(form);
  });
}

function renderCourseQuizResult(form) {
  const copy = courseQuizCopy[state.settings.lang] || courseQuizCopy.ru;
  const data = Object.fromEntries(new FormData(form).entries());
  const result = form.querySelector('[data-quiz-result]');
  if (!result) return;
  if (!data.goal) {
    result.hidden = false;
    result.innerHTML = `<p>${copy.required}</p>`;
    return;
  }
  const subject = copy.subjects[data.goal] || copy.subjects.math;
  const format = copy.options[data.format] || copy.options.offline;
  const level = copy.options[data.level] || copy.options.base;
  const link = `courses.html?subject=${encodeURIComponent(data.goal)}`;
  result.hidden = false;
  result.innerHTML = `
    <strong>${copy.resultTitle} ${subject}</strong>
    <p>${copy.resultText.replace('{format}', format).replace('{level}', level)}</p>
    <a class="ref-button" href="${link}">${copy.openCourses}</a>
  `;
}

// Делает горизонтальную ленту кейсов учеников на странице результатов.
function initResultsCases() {
  const carousel = document.querySelector('[data-results-cases]');
  if (!carousel) return;

  const list = carousel.querySelector('[data-cases-list]');
  const getCases = () => resultCases[state.settings.lang] || resultCases.ru;
  const getCopy = () => referenceResultsTranslations[state.settings.lang] || referenceResultsTranslations.ru;
  const getStep = () => {
    const card = list.querySelector('.student-case');
    if (!card) return list.clientWidth;
    const styles = getComputedStyle(list);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const render = () => {
    const cases = getCases();
    const copy = getCopy();
    list.innerHTML = cases.map((item) => `
      <article class="student-case">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <mark>${item.subject}</mark>
          <div class="student-case__scores">
            <div><strong>${item.test}</strong><span>${copy.testLabel}</span></div>
            <div><strong>${item.exam}</strong><span>${copy.examLabel}</span></div>
          </div>
        </div>
      </article>
    `).join('');
  };

  const scroll = (direction) => {
    const maxScroll = list.scrollWidth - list.clientWidth - 4;
    if (direction > 0 && list.scrollLeft >= maxScroll) {
      list.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (direction < 0 && list.scrollLeft <= 4) {
      list.scrollTo({ left: list.scrollWidth, behavior: 'smooth' });
      return;
    }
    list.scrollBy({ left: getStep() * direction, behavior: 'smooth' });
  };

  carousel.querySelector('[data-cases-prev]')?.addEventListener('click', () => scroll(-1));
  carousel.querySelector('[data-cases-next]')?.addEventListener('click', () => scroll(1));
  let autoplay = setInterval(() => scroll(1), 5000);
  carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
  carousel.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => scroll(1), 5000);
  });
  window.addEventListener('resize', debounce(() => {
    list.scrollTo({ left: 0 });
  }, 150));
  carousel.renderCases = render;
  render();
}

// Инициализирует каталог: загружает курсы, подключает фильтры и пагинацию.
async function initCoursesPage() {
  const list = document.querySelector('#coursesList');
  if (!list) return;
  const form = document.querySelector('#filters');
  const params = new URLSearchParams(window.location.search);
  const subjectFromUrl = params.get('subject');
  const searchFromUrl = params.get('q');
  if (subjectFromUrl) {
    const subjectControl = [...(form?.querySelectorAll('input[name="subject"]') || [])].find((control) => control.value === subjectFromUrl);
    if (subjectControl) subjectControl.checked = true;
  }
  if (searchFromUrl) {
    const searchControl = form?.querySelector('#search');
    if (searchControl) searchControl.value = searchFromUrl;
  }
  const load = async () => {
    const params = buildCourseQuery();
    const courses = await fetchData('courses', params);
    state.courses = filterCourses(filterDeletedCourses(mergeLocalCourseEdits(uniqueCourses([...courses, ...getLocalCreatedCourses()]))));
    state.page = 1;
    renderCourses();
  };
  form?.addEventListener('input', debounce(load, 250));
  form?.addEventListener('change', load);
  document.querySelector('[data-courses-reset]')?.addEventListener('click', () => {
    form?.reset();
    load();
  });
  await syncUserLists();
  await load();
}

function buildCourseQuery() {
  const query = new URLSearchParams();
  const search = document.querySelector('#search')?.value.trim();
  const level = document.querySelector('#level')?.value;
  const format = document.querySelector('#format')?.value;
  if (search) query.set('q', search);
  if (level) query.set('level', level);
  if (format) query.set('format', format);
  return query.toString() ? `?${query.toString()}` : '';
}

// Применяет поиск, предметы, формат и диапазон цены к списку курсов.
function filterCourses(courses) {
  const subjects = [...document.querySelectorAll('input[name="subject"]:checked')].map((input) => input.value);
  const priceMin = Number(document.querySelector('#priceMin')?.value || 0);
  const priceMax = Number(document.querySelector('#priceMax')?.value || 0);
  return courses.filter((course) => {
    const subjectMatches = !subjects.length || subjects.includes(course.subject);
    const minMatches = !priceMin || course.price >= priceMin;
    const maxMatches = !priceMax || course.price <= priceMax;
    return subjectMatches && minMatches && maxMatches;
  });
}

// Отрисовывает текущую страницу каталога и кнопки пагинации.
function renderCourses() {
  const list = document.querySelector('#coursesList');
  const pagination = document.querySelector('#pagination');
  if (!list || !pagination) return;
  const start = (state.page - 1) * state.perPage;
  const pageItems = state.courses.slice(start, start + state.perPage);
  const copy = referenceCoursesPageTranslations[state.settings.lang] || referenceCoursesPageTranslations.ru;
  list.innerHTML = pageItems.map(courseCard).join('') || `<p>${copy.noCourses}</p>`;
  list.querySelectorAll('[data-enroll]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.enroll)));
  });
  const pages = Math.max(1, Math.ceil(state.courses.length / state.perPage));
  pagination.innerHTML = Array.from({ length: pages }, (_, i) => `<button class="${i + 1 === state.page ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>`).join('');
  pagination.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      state.page = Number(button.dataset.page);
      renderCourses();
    });
  });
}

// Формирует HTML одной карточки курса в каталоге.
function courseCard(course) {
  const copy = referenceCoursesPageTranslations[state.settings.lang] || referenceCoursesPageTranslations.ru;
  const title = getCourseDisplayTitle(course);
  const description = getCourseDisplayDescription(course);
  const formatLabel = course.format === 'online' ? copy.online : copy.offline;
  const price = course.price ? `${course.price} BYN` : 'от 95 BYN';
  const isFavorite = getFavorites().includes(Number(course.id));
  const favoriteLabel = state.settings.lang === 'en'
    ? (isFavorite ? 'Remove from favorites' : 'Add to favorites')
    : (isFavorite ? 'Убрать из избранного' : 'Добавить в избранное');
  return `
    <article class="course-card">
      <h3>${title}</h3>
      <p>${description}</p>
      <strong>${price}</strong>
      <span>${formatLabel}</span>
      <button class="course-card__button" data-enroll="${course.id}" type="button">${state.settings.lang === 'en' ? 'To cart' : 'В корзину'}</button>
      <button class="course-card__favorite favorite-btn ${isFavorite ? 'is-active' : ''}" data-favorite="${course.id}" type="button" aria-label="${favoriteLabel}">${isFavorite ? '♥' : '♡'}</button>
    </article>`;
}

// Загружает избранные курсы текущего пользователя.
function initFavorites() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-favorite]');
    if (!button) return;
    event.preventDefault();
    toggleFavorite(Number(button.dataset.favorite));
  });
  syncFavoriteButtons();
}

function getFavorites() {
  const user = getCurrentUser();
  if (!user) return [];
  if (Array.isArray(state.favorites) && state.favorites.length) return [...state.favorites];
  return getLocalIds('favorites');
}

function saveFavorites(favorites) {
  const user = getCurrentUser();
  if (!user) return;
  const unique = [...new Set(favorites.map(Number).filter(Boolean))];
  state.favorites = unique;
  saveLocalIds('favorites', unique);
}

// Добавляет или убирает курс из избранного; администратору эта функция запрещена.
async function toggleFavorite(courseId) {
  const user = getCurrentUser();
  if (!user) {
    openModal('authRequired');
    showToast(state.settings.lang === 'en' ? 'Sign in before adding favorites' : 'Сначала войдите или зарегистрируйтесь');
    return;
  }
  if (user.role === 'admin') {
    showToast(state.settings.lang === 'en' ? 'Favorites are available for students only' : 'Избранное доступно только ученику');
    return;
  }
  const favorites = getFavorites();
  const hadFavorite = favorites.includes(courseId);
  const next = hadFavorite
    ? favorites.filter((id) => id !== courseId)
    : [...favorites, courseId];
  saveFavorites(next);
  if (hadFavorite) await removeUserItem('favorites', courseId);
  else await writeUserItem('favorites', courseId);
  syncFavoriteButtons();
  refreshStudentDashboard();
  showToast(state.settings.lang === 'en'
    ? (hadFavorite ? 'Removed from favorites' : 'Added to favorites')
    : (hadFavorite ? 'Курс убран из избранного' : 'Курс добавлен в избранное'));
}

function syncFavoriteButtons() {
  const favorites = getFavorites();
  document.querySelectorAll('[data-favorite]').forEach((button) => {
    const active = favorites.includes(Number(button.dataset.favorite));
    button.classList.toggle('is-active', active);
    button.textContent = active ? '♥' : '♡';
    button.setAttribute('aria-label', state.settings.lang === 'en'
      ? (active ? 'Remove from favorites' : 'Add to favorites')
      : (active ? 'Убрать из избранного' : 'Добавить в избранное'));
  });
}

function getCart() {
  const user = getCurrentUser();
  if (!user) return [];
  if (Array.isArray(state.cart) && state.cart.length) return [...state.cart];
  return getLocalIds('cart');
}

function saveCart(cart) {
  const user = getCurrentUser();
  if (!user) return;
  const unique = [...new Set(cart.map(Number).filter(Boolean))];
  state.cart = unique;
  saveLocalIds('cart', unique);
}

// Добавляет курс в корзину ученика; гостю показывает окно входа.
async function addToCart(courseId) {
  const user = getCurrentUser();
  if (!user) {
    openModal('authRequired');
    showToast(state.settings.lang === 'en' ? 'Sign in before adding courses' : 'Сначала войдите или зарегистрируйтесь');
    return;
  }
  if (user.role === 'admin') {
    showToast(state.settings.lang === 'en' ? 'Admins manage courses, students add them to cart' : 'Администратор управляет курсами, корзина доступна ученику');
    return;
  }
  const cart = getCart();
  if (cart.includes(courseId)) {
    showToast(state.settings.lang === 'en' ? 'Course is already in cart' : 'Курс уже в корзине');
    return;
  }
  saveCart([...cart, courseId]);
  await writeUserItem('cartItems', courseId);
  showToast(state.settings.lang === 'en' ? 'Course added to cart' : 'Курс добавлен в корзину');
  refreshStudentDashboard();
}

async function removeFromCart(courseId) {
  saveCart(getCart().filter((id) => id !== courseId));
  await removeUserItem('cartItems', courseId);
  refreshStudentDashboard();
}

// Возвращает курсы с учетом локальных правок администратора.
async function getAllCourses(includeDeleted = false) {
  const courses = state.courses.length >= 30
    ? mergeLocalCourseEdits(uniqueCourses([...state.courses, ...getLocalCreatedCourses()]))
    : mergeLocalCourseEdits(uniqueCourses([...(await fetchData('courses')), ...getLocalCreatedCourses()]));
  return includeDeleted ? courses : filterDeletedCourses(courses);
}

function uniqueCourses(courses) {
  const map = new Map();
  courses.forEach((course) => map.set(Number(course.id), course));
  return [...map.values()];
}

function getNextCourseId(courses) {
  const ids = new Set(courses.map((course) => Number(course.id)).filter(Number.isFinite));
  let id = 1;
  while (ids.has(id)) id += 1;
  return id;
}

function getLocalCourseEdits() {
  try { return JSON.parse(localStorage.getItem('courseEdits') || '{}'); } catch { return {}; }
}

function getLocalCreatedCourses() {
  try { return JSON.parse(localStorage.getItem('createdCourses') || '[]'); } catch { return []; }
}

function saveLocalCreatedCourses(courses) {
  localStorage.setItem('createdCourses', JSON.stringify(courses));
}

function getLocalDeletedCourseIds() {
  try {
    return JSON.parse(localStorage.getItem('deletedCourseIds') || '[]')
      .map((id) => Number(id))
      .filter(Number.isFinite);
  } catch {
    return [];
  }
}

function saveLocalDeletedCourseIds(ids) {
  localStorage.setItem('deletedCourseIds', JSON.stringify([...new Set(ids.map((id) => Number(id)).filter(Number.isFinite))]));
}

function filterDeletedCourses(courses) {
  const deletedIds = new Set(getLocalDeletedCourseIds());
  return courses.filter((course) => !deletedIds.has(Number(course.id)));
}

function saveLocalCourseEdit(course) {
  const edits = getLocalCourseEdits();
  edits[course.id] = { ...edits[course.id], ...course };
  localStorage.setItem('courseEdits', JSON.stringify(edits));
}

function mergeLocalCourseEdits(courses) {
  const edits = getLocalCourseEdits();
  return courses.map((course) => edits[course.id] ? { ...course, ...edits[course.id] } : course);
}

// Создает одиночную заявку на курс со статусом ожидания оплаты.
async function enroll(courseId) {
  const user = getCurrentUser();
  if (!user) {
    openModal('authRequired');
    return;
  }
  const enrollments = await getAllEnrollments();
  const item = { id: getNextNumericId(enrollments), userId: user.id, courseId, status: 'pending', paymentDate: new Date().toISOString().slice(0, 10) };
  try {
    await fetch(`${API_URL}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
  } catch (error) {
    localStorage.setItem('pendingEnrollment', String(courseId));
  }
  saveLocalEnrollmentMirror(item);
  showToast(t('requestSent'));
}

// Оформляет все курсы из корзины как заявки на обучение.
async function checkoutCart() {
  const user = getCurrentUser();
  if (!user) {
    openModal('authRequired');
    return;
  }
  const cart = getCart();
  if (!cart.length) {
    showToast(state.settings.lang === 'en' ? 'Cart is empty' : 'Корзина пустая');
    return;
  }
  const createdOrders = [];
  const existingEnrollments = await getAllEnrollments();
  let nextEnrollmentId = getNextNumericId(existingEnrollments);
  for (const courseId of cart) {
    const item = { id: nextEnrollmentId, userId: user.id, courseId, status: 'pending', paymentDate: '' };
    nextEnrollmentId += 1;
    createdOrders.push(item);
    try {
      const response = await fetch(`${API_URL}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) throw new Error('API unavailable');
      await response.json();
    } catch (error) {
      // Локальная копия сохраняет заявки ученика, если JSON Server выключен.
    }
  }
  saveLocalEnrollmentMirror(createdOrders);
  await clearUserItems('cartItems');
  saveCart([]);
  showToast(state.settings.lang === 'en' ? 'Order created' : 'Заказ оформлен');
  refreshStudentDashboard();
}

// Сохраняет локальную копию заявок, чтобы они не пропали при выключенном JSON Server.
function saveLocalEnrollmentMirror(items) {
  const list = Array.isArray(items) ? items : [items];
  const localOrders = JSON.parse(localStorage.getItem('localEnrollments') || '[]');
  const merged = [...localOrders];
  list.forEach((item) => {
    const index = merged.findIndex((order) => Number(order.id) === Number(item.id));
    if (index >= 0) merged[index] = { ...merged[index], ...item };
    else merged.push(item);
  });
  localStorage.setItem('localEnrollments', JSON.stringify(merged));
}

// Собирает заявки из сервера и локального хранилища, убирая дубли по id.
async function getAllEnrollments() {
  const remote = await fetchData('enrollments');
  const local = JSON.parse(localStorage.getItem('localEnrollments') || '[]');
  const remoteIds = new Set(remote.map((item) => Number(item.id)));
  return [...remote, ...local.filter((item) => !remoteIds.has(Number(item.id)))];
}

function getLocalReviews() {
  try { return JSON.parse(localStorage.getItem('localReviews') || '[]'); } catch { return []; }
}

function saveLocalReviews(reviews) {
  localStorage.setItem('localReviews', JSON.stringify(reviews));
}

function getLocalDeletedReviewIds() {
  try {
    return JSON.parse(localStorage.getItem('deletedReviewIds') || '[]')
      .map((id) => Number(id))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function saveLocalDeletedReviewIds(ids) {
  localStorage.setItem('deletedReviewIds', JSON.stringify([...new Set(ids.map(Number).filter(Boolean))]));
}

async function getAllReviews() {
  const remote = await fetchData('reviews');
  const local = getLocalReviews();
  const remoteIds = new Set(remote.map((item) => Number(item.id)));
  const activeDeletedIds = getLocalDeletedReviewIds().filter((id) => !remoteIds.has(Number(id)));
  if (activeDeletedIds.length !== getLocalDeletedReviewIds().length) saveLocalDeletedReviewIds(activeDeletedIds);
  const deletedIds = new Set(activeDeletedIds);
  return [
    ...remote,
    ...local.filter((item) => !remoteIds.has(Number(item.id)) && !deletedIds.has(Number(item.id)))
  ];
}

// Создает отзыв ученика и отправляет его администратору на модерацию.
async function createStudentReview({ userId, courseId, text }) {
  const allReviews = await getAllReviews();
  const review = {
    id: getNextCourseId(allReviews),
    userId: Number(userId),
    courseId: Number(courseId),
    text: text.trim(),
    status: 'pending',
    createdAt: new Date().toISOString().slice(0, 10)
  };
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!response.ok) throw new Error('API unavailable');
    return await response.json();
  } catch {
    const localReviews = getLocalReviews().filter((item) => Number(item.id) !== Number(review.id));
    saveLocalReviews([...localReviews, review]);
    return review;
  }
}

async function setReviewStatus(id, status) {
  const localReviews = getLocalReviews();
  const localIndex = localReviews.findIndex((item) => Number(item.id) === Number(id));
  if (localIndex >= 0) {
    localReviews[localIndex].status = status;
    saveLocalReviews(localReviews);
  }
  try {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('API unavailable');
  } catch {
    // Локальные отзывы обновляются даже тогда, когда JSON Server недоступен.
  }
}

async function deleteReview(id) {
  saveLocalReviews(getLocalReviews().filter((item) => Number(item.id) !== Number(id)));
  try {
    const response = await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('API unavailable');
    saveLocalDeletedReviewIds(getLocalDeletedReviewIds().filter((item) => Number(item) !== Number(id)));
  } catch {
    saveLocalDeletedReviewIds([...getLocalDeletedReviewIds(), id]);
    // Локальный список удаленных отзывов скрывает отзыв до следующего запуска JSON Server.
  }
}

function formatReviewDate(value) {
  const [year, month, day] = String(value || '').split('-');
  if (year && month && day) return `${day}.${month}.${year.slice(-2)}`;
  return value || '';
}

// Подключает формы входа и регистрации, если они есть на текущей странице.
function initAuthForms() {
  initRegistrationForm();
  initPasswordToggles();
  const loginForm = document.querySelector('#loginForm');
  if (loginForm) {
    clearLoginAutofill(loginForm);
    loginForm.addEventListener('submit', handleLogin);
  }
  initRolePanel();
}

// Кнопки "Показать" переключают видимость пароля в полях формы.
function initPasswordToggles() {
  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    if (button.dataset.ready === 'true') return;
    button.dataset.ready = 'true';
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      syncPasswordToggleLabels();
    });
  });
  syncPasswordToggleLabels();
}

function syncPasswordToggleLabels() {
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    const input = document.getElementById(button.dataset.passwordToggle);
    const visible = input?.type === 'text';
    const text = visible ? copy.hidePassword : copy.showPassword;
    button.textContent = text;
    button.setAttribute('aria-label', text);
  });
}

function clearLoginAutofill(form) {
  const clear = () => {
    if (getCurrentUser()) return;
    form.reset();
    form.querySelectorAll('input').forEach((input) => {
      input.value = '';
      input.defaultValue = '';
    });
  };
  clear();
  window.setTimeout(clear, 120);
}

// Настраивает регистрацию: генерацию никнейма, выбор пароля и live-проверку полей.
function initRegistrationForm() {
  const form = document.querySelector('#registerForm');
  if (!form) return;
  const submit = form.querySelector('#registerSubmit');
  const fullName = form.querySelector('#fullName');
  const nickname = form.querySelector('#nickname');
  const nicknameHelp = form.querySelector('[data-nickname-help]');
  const refresh = form.querySelector('[data-nickname-refresh]');
  const password = form.querySelector('#password');
  let nicknameAttempts = 0;
  const touched = new Set();
  const fieldMap = {
    name: 'name',
    phone: 'phone',
    email: 'email',
    birthDate: 'birthDate',
    nickname: 'nickname',
    password: 'password',
    agreementRead: 'agreement'
  };

  const refreshState = () => {
    togglePasswordMode(form);
    const errors = validateRegistration(Object.fromEntries(new FormData(form).entries()));
    renderRegistrationErrors(form, errors, touched, form.dataset.showErrors === 'true');
    if (submit) submit.disabled = Object.keys(errors).length > 0;
  };

  const makeNickname = () => {
    if (nicknameAttempts >= 5) {
      nickname.readOnly = false;
      nicknameHelp.textContent = 'Лимит генераций исчерпан: можно ввести никнейм вручную';
      nickname.focus();
      return;
    }
    nicknameAttempts += 1;
    nickname.value = generateNickname(fullName.value, nicknameAttempts);
    nicknameHelp.textContent = `Осталось генераций: ${Math.max(0, 5 - nicknameAttempts)}`;
    refreshState();
  };

  fullName?.addEventListener('input', () => {
    if (!nickname.value || nickname.readOnly) nickname.value = generateNickname(fullName.value, nicknameAttempts);
    refreshState();
  });
  refresh?.addEventListener('click', makeNickname);
  form.querySelectorAll('input, select').forEach((control) => {
    control.addEventListener('blur', () => {
      const key = fieldMap[control.name];
      if (key) touched.add(key);
      refreshState();
    });
    control.addEventListener('input', refreshState);
    control.addEventListener('change', () => {
      const key = fieldMap[control.name];
      if (control.type === 'checkbox' && key) touched.add(key);
      refreshState();
    });
  });
  form.querySelectorAll('input[name="passwordMode"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.value === 'auto' && radio.checked) {
        password.value = generatePassword();
        password.readOnly = true;
      }
      if (radio.value === 'manual' && radio.checked) {
        password.value = '';
        password.readOnly = false;
      }
      refreshState();
    });
  });
  nickname.value = generateNickname('', 0);
  refreshState();
  form.addEventListener('submit', handleRegister);
}

// Генерирует никнейм из ФИО и случайного числа.
function generateNickname(name, seed = 0) {
  const cleaned = (name || 'logos').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const base = cleaned.replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-|-$/g, '') || 'logos-student';
  return `${base}-${String(Date.now()).slice(-3)}${seed || ''}`;
}

// Создает случайный пароль для режима автоматической генерации.
function generatePassword() {
  const specials = '!@#$%';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const pool = upper + lower + digits + specials;
  const pick = (source) => source[Math.floor(Math.random() * source.length)];
  return pick(upper) + pick(lower) + pick(digits) + pick(specials) + Array.from({ length: 8 }, () => pick(pool)).join('');
}

function togglePasswordMode(form) {
  const mode = new FormData(form).get('passwordMode') || 'manual';
  const password = form.querySelector('#password');
  if (password) password.readOnly = mode === 'auto';
}

// Обрабатывает отправку формы регистрации и сохраняет нового ученика.
async function handleRegister(event) {
  event.preventDefault();
  const form = event.currentTarget;
  form.dataset.showErrors = 'true';
  const data = Object.fromEntries(new FormData(form).entries());
  const errors = validateRegistration(data);
  renderErrors(form, errors);
  if (Object.keys(errors).length) {
    showToast(t('invalidForm'));
    return;
  }
  const password = data.password;
  try {
    const users = await fetchData('users');
    if (users.some((item) => item.email?.toLowerCase() === data.email.trim().toLowerCase())) {
      renderErrors(form, { email: state.settings.lang === 'en' ? 'This email is already registered' : 'Этот email уже зарегистрирован' });
      showToast(t('invalidForm'));
      return;
    }
    const user = { id: getNextNumericId(users), name: data.name.trim(), email: data.email.trim(), phone: data.phone, birthDate: data.birthDate, nickname: data.nickname, role: 'student', courses: [], password };
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error('API unavailable');
    setCurrentUser(user);
    showToast(t('registerSuccess'));
    renderAuthProfile(sanitizeUser(user));
  } catch {
    showToast(state.settings.lang === 'en' ? 'Start JSON Server before registration' : 'Запустите JSON Server перед регистрацией');
    return;
  }
}

// Проверяет ФИО, телефон, email, возраст, пароль и согласие пользователя.
function validateRegistration(data) {
  const errors = {};
  const byPhone = /^\+375(25|29|33|44)\d{7}$/;
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const age = getAge(data.birthDate);
  const password = data.password || '';
  const nameParts = (data.name || '').trim().split(/\s+/).filter(Boolean);
  if (nameParts.length < 2) errors.name = 'Введите фамилию и имя';
  if (!byPhone.test((data.phone || '').replace(/\s|-/g, ''))) errors.phone = 'Формат: +375291112233';
  if (!email.test(data.email || '')) errors.email = 'Некорректный email';
  if (age < 16) errors.birthDate = 'Возраст должен быть 16+';
  if (!data.nickname || data.nickname.length < 3) errors.nickname = 'Нужен никнейм';
  if (password.length < 8 || password.length > 20) errors.password = 'Пароль 8-20 символов';
  if (!/[a-zа-я]/.test(password) || !/[A-ZА-Я]/.test(password) || !/\d/.test(password) || !/[^\wа-яА-Я]/.test(password)) errors.password = 'Нужны строчная, заглавная, цифра и спецсимвол';
  if (TOP_PASSWORDS.map((item) => item.toLowerCase()).includes(password.toLowerCase())) errors.password = 'Слишком популярный пароль';
  if (!data.agreementRead) errors.agreement = 'Подтвердите прочтение соглашения';
  return errors;
}

// Проверяет учетные данные и открывает кабинет ученика или администратора.
async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const errors = {};
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  if (!email) errors.loginEmail = 'Введите email';
  if (!password) errors.loginPassword = 'Введите пароль';
  renderErrors(form, errors);
  if (Object.keys(errors).length) return;
  const users = [...await fetchData('users'), ...getLocalUsers()];
  const user = users.find((item) => item.email?.toLowerCase() === email);
  const expectedPassword = user?.password || DEMO_PASSWORDS[email];
  if (!user) errors.loginEmail = 'Пользователь не найден';
  if (user && !expectedPassword) errors.loginPassword = 'Для этого пользователя не задан пароль';
  if (user && expectedPassword !== password) errors.loginPassword = 'Неверный пароль';
  renderErrors(form, errors);
  if (Object.keys(errors).length) {
    showToast('Неверные данные для входа');
    return;
  }
  setCurrentUser(user);
  await syncUserLists();
  showToast(user.role === 'admin' ? t('profileAdmin') : t('profileStudent'));
  renderAuthProfile(user);
}

function getLocalUsers() {
  return [];
}

function renderErrors(form, errors) {
  form.querySelectorAll('.error').forEach((node) => node.textContent = '');
  Object.entries(errors).forEach(([key, message]) => {
    const node = form.querySelector(`[data-error="${key}"]`);
    if (node) node.textContent = message;
  });
}

function renderRegistrationErrors(form, errors, touched, showAll = false) {
  form.querySelectorAll('.error').forEach((node) => {
    const key = node.dataset.error;
    node.textContent = (showAll || touched.has(key)) ? (errors[key] || '') : '';
  });
}

function getAge(birthDate) {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

// Если пользователь уже вошел, сразу показывает его кабинет при открытии страницы входа.
async function initRolePanel() {
  const panel = document.querySelector('#profilePanel');
  if (!panel) return;
  const user = getCurrentUser();
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  syncAuthGate(user);
  if (!user) {
    panel.innerHTML = `<h3>${copy.guestTitle}</h3><p>${copy.guestText}</p>`;
    return;
  }
  await syncUserLists();
  renderAuthProfile(user);
}

function syncAuthGate(user = getCurrentUser()) {
  document.querySelectorAll('#loginForm, #registerForm').forEach((form) => {
    const layout = form.closest('.auth-layout');
    const isSignedIn = Boolean(user);
    form.hidden = isSignedIn;
    form.setAttribute('aria-hidden', String(isSignedIn));
    if (layout) layout.hidden = isSignedIn;
  });
}

// Выбирает, какую панель показать: ученическую или административную.
function renderAuthProfile(user) {
  const panel = document.querySelector('#profilePanel');
  if (!panel || !user) return;
  syncAuthGate(user);
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  if (user.role === 'admin') {
    panel.innerHTML = `<div class="auth-profile__head"><div><h3>${copy.adminPanel}</h3><p>${user.name}: ${copy.adminIntro}</p></div><button type="button" data-logout>${copy.logout}</button></div>`;
    bindLogout(panel);
    renderAdminDashboard(panel);
    return;
  }
  panel.innerHTML = `
    <div class="auth-profile__head"><div><h3>${copy.studentPanel}</h3><p>${user.name}: ${copy.studentIntro}</p></div><button type="button" data-logout>${copy.logout}</button></div>
    <div class="auth-dashboard" data-student-dashboard>
      <div class="auth-panel"><h4>${copy.cart}</h4><p>...</p></div>
      <div class="auth-panel"><h4>${copy.myOrders}</h4><p>...</p></div>
      <div class="auth-panel"><h4>${copy.favorites}</h4><p>...</p></div>
      <div class="auth-panel"><h4>${copy.studentReviewTitle}</h4><p>...</p></div>
      <div class="auth-panel auth-panel--profile"><h4>${copy.profileData}</h4><p>...</p></div>
    </div>`;
  bindLogout(panel);
  renderStudentDashboard(panel);
}

function refreshStudentDashboard() {
  const panel = document.querySelector('#profilePanel');
  const user = getCurrentUser();
  if (!panel || !user) return;
  if (user.role !== 'student') {
    renderAuthProfile(user);
    return;
  }
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  const intro = panel.querySelector('.auth-profile__head p');
  if (intro) intro.textContent = `${user.name}: ${copy.studentIntro}`;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const currentHeight = panel.getBoundingClientRect().height;
  if (currentHeight) panel.style.minHeight = `${currentHeight}px`;
  renderStudentDashboard(panel).finally(() => {
    panel.style.minHeight = '';
    window.scrollTo(scrollX, scrollY);
  });
}

function refreshAuthProfile() {
  const panel = document.querySelector('#profilePanel');
  if (!panel) return;
  const user = getCurrentUser();
  if (!user) {
    const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
    panel.innerHTML = `<h3>${copy.guestTitle}</h3><p>${copy.guestText}</p>`;
    syncAuthGate(null);
    return;
  }
  renderAuthProfile(user);
}

function bindLogout(panel) {
  panel.querySelector('[data-logout]')?.addEventListener('click', () => {
    const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
    setCurrentUser(null);
    state.cart = [];
    state.favorites = [];
    syncAuthGate(null);
    panel.innerHTML = `<h3>${copy.guestTitle}</h3><p>${copy.guestText}</p>`;
    syncFavoriteButtons();
    showToast(state.settings.lang === 'en' ? 'Signed out' : 'Выход выполнен');
  });
}

// Собирает личный кабинет ученика: корзину, заявки, избранное, отзывы и профиль.
async function renderStudentDashboard(panel) {
  const root = panel.querySelector('[data-student-dashboard]');
  if (!root) return;
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  const user = getCurrentUser();
  const courses = await getAllCourses();
  const enrollments = (await getAllEnrollments()).filter((item) => Number(item.userId) === Number(user.id));
  const reviews = (await getAllReviews()).filter((item) => Number(item.userId) === Number(user.id));
  const cart = getCart();
  const favorites = getFavorites();
  const selectedCourses = cart.map((id) => courses.find((course) => Number(course.id) === Number(id))).filter(Boolean);
  const favoriteCourses = favorites.map((id) => courses.find((course) => Number(course.id) === Number(id))).filter(Boolean);
  const paidCourses = enrollments
    .filter((item) => item.status === 'active')
    .map((item) => courses.find((course) => Number(course.id) === Number(item.courseId)))
    .filter(Boolean);
  const reviewedCourseIds = new Set(reviews.map((item) => Number(item.courseId)));
  const reviewableCourses = paidCourses.filter((course) => !reviewedCourseIds.has(Number(course.id)));
  const total = selectedCourses.reduce((sum, course) => sum + Number(course.price || 0), 0);
  const cartHtml = selectedCourses.length
    ? `<div class="cart-list">${selectedCourses.map((course) => `
        <article class="cart-item">
          <div><strong>${escapeHtml(getCourseDisplayTitle(course))}</strong><span>${course.format === 'online' ? 'Онлайн' : 'Офлайн'} · ${course.schedule || 'Расписание уточняется'}</span></div>
          <b>${course.price} BYN</b>
          <button type="button" data-cart-remove="${course.id}">×</button>
        </article>
      `).join('')}</div>
      <div class="cart-total"><span>${copy.total}</span><strong>${total} BYN</strong></div>
      <button class="ref-button" type="button" data-cart-checkout>${copy.checkout}</button>`
    : `<p>${copy.cartEmpty}</p><a class="ref-button" href="courses.html">${copy.goCourses}</a>`;
  const ordersHtml = enrollments.length
    ? `<div class="cart-list">${enrollments.map((item) => {
        const course = courses.find((courseItem) => Number(courseItem.id) === Number(item.courseId));
        return `
          <article class="cart-item cart-item--order">
            <div><strong>${escapeHtml(course ? getCourseDisplayTitle(course) : `${copy.courseFallback} #${item.courseId}`)}</strong><span>${item.status === 'active' ? copy.paid : copy.waiting}${item.paymentDate ? ` · ${item.paymentDate}` : ''}</span></div>
            <b>${course?.price || 0} BYN</b>
            ${item.status === 'active' ? '<span></span>' : `<button type="button" data-pay-enrollment="${item.id}">${copy.pay}</button>`}
          </article>`;
      }).join('')}</div>`
    : `<p>${copy.ordersEmpty}</p>`;
  const favoritesHtml = favoriteCourses.length
    ? `<div class="cart-list">${favoriteCourses.map((course) => `
        <article class="cart-item cart-item--favorite">
          <div><strong>${escapeHtml(getCourseDisplayTitle(course))}</strong><span>${course.price} BYN В· ${course.format === 'online' ? 'Онлайн' : 'Офлайн'}</span></div>
          <button type="button" data-favorite-cart="${course.id}">${copy.addFavoriteToCart}</button>
          <button type="button" data-favorite-remove="${course.id}">×</button>
        </article>
      `).join('')}</div>`
    : `<p>${copy.favoritesEmpty}</p>`;
  const profileHtml = `
    <form class="profile-form" data-profile-form>
      <label>${copy.fullName}<input name="name" value="${escapeHtml(user.name || '')}" required></label>
      <label>Email<input name="email" type="email" value="${escapeHtml(user.email || '')}" required></label>
      <label>${copy.phone}<input name="phone" value="${escapeHtml(user.phone || '')}" required></label>
      <label>${copy.birthDate}<input name="birthDate" type="date" value="${escapeHtml(user.birthDate || '')}" required></label>
      <label>${copy.nickname}<input name="nickname" value="${escapeHtml(user.nickname || '')}" required></label>
      <button class="ref-button" type="submit">${copy.saveProfile}</button>
      <span class="error" data-profile-error></span>
    </form>`;
  const reviewListHtml = reviews.length
    ? `<div class="review-list">${reviews.map((review) => {
        const course = courses.find((courseItem) => Number(courseItem.id) === Number(review.courseId));
        return `
          <article>
            <div>
              <strong>${escapeHtml(course ? getCourseDisplayTitle(course) : `${copy.courseFallback} #${review.courseId}`)}</strong>
              <span>${formatReviewDate(review.createdAt)}</span>
            </div>
            <mark>${review.status === 'published' ? copy.reviewPublished : copy.reviewPending}</mark>
          </article>`;
      }).join('')}</div>`
    : '';
  const reviewFormHtml = reviewableCourses.length
    ? `<form class="review-form" data-student-review-form>
        <label>${copy.reviewCourse}
          <select name="courseId" required>
            <option value="">${copy.selectCourse}</option>
            ${reviewableCourses.map((course) => `<option value="${course.id}">${escapeHtml(getCourseDisplayTitle(course))}</option>`).join('')}
          </select>
        </label>
        <label>${copy.reviewText}
          <textarea name="text" rows="5" minlength="20" required></textarea>
        </label>
        <button class="ref-button" type="submit">${copy.reviewSubmit}</button>
        <span class="error" data-review-error></span>
      </form>`
    : `<p>${paidCourses.length ? copy.reviewNoCoursesLeft : copy.reviewNoPaidCourses}</p>`;
  const reviewHtml = `${reviewListHtml}${reviewFormHtml}`;
  const panels = root.querySelectorAll('.auth-panel');
  const firstPanel = panels[0];
  const secondPanel = panels[1];
  const thirdPanel = panels[2];
  const fourthPanel = panels[3];
  const fifthPanel = panels[4];
  firstPanel.innerHTML = `<h4>${copy.cart}</h4>${cartHtml}`;
  secondPanel.innerHTML = `<h4>${copy.myOrders}</h4>${ordersHtml}<a class="ref-button" href="courses.html">${copy.chooseCourse}</a>`;
  thirdPanel.innerHTML = `<h4>${copy.favorites}</h4>${favoritesHtml}`;
  fourthPanel.innerHTML = `<h4>${copy.studentReviewTitle}</h4>${reviewHtml}`;
  fifthPanel.innerHTML = `<h4>${copy.profileData}</h4>${profileHtml}`;
  firstPanel.querySelectorAll('[data-cart-remove]').forEach((button) => {
    button.addEventListener('click', () => removeFromCart(Number(button.dataset.cartRemove)));
  });
  firstPanel.querySelector('[data-cart-checkout]')?.addEventListener('click', checkoutCart);
  secondPanel.querySelectorAll('[data-pay-enrollment]').forEach((button) => {
    button.addEventListener('click', () => payEnrollment(Number(button.dataset.payEnrollment)));
  });
  thirdPanel.querySelectorAll('[data-favorite-remove]').forEach((button) => {
    button.addEventListener('click', () => toggleFavorite(Number(button.dataset.favoriteRemove)));
  });
  thirdPanel.querySelectorAll('[data-favorite-cart]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.favoriteCart)));
  });
  fourthPanel.querySelector('[data-student-review-form]')?.addEventListener('submit', submitStudentReview);
  fifthPanel.querySelector('[data-profile-form]')?.addEventListener('submit', updateProfile);
}

// Отправляет отзыв только по оплаченному курсу, чтобы не было случайных отзывов.
async function submitStudentReview(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  const user = getCurrentUser();
  if (!user || user.role !== 'student') return;
  const data = Object.fromEntries(new FormData(form).entries());
  const courseId = Number(data.courseId);
  const text = String(data.text || '').trim();
  const error = form.querySelector('[data-review-error]');
  const enrollments = (await getAllEnrollments()).filter((item) => Number(item.userId) === Number(user.id));
  const reviews = (await getAllReviews()).filter((item) => Number(item.userId) === Number(user.id));
  const canReview = enrollments.some((item) => Number(item.courseId) === courseId && item.status === 'active');
  const alreadySent = reviews.some((item) => Number(item.courseId) === courseId);
  if (!courseId || text.length < 20 || !canReview || alreadySent) {
    if (error) error.textContent = copy.reviewError;
    return;
  }
  await createStudentReview({ userId: user.id, courseId, text });
  showToast(copy.reviewSent);
  refreshStudentDashboard();
}

// Сохраняет изменения личных данных ученика.
async function updateProfile(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  const user = getCurrentUser();
  if (!user) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const phone = String(data.phone || '').trim();
  const birthDate = String(data.birthDate || '').trim();
  const nickname = String(data.nickname || '').trim();
  const error = form.querySelector('[data-profile-error]');
  const valid = name.length >= 5
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    && /^(\+375|80)\s?\(?((25|29|33|44))\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/.test(phone)
    && getAge(birthDate) >= 16
    && nickname.length >= 3;
  if (!valid) {
    if (error) error.textContent = copy.profileError;
    return;
  }
  const updated = { ...user, name, email, phone, birthDate, nickname };
  setCurrentUser(updated);
  try {
    await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, birthDate, nickname })
    });
  } catch (error) {
    // Локальное сохранение остается рабочим, даже если JSON Server сейчас выключен.
  }
  showToast(copy.profileSaved);
  refreshStudentDashboard();
}

// В ученическом кабинете условно переводит заявку в статус "оплачено".
async function payEnrollment(id) {
  await changeEnrollmentStatus(id, 'active', true);
  showToast(state.settings.lang === 'en' ? 'Payment completed' : 'Оплата выполнена');
  refreshStudentDashboard();
}

// Собирает панель администратора: заявки, пользователи, отзывы и редактор курсов.
async function renderAdminDashboard(panel) {
  const [remoteUsers, courses, enrollments, reviews] = await Promise.all([
    fetchData('users'),
    getAllCourses(),
    getAllEnrollments(),
    getAllReviews()
  ]);
  const users = [...remoteUsers, ...getLocalUsers().filter((localUser) => !remoteUsers.some((user) => Number(user.id) === Number(localUser.id)))];
  const adminReviews = [...reviews].reverse();
  const findUser = (id) => users.find((user) => Number(user.id) === Number(id));
  const findCourse = (id) => courses.find((course) => Number(course.id) === Number(id));
  const validEnrollments = enrollments.filter((item) => findUser(item.userId) && findCourse(item.courseId));
  const pending = validEnrollments.filter((item) => item.status === 'pending');
  const active = validEnrollments.filter((item) => item.status === 'active');
  const allRequests = [...validEnrollments].reverse();
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;

  panel.innerHTML = `
    <div class="auth-profile__head"><div><h3>${copy.adminPanel}</h3><p>${copy.adminIntro}</p></div><button type="button" data-logout>${copy.logout}</button></div>
    <div class="admin-stats">
      <article><strong>${users.length}</strong><span>${copy.users}</span></article>
      <article><strong>${courses.length}</strong><span>${copy.courses}</span></article>
      <article><strong>${pending.length}</strong><span>${copy.newRequests}</span></article>
      <article><strong>${active.length}</strong><span>${copy.activePayments}</span></article>
    </div>
    <div class="auth-dashboard auth-dashboard--admin">
      <div class="auth-panel">
        <h4>${copy.allRequests}</h4>
        <div class="admin-table">
          ${allRequests.map((item) => `
            <div>
              <span>${escapeHtml(findUser(item.userId)?.name || `${copy.userFallback} #${item.userId}`)}</span>
              <b>${escapeHtml(findCourse(item.courseId) ? getCourseDisplayTitle(findCourse(item.courseId)) : `${copy.courseFallback} #${item.courseId}`)}</b>
              <mark>${item.status === 'active' ? copy.paid : copy.waiting}</mark>
              <button type="button" data-enrollment-status="${item.id}" data-status="${item.status === 'active' ? 'pending' : 'active'}">${item.status === 'active' ? copy.pendingBack : copy.confirm}</button>
            </div>
          `).join('') || `<p>${copy.ordersEmpty}</p>`}
        </div>
      </div>
      <div class="auth-panel">
        <h4>${copy.adminUsers}</h4>
        <div class="admin-table admin-table--simple">
          ${users.map((item) => `
            <div>
              <span>${escapeHtml(item.name || '')}</span>
              <b>${escapeHtml(item.email || '')}</b>
              <mark>${item.role === 'admin' ? copy.adminAdmin : copy.adminStudent}</mark>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="auth-panel">
        <h4>${copy.adminReviews}</h4>
        <div class="admin-table admin-table--reviews">
          ${adminReviews.map((item) => `
            <div>
              <span>${escapeHtml(findUser(item.userId)?.name || `${copy.userFallback} #${item.userId}`)}</span>
              <b>${escapeHtml(findCourse(item.courseId) ? getCourseDisplayTitle(findCourse(item.courseId)) : `${copy.courseFallback} #${item.courseId}`)}</b>
              <p>${escapeHtml(item.text || '')}</p>
              <mark>${item.status === 'published' ? copy.reviewPublished : copy.reviewPending}</mark>
              <span class="admin-review-actions">
                ${item.status === 'pending' ? `<button type="button" data-review-publish="${item.id}">${copy.publishReview}</button>` : ''}
                <button class="admin-button-light" type="button" data-review-delete="${item.id}">${copy.deleteReview}</button>
              </span>
            </div>
          `).join('') || `<p>${copy.noReviewRequests}</p>`}
        </div>
      </div>
      <div class="auth-panel auth-panel--wide">
        <h4>${copy.adminCatalog}</h4>
        ${renderAdminCourseEditor(courses, copy)}
      </div>
    </div>`;
  bindLogout(panel);
  panel.querySelectorAll('[data-enrollment-status]').forEach((button) => {
    button.addEventListener('click', () => updateEnrollmentStatus(Number(button.dataset.enrollmentStatus), button.dataset.status, panel));
  });
  panel.querySelectorAll('[data-review-publish]').forEach((button) => {
    button.addEventListener('click', () => publishStudentReview(Number(button.dataset.reviewPublish), panel));
  });
  panel.querySelectorAll('[data-review-delete]').forEach((button) => {
    button.addEventListener('click', () => removeStudentReview(Number(button.dataset.reviewDelete), panel));
  });
  panel.querySelectorAll('[data-course-edit]').forEach((form) => {
    form.addEventListener('submit', (event) => updateCourseCard(event, panel));
  });
  panel.querySelector('[data-course-picker]')?.addEventListener('change', (event) => {
    localStorage.setItem('adminSelectedCourseId', event.currentTarget.value);
    renderAdminDashboard(panel);
  });
  panel.querySelector('[data-course-create]')?.addEventListener('submit', (event) => createCourseCard(event, panel));
  panel.querySelector('[data-course-delete]')?.addEventListener('click', (event) => deleteCourseCard(Number(event.currentTarget.dataset.courseDelete), panel));
}

// Рисует форму редактирования выбранного курса и блок создания нового курса.
function renderAdminCourseEditor(courses, copy) {
  const selectedId = Number(localStorage.getItem('adminSelectedCourseId')) || Number(courses[0]?.id);
  const selectedCourse = courses.find((course) => Number(course.id) === selectedId) || courses[0];
  if (!selectedCourse) return `<p>${copy.ordersEmpty}</p>`;
  const formatOptions = (value) => `
    <option value="offline" ${value === 'offline' ? 'selected' : ''}>${state.settings.lang === 'en' ? 'Offline' : 'Офлайн'}</option>
    <option value="online" ${value === 'online' ? 'selected' : ''}>${state.settings.lang === 'en' ? 'Online' : 'Онлайн'}</option>`;
  return `
    <div class="admin-course-editor">
      <label class="admin-course-picker">${copy.selectCourse}
        <select data-course-picker>
          ${courses.map((course) => `<option value="${course.id}" ${Number(course.id) === Number(selectedCourse.id) ? 'selected' : ''}>${escapeHtml(course.title || `#${course.id}`)}</option>`).join('')}
        </select>
      </label>
      <form class="admin-course-form" data-course-edit="${selectedCourse.id}">
        <label>${copy.courseTitle}<input name="title" value="${escapeHtml(selectedCourse.title || '')}" required></label>
        <label>${copy.courseSubject}<input name="subject" value="${escapeHtml(selectedCourse.subject || '')}" required></label>
        <label>${copy.courseDescription}<textarea name="description" required>${escapeHtml(selectedCourse.description || '')}</textarea></label>
        <label>${copy.coursePrice}<input name="price" type="number" min="1" value="${Number(selectedCourse.price || 0)}" required></label>
        <label>${copy.courseFormat}<select name="format">${formatOptions(selectedCourse.format)}</select></label>
        <button class="ref-button" type="submit">${copy.saveCourse}</button>
        <button class="ref-button ref-button--light" type="button" data-course-delete="${selectedCourse.id}">${copy.deleteCourse}</button>
        <span class="error" data-course-error></span>
      </form>
      <details class="admin-course-create">
        <summary>${copy.addCourse}</summary>
        <form class="admin-course-form" data-course-create>
          <label>${copy.courseTitle}<input name="title" placeholder="${copy.newCourseTitle}" required></label>
          <label>${copy.courseSubject}<input name="subject" placeholder="math" required></label>
          <label>${copy.courseDescription}<textarea name="description" required></textarea></label>
          <label>${copy.coursePrice}<input name="price" type="number" min="1" required></label>
          <label>${copy.courseFormat}<select name="format">${formatOptions('offline')}</select></label>
          <button class="ref-button" type="submit">${copy.createCourse}</button>
          <span class="error" data-course-error></span>
        </form>
      </details>
    </div>`;
}

// Сохраняет изменения курса через JSON Server или локально, если сервер выключен.
async function updateCourseCard(event, panel) {
  event.preventDefault();
  const form = event.currentTarget;
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  const id = Number(form.dataset.courseEdit);
  const data = Object.fromEntries(new FormData(form).entries());
  const price = Number(data.price);
  const error = form.querySelector('[data-course-error]');
  if (!data.title?.trim() || !data.description?.trim() || !Number.isFinite(price) || price <= 0) {
    if (error) error.textContent = copy.courseError;
    return;
  }
  const updatedCourse = {
    id,
    title: data.title.trim(),
    subject: data.subject.trim(),
    description: data.description.trim(),
    price,
    format: data.format === 'online' ? 'online' : 'offline'
  };
  saveLocalCourseEdit(updatedCourse);
  state.courses = state.courses.map((course) => Number(course.id) === id ? { ...course, ...updatedCourse } : course);
  try {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCourse)
    });
    if (!response.ok) throw new Error('API unavailable');
  } catch (error) {
    // При выключенном JSON Server карточка все равно обновляется через localStorage.
  }
  showToast(copy.courseSaved);
  renderAdminDashboard(panel);
}

// Добавляет новый курс в каталог и выбирает его в админском редакторе.
async function createCourseCard(event, panel) {
  event.preventDefault();
  const form = event.currentTarget;
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  const data = Object.fromEntries(new FormData(form).entries());
  const price = Number(data.price);
  const error = form.querySelector('[data-course-error]');
  if (!data.title?.trim() || !data.description?.trim() || !Number.isFinite(price) || price <= 0) {
    if (error) error.textContent = copy.courseError;
    return;
  }
  const localId = getNextCourseId(await getAllCourses(true));
  const newCourse = {
    id: localId,
    title: data.title.trim(),
    subject: data.subject.trim(),
    level: 'base',
    format: data.format === 'online' ? 'online' : 'offline',
    price,
    schedule: state.settings.lang === 'en' ? 'Schedule is being confirmed' : 'Расписание уточняется',
    teacherId: 1,
    description: data.description.trim(),
    image: 'images/course1.png'
  };
  let savedCourse = newCourse;
  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse)
    });
    if (!response.ok) throw new Error('API unavailable');
    savedCourse = await response.json();
  } catch (error) {
    const created = getLocalCreatedCourses().filter((course) => Number(course.id) !== Number(localId));
    saveLocalCreatedCourses([...created, newCourse]);
  }
  state.courses = uniqueCourses([...state.courses, savedCourse]);
  localStorage.setItem('adminSelectedCourseId', String(savedCourse.id));
  showToast(copy.courseCreated);
  renderAdminDashboard(panel);
}

// Удаляет курс после подтверждения администратора.
async function deleteCourseCard(id, panel) {
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  if (!id) return;
  const confirmed = await confirmAction({
    title: copy.deleteCourseTitle,
    message: copy.deleteCourseConfirm,
    okText: copy.deleteCourseOk,
    cancelText: copy.cancel
  });
  if (!confirmed) return;
  saveLocalDeletedCourseIds([...getLocalDeletedCourseIds(), id]);
  saveLocalCreatedCourses(getLocalCreatedCourses().filter((course) => Number(course.id) !== id));
  const edits = getLocalCourseEdits();
  delete edits[id];
  localStorage.setItem('courseEdits', JSON.stringify(edits));
  state.courses = state.courses.filter((course) => Number(course.id) !== id);
  try {
    const response = await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('API unavailable');
  } catch (error) {
    // Если JSON Server выключен, локальный список скрытых курсов все равно очищает каталог.
  }
  const nextCourse = state.courses[0] || (await getAllCourses())[0];
  if (nextCourse) localStorage.setItem('adminSelectedCourseId', String(nextCourse.id));
  else localStorage.removeItem('adminSelectedCourseId');
  showToast(copy.courseDeleted);
  renderAdminDashboard(panel);
}

async function publishStudentReview(id, panel) {
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  if (!id) return;
  await setReviewStatus(id, 'published');
  showToast(copy.reviewPublished);
  renderAdminDashboard(panel);
}

async function removeStudentReview(id, panel) {
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  if (!id) return;
  await deleteReview(id);
  showToast(copy.reviewDeleted);
  renderAdminDashboard(panel);
}

// Меняет статус заявки между "ожидает оплаты" и "оплачено".
async function updateEnrollmentStatus(id, status, panel) {
  const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
  await changeEnrollmentStatus(id, status, status === 'active');
  showToast(copy.requestUpdated);
  renderAdminDashboard(panel);
}

async function changeEnrollmentStatus(id, status, paid = false) {
  const paymentDate = paid ? new Date().toISOString().slice(0, 10) : '';
  const localEnrollments = JSON.parse(localStorage.getItem('localEnrollments') || '[]');
  const localIndex = localEnrollments.findIndex((item) => Number(item.id) === Number(id));
  if (localIndex >= 0) {
    localEnrollments[localIndex].status = status;
    localEnrollments[localIndex].paymentDate = paymentDate;
    localStorage.setItem('localEnrollments', JSON.stringify(localEnrollments));
  }
  try {
    const response = await fetch(`${API_URL}/enrollments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentDate })
    });
    if (!response.ok) throw new Error('API unavailable');
  } catch (error) {
    if (localIndex < 0) {
      const copy = referenceAuthTranslations[state.settings.lang] || referenceAuthTranslations.ru;
      showToast(copy.enrollmentServerError);
    }
  }
}

function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem('currentUser')); } catch { return null; }
}

function openModal(id) {
  document.querySelector(`[data-modal="${id}"]`)?.classList.add('open');
}

function closeModal() {
  document.querySelectorAll('.modal-backdrop.open').forEach((modal) => modal.classList.remove('open'));
}

// Универсальное окно подтверждения для опасных действий, например удаления курса.
function confirmAction({ title, message, okText, cancelText }) {
  const oldModal = document.querySelector('[data-confirm-modal]');
  oldModal?.remove();
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop confirm-backdrop open';
  backdrop.dataset.confirmModal = 'true';
  backdrop.innerHTML = `
    <div class="modal confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div class="modal-head">
        <h3 id="confirm-modal-title">${escapeHtml(title)}</h3>
        <button class="icon-btn" type="button" data-confirm-cancel aria-label="${escapeHtml(cancelText)}">×</button>
      </div>
      <p>${escapeHtml(message)}</p>
      <div class="modal-actions confirm-actions">
        <button class="ref-button" type="button" data-confirm-ok>${escapeHtml(okText)}</button>
        <button class="ref-button ref-button--light" type="button" data-confirm-cancel>${escapeHtml(cancelText)}</button>
      </div>
    </div>
  `;
  document.body.append(backdrop);

  return new Promise((resolve) => {
    const finish = (value) => {
      document.removeEventListener('keydown', onKeydown);
      backdrop.remove();
      resolve(value);
    };
    const onKeydown = (event) => {
      if (event.key === 'Escape') finish(false);
    };
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop || event.target.closest('[data-confirm-cancel]')) finish(false);
      if (event.target.closest('[data-confirm-ok]')) finish(true);
    });
    document.addEventListener('keydown', onKeydown);
    backdrop.querySelector('[data-confirm-ok]')?.focus();
  });
}

// Показывает короткое уведомление в правом нижнем углу.
function showToast(message) {
  const root = document.querySelector('.toast');
  if (!root) return;
  const item = document.createElement('div');
  item.className = 'toast-message';
  item.textContent = message;
  root.append(item);
  setTimeout(() => item.remove(), 2600);
}

// Экранирует пользовательский текст, чтобы его безопасно вставлять в HTML.
function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function setLoading(isLoading) {
  if (!isHomePage()) return;
  loadingCounter += isLoading ? 1 : -1;
  loadingCounter = Math.max(0, loadingCounter);
  document.querySelector('.preloader')?.classList.toggle('visible', loadingCounter > 0);
}

function debounce(callback, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), wait);
  };
}
