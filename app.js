// Минимальная версия для отладки
console.log("🚀 Запуск игры...");

// Глобальные переменные
let tg = null;
let gameState = {
    currentStage: 1,
    score: 0,
    timeLeft: 2700,
    timerInterval: null,
    isGameActive: false
};

// Простые этапы для теста
const stages = {
    1: {
        title: "🍎 ЭТАП 1: ЗАРАЖЕНИЕ",
        description: "Найдите зараженное яблоко с кодом.",
        task: "Код: ЗАРАЖЕНИЕ_2024",
        answer: "ЗАРАЖЕНИЕ_2024",
        points: 100
    },
    2: {
        title: "🥚 ЭТАП 2: ТАЙНА ЯИЦ", 
        description: "Расшифруйте символы на яйцах.",
        task: "Символы: Ω†∞¤§",
        answer: "Ω†∞¤§",
        points: 150
    }
};

// Основная функция инициализации
function initializeApp() {
    console.log("🔧 Инициализация приложения...");
    
    try {
        // Инициализация Telegram Web App
        if (window.Telegram && window.Telegram.WebApp) {
            tg = window.Telegram.WebApp;
            tg.expand();
            console.log("✅ Telegram Web App инициализирован");
        } else {
            console.log("⚠️ Telegram Web App не найден, работаем в браузере");
        }
        
        // Показываем главное меню через 1 секунду
        setTimeout(() => {
            hideScreen('loading');
            showScreen('main');
            console.log("✅ Главное меню показано");
        }, 1000);
        
        // Настраиваем обработчики событий
        setupEventListeners();
        
    } catch (error) {
        console.error("❌ Ошибка инициализации:", error);
        // Принудительно показываем главное меню при ошибке
        hideScreen('loading');
        showScreen('main');
    }
}

// Управление экранами
function showScreen(screenId) {
    console.log("🖥 Показываем экран:", screenId);
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function hideScreen(screenId) {
    document.getElementById(screenId).classList.remove('active');
}

// Настройка обработчиков событий
function setupEventListeners() {
    console.log("🔗 Настраиваем обработчики...");
    
    // Главное меню
    const startBtn = document.getElementById('start-btn');
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
        console.log("✅ Обработчик для start-btn установлен");
    }
    
    if (howToPlayBtn) {
        howToPlayBtn.addEventListener('click', showInstructions);
        console.log("✅ Обработчик для how-to-play-btn установлен");
    }
    
    // Игровой экран
    const backBtn = document.getElementById('back-btn');
    const submitAnswer = document.getElementById('submit-answer');
    const answerInput = document.getElementById('answer-input');
    const backFromInstructions = document.getElementById('back-from-instructions');
    
    if (backBtn) backBtn.addEventListener('click', showMainMenu);
    if (submitAnswer) submitAnswer.addEventListener('click', checkAnswer);
    if (backFromInstructions) backFromInstructions.addEventListener('click', showMainMenu);
    
    // Enter для отправки ответа
    if (answerInput) {
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkAnswer();
        });
    }
    
    console.log("✅ Все обработчики настроены");
}

// Игровые функции
function startGame() {
    console.log("🎮 Начинаем новую игру");
    
    gameState = {
        currentStage: 1,
        score: 0,
        timeLeft: 2700,
        isGameActive: true
    };
    
    showScreen('game');
    loadStage(1);
    updateStats();
}

function showMainMenu() {
    console.log("🏠 Возврат в главное меню");
    if (gameState.isGameActive) {
        clearInterval(gameState.timerInterval);
        gameState.isGameActive = false;
    }
    showScreen('main');
}

function showInstructions() {
    console.log("📚 Показываем инструкции");
    showScreen('instructions');
}

function loadStage(stageNumber) {
    console.log("📖 Загружаем этап:", stageNumber);
    
    const stage = stages[stageNumber];
    if (!stage) {
        endGame();
        return;
    }
    
    const stageContent = document.getElementById('stage-content');
    if (!stageContent) {
        console.error("❌ Элемент stage-content не найден");
        return;
    }
    
    stageContent.innerHTML = `
        <div class="stage-header">
            <h3>${stage.title}</h3>
            <p>${stage.description}</p>
        </div>
        <div class="stage-task">
            <h4>🎯 Задача:</h4>
            <p>${stage.task}</p>
        </div>
        <div class="input-section">
            <input type="text" id="answer-input" placeholder="Введите ответ..." value="">
            <button id="submit-answer" class="btn-primary">ПРОВЕРИТЬ</button>
        </div>
    `;
    
    // Обновляем обработчики для нового контента
    const newSubmitAnswer = document.getElementById('submit-answer');
    const newAnswerInput = document.getElementById('answer-input');
    
    if (newSubmitAnswer) {
        newSubmitAnswer.addEventListener('click', checkAnswer);
    }
    
    if (newAnswerInput) {
        newAnswerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkAnswer();
        });
        newAnswerInput.focus();
    }
    
    document.getElementById('current-stage').textContent = stageNumber;
    updateStats();
}

function checkAnswer() {
    console.log("🔍 Проверяем ответ...");
    
    const input = document.getElementById('answer-input');
    if (!input) {
        console.error("❌ Поле ввода не найдено");
        return;
    }
    
    const userAnswer = input.value.trim();
    const currentStage = stages[gameState.currentStage];
    
    if (!userAnswer) {
        showMessage('Введите ответ!', 'error');
        return;
    }
    
    if (userAnswer.toUpperCase() === currentStage.answer) {
        // Правильный ответ
        gameState.score += currentStage.points;
        gameState.currentStage++;
        
        showMessage('✅ Правильно! Переходим дальше!', 'success');
        
        setTimeout(() => {
            if (gameState.currentStage <= Object.keys(stages).length) {
                loadStage(gameState.currentStage);
            } else {
                endGame();
            }
            updateStats();
        }, 1500);
        
    } else {
        // Неправильный ответ
        showMessage('❌ Неправильно! Попробуйте еще раз.', 'error');
        input.value = '';
        input.focus();
    }
}

function showMessage(text, type) {
    console.log("💬 Показываем сообщение:", text);
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 30px;
        border-radius: 10px;
        z-index: 1000;
        font-weight: bold;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        text-align: center;
        min-width: 250px;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 2000);
}

function updateStats() {
    const stageCounter = document.getElementById('stage-counter');
    const scoreCounter = document.getElementById('score-counter');
    
    if (stageCounter) {
        stageCounter.textContent = `${gameState.currentStage - 1}/${Object.keys(stages).length}`;
    }
    
    if (scoreCounter) {
        scoreCounter.textContent = gameState.score;
    }
}

function endGame() {
    console.log("🎉 Завершаем игру");
    
    clearInterval(gameState.timerInterval);
    gameState.isGameActive = false;
    
    const stageContent = document.getElementById('stage-content');
    if (stageContent) {
        stageContent.innerHTML = `
            <div class="game-complete">
                <h2>🎉 Игра завершена!</h2>
                <p>Вы прошли ${gameState.currentStage - 1} из ${Object.keys(stages).length} этапов!</p>
                <p>🏆 Очков: ${gameState.score}</p>
                <button onclick="showMainMenu()" class="btn-primary">В ГЛАВНОЕ МЕНЮ</button>
            </div>
        `;
    }
}

// Запускаем приложение когда DOM загружен
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM загружен");
    initializeApp();
});

// Если DOM уже загружен, запускаем сразу
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("⚡ DOM уже готов");
    setTimeout(initializeApp, 0);
}
