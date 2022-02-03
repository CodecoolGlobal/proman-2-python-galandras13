import {dataHandler} from "../data/dataHandler.js";
import {createNewBoardTitle, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {reset} from "../main.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            // domManager.addEventListener(`.toggle-board-button[data-board-id="${board.id}"]`, "click", showHideButtonHandler);
            domManager.addEventListener(`.board-header[data-board-id="${board.id}"]`, "click", showHideButtonHandler);
            domManager.addEventListener(`.board-title[data-board-id="${board.id}"]`, "click", renameTable);
        }
    },
    loadStatuses: async function () {
        return await dataHandler.getStatuses()
    },
};

async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const columContainer = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
    const button = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`);
    button.classList.toggle("rotate");
    columContainer.classList.toggle("show-board-content");
    if (columContainer.classList.contains("show-board-content")) {
        await showCards(boardId);
        await cardsManager.loadCards(boardId);
        await cardsManager.initDragAndDrop(boardId);
    } else {
        await hideCards(boardId);
    }
}

const showCards = async (boardId) => {
    let statuses = await boardsManager.loadStatuses();
    for (let status of statuses) {
        if (status.board_id === parseInt(boardId)) {
            const statusBuilder = htmlFactory(htmlTemplates.status);
            const content = statusBuilder(status, boardId);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content);
        }
    }
    const addStatusButton = htmlFactory(htmlTemplates.addStatusButton);
    const addStatusButtonContent = addStatusButton(boardId)
    domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, addStatusButtonContent);
    const addModalBuilder = htmlFactory(htmlTemplates.addModal);
    const modalTitle = "Add a column";
    const modalLabelText = "Column name";
    const placeholderText = "Enter a column name (To Do, in Progress, Done)";
    const modalContent = addModalBuilder(modalTitle, modalLabelText, placeholderText, boardId);
    domManager.addChild(`#modalContainer`, modalContent);
    domManager.addEventListener(`#modalInputId${boardId}`, "input", checkInput);
    // domManager.addEventListener(`.add-column[data-board-id="${boardId}"]`, "click", addModal);
    domManager.addEventListener(`#modalSubmitButton${boardId}`, "click", addColumn);
}

const hideCards = async (boardId) => {
    const statusContainer = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
    const modalChild = document.querySelector(`#AddColumnModal${boardId}`);
    modalChild.parentElement.removeChild(modalChild);
    statusContainer.innerHTML = "";
}

function renameTable(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const selectorString = `.board-title[data-board-id="${boardId}"]`
    const rename = document.querySelector(selectorString)
    rename.innerHTML = createNewBoardTitle(boardId)
    // const boardId = clickEvent.target.dataset.boardId;
    // clickEvent.target.innerHTML = createNewBoardTitle(boardId);
    domManager.addEventListener(`#submit-new-board-title-${boardId}`, 'click', async () => {
        const updatedBoardTitle = document.querySelector(`#new-board-title-${boardId}`).value
        await dataHandler.updateBoardTitle(boardId, updatedBoardTitle)
        await reset()
    })
}

async function addColumn(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const newColumnTitle = document.querySelector(`#modalInputId${boardId}`).value;
    await dataHandler.createNewCard(boardId, newColumnTitle);
    await hideCards(boardId);
    await showCards(boardId);
    await cardsManager.loadCards(boardId);
    await cardsManager.initDragAndDrop(boardId);
}

async function checkInput(e) {
    const boardId = e.target.dataset.boardId;
    const createColumnButton = document.querySelector(`#modalSubmitButton${boardId}`);
    createColumnButton.disabled = !e.target.value;
}
