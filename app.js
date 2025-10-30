// app.js
// ===== КОНФИГУРАЦИЯ ИГРЫ =====
const CONFIG = {
    TOTAL_STAGES: 10,
    INITIAL_TIME: 45 * 60, // 45 минут в секундах
    MAX_HINTS: 5, // Увеличили до 5 подсказок
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
        title: "🥚 ЭТАП 1: ТАЙНА ЯИЦ",
        description: "Конюх накормил животных странным кормом. Пройдите в каретный двор. Отгадай чье яйцо, расположи в правильной последовательности от большей птицы к меньшей.",
        task: "🔍 Расположи яйца в правильной последовательности от большей птицы к меньшей",
        hint: "💡 Птицы по размеру: страус > гусь > курица > цесарка",
        joke: "🐔 Почему курица перешла дорогу? Чтобы не стать зомби-курицей! 🧟‍♂️",
        fact: "🐔 Страусиное яйцо - самое большое в мире и может весить до 2 кг!",
        answer: "2314",
        points: 100,
        difficulty: "easy",
        timeBonus: 50
    },
    2: {
        title: "🦢 ЭТАП 2: ДОБРЫЕ ГУСИ",
        description: "В Марьино наши гуси очень добрые! Сделай селфи с нашими добрыми гусями и отправь на номер +79817208061",
        task: "📸 Сделай селфи с гусями и отправь на номер +79817208061",
        hint: "💡 После отправки селфи получи код для продолжения",
        joke: "🦢 Гусь говорит: 'Я не зомби, я просто очень преданный!' 🧟‍♀️",
        fact: "🦢 Гуси могут летать на высоте до 8 километров и преодолевать огромные расстояния во время миграции!",
        answer: "СЕЛФИ",
        points: 150,
        difficulty: "easy",
        timeBonus: 75
    },
    3: {
        title: "🦙 ЭТАП 3: ТАКТИЛЬНЫЙ ДЕТЕКТИВ",
        description: "Альпаки славятся своей роскошной шерстью! Она ценится во всем мире. Проверьте свои чувства! С завязанными глазами найдите тот мешочек, где спрятана шерсть альпаки.",
        task: "🔍 На ощупь определи, в каком мешочке шерсть альпаки",
        hint: "💡 Шерсть альпаки очень мягкая и нежная, в отличие от грубой овечьей шерсти",
        joke: "🦙 Альпака шепчет: 'Моя шерсть такая мягкая, что даже зомби становятся добрыми!' 🧟‍♂️❤️",
        fact: "🦙 Шерсть альпаки в 7 раз теплее овечьей и не содержит ланолина!",
        answer: "3",
        points: 200,
        difficulty: "medium",
        timeBonus: 100
    },
    4: {
        title: "🐕 ЭТАП 4: ВЕСЕЛЫЕ СОБАКИ",
        description: "На ферме живут веселые собаки! Прогуляйтесь до вольера с собаками - эти собаки есть на ферме и кому интересно может прогуляться до них.",
        task: "🔍 Найдите вольер с собаками и получите код",
        hint: "💡 Код связан с нашими верными друзьями",
        joke: "🐕 Собака думает: 'Я бы погнался за зомби-костями, но они слишком воняют!' 🦴🧟‍♂️",
        fact: "🐕 Собаки могут понимать до 250 слов и жестов!",
        answer: "СОБАКИ",
        points: 250,
        difficulty: "easy",
        timeBonus: 125
    },
    5: {
        title: "🐄 ЭТАП 5: РАДУЖНОЕ МОЛОКО",
        description: "В молочном цеху появилось молоко разных цветов. Найдите логику в расположении бутылок. Расставив бутылки по цветам радуги получается слово.",
        task: "🎨 Расставьте бутылки в порядке цветов радуги и прочитайте слово",
        hint: "💡 Цвета радуги: красный, оранжевый, желтый, зеленый, голубой, синий, фиолетовый",
        joke: "🐄 Корова шутит: 'Мое молоко теперь всех цветов радуги, кроме зомби-зеленого!' 🌈🧟‍♂️",
        fact: "🐄 Корова может давать до 25 литров молока в день!",
        answer: "КОНЬ",
        points: 300,
        difficulty: "medium",
        timeBonus: 150
    },
    6: {
        title: "🐑 ЭТАП 6: ОВЕЧЬЕ СТАДО",
        description: "Овцы стали более активные. Их нужно посчитать. У вас есть 5 попыток!",
        task: "🔢 Посчитайте количество овец в стаде",
        hint: "💡 Попробуйте посчитать овец, когда они в движении",
        joke: "🐑 Овца бормочет: 'Я бы посчитала себя, но боюсь зомби-математиков!' 🧟‍♂️➗",
        fact: "🐑 Овцы имеют отличную память и могут помнить до 50 других овец и людей!",
        answer: "41",
        points: 350,
        difficulty: "hard",
        timeBonus: 175
    },
    7: {
        title: "🐴 ЭТАП 7: ТАЙНА ЛОШАДЕЙ",
        description: "Лошадей на ферме 12. Из них 1 девочка и одного зовут в честь самой высокой горы в мире.",
        task: "🔍 Как зовут лошадь, названную в честь самой высокой горы в мире?",
        hint: "💡 Это самая высокая гора в мире",
        joke: "🐴 Лошадь ржет: 'Я не Эверест, но тоже высокая и красивая!' 🏔️🧟‍♂️",
        fact: "🐴 Лошади могут спать как стоя, так и лежа!",
        answer: "ЭВЕРЕСТ",
        points: 400,
        difficulty: "medium",
        timeBonus: 200
    },
    8: {
        title: "🧩 ЭТАП 8: ПАЗЛ В ДЕННИКЕ",
        description: "Соберите пазл в деннике у лошадей, чтобы найти скрытое сообщение.",
        task: "🧩 Соберите пазл и расшифруйте скрытое сообщение",
        hint: "💡 Слово заканчивается на ...сенник!",
        joke: "🧩 Пазл жалуется: 'Собирать меня - это не зомби-апокалипсис пережить!' 🧟‍♂️😄",
        fact: "🧩 Пазлы были изобретены в 1760 году как учебное пособие по географии!",
        answer: "СЕННИК",
        points: 450,
        difficulty: "hard",
        timeBonus: 225
    },
    9: {
        title: "🔦 ЭТАП 9: НОЧНАЯ ОХОТА",
        description: "С наступлением темноты животные становятся активнее. С помощью фонарика найдите спрятанные предметы. Затем нарисуй животное, которое тебе больше нравится на ферме.",
        task: "🌙 Найдите 5 спрятанных предметов в темноте",
        hint: "💡 Используйте фонарик, чтобы найти светящиеся в темноте предметы",
        joke: "🔦 Фонарик говорит: 'Я освещаю путь, чтобы ты не наступил на зомби-курицу!' 🐔🧟‍♂️",
        fact: "🦉 Многие ночные животные видят в темноте в 6 раз лучше человека!",
        answer: "5",
        points: 500,
        difficulty: "hard",
        timeBonus: 250
    },
    10: {
        title: "🏆 ЭТАП 10: ФИНАЛЬНАЯ БИТВА",
        description: "ФИНАЛ! Подсчитайте общее количество разновидностей животных и птиц на ферме.",
        task: "⚡ Введите количество разновидностей животных и птиц",
        hint: "💡 Утки, гуси, цесарки, лебеди, альпаки, пони, лошади, страусы, павлины, фазан, собаки, курица, овца, корова",
        joke: "🏆 Фермер кричит: '14 видов животных, и все хотят есть... кроме зомби, те хотят мозги!' 🧠🧟‍♂️",
        fact: "🏆 Поздравляем! Вы стали героем фермы и спасли всех животных!",
        answer: "14",
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
    if (tg?.initDataUnsafe?.user) {
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
    
    // Останавливаем таймер при паузе
    clearInterval(gameState.timerInterval);
    
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
            startTime: new Date(),
            playerName: gameState.playerName,
            playerEmoji: gameState.playerEmoji
        };
    } else {
        // Если загружаем сохраненную игру, устанавливаем флаг активности
        gameState.isGameActive = true;
    }
    
    // Запуск таймера
    startTimer();
    
    // Загрузка текущего этапа
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
    
    // Создаем контент этапа (убрали подсказку, добавили шутку)
    stageContent.innerHTML = `
        <div class="stage-header">
            <h2 class="stage-title">${stage.title}</h2>
            <p class="stage-description">${stage.description}</p>
        </div>
        
        <div class="stage-task">
            <h3>🎯 Задача:</h3>
            <p>${stage.task}</p>
        </div>
        
        ${stage.joke ? `
        <div class="stage-hint">
            <h3>😄 Шутка дня:</h3>
            <p>${stage.joke}</p>
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
    
    // Очищаем поле ввода
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        answerInput.value = '';
    }
    
    // Фокусируемся на поле ввода
    setTimeout(() => {
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
    saveGameProgress();
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
    
    // Показываем модальное окно с подсказкой
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
        
        // Увеличиваем счетчик прохождений
        incrementPlayCount();
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
    
    // Сразу обновляем отображение таймера
    updateTimerDisplay();
    
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
    
    // Обновляем подсказки и пропуски (теперь 5 подсказок)
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
    
    // Показываем количество прохождений
    const playCount = localStorage.getItem('zombieFarmPlayCount') || 1;
    document.getElementById('play-count').textContent = playCount;
    
    // Показываем полученные достижения
    displayEarnedAchievements();
}

function calculateRating(score, completion) {
    if (completion === 100 && score >= 3500) return "🧙‍♂️ ЛЕГЕНДА ФЕРМЫ";
    if (completion === 100 && score >= 3000) return "🏆 МАСТЕР СПАСЕНИЯ";
    if (completion >= 80 && score >= 2500) return "⭐ ГЕРОЙ ФЕРМЫ";
    if (completion >= 60 && score >= 2000) return "👍 ОПЫТНЫЙ ФЕРМЕР";
    if (completion >= 40 && score >= 1500) return "🌱 НАЧИНАЮЩИЙ";
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

function incrementPlayCount() {
    let playCount = parseInt(localStorage.getItem('zombieFarmPlayCount') || '0');
    playCount++;
    localStorage.setItem('zombieFarmPlayCount', playCount.toString());
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
        timestamp: new Date().getTime()
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
            if (new Date().getTime() - progress.timestamp < 24 * 60 * 60 * 1000) {
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
    document.getElementById('leaderboard')?.addEventListener('click', () => {
        showNotification('🏆 Функция рейтинга скоро будет доступна!', 'info');
    });
    document.getElementById('achievements')?.addEventListener('click', () => {
        showNotification('🎯 Функция достижений скоро будет доступна!', 'info');
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
    document.getElementById('resume-game')?.addEventListener('click', () => {
        // Возобновляем игру
        gameState.isGameActive = true;
        startTimer();
        showScreen('game-screen');
    });
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
    document.getElementById('save-result')?.addEventListener('click', () => {
        showNotification('💾 Результат сохранен!', 'success');
    });
    document.getElementById('back-to-menu-from-results')?.addEventListener('click', showMainMenu);
    
    // Модальные окна
    document.querySelector('.modal-close')?.addEventListener('click', () => {
        document.getElementById('hint-modal')?.classList.remove('active');
    });
    document.getElementById('use-hint')?.addEventListener('click', () => {
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
    
    // Бонус за ежедневный вход
    document.querySelector('.daily-bonus')?.addEventListener('click', () => {
        showNotification('🎁 Ежедневный бонус получен! +100 очков', 'success');
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
