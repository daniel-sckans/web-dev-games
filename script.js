window.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('guessTheHexWins')) document.querySelector('guess-the-hex wins span').innerText = localStorage.getItem('guessTheHexWins'); 
    if(localStorage.getItem('guessTheHexHighScore')) document.querySelector('guess-the-hex high-score span').innerText = localStorage.getItem('guessTheHexHighScore'); 
    if(localStorage.getItem('domVisualizerWins')) document.querySelector('dom-visualizer wins span').innerText = localStorage.getItem('domVisualizerWins'); 
    if(localStorage.getItem('domVisualizerHighScore')) document.querySelector('dom-visualizer high-score span').innerText = localStorage.getItem('domVisualizerHighScore'); 
}); 