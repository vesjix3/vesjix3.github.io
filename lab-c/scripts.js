const MAP_WIDTH = 1000;
const MAP_HEIGHT = 480;
const COLS = 4;
const ROWS = 4;
const PIECE_WIDTH = MAP_WIDTH / COLS;
const PIECE_HEIGHT = MAP_HEIGHT / ROWS;

const GAME_STATUS = {
  READY: 'ready',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

let gameStatus = GAME_STATUS.READY;
let draggedPiece = null;

document.addEventListener('DOMContentLoaded', () => {
  renderBoard();
  initPuzzleDnD();
  requestNotificationPermission();
});

function initPuzzleDnD() {
  const table = document.getElementById('table');
  if (!table) return;

  table.addEventListener('dragover', e => e.preventDefault());
  table.addEventListener('drop', dropOnTable);
}

function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  for (let i = 0; i < COLS * ROWS; i++) {
    const slot = document.createElement('div');
    slot.className = 'board-slot';
    slot.dataset.index = i;
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('drop', () => handleDropOnSlot(slot));
    board.appendChild(slot);
  }
}

function startPuzzle(rasterCanvas) {
  gameStatus = GAME_STATUS.IN_PROGRESS;
  console.log('Status: ' + gameStatus);

  const table = document.getElementById('table');
  const board = document.getElementById('board');
  table.innerHTML = '';
  renderBoard();

  board.style.display = 'grid';

  const pieces = createPiecesFromCanvas(rasterCanvas);
  shuffleArray(pieces).forEach(piece => table.appendChild(piece));
}

function createPiecesFromCanvas(sourceCanvas) {
  const pieces = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const id = row * COLS + col;
      const pieceCanvas = document.createElement('canvas');
      pieceCanvas.width = PIECE_WIDTH;
      pieceCanvas.height = PIECE_HEIGHT;

      const ctx = pieceCanvas.getContext('2d');
      ctx.drawImage(
        sourceCanvas,
        col * PIECE_WIDTH,
        row * PIECE_HEIGHT,
        PIECE_WIDTH,
        PIECE_HEIGHT,
        0,
        0,
        PIECE_WIDTH,
        PIECE_HEIGHT
      );

      const piece = document.createElement('div');
      piece.className = 'puzzle-piece';
      piece.draggable = true;
      piece.dataset.pieceId = id;
      piece.style.backgroundImage = `url(${pieceCanvas.toDataURL()})`;
      piece.style.backgroundSize = `${PIECE_WIDTH}px ${PIECE_HEIGHT}px`;

      piece.addEventListener('dragstart', () => draggedPiece = piece);
      piece.addEventListener('dragend', () => draggedPiece = null);

      pieces.push(piece);
    }
  }

  return pieces;
}

function handleDropOnSlot(slot) {
  if (!draggedPiece) return;

  const sourceParent = draggedPiece.parentElement;
  const existing = slot.firstElementChild;

  if (existing && sourceParent !== slot) {
    if (sourceParent && sourceParent.classList.contains('board-slot')) {
      sourceParent.appendChild(existing);
    } else {
      document.getElementById('table').appendChild(existing);
    }
  }

  if (sourceParent !== slot) {
    slot.appendChild(draggedPiece);
  }

  draggedPiece = null;
  updateBoardState();
}

function dropOnTable() {
  if (!draggedPiece) return;
  document.getElementById('table').appendChild(draggedPiece);
  draggedPiece = null;
  updateBoardState();
}

function updateBoardState() {
  const slots = document.querySelectorAll('.board-slot');
  let correctCount = 0;

  slots.forEach(slot => {
    const piece = slot.firstElementChild;
    const ok = piece && Number(piece.dataset.pieceId) === Number(slot.dataset.index);
    slot.classList.toggle('correct', Boolean(ok));
    if (ok) correctCount++;
  });

  if (correctCount === COLS * ROWS) {
    gameStatus = GAME_STATUS.COMPLETED;
    console.log('Status: ' + gameStatus);
    console.log('Puzzle ulozone!');
    showNotification();
  }

}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function requestNotificationPermission() {
  console.log('Sprawdzanie uprawnien powiadomien...');

  if (!('Notification' in window)) {
    console.log('Przeglądarka nie obsługuje powiadomień]');
    return;
  }

  if (Notification.permission === 'granted') {
    console.log('Uprawnienia juz przyznane');
    return;
  }

  if (Notification.permission !== 'denied') {
    console.log('Zadanie uprawnien do powiadomien');
    Notification.requestPermission().then(permission => {
      console.log('Wybor uzytkownika:', permission);
      if (permission === 'granted') {
        console.log('Powiadomienia wlaczone!');
      }
    });
  }
}

function showNotification() {





  if (Notification.permission === 'granted') {
    console.log('Wysylanie powiadomienia...');
    new Notification('Puzzle Ulozone!', {
      body: 'Wszystkie puzzle zostaly ulozone!',
    });
  } else if (Notification.permission !== 'denied') {
    console.log('Prosba o uprawnienia...');
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Puzzle Ulozone!', {
          body: 'Wszystkie puzzle zostaly ulozone!',
        });
      }
    });
  } else {
    console.log('Brak uprawnien do powiadomien');
  }
}
