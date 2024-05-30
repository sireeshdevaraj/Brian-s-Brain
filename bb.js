const canvas = document.getElementById("canvas");
canvas.height = 500//window.window.outerWidth;
canvas.width = 500//canvas.height;
const ctx = canvas.getContext("2d");
const btn = document.getElementById("btn");
const step = document.getElementById("step");
const clearButton = document.getElementById("clear");
let board = [];
let temp = [];
let intervalId;

// -1 -> off
// 0 -> dying
// 1 -> on

const boardRows =canvas.height;
const boardColumns = boardRows;

for (let r=0; r<boardRows;r++){

    for (let c=0; c<boardColumns;c++){
        temp.push(-1);        
    }
    board.push(temp);
    temp = [];   
}


function checkCells(row,col,newBoard,board){
    let stateValue = 0;
    for (let i=-1;i<=1;i++){
        for (let j=-1;j<=1;j++){
            if (i==0 && j==0) continue;
            let r = row+i;
            let c = col+j;
            if (r>=0 && r<=boardRows-1){
                if (c>=0 && c<=boardColumns-1){
                    try{
                        if (board[c][r] == 1) stateValue++;
                    }
                    catch(error){
                        console.log("Error at row and col of",[r,c]);
                        
                    } 
                }
            }
        }   
    }
    if (board[col][row] == 0) newBoard[col][row] =-1;
    else if (board[col][row] == 1) newBoard[col][row] =0;
    else if (board[col][row] == -1 && stateValue == 2) newBoard[col][row] = 1;
    else newBoard[col][row] = board[col][row];
    //console.log("State Value for",col,row,stateValue);

}

function RecurrCellChecker(){
    const newBoard = [];
    for (let r=0; r<boardRows;r++){

        for (let c=0; c<boardColumns;c++){
            temp.push(-1);        
        }
        newBoard.push(temp);
        temp = [];   
    }
    for (let r=0; r<boardColumns;r++){
        for (let c=0; c<boardRows;c++){
           checkCells(r,c,newBoard,board);
           
        }   
    }
    return newBoard;
}
let iterations = 0;
function BB(){
    const nextBoard = RecurrCellChecker();
    ctx.fillStyle = "white";
    for (let i=0;i<boardRows;i++){
        for (let j=0;j<boardColumns;j++){
            if (nextBoard[i][j] == 1){
                ctx.fillStyle = "white";
                ctx.fillRect(10*i,10*j,10,10)
            }else if(nextBoard[i][j] == 0){
                ctx.fillStyle = "blue";
                ctx.fillRect(10*i,10*j,10,10)
            }else if(nextBoard[i][j] == -1){
                ctx.fillStyle = "black";
                ctx.fillRect(10*i,10*j,10,10);
            }
        }
    }
    iterations++;
    try{
        document.getElementById("iterations").innerHTML = iterations;
    }catch(error){console.log(error)}
        board = nextBoard;
}


/*
* Event listeners.
*/


canvas.addEventListener("mousemove",(event)=>{
    if (event.buttons == 1){
        let col = Math.floor(event.offsetX/10);
        let row = Math.floor(event.offsetY/10);
        ctx.fillStyle = "white";
        ctx.fillRect(10*col,10*row,10,10);
        board[col][row] = 1;
    }
    if (event.buttons == 2){
        let col = Math.floor(event.offsetX/10);
        let row = Math.floor(event.offsetY/10);
        ctx.fillStyle = "black";
        ctx.fillRect(10*col,10*row,10,10);
        board[col][row] = -1;
    }
})

canvas.addEventListener("click",(event)=>{
    let col = Math.floor(event.offsetX/10);
    let row = Math.floor(event.offsetY/10);
    ctx.fillStyle = "white";
    ctx.fillRect(10*col,10*row,10,10);
    board[col][row] = 1;
    
})

btn.addEventListener("click",(event)=>{
    intervalId = setInterval(() => {
        BB();
    },100)    
})

step.addEventListener("click",(event)=>{
    BB();
})

const pauseButton = document.getElementById("pause");
pauseButton.addEventListener("click",()=>{
    try{
        if (intervalId) clearInterval(intervalId);
    }catch(error){
        console.log("Error in Pausing the simulation",error);
    }
})

clearButton.addEventListener("click",()=> {
    if (intervalId) clearInterval(intervalId);
    ctx.clearRect(0,0,canvas.width,canvas.height);
})