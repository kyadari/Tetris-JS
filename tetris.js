let rows = 24;
let columns = 15;
let boxWidth = 1.25;
let boxHeight = 1.25;
let squares = [];
let nextRandom = 0;
let timerId;
let score = 0;
const colors = [
    'lightsalmon',
    'blueviolet',
    'darkcyan',
    'firebrick',
    'dodgerblue'
];
let restartGame = false;

document.addEventListener('DOMContentLoaded', () => {
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    let board = document.querySelector('#board');
    let start = document.querySelector('#start');
    let play = document.querySelector('#play');
    board.style.width = (columns * boxWidth) + 0.5 + "rem";
    board.style.height = (rows * boxHeight) + 0.5 + "rem";
    document.querySelector('#gameOver').style.display = "none";

    for (let i = 0; i < 4 * columns; i++) {
        let startbox = document.createElement('div');
        startbox.style.width = boxWidth + "rem";
        startbox.style.height = boxHeight + "rem";
        start.appendChild(startbox);
    }

    for (let i = 0; i < (rows - 4) * columns; i++) {
        let box = document.createElement('div');
        box.style.width = boxWidth + "rem";
        box.style.height = boxHeight + "rem";
        play.appendChild(box);
    }

    for (let i = 0; i < columns; i++) {
        let paddingbox = document.createElement('div');
        paddingbox.className = "taken";
        play.appendChild(paddingbox);
    }

    for (let i = 0; i < 16; i++) {
        let paddingbox = document.createElement('div');
        document.querySelector('.mini-grid').appendChild(paddingbox);
    }

    squares = [...document.querySelectorAll('.start div'), ...document.querySelectorAll('.play div')];

    //The Tetrominoes
    const lTetromino = [
        [1, columns + 1, columns * 2 + 1, 2],
        [columns, columns + 1, columns + 2, columns * 2 + 2],
        [1, columns + 1, columns * 2 + 1, columns * 2],
        [columns, columns * 2, columns * 2 + 1, columns * 2 + 2]
    ]

    const zTetromino = [
        [0, columns, columns + 1, columns * 2 + 1],
        [columns + 1, columns + 2, columns * 2, columns * 2 + 1],
        [0, columns, columns + 1, columns * 2 + 1],
        [columns + 1, columns + 2, columns * 2, columns * 2 + 1]
    ]

    const tTetromino = [
        [1, columns, columns + 1, columns + 2],
        [1, columns + 1, columns + 2, columns * 2 + 1],
        [columns, columns + 1, columns + 2, columns * 2 + 1],
        [1, columns, columns + 1, columns * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, columns, columns + 1],
        [0, 1, columns, columns + 1],
        [0, 1, columns, columns + 1],
        [0, 1, columns, columns + 1]
    ]

    const iTetromino = [
        [1, columns + 1, columns * 2 + 1, columns * 3 + 1],
        [columns, columns + 1, columns + 2, columns + 3],
        [1, columns + 1, columns * 2 + 1, columns * 3 + 1],
        [columns, columns + 1, columns + 2, columns + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];
    // draw();


    function draw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        })
    }

    function undraw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }


    function movedown() {
        undraw();
        currentPosition += columns;
        draw();
        freeze();
    }


    function freeze() {
        if (current.some((index) => squares[currentPosition + index + columns].classList.contains('taken'))) {
            current.forEach((index) => squares[currentPosition + index].classList.add('taken'));
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            gameOver();
            draw();
            addScore();
            displayShape();

        }
    }


    //assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            movedown();
        }
    }
    document.addEventListener('keyup', control)

    //move tetromino left , unless is at edge or  there is a blockage.
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % columns == 0);
        if (!isAtLeftEdge) {
            currentPosition -= 1;
        }
        if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
        freeze();
    }

    //move tetromino right , unless is at edge or  there is a blockage.
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % columns == columns - 1);
        if (!isAtRightEdge) {
            currentPosition += 1;
        }
        if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
        freeze();
    }

    function isnearLeftEdge() {
        return current.some(index => (currentPosition + index) % columns < 2);
    }

    function isnearRightEdge() {
        return current.some(index => (currentPosition + index) % columns > (columns - 3));

    }

    function rotate() {

        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            //if currentRotation value is greater that 4 than reset same to 0
            currentRotation = 0;
        }
        if (isnearLeftEdge()) {
            current = theTetrominoes[random][currentRotation];
            if (isnearRightEdge()) {
                currentPosition++;
            }
        } else if (isnearRightEdge()) {
            current = theTetrominoes[random][currentRotation];
            if (isnearLeftEdge()) {
                //for i teteromino we need to move by 2 units left
                currentPosition = (random == 4) ? currentPosition - 2 : currentPosition - 1;
            }
        } else {
            current = theTetrominoes[random][currentRotation];
        }
        draw();

    }


    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4;
    const displayIndex = 0;


    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    //display the shape in the mini-grid display
    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    };


    startBtn.addEventListener('click', () => {
        if (restartGame) {
            location.reload();
        }

        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(movedown, 500);
            displayShape();
        }
    });

    //add score
    function addScore() {
        for (let i = 4 * columns; i <= ((rows * columns) - columns); i += columns) {
            let row = [];

            for (let j = 0; j < columns; j++) {
                row.push(i + j);
            }

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                    squares[index].remove();
                    let box = document.createElement('div');
                    box.style.width = boxWidth + "rem";
                    box.style.height = boxHeight + "rem";
                    play.insertBefore(box, play.firstElementChild);
                });
                squares = [...document.querySelectorAll('.start div'), ...document.querySelectorAll('.play div')];
            }
        }
    }


    //game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            document.querySelector('#gameOver').style.display = "block";
            restartGame = true;
            clearInterval(timerId);
            document.removeEventListener('keyup', control);
            return true;
        }
        return false;
    }

});