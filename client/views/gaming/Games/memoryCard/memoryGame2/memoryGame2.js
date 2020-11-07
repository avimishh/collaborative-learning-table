// variable
var bgMusic, flipSound, matchSound, victorySound, gameOverSound;
var cardsArray, totalTime, timeRemaining, timer, ticker;
var arrBackCard, arrFrontCard;
var arrRand = [];
let len;

var soundCard = [];
let position = 0;
var nameCard;

// arr of path pic cards
var cards_arr = [
    "../../images/home.jpg", "../../images/airplane.jpg", "../../images/apple.jpg",
    "../../images/books.jpg", "../../images/car.jpg", "../../images/clock.jpg",
    "../../images/computer.jpg", "../../images/football.jpg", "../../images/pencil.jpg",
    "../../images/shirt.jpg", "../../images/shoes.jpg", "../../images/phone.jpg"
];

// arr of path audio cards
var record_arr = [
    "../../audio/homeSound.mp3", "../../audio/airplaneSound.mp3", "../../audio/appleSound.mp3",
    "../../audio/booksSound.mp3", "../../audio/carSound.mp3", "../../audio/clockSound.mp3",
    "../../audio/computerSound.mp3", "../../audio/footballSound.mp3", "../../audio/pencilSound.mp3",
    "../../audio/shirtSound.mp3", "../../audio/shoesSound.mp3", "../../audio/phoneSound.mp3"
];

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// get ready
function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    //backCardInsert();
    //frontCardInsert();

    //for (var i = 0; i < len / 2; i++) {
    //    console.log("27: --> " + parseInt(arrRand[i]));
    //}

    let game = mixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            flipCard(card);
        });
    });
}

// src back card insert
function backCardInsert() {
    arrBackCard = document.getElementsByClassName('pokemon');
    for (let i = 0; i < arrBackCard.length; i++) {
        arrBackCard[i].src = "../../images/pokemon.jpg";
    }
}

// src front card insert
function frontCardInsert() {
    let i;
    arrFrontCard = document.getElementsByClassName('card-value');
    len = arrFrontCard.length;

    rand();

    for (i = 0; i < len / 2; i++) {
        arrFrontCard[i].src = cards_arr[parseInt(arrRand[i])];
        console.log(arrFrontCard[i].src + " " + cards_arr[i]);
        console.log("70: --> " + i + "--> " + arrFrontCard[i].src);
    }

    for (let x = len / 2; x < len; x++) {
        arrFrontCard[x].src = cards_arr[parseInt(arrRand[x - i])].split(".jpg")[0] + 'Txt.jpg';
        console.log("75: --> " + x + "--> " + arrFrontCard[x - i].src);
    }
}

// get random index
function randomIndex() {
    var index = Math.floor(Math.random() * cards_arr.length);
    return index.toString();;
}

// get random index and insert to arrRand array
function rand() {
    // repeat num times
    for (var i = 0; i < len / 2; i++) {
        // check if exist in arr
        varRandom = randomIndex();

        while (arrRand.includes(varRandom)) {
            varRandom = randomIndex();
        }
        // add num random index to arrRand array
        arrRand.push(varRandom);
    }

    // print cards in console
    for (var i = 0; i < len / 2; i++) {
        console.log("89: --> " + parseInt(arrRand[i]));
    }
}

// mix or match
function mixOrMatch(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById('time-remaining')
    this.ticker = document.getElementById('flips');
    audioController();
}

// init main audio sound
function audioController() {
    this.bgMusic = new Audio('../audio/start.mp3');
    this.flipSound = new Audio('../audio/flipSound.mp3');
    this.matchSound = new Audio('../audio/matchSound.mp3');
    this.victorySound = new Audio('../audio/victorySound.mp3');
    this.gameOverSound = new Audio('../audio/gameOverSound.mp3');

    //this.bgMusic.volume = 0.5;
    //this.bgMusic.loop = true;
}

// start game
function startGame() {
    backCardInsert();
    frontCardInsert();

    for (var i = 0; i < len / 2; i++) {
        console.log("27: --> " + parseInt(arrRand[i]));
    }

    totalClicks = 0;
    timeRemaining = this.totalTime;
    cardToCheck = null;
    matchedCards = [];
    busy = true;
    setTimeout(() => {
        startMusic();
        shuffleCards(cardsArray);
        countdown = startCountdown();
        busy = false;
    }, 500)
    hideCards();
    timer.innerText = timeRemaining;
    ticker.innerText = totalClicks;
}

// start music sound
function startMusic() {
    bgMusic.play();
}

// stop music sound
function stopMusic() {
    bgMusic.currentTime = 0;
}

// flip sound
function flip() {
    flipSound.play();
}

// match sound
function match() {
    matchSound.play();
}

// gameOver
function gameOver() {
    stopMusic();
    gameOverSound.play();
    gameOverSound.volume = 0.5;

    // remove arrRand array
    removeArrRand();
}

// remove index from arrRand array
function removeArrRand() {
    for (var i = 0; i < len; i++) {
        arrRand.splice(i, 1);
    }
}

// start count down
function startCountdown() {
    return setInterval(() => {
        timeRemaining--;
        timer.innerText = timeRemaining;
        if (timeRemaining === 0)
            gameOver1();
    }, 1000);
}

// gameOver1
function gameOver1() {
    clearInterval(countdown);

    // call gameOver()
    gameOver();
    document.getElementById('game-over-text').classList.add('visible');
}

// victory
function victory() {
    clearInterval(countdown);

    // remove arrRand array
    removeArrRand();

    //victorySound
    stopMusic();
    victorySound.play();
    victorySound.volume = 0.5;

    document.getElementById('victory-text').classList.add('visible');
}

// hide cards
function hideCards() {
    cardsArray.forEach(card => {
        card.classList.remove('visible');
        card.classList.remove('matched');
    });
}

// flip card and check it
function flipCard(card) {
    if (canFlipCard(card)) {
        flip();
        totalClicks++;
        ticker.innerText = totalClicks;
        card.classList.add('visible');

        if (cardToCheck) {
            checkForCardMatch(card);
        } else {
            cardToCheck = card;
        }
    }
}

// check if cards match
function checkForCardMatch(card) {
    var getCard;

    // get path card, include 'Txt.jpg' into getCard variable.
    // get name card into nameCard variable.
    if (!getCardType(card).includes("Txt")){
        getCard = getCardType(card).split(".jpg")[0] + 'Txt.jpg';
        nameCard = getCardType(card).split(".jpg")[0].split("images/")[1];
    }
    else {
        getCard = getCardType(card).split("Txt")[0] + '.jpg';
        nameCard = getCardType(card).split("Txt")[0].split("images/")[1];
    }

    // check if cards match or mismatch
    if (getCard === getCardType(cardToCheck)) {
        cardMatch(card, cardToCheck);
    }
    else {
        cardMismatch(card, cardToCheck);
    }

    cardToCheck = null;
}

// card1 match to card2
function cardMatch(card1, card2) {
    console.log(getCardType(card1));
    console.log(getCardType(card1).split(".jpg")[0].split("images/")[1]);

    matchedCards.push(card1);
    matchedCards.push(card2);
    card1.classList.add('matched');
    card2.classList.add('matched');

    // listen word for pick card
    listenWord();
    //match();

    // check if you finish and call victory message
    if (matchedCards.length === cardsArray.length) {
        setTimeout(victory, 2500);
    }
}

function cardMismatch(card1, card2) {
    busy = true;
    setTimeout(() => {
        card1.classList.remove('visible');
        card2.classList.remove('visible');
        busy = false;
    }, 1000);
}

// shuffle cards
function shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
    for (let i = cardsArray.length - 1; i > 0; i--) {
        let randIndex = Math.floor(Math.random() * (i + 1));
        cardsArray[randIndex].style.order = i;
        cardsArray[i].style.order = randIndex;
    }
}

// get card
function getCardType(card) {
    return card.getElementsByClassName('card-value')[0].src;
}

// check if can flip card
function canFlipCard(card) {
    return !busy && !matchedCards.includes(card) && card !== cardToCheck;
}

function listenWord() {
    // wait with flip card until listen word
    busy = true;
    console.log(nameCard);

    // find name card and start nameCard.mp3 for listen word
    for (var i = 0; i < cards_arr.length; i++) {
        if (cards_arr[i] === '../../images/' + nameCard + '.jpg') {
            soundCard[position] = new Audio();
            soundCard[position].src = record_arr[i];
            soundCard[position].volume = 0.8;
            soundCard[position].play();
            position++;
        }
    }

    // close wait with flip card
    setTimeout(() => {
        busy = false;
        position = 0;
    }, 2000);
}
