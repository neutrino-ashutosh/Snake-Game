document.addEventListener('DOMContentLoaded', function () {

    const gameArena = document.getElementById('game-arena');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0; // Score of the game
    let gameStarted = false; // Game status
    let food = { x: 300, y: 200 }; // {x: 15*20, y: 10*20} // -> cell coordinate -> pixels// top left pixels for food
    let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}]; // [head, body, body, tail]

    let dx = cellSize; // +20
    let dy = 0;
    let intervalId;
    let gameSpeed = 200;
    
    /**
     * Generates a new random position for food that is not occupied by the snake.
     * @returns {Object} - The new position of the food in the format {x: number, y: number}.
     */
    function moveFood() {
        let newX, newY;

        do {
            newX = Math.floor(Math.random() * 30) * cellSize;
            newY = Math.floor(Math.random() * 30) * cellSize;
        } while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));

        food = { x: newX, y: newY };
    }
    /**
     * Updates the position of the snake according to the current direction and game speed.
     * If the snake head collides with the food, the score is increased and the food is moved to a new random position.
     * If the snake head is not colliding with the food, the tail of the snake is removed.
     * @returns {void}
     */
    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead); // Add new head to the snake

        // check collision with food
        if(newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            moveFood();

            if(gameSpeed > 50) {
                clearInterval(intervalId);
                gameSpeed -= 10;
                gameLoop();
            }

        } else {
            snake.pop(); // Remove tail
        }
    }

    /**
     * Handles key presses to change the direction of the snake.
     * Does not allow the snake to turn 180 degrees.
     * @param {KeyboardEvent} e - The event object from the key press.
     * @returns {void}
     */
    function changeDirection(e) {
        console.log("key pressed", e);
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;
        if(e.key === 'ArrowUp' && !isGoingDown ) {
            dx = 0;
            dy = -cellSize;
        } else if(e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if(e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if(e.key === 'ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    /**
     * Creates a new HTML div element at the given coordinates with the given class.
     * @param {number} x - The x-coordinate of the div.
     * @param {number} y - The y-coordinate of the div.
     * @param {string} className - The class name to add to the div.
     * @returns {HTMLDivElement} - The created div element.
     */
    function drawDiv(x, y, className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }

    /**
     * Clears the game arena and redraws the snake and food with their new positions.
     * @returns {void}
     */
    function drawFoodAndSnake() {
        gameArena.innerHTML = ''; // Clear the game arena
        // wipe out everything and redraw with new positions

        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        })

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }

    /**
     * Checks if the game is over by checking for snake collision and wall collision.
     * @returns {boolean} - True if the game is over, false otherwise.
     */
    function isGameOver() {
        // snake collision checks
        for(let i = 1; i < snake.length; i++) {
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true;
            }
        }

        // wall collision checks
        const hitLeftWall = snake[0].x < 0; // snake[0] -> head
        const hitRightWall = snake[0].x > arenaSize - cellSize;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > arenaSize - cellSize;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    /**
     * The main game loop. Checks for game over, updates the snake's position, redraws the snake and food, and updates the score board.
     * @returns {void}
     */
    function gameLoop() {
        intervalId = setInterval(() => {
            if(isGameOver()) {
                clearInterval(intervalId);
                gameStarted = false;
                alert('Game Over' + '\n' + 'Your Score: ' + score);
                return;
            }
            updateSnake();
            drawFoodAndSnake();
            drawScoreBoard();
        }, gameSpeed);
    }

    /**
     * Starts the game if it is not already started.
     * Sets up event listener for key presses, and starts the game loop.
     * @returns {void}
     */
    function runGame() {
        if(!gameStarted) {
            gameStarted = true;
            document.addEventListener('keydown', changeDirection);
            
            gameLoop(); // TODO: Implement game loop
        }
    }

    /**
     * Updates the score board with the current score.
     * @returns {void}
     */
    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`;
    }

    /**
     * Initializes the game by creating and appending a start button and score board to the page.
     * The start button is hidden once the game is started.
     * @returns {void}
     */
    function initiateGame() {
        const scoreBoard = document.createElement('div'); 
        scoreBoard.id = 'score-board';

        document.body.insertBefore(scoreBoard, gameArena); // Insert score board before game arena


        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');

        startButton.addEventListener('click', function startGame() {
            startButton.style.display = 'none'; // Hide start button

            runGame();
        });

        document.body.appendChild(startButton); // Append start button to the body
    }

    initiateGame();
    
});