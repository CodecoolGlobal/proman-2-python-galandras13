import { boardsManager } from "./controller/boardsManager.js";

function init () {
    boardsManager.loadBoards();
    boardsManager.createBoard();
}

export async function reset () {
    const root = document.querySelector('#root')
    root.innerHTML = ''
    await init()
}

init();
