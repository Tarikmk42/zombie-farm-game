// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран
tg.enableClosingConfirmation(); // Подтверждение выхода

// Состояние игры
let gameState = {
    currentStage: 1,
    score: 0,
    timeLeft: 2700, // 45 минут в секундах
    timerInterval: null,
    playerName: '',
    isPaused: false
};

// Данные этапов
const stages = {
    1: {
        title: "🍎 ЭТАП 1: ЗАРАЖЕНИЕ",
        description: "Безумный ученый Агриус провел неудачный эксперимент! Все животные на ферме стали зомби. Найдите зараженное яблоко с кодом.",
        task: "Отсканируйте QR-код на входе и найдите яблоко с кодом",
        hint: "Код состоит из слова и года",
        fact: "Интересный факт: Первые фермы появились около 12 000 лет назад!",
        answer: "ЗАРАЖЕНИЕ_2024",
        points: 100
    },
    2: {
        title: "🥚 ЭТАП 2: ТАЙНА ЗОМБИ-ЯИЦ",
        description: "Зомби-куры снесли яйца со странными символами! Найдите все яйца и расшифруйте код.",
        task: "Найдите 5 яиц с символами в курятнике",
        hint: "Символы: Ω † ∞ ¤ §",
        fact: "Куры могут запомнить до 100 разных лиц!",
        answer: "Ω†∞¤§",
        points: 150
    },
    3: {
        title: "🦢 ЭТАП 3: ГУСИНОЕ СЕЛФИ",
        description: "Пройдите через территорию гусей-охранников и сделайте крутое селфи!",
        task: "Сделайте селфи с гусями и поделитесь в соцсетях",
        hint: "Используйте хэштег #УсадьбаМарьиноКрутьКвестЗомби",
        fact: "Гуси образуют пары на всю жизнь!",
        answer: "ГУСИ_2024",
        points: 200
    }
    // Добавьте остальные 10 этапов по аналогии
};

// Инициализация игры
function initGame() {
    loadPlayerInfo();
    showScreen('main-menu');
    startLoadingAnimation();
}

// Загрузка информации об игроке
function loadPlayerInfo() {
    const user = tg.initDataUnsafe?.user;
    gameState.playerName = user?.first_name || 'Игрок';
    document.getElementById('player-name').textContent = gameState.playerName;
    
    // Загружаем рекорд из локального хранилища
    const bestScore = localStorage.getItem('zombieFarmBestScore') || 0;
    document.getElementById('player-score').textContent = bestScore;
}

// Анимация загрузки
function startLoadingAnimation() {
    setTimeout(() => {
        hideScreen('loading-screen');
        showScreen('main-menu');
    }, 2000);
}

// Управление экранами
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active', 'fade-in');
}

function hideScreen(screenId) {
    document.getElementById(screenId).classList.remove('active');
}

// Начало игры
function startGame() {
    gameState = {
        currentStage: 1,
        score: 0,
        timeLeft: 2700,
        isPaused: false,
        playerName: gameState.playerName
    };
    
    updateGameUI();
    startTimer();
    showScreen('game-screen');
    loadStage(1);
}

// Загрузка этапа
function loadStage(stageNumber) {
    const stage = stages[stageNumber];
    if (!stage) {
        endGame();
        return;
    }
    
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = `
        <div class="stage-title">${stage.title}</div>
        <div class="stage-description">${stage.description}</div>
        <div class="stage-task">
            <strong>Задача:</strong> ${stage.task}
        </div>
        <div class="stage-hint">
            <strong>💡 Подсказка:</strong> ${stage.hint}
        </div>
        <div class="stage-fact">
            <strong>🧠 Интересный факт:</strong> ${stage.fact}
        </div>
    `;
    
    document.getElementById('current-stage').textContent = stageNumber;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
}

// Таймер игры
function startTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        if (!gameState.isPaused) {
            gameState.timeLeft--;
            updateTimerDisplay();
            
            if (gameState.timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Проверка ответа
function checkAnswer() {
    const input = document.getElementById('answer-input');
    const userAnswer = input.value.trim().toUpperCase();
    const currentStage = stages[gameState.currentStage];
    
    if (userAnswer === currentStage.answer) {
        // Правильный ответ
        gameState.score += currentStage.points;
        gameState.currentStage++;
        updateGameUI();
        
        if (gameState.currentStage <= Object.keys(stages).length) {
            showSuccessMessage();
            setTimeout(() => loadStage(gameState.currentStage), 1500);
        } else {
            endGame();
        }
    } else {
        // Неправильный ответ
        showErrorMessage();
        input.value = '';
        input.focus();
    }
}

// Обновление UI игры
function updateGameUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('current-stage').textContent = gameState.currentStage;
    
    // Обновляем прогресс-бар
    const progress = (gameState.currentStage - 1) / Object.keys(stages).length * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
}

// Сообщения
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = '✅ Правильно! Переходим к следующему этапу!';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #48bb78;
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 1500);
}

function showErrorMessage() {
    const message = document.createElement('div');
    message.className = 'error-message';
    message.textContent = '❌ Неправильно! Попробуйте еще раз.';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f56565;
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        z-index: 1000;
        animation: shake 0.5s ease;
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 1500);
}

// Конец игры
function endGame() {
    clearInterval(gameState.timerInterval);
    
    // Сохраняем рекорд
    const bestScore = localStorage.getItem('zombieFarmBestScore') || 0;
    if (gameState.score > bestScore) {
        localStorage.setItem('zombieFarmBestScore', gameState.score);
    }
    
    // Показываем результаты
    document.getElementById('final-stages').textContent = gameState.currentStage - 1;
    document.getElementById('final-score').textContent = gameState.score;
    
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    document.getElementById('final-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    showScreen('results-screen');
}

// Поделиться результатом
function shareResults() {
    const shareText = `Я прошел(а) ${gameState.currentStage - 1} этапов в игре "Проклятие Зомби-Фермы" и набрал(а) ${gameState.score} очков! 🧟🎮`;
    
    if (tg.share) {
        tg.share(shareText);
    } else {
        // Альтернатива для десктопа
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Текст скопирован в буфер обмена! Поделитесь им в соцсетях!');
        });
    }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    initGame();
    
    // Главное меню
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('how-to-play').addEventListener('click', () => {
        alert(`🎮 КАК ИГРАТЬ:\n\n1. Проходите 13 этапов с загадками\n2. Вводите коды в поле ответа\n3. Изучайте факты о животных\n4. Соревнуйтесь за лучший результат!`);
    });
    
    // Игровой экран
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
    document.getElementById('answer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
    
    // Пауза
    document.getElementById('pause-btn').addEventListener('click', () => {
        gameState.isPaused = true;
        showScreen('pause-screen');
    });
    
    document.getElementById('resume-game').addEventListener('click', () => {
        gameState.isPaused = false;
        showScreen('game-screen');
    });
    
    document.getElementById('restart-game').addEventListener('click', () => {
        if (confirm('Начать игру заново?')) {
            startGame();
        }
    });
    
    document.getElementById('quit-game').addEventListener('click', () => {
        if (confirm('Выйти в главное меню?')) {
            showScreen('main-menu');
        }
    });
    
    // Результаты
    document.getElementById('play-again').addEventListener('click', startGame);
    document.getElementById('share-result').addEventListener('click', shareResults);
    document.getElementById('back-to-menu').addEventListener('click', () => {
        showScreen('main-menu');
    });
});

// Анимация тряски для ошибки
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%); }
        25% { transform: translate(-55%, -50%); }
        75% { transform: translate(-45%, -50%); }
    }
`;
document.head.appendChild(style);