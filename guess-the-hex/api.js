const backendUrl = 'resolute-oxygen-253108.appspot.com'; // DO NOT INCLUDE PROTOCOL OR TRAILING '/'
const forceBackendUrl = false; 
const backendSocketPath = 'socket'; 
const backendAjaxPath = 'ajax'; 

window.addEventListener('DOMContentLoaded', () => {
    trySocket(); 
    tryAjax(); 
}); 

const trySocket = () => {
    let socket = new WebSocket(!forceBackendUrl && window.location.hostname === 'localhost' ? `ws://localhost:8080/${backendSocketPath}` : `wss://${backendUrl}/${backendSocketPath}`); 
    if(!socket) {
        console.log('Socket doesn\'t exist'); 
        return; 
    }

    socket.addEventListener('open', () => {
        socket.send(JSON.stringify({Message: 'Hiya.'})); 
    }); 

    socket.addEventListener('message', socketMessage => {
        console.log('Message from the back end socket: ', socketMessage.data); 
    }); 
}; 

const tryAjax = () => {
    const ajax = new XMLHttpRequest(); 
    
    ajax.open('POST', !forceBackendUrl && window.location.hostname === 'localhost' ? `http://localhost:8080/${backendAjaxPath}` : `https://${backendUrl}/${backendAjaxPath}`); 
    ajax.setRequestHeader('Content-Type', 'application/json'); 
    ajax.setRequestHeader('Origin', 'https://daniel-sckans.github.io'); 
    ajax.send(JSON.stringify({Message: 'Whoashoo.'})); 
    
    ajax.onreadystatechange = () => {
        if(ajax.readyState === 4 && ajax.status === 200) {
            const ajaxResponse = JSON.parse(ajax.responseText); 
            console.log('Message from the back end AJAX: ', ajaxResponse); 
        }
    }; 
}; 