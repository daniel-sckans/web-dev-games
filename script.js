const forceProductionUrl = false; 

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('guess-the-hex high-score span').innerText = localStorage.getItem('guessTheHexHighScore'); 
    document.querySelector('dom-visualizer high-score span').innerText = localStorage.getItem('domVisualizerHighScore'); 
    document.querySelector('button').addEventListener('click', pickName); 

    populatePlayerGamesData(); 
}); 

const pickName = () => {
    console.log('pickName'); 
    const select = document.querySelector('select'); 
    const name = select[select.selectedIndex].innerText; 
    if(name === 'select your name') return; 

    localStorage.setItem('name', name); 
    populatePlayerGamesData(); 
}; 

const populatePlayerGamesData = async () => {
    const name = localStorage.getItem('name'); 
    if(!name) return; 
    document.querySelector('login').innerText = `Hello ${name}`; 
    const playerGameDevGames = await queryGames(); 
    if(playerGameDevGames) populateGames(playerGameDevGames); 
    return true; 
}; 

const queryGames = () => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest(); 
    xhr.open('POST', !forceProductionUrl && window.location.hostname === 'localhost' ? 'http://localhost:8080/web-dev-games' : 'https://web-dev-games-mr44t3zfia-uc.a.run.app/web-dev-games')
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.send(JSON.stringify({Name: localStorage.getItem('name')})); 

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText); 
            console.log(response); 
            if(typeof response.GuessTheHex !== 'number' || typeof response.DomVisualizer !== 'number') return; 
            resolve(response); 
        }
    }; 
}); 

const populateGames = playerGameDevGames => {
    document.querySelector('guess-the-hex wins span').innerText = playerGameDevGames.GuessTheHex; 
    document.querySelector('dom-visualizer wins span').innerText = playerGameDevGames.DomVisualizer; 
}; 