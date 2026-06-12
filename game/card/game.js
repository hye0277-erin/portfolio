// 1. 기본 이모지 데이터 세트 (최대 12쌍)
const defaultEmojis = ['🐶', '🐱', '🦊', '🦁', '🐸', '🐷', '🦄', '🐝', '🐼', '🐨', '🦖', '🐳'];

// 2. 커스텀 이미지 데이터 세트
// 이미지를 등록했다면 아래 배열의 주석을 해제하거나 파일명/경로를 맞춰주세요.
// 만약 값이 비어있거나 이미지를 불러오는데 실패하면(onerror) 자동으로 기본 이모지가 출력됩니다.
const customImages = [
    // 'images/card1.png', 'images/card2.png', 'images/card3.png', 'images/card4.png',
    // 'images/card5.png', 'images/card6.png', 'images/card7.png', 'images/card8.png',
    // 'images/card9.png', 'images/card10.png', 'images/card11.png', 'images/card12.png'
];

let flippedCards = [];
let moves = 0;
let matches = 0;
let lockBoard = false;
let currentCardCount = 12;

const cardGrid = document.getElementById('card-grid');
const movesDisplay = document.getElementById('moves');
const matchesDisplay = document.getElementById('matches');
const totalMatchesDisplay = document.getElementById('total-matches');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty-select');

restartBtn.addEventListener('click', initGame);
difficultySelect.addEventListener('change', (e) => {
    currentCardCount = parseInt(e.target.value);
    initGame();
});

initGame();

function initGame() {
    flippedCards = [];
    moves = 0;
    matches = 0;
    lockBoard = false;
    
    movesDisplay.textContent = moves;
    matchesDisplay.textContent = matches;
    
    const pairCount = currentCardCount / 2;
    totalMatchesDisplay.textContent = pairCount;
    cardGrid.innerHTML = '';

    // 현재 게임에 필요한 수량만큼 데이터 생성
    let gameCardsData = [];
    for (let i = 0; i < pairCount; i++) {
        // 커스텀 이미지 배열에 값이 있고 실제 입력되어 있다면 사용, 없으면 이모지 사용
        const hasCustomImg = customImages && customImages[i] && customImages[i].trim() !== '';
        
        const cardItem = {
            id: i,
            emoji: defaultEmojis[i],
            image: hasCustomImg ? customImages[i] : null
        };
        // 한 쌍(2장)을 넣음
        gameCardsData.push({...cardItem}, {...cardItem});
    }

    // 무작위 셔플
    gameCardsData.sort(() => Math.random() - 0.5);

    // 가로형 카드 DOM 카드 동적 빌드
    gameCardsData.forEach((cardData) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = cardData.id; // 매칭 검증용 고유 ID

        // 이미지가 설정되어 있다면 <img> 태그 생성, 로드 실패(onerror) 시 이모지로 대체하는 안전장치 포함
        let frontContent = '';
        if (cardData.image) {
            frontContent = `<img src="${cardData.image}" alt="카드 앞면" class="card-img" onerror="this.style.display='none'; this.parentElement.innerHTML='${cardData.emoji}';">`;
        } else {
            frontContent = cardData.emoji;
        }

        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">${frontContent}</div>
        `;

        card.addEventListener('click', flipCard);
        cardGrid.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.id === card2.dataset.id;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    flippedCards[0].classList.add('matched');
    flippedCards[1].classList.add('matched');
    
    matches++;
    matchesDisplay.textContent = matches;
    
    resetTurn();

    if (matches === currentCardCount / 2) {
        setTimeout(() => {
            alert(`🎉 미션 완료! [카드 ${currentCardCount}개]를 ${moves}회 만에 모두 맞추셨습니다!`);
        }, 400);
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        flippedCards[0].classList.remove('flipped');
        flippedCards[1].classList.remove('flipped');
        resetTurn();
    }, 800);
}

function resetTurn() {
    flippedCards = [];
    lockBoard = false;
}