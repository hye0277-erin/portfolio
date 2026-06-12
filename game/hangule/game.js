// 1. 단어 데이터베이스 세트 정의
const quizData = [
    { chosung: 'ㄱㅇ', answer: '고양이', category: '동물', hint: '야옹하고 우는 반려동물' },
    { chosung: 'ㅂㄴㄴ', answer: '바나나', category: '음식', hint: '원숭이가 좋아하는 노란색 과일' },
    { chosung: 'ㅋㅍㅌ', answer: '컴퓨터', category: '전자기기', hint: '코딩이나 게임을 할 때 쓰는 기계' },
    { chosung: 'ㅎㄱ', answer: '한글', category: '언어', hint: '세종대왕님이 창제하신 우리나라 고유 문자' },
    { chosung: 'ㅊㄱ', answer: '축구', category: '스포츠', hint: '발로 공을 차서 골대에 넣는 경기' },
    { chosung: 'ㅂㄷ', answer: '바다', category: '자연', hint: '여름철 피서지로 인기가 많은 넓고 짠 물' },
    { chosung: '우ㅅ', answer: '우산', category: '생활용품', hint: '비가 올 때 머리에 쓰는 물건' }
];

// 2. 게임 상태 변수 관리
let currentQuizIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval = null;
let shuffledQuiz = [];

// 3. DOM 요소 탐색 및 정의
const startScreen = document.getElementById('start-screen');
const playScreen = document.getElementById('play-screen');
const endScreen = document.getElementById('end-screen');

const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');

const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const categoryDisplay = document.getElementById('category-display');
const chosungDisplay = document.getElementById('chosung-display');
const hintDisplay = document.getElementById('hint-display');
const answerInput = document.getElementById('answer-input');
const feedbackDisplay = document.getElementById('feedback-display');
const finalScoreDisplay = document.getElementById('final-score-display');

// 4. 이벤트 리스너 등록
startBtn.addEventListener('click', startGame);
submitBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', startGame);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

// 5. 게임 기능 및 함수 제어
function switchScreen(screen) {
    [startScreen, playScreen, endScreen].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function startGame() {
    score = 0;
    timeLeft = 30;
    currentQuizIndex = 0;
    
    // 무작위 문제 셔플
    shuffledQuiz = [...quizData].sort(() => Math.random() - 0.5);
    
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    feedbackDisplay.textContent = '';
    answerInput.value = '';
    
    switchScreen(playScreen);
    loadNextQuiz();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function loadNextQuiz() {
    if (currentQuizIndex >= shuffledQuiz.length) {
        // 모든 문제를 다 푼 경우 새로운 무작위 세트로 다시 셔플하여 연장
        shuffledQuiz = [...quizData].sort(() => Math.random() - 0.5);
        currentQuizIndex = 0;
    }
    
    const currentQuiz = shuffledQuiz[currentQuizIndex];
    categoryDisplay.textContent = currentQuiz.category;
    chosungDisplay.textContent = currentQuiz.chosung;
    hintDisplay.textContent = `힌트: ${currentQuiz.hint}`;
    answerInput.focus();
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    if (!userAnswer) return;
    
    const correctAnswer = shuffledQuiz[currentQuizIndex].answer;
    
    if (userAnswer === correctAnswer) {
        score += 10;
        scoreDisplay.textContent = score;
        showFeedback('정답입니다! +10점', 'correct');
        
        currentQuizIndex++;
        answerInput.value = '';
        loadNextQuiz();
    } else {
        showFeedback('틀렸습니다. 다시 시도해보세요!', 'incorrect');
        answerInput.value = '';
        answerInput.focus();
    }
}

function showFeedback(text, type) {
    feedbackDisplay.textContent = text;
    feedbackDisplay.className = `feedback-message ${type}`;
    
    // 1.5초 후 피드백 메시지만 살짝 초기화
    setTimeout(() => {
        if (feedbackDisplay.textContent === text) {
            feedbackDisplay.textContent = '';
        }
    }, 1500);
}

function endGame() {
    clearInterval(timerInterval);
    finalScoreDisplay.textContent = score;
    switchScreen(endScreen);
}