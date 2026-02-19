const CHOICES  = ['rock', 'paper', 'scissors'];
const BEATS    = { rock: 'scissors', scissors: 'paper', paper: 'rock' };
const EMOJI    = { rock: '✊', paper: '✋', scissors: '✌' };


function getScores() {
  return {
    player:   parseInt(localStorage.getItem('rps_player'))   || 0,
    computer: parseInt(localStorage.getItem('rps_computer')) || 0,
  };
}

function setScores(player, computer) {
  localStorage.setItem('rps_player',   player);
  localStorage.setItem('rps_computer', computer);
}

function renderScores() {
  const { player, computer } = getScores();
  const pEl = document.getElementById('player-score');
  const cEl = document.getElementById('computer-score');
  if (pEl) pEl.textContent = player;
  if (cEl) cEl.textContent = computer;
}


function saveRound(playerChoice, computerChoice, result) {
  sessionStorage.setItem('rps_pChoice', playerChoice);
  sessionStorage.setItem('rps_cChoice', computerChoice);
  sessionStorage.setItem('rps_result',  result);
}

function loadRound() {
  return {
    playerChoice:   sessionStorage.getItem('rps_pChoice') || 'rock',
    computerChoice: sessionStorage.getItem('rps_cChoice') || 'rock',
    result:         sessionStorage.getItem('rps_result')  || 'draw',
  };
}


function randomChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function getResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return 'draw';
  return BEATS[playerChoice] === computerChoice ? 'win' : 'lose';
}


function initRules() {
  const rulesBtn = document.getElementById('rules-btn');
  const rulesBox = document.getElementById('rules-box');
  const closeBtn = document.getElementById('close-btn');
  if (!rulesBtn || !rulesBox || !closeBtn) return;

  rulesBtn.addEventListener('click', () => rulesBox.classList.remove('hidden'));
  closeBtn.addEventListener('click', () => rulesBox.classList.add('hidden'));
}


function initSelectionPage() {
  renderScores();
  initRules();

  document.querySelectorAll('.choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const playerChoice   = btn.dataset.choice;
      const computerChoice = randomChoice();            
      const result         = getResult(playerChoice, computerChoice);

      let { player, computer } = getScores();
      if (result === 'win')  player++;
      if (result === 'lose') computer++;
      setScores(player, computer);

      saveRound(playerChoice, computerChoice, result);

      window.location.href = 'result.html';
    });
  });
}


function initResultPage() {
  renderScores();
  initRules();

  const { playerChoice, computerChoice, result } = loadRound();

  const playerPickedEl   = document.getElementById('player-picked');
  const computerPickedEl = document.getElementById('computer-picked');
  const resultTextEl     = document.getElementById('result-text');
  const nextBtn          = document.getElementById('next-btn');
  const playAgainBtn     = document.getElementById('play-again');

  playerPickedEl.textContent   = EMOJI[playerChoice];
  computerPickedEl.textContent = EMOJI[computerChoice];

  document.querySelectorAll('.ripple').forEach(r => r.remove());

  if (result === 'win') {
    resultTextEl.textContent = 'YOU WIN AGAINST PC';
    playerPickedEl.classList.add('win-ripple');
    nextBtn.classList.remove('hidden');
  } else if (result === 'lose') {
    resultTextEl.textContent = 'YOU LOST AGAINST PC';
    computerPickedEl.classList.add('win-ripple');
  } else {
    resultTextEl.textContent = "IT'S A DRAW";
  }

  playAgainBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  nextBtn.addEventListener('click', () => {
    window.location.href = 'hurray.html';
  });
}


function initHurrayPage() {

  document.getElementById('hurray-play').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}




const page = window.location.pathname;

if (page.endsWith('result.html')) {
  initResultPage();
} else if (page.endsWith('hurray.html')) {
  initHurrayPage();
} else {
  initSelectionPage();
}