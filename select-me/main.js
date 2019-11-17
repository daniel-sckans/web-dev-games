let forceBackendUrl = false; 
let words; 
let timeCounter = 0, staticTimeCounter = 0, winsCounter = 0; 
let stopwatchEnabled = true; 
const elements = []; 

window.addEventListener('DOMContentLoaded', async () => {
    words = await loadWords(); 
    document.querySelector('template').content.querySelectorAll('*').forEach(element => elements.push(element)); 
    
    populateProblemDom(); 
    document.querySelector('interface').focus(); 
    document.querySelector('interface').addEventListener('keyup', evaluateInput); 
    document.addEventListener('keydown', documentKeydown => documentKeydown.key === 'Tab' ? documentKeydown.preventDefault() : ''); 
    window.setInterval(stopwatch, 1000); 
    document.querySelector('play-again').addEventListener('click', populateNewGame); 
}); 

const loadWords = () => new Promise(resolve => {
    const xhr = new XMLHttpRequest(); 
    xhr.open('GET', 'words.json'); 
    xhr.responseType = 'json'; 
    xhr.addEventListener('load', () => resolve(xhr.response)); 
    xhr.send(); 
}); 

const populateNewGame = () => {
    stopwatchEnabled = true; 
    timeCounter = 0; 
    document.querySelector('interface').setAttribute('contenteditable', 'true'); 
    document.querySelector('interface').innerText = ''; 
    populateProblemDom(); 
    document.querySelector('preview').innerHTML = ''; 
    document.querySelector('problem-dom').className = ''; 
}; 

const stopwatch = () => {
    if(stopwatchEnabled) {
        staticTimeCounter++; 
        document.querySelector('time span').innerText = timeCounter++
    }
}; 

const sendWin = () => {
    const message = {
        Name: localStorage.getItem("name"), 
        Game: "dom_visualizer"
    }; 
    if(!message.Name) return;
    
    const xhr = new XMLHttpRequest(); 
    xhr.open('POST', !forceBackendUrl && window.location.hostname === 'localhost' ? 'http://localhost:8080/web-dev-games' : 'https://web-dev-games-mr44t3zfia-uc.a.run.app/web-dev-games'); 
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.send(JSON.stringify(message)); 

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText); 
            console.log('XHR response: ', response); 
        }
    }; 
}; 