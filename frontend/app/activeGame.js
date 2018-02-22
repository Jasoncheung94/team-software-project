import * as generateUserDetails from './generateUserDetails';
import * as control from './moveFunctions';
import * as getCookie from './checkUserIDCookie';
import {getEventSource} from './sse';
import * as sendJSON from './sendJSON';

let details = getCookie.checkUserDetails();
let id = details.user_id;

/**
 * Displays the page for an active game.
 *
 * @param gameID The ID for the game that will be displayed.
 */
export function activeGame(gameID, playerList) {
    // display board and assign starting positions.
    displayBoard(playerList);
    generateUserDetails.generateUserDetails();
    details = getCookie.checkUserDetails();
    id = details.user_id;
    enableActiveGameListeners();
}


/**
 * Called when a playerMove event happens.
 *
 * @param playerMoveEvent The data received from the event
 */
function onPlayerMove(playerMoveEvent) {
    const move = String(JSON.parse(playerMoveEvent.data));
    const items = move.split(',');
    console.log(move);
    control.movePlayer(items[0], items[1]);
}

/**
 * Called when a playerTurn event happens.
 *
 * @param playerTurnEvent The data received from the event
 */
function onPlayerTurn(playerTurnEvent) {
    const turn = String(JSON.parse(playerTurnEvent.data));
    document.getElementById('current-turn').innerHTML = `Player ${turn}`;
    console.log(`Turn:${turn}`);
    const rollDiceButton = document.getElementById('roll-dice');
    rollDiceButton.onclick = () => { generateUserDetails.rollDice(sendJSON.sendJSON); };
    rollDiceButton.disabled = true;
    const endTurnButton = document.getElementById('end-turn');
    endTurnButton.onclick = () => { generateUserDetails.endTurn(sendJSON.sendJSON); };
    endTurnButton.disabled = true;
    console.log(`id Test:${id}`);
    console.log(`turn Test:${turn}`);
    if (turn === String(id)) {
        generateUserDetails.enableGameInterface();
    }
}

/**
 * Called when a playerBalance event happens.
 *
 * @param playerBalanceEvent The data received from the event
 */
function onPlayerBalance(playerBalanceEvent) {
    const data = JSON.parse(playerBalanceEvent.data);
    let balance = '';
    console.log(`Balances:${data}`);
    data.forEach((item) => {
        // console.log(item);
        if (String(item[0]) === String(id)) {
            ({1: balance} = item);
            document.getElementById('balance').innerHTML = balance;
        }
    });
}

/**
 * Mock function for displaying the monopoly board onscreen.
 */

// displayBoard should take in player id's and then generate the canvas with its ids.
// another option instead of using create canvas would be
// document.getElementById('content').insertAdjacentHTML ('beforeend',
// '<canvas id="" width="" height="" style=""></canvas>');
function displayBoard(playerList) {
    console.log('displayBoard called');
    document.getElementById('content').innerHTML = '<canvas id="gameBoard" height="800" width = "800" style="position: absolute; left: 0 ; top: 0 ;z-index : 0;"></canvas>';

    // creates a canvas with player id and layer i.
    // layer 0 = background image, last layer = game info
    // creates a token for each player on ther canvas.
    for (let i = 1; i <= playerList.length; i += 1) {
        createCanvas(playerList[i - 1], 'content', i);
        control.movePlayer(playerList[i - 1], 0);
    }
    createCanvas('game-info', 'content', playerList + 1);
    const c = document.getElementById('gameBoard');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    };
    img.src = 'monopoly.jpg';
}

// takes in id for canvas, node to append to(<div id="content">), layerNumber
function createCanvas(canvasID, appendToNode, layerNumber) {
    const canvas = document.createElement('canvas');
    canvas.id = canvasID;
    canvas.height = 800;
    canvas.width = 800;
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.zIndex = layerNumber;
    document.getElementById(appendToNode).append(canvas);
}


function enableActiveGameListeners() {
    const eventSource = getEventSource();
    eventSource.addEventListener('playerMove', onPlayerMove);
    eventSource.addEventListener('playerTurn', onPlayerTurn);
    eventSource.addEventListener('playerBalance', onPlayerBalance);
    // eventSource.addEventListener('gameEnd', disableActiveGameListeners);
}

/*
function disableActiveGameListeners(gameEndEvent) {
    const eventSource = getEventSource();
    eventSource.removeEventListener('playerMove', onPlayerMove);
    eventSource.removeEventListener('playerTurn', onPlayerTurn);
    eventSource.removeEventListener('playerBalance', onPlayerBalance);
}
*/
