import { boardsManager } from "./controller/boardsManager.js";
import { websocketManager } from "./controller/websocketManager.js";
import { historyManager } from "./controller/historyManager.js";

async function init () {
    await boardsManager.loadBoards();
    await boardsManager.createBoard();
    await historyManager.showHistory();
    websocketManager.init();
}

export async function reset () {
    const root = document.querySelector('#root');
    root.innerHTML = '';
    await init();
}

const registerSW = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('../sw.js').then(function () {
                return navigator.serviceWorker.ready;
            }).then(function (registration) {
                console.log('Registration successful, scope is:', registration.scope);
            }).catch(function (error) {
                console.error('Service worker registration failed, error:', error);
            });
        });
    }
}

registerSW();
await init();
