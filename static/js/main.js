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
    let boardIds = [];
    let cardURLs = [];

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('../sw.js', {}).then(function () {
                return navigator.serviceWorker.ready;
            }).then(function (registration) {
                console.log('Registration successful, scope is:', registration.scope);

                getIds(boardIds, cardURLs).then(function () {
                    registration.active.postMessage(JSON.stringify(cardURLs));
                });
            }).catch(function (error) {
                console.log('Service worker registration failed, error:', error);
            });
        });
    }
}

const getIds = async (boardIds, cardURLs) => {
    const boards = document.querySelectorAll(".board");
    for (const board of boards) {
        boardIds.push(board.dataset.boardId);
    }
    for (const boardId of boardIds) {
        cardURLs.push(
            `/api/boards/${boardId}/cards/`
        );
    }
}

await init().then(registerSW);
