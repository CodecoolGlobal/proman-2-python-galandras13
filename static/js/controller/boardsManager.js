import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { reset } from "../main.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(`.board-header[data-board-id="${board.id}"]`, "click", showHideButtonHandler);
            domManager.addEventListener(`.board-title[data-board-id="${board.id}"]`, "click", renameTable);
            domManager.addEventListener(`.board-delete[data-board-id="${board.id}"]`, "click", deleteBoard);
            domManager.addEventListener(`.show-archive[data-board-id="${board.id}"]`, "click", showArchivesModalHandler);
        }
    },
    loadStatuses: async function () {
        return await dataHandler.getStatuses();
    },
    createBoard: async function () {
        domManager.addEventListener('#create-new-board', "click", createBoardHandler);
    },
    hideCards: async function (boardId, deleteModals = true) {
        const statusContainer = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
        const columnModalChild = document.querySelector(`#AddColumnModal${boardId}`);
        const archivesModalChild = document.querySelector(`#AddArchiveModal${boardId}`);
        const createCardContainer = document.querySelector(`.add-card-button-container${boardId}`);
        const showArchivedButton = document.querySelector(`.show-archive[data-board-id="${boardId}"]`);
        showArchivedButton.setAttribute("hidden", "");
        if (deleteModals) {
            columnModalChild.parentElement.removeChild(columnModalChild);
            archivesModalChild.parentElement.removeChild(archivesModalChild);
        }
        statusContainer.innerHTML = "";
        createCardContainer.innerHTML = "";
    },
    showColumn: async function (boardId, deleteModals = true) {
        let statuses = await boardsManager.loadStatuses();
        statuses.sort(sortByStatusId);
        for (let status of statuses) {
            if (status.board_id === parseInt(boardId)) {
                const statusBuilder = htmlFactory(htmlTemplates.status);
                const content = statusBuilder(status, boardId);
                domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content);
                domManager.addEventListener(`#delete-column-button-${boardId}-${status.id}`, "click", deleteColumn);
                domManager.addEventListener(`#columnName${status.id}`, "click", renameColumnHandler);
            }
        }
        addCreateStatus(boardId, deleteModals);
        addCreateCard(boardId, deleteModals);
        if (deleteModals) {
            await addShowArchivesModal(boardId);
        }
    },
    refreshBoard: async function (boardId, deleteModals = true) {
        await boardsManager.hideCards(boardId, deleteModals);
        await boardsManager.showColumn(boardId, deleteModals);
        await cardsManager.loadCards(boardId);
        await cardsManager.initDragAndDrop(boardId);
    }
};

async function showHideButtonHandler (clickEvent) {
    if (clickEvent.target === clickEvent.currentTarget || clickEvent.target.classList.contains("fa-chevron-down")) {
        const boardId = clickEvent.target.dataset.boardId;
        const columContainer = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
        const button = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`);
        button.classList.toggle("rotate");
        columContainer.classList.toggle("show-board-content");
        if (columContainer.classList.contains("show-board-content")) {
            await boardsManager.showColumn(boardId);
            await cardsManager.loadCards(boardId);
            await cardsManager.initDragAndDrop(boardId);
        } else {
            await boardsManager.hideCards(boardId);
        }
    }
}

const addShowArchivesModal = async (boardId) => {
    const modalTitle = "Archived cards";
    const addModalBuilder = htmlFactory(htmlTemplates.addModal);
    const addModalArchiveBodyBuilder = htmlFactory(htmlTemplates.addModalArchiveBody);
    const modalContent = addModalBuilder(modalTitle, "Archive", boardId);
    const modalContentBody = addModalArchiveBodyBuilder(boardId);
    domManager.addChild(`#modalContainer`, modalContent);
    domManager.addChild(`.modal-body-Archive-${boardId}`, modalContentBody);
}

const showArchivesModalHandler = async (e) => {
    const boardId = e.target.dataset.boardId;
    const archivedCardLi = document.querySelector(`.archived-cards-${boardId}`);
    archivedCardLi.innerHTML = "";
    const archivedCards = await dataHandler.getArchived(boardId);
    for (let archivedCard of archivedCards) {
        const addModalArchiveCardBuilder = htmlFactory(htmlTemplates.addModalArchiveCard);
        const modalCardContent = addModalArchiveCardBuilder(archivedCard);
        domManager.addChild(`.archived-cards-${boardId}`, modalCardContent);
        const unArchiveButton = document.querySelector(`.un-archive[data-card-id="${archivedCard.id}"]`);
        unArchiveButton.classList.add("pointer");
        domManager.addEventListener(`.un-archive[data-card-id="${archivedCard.id}"]`, "click", unArchiveHandler);
    }
}

const unArchiveHandler = async (e) => {
    const cardId = e.target.dataset.cardId;
    const boardId = e.target.dataset.boardId;
    await dataHandler.updateArchives(cardId, true);
    const archivedCard = document.querySelector(`.archived-card-li-${cardId}`);
    archivedCard.parentElement.removeChild(archivedCard);
    await boardsManager.refreshBoard(boardId, false);
}

function sortByStatusId (a, b) {
    if (a.id < b.id) {
        return -1;
    }
    if (a.id > b.id) {
        return 1;
    }
    return 0;
}

function renameTable (clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const selectorString = `.board-title[data-board-id="${boardId}"]`;
    const rename = document.querySelector(selectorString);
    const createNewBoardTitle = htmlFactory(htmlTemplates.createNewBoardTitle);
    rename.innerHTML = createNewBoardTitle(boardId);
    domManager.addEventListener(`#submit-new-board-title-${boardId}`, 'click', async () => {
        const updatedBoardTitle = document.querySelector(`#new-board-title-${boardId}`).value;
        await dataHandler.updateBoardTitle(boardId, updatedBoardTitle);
        await reset();
    })
}

async function addCardInput (clickEvent) {
    clickEvent.stopPropagation();
    const boardId = clickEvent.target.dataset.boardId;
    const createNewCard = htmlFactory(htmlTemplates.createNewCard);
    const createNewCardInputContent = createNewCard(boardId);
    const createCardButton = document.querySelector(`.board-add-new-card[data-board-id="${boardId}"]`);
    createCardButton.classList.add("hidden");
    domManager.addChild(`.add-card-button-container${boardId}`, createNewCardInputContent);
    domManager.addEventListener(`#new-card${boardId}`, "click", addCard);
    domManager.addEventListener(`#new-card-input-field${boardId}`, "input", checkCreateCardInput);
    domManager.addEventListener(`#new-card-input-field${boardId}`, "click", noClickEvent);
}

async function addCard (clickEvent) {
    clickEvent.stopPropagation();
    const boardId = clickEvent.target.dataset.boardId;
    const createCardInputField = document.querySelector(`#new-card-input-field${boardId}`);
    const newCardName = createCardInputField.value;
    await dataHandler.createNewCard(boardId, newCardName);
    await boardsManager.refreshBoard(boardId);
}

async function addColumn (clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const newColumnTitle = document.querySelector(`#modalInputId${boardId}`).value;
    await dataHandler.createNewColumn(boardId, newColumnTitle);
    await boardsManager.refreshBoard(boardId);
}

async function checkInput (e) {
    const boardId = e.target.dataset.boardId;
    const createColumnButton = document.querySelector(`#modalSubmitButton${boardId}`);
    createColumnButton.disabled = !e.target.value;
}

async function checkCreateCardInput (e) {
    const boardId = e.target.dataset.boardId;
    const createCardButton = document.querySelector(`#new-card${boardId}`);
    createCardButton.disabled = !e.target.value;
}

export async function noClickEvent (e) {
    e.stopPropagation();
}

function createBoardHandler (clickEvent) {
    const buttonSpan = clickEvent.target.parentElement;
    const createButton = clickEvent.target;
    const inputFieldSelector = `#new-board-input-field`;

    if (!document.querySelector(inputFieldSelector)) {
        createButton.classList.toggle('hidden');
        const createNewBoard = htmlFactory(htmlTemplates.createNewBoard);
        const textBox = createNewBoard();
        buttonSpan.insertAdjacentHTML('afterbegin', textBox);
        const inputField = document.querySelector(inputFieldSelector);
        const submitButton = document.querySelector('#new-board');
        inputField.focus();
        domManager.addEventListener('#new-board', "click", async () => {
            const title = inputField.value;
            const userId = createButton.dataset.userId;
            await dataHandler.createNewBoard(title, userId);
            await reset();
            hideForm(createButton, inputField, submitButton);
        });
    }
}

function hideForm (createButton, inputField, submitButton) {
    createButton.parentElement.removeChild(inputField);
    createButton.parentElement.removeChild(submitButton);
    createButton.classList.toggle('hidden');
}

function addCreateStatus (boardId, deleteModals) {
    const addStatusButton = htmlFactory(htmlTemplates.addStatusButton);
    const addStatusButtonContent = addStatusButton(boardId);
    domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, addStatusButtonContent);
    if (deleteModals) {
        const addModalBuilder = htmlFactory(htmlTemplates.addModal);
        const addColumnModalBody = htmlFactory(htmlTemplates.addColumnModalBody);
        const modalTitle = "Add a column";
        const modalLabelText = "Column name";
        const placeholderText = "Enter a column name (To Do, in Progress, Done)";
        const modalContent = addModalBuilder(modalTitle, "Column", boardId);
        const modalContentBody = addColumnModalBody(boardId, modalLabelText, placeholderText);
        domManager.addChild(`#modalContainer`, modalContent);
        domManager.addChild(`.modal-body-Column-${boardId}`, modalContentBody);
        domManager.addEventListener(`#modalInputId${boardId}`, "input", checkInput);
        domManager.addEventListener(`#modalSubmitButton${boardId}`, "click", addColumn);
    }
}

function addCreateCard (boardId) {
    const addCreateCardButton = htmlFactory(htmlTemplates.addCreateCardButton);
    const addCreateCardButtonContent = addCreateCardButton(boardId);
    domManager.addChild(`.add-card-button-container${boardId}`, addCreateCardButtonContent);
    domManager.addEventListener(`.board-add-new-card[data-board-id="${boardId}"]`, "click", addCardInput);
}

async function deleteBoard (clickEvent) {
    clickEvent.stopPropagation();
    const boardId = clickEvent.target.dataset.boardId;
    await dataHandler.deleteBoard(boardId);
    await reset();
}

async function deleteColumn (clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const statusId = clickEvent.target.dataset.statusId;
    await dataHandler.deleteColumn(boardId, statusId);
    await boardsManager.hideCards(boardId);
    await boardsManager.showColumn(boardId);
    await cardsManager.loadCards(boardId);
    await cardsManager.initDragAndDrop(boardId);
}

async function renameColumnHandler (clickEvent) {
    const statusId = clickEvent.target.dataset.statusId;
    const boardId = clickEvent.target.dataset.boardId;
    const renameColumnCurrentName = document.querySelector(`#columnName${statusId}`);
    renameColumnCurrentName.classList.add("hidden");
    const newColumnTitle = htmlFactory(htmlTemplates.newColumnTitle);
    const renameColumnContent = newColumnTitle(boardId, statusId);
    domManager.addChildAfterBegin(`.board-column-title-${statusId}`, renameColumnContent);
    domManager.addEventListener(`#new-column-title-${statusId}`, "keydown", keyDownOnRenameColumn);
    domManager.addEventListener(`#new-column-title-${statusId}`, "click", noClickEvent);
    domManager.addEventListener(`#new-column-title-${statusId}`, "focusout", cancelNameChange);
    document.querySelector(`#new-column-title-${statusId}`).focus();
}

async function keyDownOnRenameColumn (e) {
    const statusId = e.target.dataset.statusId;
    const boardId = e.target.dataset.boardId;
    if (e.key === 'Enter') {
        if (e.target.value) {
            const modifiedTitle = document.querySelector(`#new-column-title-${statusId}`).value;
            await dataHandler.renameColumn(statusId, modifiedTitle);
            await boardsManager.refreshBoard(boardId);
        }
    } else if (e.key === "Escape") {
        const inputField = document.querySelector(`#new-column-title-${statusId}`);
        const currentColumnName = document.querySelector(`#columnName${statusId}`);
        inputField.parentElement.removeChild(inputField);
        currentColumnName.classList.remove("hidden");
    }
}

async function cancelNameChange (e) {
    const statusId = e.target.dataset.statusId;
    const inputField = document.querySelector(`#new-column-title-${statusId}`);
    const currentColumnName = document.querySelector(`#columnName${statusId}`);
    inputField.parentElement.removeChild(inputField);
    currentColumnName.classList.remove("hidden");
}
