// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Состояние игры
let gameState = {
    currentStage: 1,
    score: 0,
    timeLeft: 2700, // 45 минут в секундах
    timerInterval: null,
    isGameActive: false
};

// Данные этапов (упрощенные для примера)
const stages = {
    1: {
        title: "🍎 ЗАРАЖЕНИЕ",
        description: "Безумный ученый Агриус провел неудачный эксперимент! Все животные на ферме стали зомби. Найдите зараженное яблоко с кодом.",
        task: "🔍 Найдите яблоко с кодом на территории фермы",
        hint: "💡 Код состоит из слова и года через нижнее подчеркивание",
        answer: "ЗАРАЖЕНИЕ_2024",
        points: 100
    },
    2: {
        title: "🥚 ТАЙНА ЯИЦ",
        description: "Зомби-куры снесли яйца со странными символами! Найдите все яйца и расшифруйте код.",
        task: "🔍 Найдите 5 яиц с символами в курятнике",
        hint: "💡 Символы: Ω † ∞ ¤ §",
        answer: "Ω†∞¤§",
        points: 150
    }
    // Добавьте остальные этапы...
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Инициализируем Telegram Web App
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Настройка главной кнопки Telegram
    tg.MainButton.setText("СОХРАНИТЬ ПРОГРЕСС");
    tg.MainButton.hide();
    
    // Показываем главный экран после загрузки
    setTimeout(() => {
        hideScreen('loading');
        showScreen('main');
    }, 2000);
    
    // Назначаем обработчики событий
    setupEventListeners();
}

function setupEventListeners() {
    // Кнопки главного меню
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('how-to-play-btn').addEventListener('click', showInstructions);
    
    // Игровые кнопки
    document.getElementById('back-btn').addEventListener('click', showMainMenu);
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
    document.getElementById('back-from-instructions').addEventListener('click', showMainMenu);
    
    // Enter для отправки ответа
    document.getElementById('answer-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkAnswer();
    });
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

function showMainMenu() {
    if (gameState.isGameActive) {
        stopGame();
    }
    showScreen('main');
    updateStats();
}

function showInstructions() {
    showScreen('instructions');
}

// Игровая логика
function startGame() {
    gameState = {
        currentStage: 1,
        score: 0,
        timeLeft: 2700,
        isGameActive: true
    };
    
    startTimer();
    showScreen('game');
    loadStage(1);
    updateStats();
}

function stopGame() {
    gameState.isGameActive = false;
    clearInterval(gameState.timerInterval);
    tg.MainButton.hide();
}

function loadStage(stageNumber) {
    const stage = stages[stageNumber];
    if (!stage) {
        endGame();
        return;
    }
    
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = `
        <div class="stage-header">
            <h3>${stage.title}</h3>
            <p>${stage.description}</p>
        </div>
        
        <div class="stage-task">
            <h4>🎯 Задача:</h4>
            <p>${stage.task}</p>
        </div>
        
        <div class="stage-hint">
            <h4>💡 Подсказка:</h4>
            <p>${stage.hint}</p>
        </div>
    `;
    
    document.getElementById('current-stage').textContent = stageNumber;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
}

function checkAnswer() {
    const input = document.getElementById('answer-input');
    const userAnswer = input.value.trim().toUpperCase();
    const currentStage = stages[gameState.currentStage];
    
    if (!userAnswer) {
        showMessage('Введите ответ!', 'error');
        return;
    }
    
    if (userAnswer === currentStage.answer) {
        // Правильный ответ
        gameState.score += currentStage.points;
        gameState.currentStage++;
        
        showMessage('✅ Правильно! Переходим к следующему этапу!', 'success');
        
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
        text-align: center;
        min-width: 250px;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

function startTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        if (gameState.isGameActive) {
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
    document.getElementById('time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateStats() {
    document.getElementById('stage-counter').textContent = 
        `${gameState.currentStage - 1}/${Object.keys(stages).length}`;
    document.getElementById('score-counter').textContent = gameState.score;
}

function endGame() {
    stopGame();
    
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = `
        <div class="game-complete">
            <h2>🎉 Поздравляем!</h2>
            <p>Вы завершили игру и спасли ферму!</p>
            <div class="final-stats">
                <p>🏆 Набрано очков: <strong>${gameState.score}</strong></p>
                <p>🎯 Пройдено этапов: <strong>${gameState.currentStage - 1}/${Object.keys(stages).length}</strong></p>
            </div>
            <button onclick="showMainMenu()" class="btn-primary">В ГЛАВНОЕ МЕНЮ</button>
        </div>
    `;
    
    // Отправляем данные в Telegram
    tg.sendData(JSON.stringify({
        action: 'game_complete',
        score: gameState.score,
        stages: gameState.currentStage - 1
    }));
}

// Экспортируем функции для глобального использования
window.showMainMenu = showMainMenu;
