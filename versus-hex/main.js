const forceBackendUrl = false; 
const hexCharacters = '0123456789abcdef'; 
let socket; 
let RGB = {R: '0', G: '0', B: '0'}; 
let name = ''; 
const messages = {}; 
[
	'INITIALIZE',
	'JOIN',
	'WAIT',
	'START',
	'PLAY',
	'MOVE',
	'RESULT',
	'RESIGN',
	'TIMEOUT',
	'SUCCESS',
    'ERROR',
].forEach((s, i) => messages[s] = i); 

window.addEventListener('DOMContentLoaded', () => {
    socket = new WebSocket(!forceBackendUrl && window.location.hostname === 'localhost' ? 'ws://localhost:8080/web_dev_games_versus_backend' : 'wss://www.el-evan.com/web_dev_games_versus_backend'); 
    socket.addEventListener('error', displayError); 
    socket.addEventListener('close', displayError); 
    socket.addEventListener('open', main);
}); 

const main = () => {
    document.querySelector('new-match').addEventListener('click', () => {
        if(!getName()) return; 
        socket.send(JSON.stringify({State: messages.JOIN, Payload: getName()}));
        document.querySelector('select').setAttribute('disabled', 'disabled'); 
    }); 
    document.querySelector('resign').addEventListener('click', () => socket.send(JSON.stringify({State: messages.RESIGN}))); 

    document.querySelector('enter-color').addEventListener('click', colorClick => {
        RGB[colorClick.target.parentElement.tagName] = colorClick.target.innerText; 
        socket.send(JSON.stringify({State: messages.MOVE, Payload: getRGB()})); 
    }); 
    
    socket.addEventListener('message', socketMessage => {
        console.log('socket message: ' + socketMessage.data); 
        
        let yourMove; 
        const message = JSON.parse(socketMessage.data); 
        switch(message.State) {
            case messages.WAIT: 
                console.log('WAIT message'); 
                setFeedback('You are currently waiting for an opponent.'); 
                setEnterColorActive(false); 
                break; 
            case messages.START: 
                console.log('START message'); 
                setOpponent(message.Names[1-message.Names.indexOf(name)]); 
                yourMove = message.Names.indexOf(name) === message.Moves.length % 2; 
                setEnterColorActive(yourMove); 
                setFeedback(yourMove ? '' : `Waiting for ${message.Names[1-message.Names.indexOf(name)]} to move.`); 
                break; 
            case messages.MOVE: 
                console.log('MOVE message'); 
                setRGB(message.Moves[message.Moves.length-1]); 
                yourMove = message.Names.indexOf(name) === message.Moves.length % 2; 
                setEnterColorActive(yourMove); 
                setFeedback(yourMove ? '' : `Waiting for ${message.Names[1-message.Names.indexOf(name)]} to move.`); 
                break; 
            case messages.SUCCESS: 
                console.log('SUCCESS message'); 
                setEnterColorActive(false); 
                setFeedback(`Someone Won!  It was ${message.Winner}.`); 
                break; 
            case messages.RESIGN: 
                console.log('RESIGN message'); 
                setFeedback(`Someone resigned.  The player who resigned was ${message.Names[1 - message.Names.indexOf(message.Winner)]}.  That means that ${message.Winner} won.  The game.`); 
                setEnterColorActive(false); 
                break; 
            case messages.TIMEOUT: 
                console.log('TIMEOUT message'); 
                break; 
            case messages.ERROR: 
                console.log('ERROR message'); 
                setEnterColorActive(false); 
                setFeedback(`There was an error on the part of ${message.Names[1 - message.Names.indexOf(message.Winner)]}.  That means that ${message.Winner} won.  Wooo.`); 
            default: 
                console.log('ERROR message'); 
                break
        }
    }); 
}; 

const getRGB = () => `${RGB.R}${RGB.G}${RGB.B}`; 
const setRGB = (goal) => {
    Object.keys(RGB).forEach((k, index) => RGB[k] = String.fromCharCode(goal[index])); 
    document.querySelector('problem-color').style.backgroundColor = `#${getRGB()}`; 
}; 

const getName = () => {
    const select = document.querySelector('select'); 
    name = select[select.selectedIndex].innerText; 
    if(name === 'select your name') name = ''; 
    return name; 
};

const setEnterColorActive = isActivate => {
    document.querySelector('blocker').style.display = isActivate ? 'none' : 'block'; 
}; 

const setFeedback = s => document.querySelector('feedback').innerText = s; 
const setOpponent = s => document.querySelector('opponent > span').innerText = s; 

const displayError = () => {
    document.querySelector('error').style.display = 'flex'; 
}; 