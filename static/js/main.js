import { boardsManager } from "./controller/boardsManager.js";

function init () {
    boardsManager.loadBoards();
    boardsManager.createBoard();
}

export async function reset () {
    const root = document.querySelector('#root');
    root.innerHTML = '';
    await init();
}

init();

let boardIds = [];
let cardURLs = [];
async function getIds() {
    const boards = document.querySelectorAll(".board");
    // console.log(boards);
    for (const board of boards) {
        boardIds.push(board.dataset.boardId);
    }
    // console.log(boardIds);
    for (const boardId of boardIds) {
        cardURLs.push(
            `/api/boards/${boardId}/cards/`
        );
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('../sw.js', {
            // scope: '/'
        }).then(function () {
            return navigator.serviceWorker.ready;
        })
            .then(function (registration) {
                console.log('Registration successful, scope is:', registration.scope);

                getIds().then(function (){
                    registration.active.postMessage(JSON.stringify(cardURLs));
                });
            })
            .catch(function (error) {
                console.log('Service worker registration failed, error:', error);
            });
    });
}