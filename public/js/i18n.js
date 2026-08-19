// Prosty system tłumaczeń PL/EN dla całego UI gry + przełącznik języka zapisywany w localStorage.
//
// WAŻNE: wartości ZAPISYWANE do sesji/arkusza (nazwy tagów, kryteriów designu, decyzje) muszą
// zostać jako kanoniczne polskie stringi niezależnie od wybranego języka UI - inaczej dane z sesji
// PL i EN rozjechałyby się w agregacji arkusza. Tłumaczeniu podlega WYŁĄCZNIE to, co się wyświetla
// (przez t()/tagLabel()/criteriaLabel()/decisionLabel()), nigdy to, co trafia do localStorage/CSV.

const I18N_LANG_KEY = 'gameLang';

const I18N = {
    pl: {
        'common.backToMenu': 'Powrót do menu',
        'common.questionN': 'Pytanie {i}',
        'common.correct': 'Poprawna',
        'common.incorrect': 'Błędna',
        'common.correctAnswerLabel': 'Poprawna odpowiedź:',

        'idx.pageTitle': 'HR Game - Strona Główna',
        'idx.title': 'Witaj w HR Game',
        'idx.subtitle': 'Sprawdź swoje umiejętności analizy CV w praktyce.',
        'idx.play': 'Graj',
        'idx.calibrate': 'Kalibruj',
        'idx.viewAnalysis': 'Zobacz analizę',
        'idx.options': 'Opcje',

        'opt.pageTitle': 'HR Game - Opcje',
        'opt.title': 'Opcje',
        'opt.subtitle': 'Dostosuj sposób rozgrywki.',
        'opt.eyeTrackLabel': 'Śledź oczy (eye tracking)',
        'opt.eyeTrackHint': 'Wyłącz, jeśli nie masz kamery albo nie chcesz jej użyć. Przycisk "Graj" przeniesie Cię wtedy od razu do gry, bez kalibracji.',
        'opt.timerLabel': 'Domyślny czas obserwacji CV (sekundy):',
        'opt.timerHint': 'Ta wartość będzie domyślnie wypełniona przy konfiguracji nowej sesji gry.',
        'opt.languageLabel': 'Język gry',
        'opt.langPolish': 'Polski',
        'opt.langEnglish': 'English',

        'setup.pageTitle': 'HR Game - Ustawienia Rozgrywki',
        'setup.title': 'Konfiguracja Sesji HR',
        'setup.infoIntro': 'Jak wygląda ocena jednego CV:',
        'setup.infoStep1': 'Patrzysz na CV przez wyznaczony czas (śledzimy wzrok).',
        'setup.infoStep2': 'CV znika, odpowiadasz na 3 pytania sprawdzające, co zapamiętałeś/aś.',
        'setup.infoStep3': 'CV wraca - oceniasz jego design i podejmujesz decyzję.',
        'setup.timerLabel': 'Czas obserwacji jednego CV (sekundy):',
        'setup.timerHint': 'Po tym czasie CV zniknie i pojawi się quiz.',
        'setup.eyeTrackLabel': 'Śledź oczy (eye tracking) w tej sesji',
        'setup.eyeTrackHint': 'Wyłącz, jeśli teraz nie chcesz używać kamery - sesja przejdzie bez śledzenia wzroku.',
        'setup.submit': 'Rozpocznij Analizę CV',

        'cal.pageTitle': 'Kalibracja Kamery',
        'cal.notCalibrated': 'Jeszcze niekalibrowane',
        'cal.recalibrate': 'Kalibruj ponownie',
        'cal.skipNoCam': 'Zrezygnuj i graj bez kamery',
        'cal.help': 'Pomoc',
        'cal.modalTitle': 'Kalibracja kamery do gry!',
        'cal.playNoCam': 'Graj bez kamery',
        'cal.calibrateBtn': 'Kalibruj',
        'cal.instrTitle': 'Instrukcje kalibracji',
        'cal.instrText': 'Kliknij każdą z 9 kropek na ekranie 5 razy. Patrz na kropkę podczas klikania, aż zmieni kolor na żółty.',
        'cal.calcAccTitle': 'Obliczanie precyzji',
        'cal.calcAccText': 'Nie ruszaj myszką i patrz na środkową kropkę przez najbliższe 5 sekund. System sprawdzi Twoją precyzję.',
        'cal.accuracyBadge': 'Precyzja | {pct}%',
        'cal.precisionTitle': 'Precyzja: {pct}%',
        'cal.calibrationDoneText': 'Kalibracja zakończona sukcesem. Co chcesz zrobić teraz?',
        'cal.retryCalibration': 'Powtórz kalibrację',
        'cal.goToGame': 'Przejdź do gry!',

        'game.pageTitle': 'HR Game - Analiza CV',
        'game.trackingBadge': 'Tryb bez kamery (bez śledzenia wzroku)',
        'game.introTitle': 'Przygotuj się',
        'game.introHint': 'Za chwilę zobaczysz CV kolejnego kandydata/kandydatki przez {n} s. Postaraj się zapamiętać jak najwięcej szczegółów.',
        'game.watchTitle': 'Zapamiętaj CV',
        'game.watchHint': 'Przyjrzyj się kandydatowi/kandydatce. Za chwilę CV zniknie i zadamy Ci 3 pytania na jego temat.',
        'game.skipWatch': 'Pomiń, przejdź dalej',
        'game.quizProgress': 'Pytanie {i} z {n}',
        'game.quizResultTitle': 'Wynik quizu: {score} / {total}',
        'game.rateDesignTitle': 'Oceń design CV',
        'game.tagSortTitle': 'Co wpłynęło na Twoją ocenę?',
        'game.tagSortTooltip': 'Chodzi o to konkretne CV, które właśnie oglądałeś/aś - oceń, czy dany element wypadł w nim pozytywnie, negatywnie, czy to zależy.',
        'game.tagSortHint': 'Przeciągnij temat z listy do odpowiedniej kolumny poniżej.',
        'game.tagPoolLabel': 'Tematy',
        'game.zoneMinus': '- Minus',
        'game.zoneDepends': 'To zależy',
        'game.zonePlus': '+ Plus',
        'game.reject': 'Odrzuć',
        'game.accept': 'Zatrudnij',
        'game.controlsHint': 'Użyj strzałek na klawiaturze, aby podjąć decyzję',
        'game.zoomHint': 'Najedź, aby przybliżyć fragment - kliknij ikonę, aby zobaczyć całość.',
        'game.maximizeTitle': 'Powiększ CV',
        'game.modalCloseLabel': 'Zamknij',
        'game.modalAlt': 'CV - pełny podgląd',
        'game.yourAnswer': 'Twoja odpowiedź:',
        'game.finishTitle': 'Koniec sesji',
        'game.finishText': 'Trwa generowanie raportu analitycznego na zdjęciach CV...',

        'sum.pageTitle': 'HR Game - Raport Heatmapy CV',
        'sum.title': 'Zbiorczy raport sesji',
        'sum.subtitle': 'Który kandydat wypadł najlepiej i jak oceniają ich inni gracze.',
        'sum.playAgain': 'Zagraj ponownie',
        'sum.emailReport': 'Wyślij raport mailem',
        'sum.emailSubject': 'HR Game - wyniki sesji ({n} CV)',
        'sum.candidateListTitle': 'Lista Kandydatów',
        'sum.mainMenuBtn': 'Menu Główne',
        'sum.designScoreLabel': 'Ocena design CV',
        'sum.whatInfluencedLabel': 'Co wpłynęło na ocenę',
        'sum.heatmapTitle': 'Realna Heatmapa skupienia wzroku na pliku JPG',
        'sum.placeholderText': 'Wybierz kandydata, aby wyświetlić heatmapę na zdjęciu CV.',
        'sum.noSessionData': 'Brak danych sesji.',
        'sum.answerLabel': 'Odpowiedź:',
        'sum.trackingOffTitle': 'Śledzenie wzroku wyłączone',
        'sum.trackingOffText': 'Ta sesja została rozegrana bez kamery, więc heatmapa nie jest dostępna.',
        'sum.noGazeDataTitle': 'Brak danych',
        'sum.noGazeDataText': 'Wzrok nie skupił się na tym CV podczas testu.',
        'sum.aggregateBestLabel': 'Najlepszy OVR w tej sesji',

        'ana.pageTitle': 'HR Game - Analiza CV',
        'ana.title': 'Analiza CV',
        'ana.subtitle': 'Jak wszyscy gracze do tej pory oceniali poszczególne CV.',
        'ana.loading': 'Wczytywanie danych z arkusza...',
        'ana.noData': 'Brak jeszcze żadnych opinii w arkuszu - zagraj i wyślij wynik, aby pojawiły się tu dane.',
        'ana.bestLabel': 'Najwyższa średnia ocena',

        'rep.hires': 'zatrudnień',
        'rep.avgOvrOthers': 'śr. OVR innych',
        'rep.yourOvr': 'Twój OVR:',
        'rep.vsAverage': 'vs średnia',
        'rep.sameAsAverage': 'tak jak średnia',
        'rep.noData': 'brak danych',
        'rep.tagBarsTitle': 'Jak oceniane są elementy tego CV',
        'rep.avgAllLegend': 'średnia wszystkich',
        'rep.yourPickLegend': 'Twój wybór',
        'rep.positivePctSuffix': '{pct}% pozytywnych',
        'rep.noOpinionsYet': 'Brak opinii jeszcze',
        'rep.yourPickDepends': 'Twój wybór: to zależy',
        'rep.unknownCv': 'Nieznane CV',
        'rep.bestResultDefault': 'Najlepszy wynik',
        'rep.previewAlt': 'Podgląd CV'
    },
    en: {
        'common.backToMenu': 'Back to menu',
        'common.questionN': 'Question {i}',
        'common.correct': 'Correct',
        'common.incorrect': 'Incorrect',
        'common.correctAnswerLabel': 'Correct answer:',

        'idx.pageTitle': 'HR Game - Home',
        'idx.title': 'Welcome to HR Game',
        'idx.subtitle': 'Test your CV screening skills in practice.',
        'idx.play': 'Play',
        'idx.calibrate': 'Calibrate',
        'idx.viewAnalysis': 'View analysis',
        'idx.options': 'Options',

        'opt.pageTitle': 'HR Game - Options',
        'opt.title': 'Options',
        'opt.subtitle': 'Customize how you play.',
        'opt.eyeTrackLabel': 'Track eyes (eye tracking)',
        'opt.eyeTrackHint': 'Turn off if you don\'t have a camera or don\'t want to use it. The "Play" button will then take you straight to the game, without calibration.',
        'opt.timerLabel': 'Default CV observation time (seconds):',
        'opt.timerHint': 'This value will be pre-filled when setting up a new game session.',
        'opt.languageLabel': 'Game language',
        'opt.langPolish': 'Polski',
        'opt.langEnglish': 'English',

        'setup.pageTitle': 'HR Game - Game Setup',
        'setup.title': 'HR Session Setup',
        'setup.infoIntro': 'How evaluating one CV works:',
        'setup.infoStep1': 'You look at a CV for a set amount of time (we track your gaze).',
        'setup.infoStep2': 'The CV disappears and you answer 3 questions about what you remember.',
        'setup.infoStep3': 'The CV comes back - you rate its design and make a decision.',
        'setup.timerLabel': 'Observation time per CV (seconds):',
        'setup.timerHint': 'After this time the CV will disappear and the quiz will appear.',
        'setup.eyeTrackLabel': 'Track eyes (eye tracking) this session',
        'setup.eyeTrackHint': 'Turn off if you don\'t want to use the camera right now - the session will run without eye tracking.',
        'setup.submit': 'Start CV Analysis',

        'cal.pageTitle': 'Camera Calibration',
        'cal.notCalibrated': 'Not yet calibrated',
        'cal.recalibrate': 'Recalibrate',
        'cal.skipNoCam': 'Skip and play without a camera',
        'cal.help': 'Help',
        'cal.modalTitle': 'Game Camera Calibration!',
        'cal.playNoCam': 'Play without camera',
        'cal.calibrateBtn': 'Calibrate',
        'cal.instrTitle': 'Calibration Instructions',
        'cal.instrText': 'Click on each of the 9 dots on the screen 5 times. Look at the dot while clicking until it turns yellow.',
        'cal.calcAccTitle': 'Calculating Accuracy',
        'cal.calcAccText': 'Do not move your mouse and look at the center dot for the next 5 seconds. The system will check your accuracy.',
        'cal.accuracyBadge': 'Accuracy | {pct}%',
        'cal.precisionTitle': 'Precision: {pct}%',
        'cal.calibrationDoneText': 'Calibration completed successfully. What would you like to do now?',
        'cal.retryCalibration': 'Retry calibration',
        'cal.goToGame': 'Go to the game!',

        'game.pageTitle': 'HR Game - CV Analysis',
        'game.trackingBadge': 'No-camera mode (no eye tracking)',
        'game.introTitle': 'Get ready',
        'game.introHint': 'You\'ll see the next candidate\'s CV for {n}s. Try to remember as many details as possible.',
        'game.watchTitle': 'Memorize the CV',
        'game.watchHint': 'Take a good look at the candidate. The CV will disappear soon and we\'ll ask you 3 questions about it.',
        'game.skipWatch': 'Skip, continue',
        'game.quizProgress': 'Question {i} of {n}',
        'game.quizResultTitle': 'Quiz result: {score} / {total}',
        'game.rateDesignTitle': 'Rate the CV design',
        'game.tagSortTitle': 'What influenced your rating?',
        'game.tagSortTooltip': 'This is about the specific CV you just viewed - rate whether each element was a positive, a negative, or it depends.',
        'game.tagSortHint': 'Drag a topic from the list into the right column below.',
        'game.tagPoolLabel': 'Topics',
        'game.zoneMinus': '- Cons',
        'game.zoneDepends': 'Depends',
        'game.zonePlus': '+ Pros',
        'game.reject': 'Reject',
        'game.accept': 'Hire',
        'game.controlsHint': 'Use the arrow keys to make your decision',
        'game.zoomHint': 'Hover to zoom into a section - click the icon to view the full CV.',
        'game.maximizeTitle': 'Enlarge CV',
        'game.modalCloseLabel': 'Close',
        'game.modalAlt': 'CV - full preview',
        'game.yourAnswer': 'Your answer:',
        'game.finishTitle': 'Session complete',
        'game.finishText': 'Generating the analytics report from the CV images...',

        'sum.pageTitle': 'HR Game - CV Heatmap Report',
        'sum.title': 'Session summary report',
        'sum.subtitle': 'Which candidate did best and how other players rate them.',
        'sum.playAgain': 'Play again',
        'sum.emailReport': 'Email the report',
        'sum.emailSubject': 'HR Game - session results ({n} CVs)',
        'sum.candidateListTitle': 'Candidate list',
        'sum.mainMenuBtn': 'Main menu',
        'sum.designScoreLabel': 'CV design rating',
        'sum.whatInfluencedLabel': 'What influenced the rating',
        'sum.heatmapTitle': 'Actual gaze-focus heatmap on the CV image',
        'sum.placeholderText': 'Select a candidate to view the gaze heatmap on their CV.',
        'sum.noSessionData': 'No session data.',
        'sum.answerLabel': 'Answer:',
        'sum.trackingOffTitle': 'Eye tracking disabled',
        'sum.trackingOffText': 'This session was played without a camera, so the heatmap isn\'t available.',
        'sum.noGazeDataTitle': 'No data',
        'sum.noGazeDataText': 'Your gaze wasn\'t focused on this CV during the test.',
        'sum.aggregateBestLabel': 'Best OVR this session',

        'ana.pageTitle': 'HR Game - CV Analysis',
        'ana.title': 'CV Analysis',
        'ana.subtitle': 'How all players have rated each CV so far.',
        'ana.loading': 'Loading data from the spreadsheet...',
        'ana.noData': 'No feedback in the spreadsheet yet - play a session and submit your results to see data here.',
        'ana.bestLabel': 'Highest average rating',

        'rep.hires': 'hires',
        'rep.avgOvrOthers': 'avg. OVR of others',
        'rep.yourOvr': 'Your OVR:',
        'rep.vsAverage': 'vs average',
        'rep.sameAsAverage': 'same as average',
        'rep.noData': 'no data',
        'rep.tagBarsTitle': 'How this CV\'s elements are rated',
        'rep.avgAllLegend': 'average of all',
        'rep.yourPickLegend': 'Your pick',
        'rep.positivePctSuffix': '{pct}% positive',
        'rep.noOpinionsYet': 'No reviews yet',
        'rep.yourPickDepends': 'Your pick: it depends',
        'rep.unknownCv': 'Unknown CV',
        'rep.bestResultDefault': 'Best result',
        'rep.previewAlt': 'CV preview'
    }
};

// Kanoniczne (niezmienne) wartości zapisywane w localStorage/CSV/arkuszu -> etykieta wyświetlana.
const TAG_LABELS = {
    pl: {
        'Zdjęcie': 'Zdjęcie',
        'Czcionka': 'Czcionka',
        'Klauzula poufności': 'Klauzula poufności',
        'Ikony / emoji / grafiki': 'Ikony / emoji / grafiki',
        'Adres zamieszkania': 'Adres zamieszkania',
        'Odnośniki zewnętrzne': 'Odnośniki zewnętrzne',
        'Długość CV': 'Długość CV',
        'Układ / kolumny': 'Układ / kolumny'
    },
    en: {
        'Zdjęcie': 'Photo',
        'Czcionka': 'Font',
        'Klauzula poufności': 'Confidentiality clause',
        'Ikony / emoji / grafiki': 'Icons / emoji / graphics',
        'Adres zamieszkania': 'Home address',
        'Odnośniki zewnętrzne': 'External links',
        'Długość CV': 'CV length',
        'Układ / kolumny': 'Layout / columns'
    }
};

const CRITERIA_LABELS = {
    pl: {
        'Przejrzystość tekstu': 'Przejrzystość tekstu',
        'Transparentność wizualna': 'Transparentność wizualna',
        'Kolorystyka': 'Kolorystyka',
        'Kompozycja': 'Kompozycja'
    },
    en: {
        'Przejrzystość tekstu': 'Text clarity',
        'Transparentność wizualna': 'Visual clarity',
        'Kolorystyka': 'Color scheme',
        'Kompozycja': 'Composition'
    }
};

const CRITERIA_INFO = {
    pl: {
        'Przejrzystość tekstu': 'Czy tekst jest łatwy do przeczytania - odpowiedni rozmiar czcionki, kontrast i odstępy między wierszami.',
        'Transparentność wizualna': 'Czy struktura CV jest czytelna na pierwszy rzut oka - wyraźny podział na sekcje i hierarchia informacji.',
        'Kolorystyka': 'Czy dobór kolorów jest spójny, czytelny i nie rozprasza uwagi od treści.',
        'Kompozycja': 'Czy elementy CV są dobrze rozmieszczone i zbalansowane na stronie.'
    },
    en: {
        'Przejrzystość tekstu': 'Whether the text is easy to read - appropriate font size, contrast, and line spacing.',
        'Transparentność wizualna': 'Whether the CV\'s structure is clear at a glance - distinct sections and a clear information hierarchy.',
        'Kolorystyka': 'Whether the color choices are consistent, readable, and don\'t distract from the content.',
        'Kompozycja': 'Whether the CV\'s elements are well arranged and balanced on the page.'
    }
};

const DECISION_LABELS = {
    pl: { 'Zatrudniono': 'Zatrudniono', 'Odrzucono': 'Odrzucono', 'Timeout': 'Timeout' },
    en: { 'Zatrudniono': 'Hired', 'Odrzucono': 'Rejected', 'Timeout': 'Timeout' }
};

function getLang() {
    return localStorage.getItem(I18N_LANG_KEY) === 'en' ? 'en' : 'pl';
}

function setLang(lang) {
    localStorage.setItem(I18N_LANG_KEY, lang === 'en' ? 'en' : 'pl');
}

function t(key, vars) {
    const lang = getLang();
    let str = (I18N[lang] && I18N[lang][key] !== undefined) ? I18N[lang][key] : (I18N.pl[key] ?? key);
    if (vars) {
        Object.keys(vars).forEach(k => {
            str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
        });
    }
    return str;
}

// Zamienia obiekt kanonicznego tagu/kryterium/decyzji na etykietę w bieżącym języku.
function tagLabel(tag) { return TAG_LABELS[getLang()]?.[tag] ?? tag; }
function criteriaLabel(crit) { return CRITERIA_LABELS[getLang()]?.[crit] ?? crit; }
function criteriaInfoText(crit) { return CRITERIA_INFO[getLang()]?.[crit] ?? ''; }
function decisionLabel(decision) { return DECISION_LABELS[getLang()]?.[decision] ?? decision; }

// Poprawna forma liczby mnogiej dla liczby opinii ("1 opinia" / "3 opinie" / "12 opinii" -> uproszczone do 2 form).
function opinionCountLabel(n) {
    if (getLang() === 'en') return `${n} ${n === 1 ? 'review' : 'reviews'}`;
    return `${n} ${n === 1 ? 'opinia' : 'opinii'}`;
}

// Wybiera aktualny język z obiektu dwujęzycznego {pl: "...", en: "..."} (używane przez cvDatabase w game.html).
function pickLang(obj) {
    if (obj == null) return obj;
    const lang = getLang();
    return obj[lang] ?? obj.pl ?? obj.en ?? obj;
}

// Podmienia statyczny tekst oznaczony atrybutami data-i18n-* na wersję w bieżącym języku.
// Używane przez strony ze statycznym markupem (index/options/setup/calibration) - strony,
// które generują cały swój UI w JS (game/summary/analysis), wołają t()/tagLabel()/... bezpośrednio.
function applyI18n(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    root.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    root.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
    });
    const titleEl = document.querySelector('title[data-i18n-doctitle]');
    if (titleEl) document.title = t(titleEl.getAttribute('data-i18n-doctitle'));
    document.documentElement.lang = getLang();
}

document.addEventListener('DOMContentLoaded', () => applyI18n());
