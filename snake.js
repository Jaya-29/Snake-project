const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i")


let gameOver = false;
let foodX, foodY;
let snakeX = 5; snakeY = 10;
let snakeBody = [];
let velocityX = 0; velocityY = 0;
let setIntervalId;
let score = 0;

//getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;


const changeFoodPosition  = () => {
    // Passing a random 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;

}
const handleGameOver = () => {
    // Clearing the timer and reloading the page
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
} 

const changeDirection = (e) => {
    // change velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
    
}

controls.forEach(key => {
    // calling changedirection on each key click and passing value as an object
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key}));
})
const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class = "food" style = "grid-area: ${foodY} / ${foodX}"></div>`;

    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); //pushing food position to snake body array
        score ++; // increament score by 1


        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score : ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--){
        // shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];    // settings first element of snake body to current snake position


    // Updating the snake's position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // checking if the snake's  head is out of wall, if so setting gameover to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }


    for (let i = 0; i < snakeBody.length; i++){
        // adding a div for each part of the snake's body
        htmlMarkup += `<div class = "head" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //Checking if the snake head hit the body, if so set gameOver to true
        if(i !==0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);