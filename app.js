// ===== КОНФИГУРАЦИЯ ИГРЫ =====
const CONFIG = {
    TOTAL_STAGES: 13,
    INITIAL_TIME: 45 * 60, // 45 минут в секундах
    MAX_HINTS: 3,
    MAX_SKIPS: 1,
    MAX_LIVES: 3,
    DAILY_BONUS: 100
};

// ===== ПЕРЕМЕННЫЕ ИГРЫ =====
let tg = null;
let gameState = {
    currentStage: 1,
    score: 0,
    timeLeft: CONFIG.INITIAL_TIME,
    timerInterval: null,
    isGameActive: false,
    hintsUsed: 0,
    skipsUsed: 0,
    lives: CONFIG.MAX_LIVES,
    startTime: null,
    playerName: 'Фермер',
    playerEmoji: '👨‍🌾'
};

// ===== ДАННЫЕ ЭТАПОВ =====
const stages = {
    1: {
        title: "🍎 ЭТАП 1: НАЧАЛО ЗАРАЖЕНИЯ",
        description: "Вы прибыли на ферму и обнаружили, что все животные ведут себя странно. Безумный ученый Агриус провел неудачный эксперимент! Первая подсказка - найдите зараженное яблоко с кодом у входа.",
        task: "🔍 Найдите зараженное яблоко с кодом на территории фермы",
        hint: "💡 Код состоит из слова 'ЗАРАЖЕНИЕ' и года через нижнее подчеркивание",
        fact: "🐔 Интересный факт: Куры могут запомнить до 100 разных лиц!",
        answer: "ЗАРАЖЕНИЕ_2024",
        points: 100,
        difficulty: "easy",
        timeBonus: 50
    },
    2: {
        title: "🥚 ЭТАП 2: ТАЙНА ЗОМБИ-ЯИЦ",
        description: "Зомби-куры снесли яйца со странными символами! Каждое яйцо содержит уникальный символ. Вам нужно найти все 5 яиц и собрать код в правильной последовательности.",
        task: "🔍 Найдите 5 яиц с символами в курятнике и расшифруйте код",
        hint: "💡 Символы нужно ввести в том порядке, в котором они расположены от входа: Ω † ∞ ¤ §",
        fact: "🥚 Куриное яйко может быть до 12 различных цветов в зависимости от породы!",
        answer: "Ω†∞¤§",
        points: 150,
        difficulty: "medium",
        timeBonus: 75
    },
    3: {
        title: "🦢 ЭТАП 3: ГУСИ-ОХРАННИКИ",
        description: "Территория охраняется агрессивными гусями-зомби! Они не пропускают никого без пароля. Вам нужно найти способ успокоить гусей и получить доступ к следующей зоне.",
        task: "🦢 Успокойте гусей-охранников с помощью специального пароля",
        hint: "💡 Пароль связан с их поведением - они шипят когда видят угрозу",
        fact: "🦢 Гуси образуют пары на всю жизнь и могут прожить до 25 лет!",
        answer: "ГУСИ_ОХРАННИКИ",
        points: 200,
        difficulty: "medium",
        timeBonus: 100
    },
    4: {
        title: "🦙 ЭТАП 4: МУДРАЯ ЛАМА",
        description: "Лама на ферме кажется единственным животным, сохранившим рассудок. Она наблюдает за происходящим и знает секрет антидота, но общается только на языке чисел.",
        task: "🔢 Расшифруйте числовое послание ламы",
        hint: "💡 Лама показывает года важных событий фермы. Нужен последний год",
        fact: "🦙 Ламы используются как сторожевые животные для охраны овец от койотов!",
        answer: "1998",
        points: 250,
        difficulty: "hard",
        timeBonus: 125
    },
    5: {
        title: "🦘 ЭТАП 5: ПРЫГАЮЩИЙ КЕНГУРУ",
        description: "Кенгуру-зомби прыгает по ферме, оставляя за собой следы. Каждый прыжок - это часть кода. Проследите его маршрут от стартовой точки до укрытия.",
        task: "🎯 Проследите маршрут кенгуру и подсчитайте прыжки",
        hint: "💡 Начинайте отсчет от большого дуба у входа",
        fact: "🦘 Детеныш кенгуру при рождении размером с фасолину!",
        answer: "7",
        points: 300,
        difficulty: "medium",
        timeBonus: 150
    },
    6: {
        title: "🐄 ЭТАП 6: ТАЙНА МОЛОЧНОГО ЦЕХА",
        description: "В молочном цеху коровы производят зараженное молоко разных цветов. Антидот скрыт в правильной комбинации бутылок. Найдите логику в расположении бутылок.",
        task: "🎨 Найдите правильную комбинацию цветных бутылок молока",
        hint: "💡 Обратите внимание на порядок цветов радуги",
        fact: "🐄 Корова может узнать до 50 других коров и имеет лучших друзей!",
        answer: "ЗЕЛЕНЫЙ7",
        points: 350,
        difficulty: "hard",
        timeBonus: 175
    },
    7: {
        title: "🐑 ЭТАП 7: ОВЕЧЬЕ СТАДО",
        description: "Овцы стали агрессивными и сбились в кучу. Чтобы успокоить их, нужно понять закономерность в их движении. Белые и черные овцы движутся по разным схемам.",
        task: "🔢 Посчитайте количество белых и черных овец в стаде",
        hint: "💡 Белые овцы движутся по кругу, черные - зигзагом",
        fact: "🐑 Овцы имеют поле зрения 270 градусов и могут видеть behind себя без поворота головы!",
        answer: "15_10",
        points: 400,
        difficulty: "medium",
        timeBonus: 200
    },
    8: {
        title: "📱 ЭТАП 8: ЦИФРОВАЯ ЛАБОРАТОРИЯ",
        description: "Вы нашли планшет Агриуса с данными эксперимента! Он защищен сложным паролем. Взломайте систему, используя подсказки из дневника ученого.",
        task: "💻 Взломайте пароль на планшете Агриуса",
        hint: "💡 Пароль - дата начала эксперимента в формате ДД.ММ.ГГГГ",
        fact: "📱 Первый сенсорный телефон был создан в 1992 году компанией IBM!",
        answer: "15.03.2024",
        points: 450,
        difficulty: "hard",
        timeBonus: 225
    },
    9: {
        title: "🧩 ЭТАП 9: ПАЗЛ ЛАБОРАТОРИИ",
        description: "План лаборатории разорван на 12 частей. Соберите пазл, чтобы понять расположение комнат и найти скрытое сообщение, которое приведет к антидоту.",
        task: "🧩 Соберите пазл и расшифруйте скрытое сообщение",
        hint: "💡 Собирайте от углов, обращайте внимание на цветные метки",
        fact: "🧩 Самый большой пазл в мире состоит из 551,232 деталей!",
        answer: "СПАСИТЕФЕРМУ",
        points: 500,
        difficulty: "medium",
        timeBonus: 250
    },
    10: {
        title: "🔦 ЭТАП 10: НОЧНАЯ ОХОТА",
        description: "С наступлением темноты зомби-животные становятся активнее. С помощью фонарика найдите спрятанные предметы, которые помогут создать антидот.",
        task: "🌙 Найдите 5 спрятанных предметов в темноте",
        hint: "💡 Предметы светятся в ультрафиолетовом свете",
        fact: "🦉 Многие ночные животные видят в темноте в 6 раз лучше человека!",
        answer: "5",
        points: 550,
        difficulty: "hard",
        timeBonus: 275
    },
    11: {
        title: "🧪 ЭТАП 11: ЛАБОРАТОРИЯ АНТИДОТА",
        description: "Вы пробрались в секретную лабораторию Агриуса! Теперь нужно создать антидот, смешав правильные ингредиенты в точной последовательности.",
        task: "⚗️ Смешайте правильные ингредиенты для создания антидота",
        hint: "💡 Следуйте формуле: ЗЕЛЕНЫЙ + КРАСНЫЙ + СИНИЙ",
        fact: "🧪 Первый антибиотик (пенициллин) был открыт случайно в 1928 году!",
        answer: "ЗЕЛЕНЬ+КРАСНЫЙ+СИНИЙ",
        points: 600,
        difficulty: "expert",
        timeBonus: 300
    },
    12: {
        title: "🎭 ЭТАП 12: МАСКАРАД АГРИУСА",
        description: "Агриус спрятался среди зомби-животных! Найдите его по subtle отличиям в поведении и внешности. Он пытается сбежать с формулой антидота!",
        task: "👀 Найдите Агриуса среди зомби-животных",
        hint: "💡 Обращайте внимание на движения глаз и неестественное поведение",
        fact: "🎭 Искусство маскировки существует тысячи лет - от охоты до военных действий!",
        answer: "3",
        points: 650,
        difficulty: "expert",
        timeBonus: 325
    },
    13: {
        title: "🏆 ЭТАП 13: ФИНАЛЬНАЯ БИТВА",
        description: "ФИНАЛ! Агриус активировал систему защиты лаборатории. У вас есть последний шанс остановить его и спасти ферму. Введите финальный код!",
        task: "⚡ Введите финальный код для активации системы спасения",
        hint: "💡 Код - общее количество всех животных на ферме",
        fact: "🏆 Поздравляем! Вы стали героем фермы и спасли всех животных!",
        answer: "42",
        points: 1000,
        difficulty: "legendary",
        timeBonus: 500
    }
};

// ===== ДОСТИЖЕНИЯ =====
const achievements = {
    first_blood: { name: "Первая кровь", desc: "Пройдите первый этап", icon: "🩸" },
    speedrunner: { name: "Спидраннер", desc: "Пройдите игру менее чем за 30 минут", icon: "⚡" },
    perfectionist: { name: "Перфекционист", desc: "Пройдите все этапы без ошибок", icon: "⭐" },
    scholar: { name: "Эрудит", desc: "Используйте все подсказки", icon: "📚" },
    hero: { name: "Герой фермы", desc: "Наберите более 5000 очков", icon: "🦸" },
    explorer: { name: "Исследователь", desc: "Пройдите все этапы", icon: "🧭" }
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎮 Инициализация игры Зомби-Ферма...");
    initializeGame();
});

function initializeGame() {
    try {
        // Инициализация Telegram Web App
        if (window.Telegram && window.Telegram.WebApp) {
            tg = window.Telegram.WebApp;
            tg.expand();
            tg.enableClosingConfirmation();
            setupTelegramUser();
            console.log("✅ Telegram Web App инициализирован");
        } else {
            console.log("🌐 Режим браузера");
        }

        // Загрузка сохраненного прогресса
        loadGameProgress();
        
        // Настройка обработчиков событий
        setupEventListeners();
        
        // Запуск анимации загрузки
        simulateLoading();
        
    } catch (error) {
        console.error("❌ Ошибка инициализации:", error);
        showMainMenu();
    }
}

function setupTelegramUser() {
    if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        gameState.playerName = user.first_name || 'Фермер';
        gameState.playerEmoji = '👨‍🌾';
        
        // Обновляем отображение имени
        const playerNameElements = document.querySelectorAll('#player-name, #mini-player-name');
        playerNameElements.forEach(el => {
            if (el) el.textContent = gameState.playerName;
        });
        
        const playerEmojiElements = document.querySelectorAll('#player-emoji, #mini-player-emoji');
        playerEmojiElements.forEach(el => {
            if (el) el.textContent = gameState.playerEmoji;
        });
    }
}

function simulateLoading() {
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Показываем главное меню после загрузки
            setTimeout(() => {
                showMainMenu();
            }, 500);
        }
        
        const progressBar = document.getElementById('loading-progress');
        const loadingTip = document.getElementById('loading-tip');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        
        // Меняем подсказки во время загрузки
        if (loadingTip) {
            const tips = [
                "Подготовка к приключению...",
                "Загружаем зомби-животных...",
                "Настраиваем ферму...",
                "Почти готово...",
                "Начинаем спасательную операцию!"
            ];
            const tipIndex = Math.floor(progress / 20);
            if (tipIndex < tips.length) {
                loadingTip.textContent = tips[tipIndex];
            }
        }
    }, 200);
}

// ===== УПРАВЛЕНИЕ ЭКРАНАМИ =====
function showScreen(screenId) {
    console.log(`🖥 Переключаемся на экран: ${screenId}`);
    
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.add('fade-in');
        
        // Удаляем анимацию после завершения
        setTimeout(() => {
            targetScreen.classList.remove('fade-in');
        }, 500);
    }
}

function showMainMenu() {
    updatePlayerStats();
    showScreen('main-menu');
}

function showGameScreen() {
    showScreen('game-screen');
    startGame();
}

function showPauseScreen() {
    if (!gameState.isGameActive) return;
    
    // Обновляем статистику на экране паузы
    document.getElementById('pause-stage').textContent = 
        `${gameState.currentStage}/${CONFIG.TOTAL_STAGES}`;
    document.getElementById('pause-score').textContent = gameState.score;
    
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    document.getElementById('pause-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    showScreen('pause-screen');
}

function showResultsScreen() {
    calculateFinalResults();
    showScreen('results-screen');
}

// ===== ИГРОВАЯ ЛОГИКА =====
function startGame() {
    console.log("🎮 Начинаем новую игру!");
    
    // Сброс состояния игры (или загрузка сохраненного)
    if (!loadGameProgress()) {
        gameState = {
            currentStage: 1,
            score: 0,
            timeLeft: CONFIG.INITIAL_TIME,
            timerInterval: null,
            isGameActive: true,
            hintsUsed: 0,
            skipsUsed: 0,
            lives: CONFIG.MAX_LIVES,
            startTime: Date.now(),
            playerName: gameState.playerName,
            playerEmoji: gameState.playerEmoji
        };
    }
    
    // Запуск таймера
    startTimer();
    
    // Загрузка первого этапа
    loadStage(gameState.currentStage);
    
    // Обновление интерфейса
    updateGameUI();
}

function loadStage(stageNumber) {
    console.log(`📖 Загружаем этап ${stageNumber}`);
    
    const stage = stages[stageNumber];
    if (!stage) {
        endGame(true);
        return;
    }
    
    const stageContent = document.getElementById('stage-content');
    if (!stageContent) return;
    
    // Создаем контент этапа
    stageContent.innerHTML = `
        <div class="stage-header">
            <h2 class="stage-title">${stage.title}</h2>
            <p class="stage-description">${stage.description}</p>
        </div>
        
        <div class="stage-task">
            <h3>🎯 Задача:</h3>
            <p>${stage.task}</p>
        </div>
        
        ${stage.hint ? `
        <div class="stage-hint">
            <h3>💡 Подсказка:</h3>
            <p>${stage.hint}</p>
        </div>
        ` : ''}
        
        ${stage.fact ? `
        <div class="stage-fact">
            <h3>🧠 Интересный факт:</h3>
            <p>${stage.fact}</p>
        </div>
        ` : ''}
        
        <div class="stage-difficulty">
            <span class="difficulty-badge ${stage.difficulty}">
                Сложность: ${getDifficultyText(stage.difficulty)}
            </span>
            <span class="points-value">+${stage.points} очков</span>
        </div>
    `;
    
    // Обновляем отображение текущего этапа
    document.getElementById('current-stage-display').textContent = 
        `${stageNumber}/${CONFIG.TOTAL_STAGES}`;
    
    // Обновляем прогресс-бар
    updateProgressBar();
    
    // Фокусируемся на поле ввода
    setTimeout(() => {
        const answerInput = document.getElementById('answer-input');
        if (answerInput) answerInput.focus();
    }, 100);
}

function getDifficultyText(difficulty) {
    const difficulties = {
        easy: "Лёгкая",
        medium: "Средняя",
        hard: "Сложная",
        expert: "Эксперт",
        legendary: "Легендарная"
    };
    return difficulties[difficulty] || difficulty;
}

function checkAnswer() {
    const input = document.getElementById('answer-input');
    if (!input) return;
    
    const userAnswer = input.value.trim();
    const currentStage = stages[gameState.currentStage];
    
    if (!userAnswer) {
        showNotification('Введите ответ!', 'error');
        return;
    }
    
    // Нормализация ответа для сравнения
    const normalizedUserAnswer = userAnswer.toUpperCase().replace(/\s+/g, '');
    const normalizedCorrectAnswer = currentStage.answer.toUpperCase().replace(/\s+/g, '');
    
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
        // Правильный ответ
        handleCorrectAnswer();
    } else {
        // Неправильный ответ
        handleWrongAnswer();
    }
}

function handleCorrectAnswer() {
    const currentStage = stages[gameState.currentStage];
    
    // Начисляем очки
    gameState.score += currentStage.points;
    
    // Бонус за скорость
    const timeBonus = Math.floor((gameState.timeLeft / CONFIG.INITIAL_TIME) * currentStage.timeBonus);
    if (timeBonus > 0) {
        gameState.score += timeBonus;
    }
    
    showNotification(`✅ Правильно! +${currentStage.points} очков${timeBonus ? ` +${timeBonus} за скорость` : ''}`, 'success');
    
    // Переход к следующему этапу
    setTimeout(() => {
        gameState.currentStage++;
        
        if (gameState.currentStage <= CONFIG.TOTAL_STAGES) {
            loadStage(gameState.currentStage);
        } else {
            endGame(true); // Победа!
        }
        
        updateGameUI();
        saveGameProgress();
    }, 1500);
}

function handleWrongAnswer() {
    gameState.lives--;
    
    if (gameState.lives <= 0) {
        showNotification('💀 Закончились жизни! Игра окончена.', 'error');
        setTimeout(() => {
            endGame(false);
        }, 2000);
    } else {
        showNotification(`❌ Неправильно! Осталось жизней: ${gameState.lives}`, 'error');
        
        // Очищаем поле ввода
        const input = document.getElementById('answer-input');
        if (input) {
            input.value = '';
            input.focus();
        }
    }
    
    updateGameUI();
}

function useHint() {
    if (gameState.hintsUsed >= CONFIG.MAX_HINTS) {
        showNotification('ℹ️ Подсказки закончились!', 'warning');
        return;
    }
    
    const currentStage = stages[gameState.currentStage];
    if (!currentStage.hint) return;
    
    gameState.hintsUsed++;
    showNotification(`💡 Использована подсказка! Осталось: ${CONFIG.MAX_HINTS - gameState.hintsUsed}`, 'success');
    
    // Здесь можно показать модальное окно с подсказкой
    const hintModal = document.getElementById('hint-modal');
    const hintText = document.getElementById('hint-text');
    
    if (hintModal && hintText) {
        hintText.textContent = currentStage.hint;
        hintModal.classList.add('active');
    }
    
    updateGameUI();
}

function skipStage() {
    if (gameState.skipsUsed >= CONFIG.MAX_SKIPS) {
        showNotification('ℹ️ Пропуски закончились!', 'warning');
        return;
    }
    
    gameState.skipsUsed++;
    gameState.currentStage++;
    
    showNotification(`⏩ Этап пропущен! Осталось пропусков: ${CONFIG.MAX_SKIPS - gameState.skipsUsed}`, 'success');
    
    if (gameState.currentStage <= CONFIG.TOTAL_STAGES) {
        loadStage(gameState.currentStage);
    } else {
        endGame(true);
    }
    
    updateGameUI();
    saveGameProgress();
}

function endGame(isVictory) {
    gameState.isGameActive = false;
    clearInterval(gameState.timerInterval);
    
    if (isVictory) {
        // Дополнительные очки за победу
        const victoryBonus = Math.floor(gameState.timeLeft * 0.5);
        gameState.score += victoryBonus;
        
        showNotification(`🎉 Победа! Бонус за время: +${victoryBonus} очков`, 'success');
        
        // Разблокируем достижения
        unlockAchievements();
    }
    
    // Сохраняем рекорд
    saveHighScore();
    
    // Показываем экран результатов
    setTimeout(() => {
        showResultsScreen();
    }, 2000);
}

// ===== ТАЙМЕР =====
function startTimer() {
    clearInterval(gameState.timerInterval);
    
    gameState.timerInterval = setInterval(() => {
        if (gameState.isGameActive && gameState.timeLeft > 0) {
            gameState.timeLeft--;
            updateTimerDisplay();
            
            // Предупреждение при малом времени
            if (gameState.timeLeft === 300) { // 5 минут
                showNotification('⏰ Осталось 5 минут!', 'warning');
            } else if (gameState.timeLeft === 60) { // 1 минута
                showNotification('🚨 Осталась 1 минута!', 'error');
            }
        } else if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            showNotification('⏰ Время вышло!', 'error');
            endGame(false);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Меняем цвет при малом времени
    if (gameState.timeLeft < 300) {
        timerDisplay.style.color = 'var(--danger-color)';
    } else if (gameState.timeLeft < 600) {
        timerDisplay.style.color = 'var(--warning-color)';
    } else {
        timerDisplay.style.color = 'inherit';
    }
}

// ===== ИНТЕРФЕЙС =====
function updateGameUI() {
    // Обновляем статистику
    document.getElementById('score-display').textContent = gameState.score;
    document.getElementById('current-stage-display').textContent = 
        `${gameState.currentStage}/${CONFIG.TOTAL_STAGES}`;
    
    // Обновляем жизни
    document.getElementById('lives-count').textContent = gameState.lives;
    
    // Обновляем подсказки и пропуски
    document.getElementById('hints-left').textContent = CONFIG.MAX_HINTS - gameState.hintsUsed;
    document.getElementById('skips-left').textContent = CONFIG.MAX_SKIPS - gameState.skipsUsed;
    
    // Обновляем прогресс-бар этапов
    updateProgressBar();
}

function updateProgressBar() {
    const progress = ((gameState.currentStage - 1) / CONFIG.TOTAL_STAGES) * 100;
    const progressBar = document.getElementById('stage-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

function updatePlayerStats() {
    const bestScore = localStorage.getItem('zombieFarmBestScore') || 0;
    document.getElementById('player-best-score').textContent = bestScore;
    
    // Рассчитываем уровень игрока
    const level = Math.floor(bestScore / 1000) + 1;
    document.getElementById('player-level').textContent = level;
}

// ===== РЕЗУЛЬТАТЫ =====
function calculateFinalResults() {
    const completedStages = gameState.currentStage - 1;
    const completionPercent = Math.round((completedStages / CONFIG.TOTAL_STAGES) * 100);
    
    // Обновляем статистику на экране результатов
    document.getElementById('final-stages').textContent = 
        `${completedStages}/${CONFIG.TOTAL_STAGES}`;
    document.getElementById('final-score').textContent = gameState.score;
    
    const timeSpent = CONFIG.INITIAL_TIME - gameState.timeLeft;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    document.getElementById('final-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Определяем рейтинг
    const rating = calculateRating(gameState.score, completionPercent);
    document.getElementById('final-rating').textContent = rating;
    
    // Показываем полученные достижения
    displayEarnedAchievements();
}

function calculateRating(score, completion) {
    if (completion === 100 && score >= 6000) return "🧙‍♂️ ЛЕГЕНДА ФЕРМЫ";
    if (completion === 100 && score >= 5000) return "🏆 МАСТЕР СПАСЕНИЯ";
    if (completion >= 80 && score >= 4000) return "⭐ ГЕРОЙ ФЕРМЫ";
    if (completion >= 60 && score >= 3000) return "👍 ОПЫТНЫЙ ФЕРМЕР";
    if (completion >= 40 && score >= 2000) return "🌱 НАЧИНАЮЩИЙ";
    return "🎯 НОВИЧОК";
}

function displayEarnedAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    if (!achievementsList) return;
    
    // Здесь можно добавить логику отображения полученных достижений
    achievementsList.innerHTML = `
        <div class="achievement-item">
            <span class="achievement-icon">⭐</span>
            <div class="achievement-info">
                <strong>Первопроходец</strong>
                <p>Завершили игру!</p>
            </div>
        </div>
    `;
}

// ===== СОХРАНЕНИЕ ДАННЫХ =====
function saveGameProgress() {
    const progress = {
        currentStage: gameState.currentStage,
        score: gameState.score,
        timeLeft: gameState.timeLeft,
        hintsUsed: gameState.hintsUsed,
        skipsUsed: gameState.skipsUsed,
        lives: gameState.lives,
        timestamp: Date.now()
    };
    
    try {
        localStorage.setItem('zombieFarmProgress', JSON.stringify(progress));
    } catch (error) {
        console.error('❌ Ошибка сохранения прогресса:', error);
    }
}

function loadGameProgress() {
    try {
        const saved = localStorage.getItem('zombieFarmProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            
            // Проверяем, не устарели ли сохранения (больше 24 часов)
            if (Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) {
                Object.assign(gameState, progress);
                return true;
            }
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки прогресса:', error);
    }
    return false;
}

function saveHighScore() {
    const currentBest = parseInt(localStorage.getItem('zombieFarmBestScore') || '0');
    if (gameState.score > currentBest) {
        localStorage.setItem('zombieFarmBestScore', gameState.score.toString());
    }
}

function unlockAchievements() {
    // Здесь можно добавить логику разблокировки достижений
    const unlocked = JSON.parse(localStorage.getItem('zombieFarmAchievements') || '[]');
    
    if (!unlocked.includes('explorer')) {
        unlocked.push('explorer');
        showNotification('🎉 Достижение разблокировано: Исследователь!', 'success');
    }
    
    if (gameState.score >= 5000 && !unlocked.includes('hero')) {
        unlocked.push('hero');
        showNotification('🎉 Достижение разблокировано: Герой фермы!', 'success');
    }
    
    localStorage.setItem('zombieFarmAchievements', JSON.stringify(unlocked));
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    console.log(`💬 ${type.toUpperCase()}: ${message}`);
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function setupEventListeners() {
    console.log("🔗 Настраиваем обработчики событий...");
    
    // Главное меню
    document.getElementById('start-game')?.addEventListener('click', showGameScreen);
    document.getElementById('continue-game')?.addEventListener('click', showGameScreen);
    document.getElementById('how-to-play')?.addEventListener('click', () => {
        showNotification('📚 Проходите этапы, вводите коды и спасайте ферму!', 'info');
    });
    
    // Игровой экран
    document.getElementById('pause-btn')?.addEventListener('click', showPauseScreen);
    document.getElementById('submit-answer')?.addEventListener('click', checkAnswer);
    document.getElementById('hint-btn')?.addEventListener('click', useHint);
    document.getElementById('skip-btn')?.addEventListener('click', skipStage);
    
    // Поле ввода ответа
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAnswer();
        });
    }
    
    // Экран паузы
    document.getElementById('resume-game')?.addEventListener('click', () => showScreen('game-screen'));
    document.getElementById('restart-game')?.addEventListener('click', () => {
        if (confirm('Начать игру заново?')) {
            localStorage.removeItem('zombieFarmProgress');
            showGameScreen();
        }
    });
    document.getElementById('quit-to-menu')?.addEventListener('click', showMainMenu);
    
    // Экран результатов
    document.getElementById('play-again')?.addEventListener('click', () => {
        localStorage.removeItem('zombieFarmProgress');
        showGameScreen();
    });
    document.getElementById('share-result')?.addEventListener('click', shareResults);
    document.getElementById('back-to-menu-from-results')?.addEventListener('click', showMainMenu);
    
    // Модальные окна
    document.querySelector('.modal-close')?.addEventListener('click', () => {
        document.getElementById('hint-modal')?.classList.remove('active');
    });
    
    // Закрытие модальных окон по клику вне области
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    console.log("✅ Обработчики событий настроены");
}

// ===== ШЕРИНГ =====
function shareResults() {
    const results = {
        score: gameState.score,
        stages: gameState.currentStage - 1,
        total: CONFIG.TOTAL_STAGES
    };
    
    const shareText = `Я прошел(а) ${results.stages} из ${results.total} этапов в игре "Зомби-Ферма" и набрал(а) ${results.score} очков! 🧟🏆\n\nПрисоединяйся к спасательной операции!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Мой результат в Зомби-Ферме',
            text: shareText
        });
    } else if (tg && tg.share) {
        tg.share(shareText);
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('📋 Результат скопирован в буфер обмена!', 'success');
        });
    }
}

// ===== СЛУЖЕБНЫЕ ФУНКЦИИ =====
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getRandomTip() {
    const tips = [
        "💡 Внимательно читайте описания этапов!",
        "💡 Используйте подсказки экономно!",
        "💡 Следите за временем!",
        "💡 Не торопитесь - обдумайте ответ!",
        "💡 Изучайте интересные факты о животных!"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// Экспортируем функции для глобального использования
window.showMainMenu = showMainMenu;
window.shareResults = shareResults;

console.log("🎮 Игра Зомби-Ферма инициализирована и готова к работе!");
