import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { boardsManager, noClickEvent } from "./boardsManager.js";
import { historyManager } from "./historyManager.js";
import { websocketManager } from "./websocketManager.js";

const ui = {
    slots: null,
    cards: null,
};

const game = {
    dragged: null,
};

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        cards.sort(sortByCardOrder);
        for (let card of cards) {
            if (!card.archived) {
                const cardBuilder = htmlFactory(htmlTemplates.card);
                const content = cardBuilder(card);
                domManager.addChild(`.board-column-content[data-status-id="${card.status_id}"][data-board-id="${boardId}"]`, content);
                domManager.addEventListener(`.card-remove[data-card-id="${card.id}"]`, "click", deleteCardHandler);
                domManager.addEventListener(`.cardName[data-card-id="${card.id}"][data-board-id="${card.board_id}"]`, "click", renameCard);
                domManager.addEventListener(`.archive-add[data-card-id="${card.id}"]`, "click", addToArchiveHandler);
            } else {
                const showArchivedButton = document.querySelector(`.show-archive[data-board-id="${boardId}"]`);
                showArchivedButton.removeAttribute("hidden");
            }
        }
    }, initDragAndDrop: async function (boardId) {
        await initElements(boardId);
        await initDragEvents();
    },
    showCurrentlyDraggedCard (cardId, position) {
        const card = document.querySelector(`[data-card-id="${cardId}"]`);
        card.classList.add('currently-dragged-by-another-user');
        cardsManager.copyCard(card, position);
    },
    copyCard (card, position) {
        let cardCopy = document.querySelector(`.card-copy[data-card-id="${card.dataset.cardId}"]`);
        if (cardCopy == null) {
            const copyOfCardHtml = `<div class="card hidden card-copy" data-card-id="${card.dataset.cardId}">${card.innerHTML}</div>`;
            document.body.insertAdjacentHTML('afterbegin', copyOfCardHtml);
            cardCopy = document.querySelector(`.card-copy[data-card-id="${card.dataset.cardId}"]`);
        }

        cardCopy.style.left = `${position.x + 48}px`;
        cardCopy.style.top = `${position.y - 16}px`;
        cardCopy.classList.remove('hidden');
    }
};

async function renameCard (clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    const boardId = clickEvent.target.dataset.boardId;
    const statusId = clickEvent.target.dataset.statusId;
    const renameCardCurrentName = document.querySelector(`.card-title[data-card-id="${cardId}"]`);
    renameCardCurrentName.classList.add("hidden");
    const currentCardTitle = clickEvent.target.innerText;
    const newCardTitle = htmlFactory(htmlTemplates.newCardTitle);
    const renameCardContent = newCardTitle(boardId, cardId, currentCardTitle, statusId);
    domManager.addChildAfterBegin(`.card[data-card-id="${cardId}"]`, renameCardContent);
    domManager.addEventListener(`#new-card-title-${boardId}`, "keydown", keyDownOnRenameCard);
    domManager.addEventListener(`#new-card-title-${boardId}`, "click", noClickEvent);
    domManager.addEventListener(`#new-card-title-${boardId}`, "focusout", cancelNameChange);
    document.querySelector(`#new-card-title-${boardId}`).focus();
}

async function keyDownOnRenameCard (e) {
    const cardId = e.target.dataset.cardId;
    const boardId = e.target.dataset.boardId;
    const statusId = e.target.dataset.statusId;
    if (e.key === 'Enter') {
        if (e.target.value) {
            const previousTitle = e.target.placeholder;
            const modifiedTitle = document.querySelector(`#new-card-title-${boardId}`).value;
            await renameHistoryHandler(statusId, modifiedTitle, previousTitle);
            await historyManager.showHistory()
            await dataHandler.renameCard(cardId, modifiedTitle);
            await boardsManager.refreshBoard(boardId);
        }
    } else if (e.key === "Escape") {
        const inputField = document.querySelector(`#new-card-title-${boardId}`);
        const currentCardName = document.querySelector(`.card-title[data-card-id="${cardId}"]`);
        inputField.parentElement.removeChild(inputField);
        currentCardName.classList.remove("hidden");
    }
}

const renameHistoryHandler = async (statusId, modifiedTitle, previousTitle) => {
    const status = await dataHandler.getStatus(statusId);
    const sessionStorageModifyCardContent = {
        'cardName': modifiedTitle,
        'previousTitle': previousTitle,
        'statusName': status.title
    };

    if (sessionStorage.getItem("0-historyIndex")) {
        let historyLength = +sessionStorage.getItem("0-historyIndex") + 1;
        sessionStorage.setItem("0-historyIndex", `${historyLength}`);
    } else {
        sessionStorage.setItem("0-historyIndex", "1")
    }

    sessionStorage.setItem(`${sessionStorage.getItem("0-historyIndex")}-updateCard`, JSON.stringify(sessionStorageModifyCardContent));
    let historyLength = sessionStorage.getItem("0-historyIndex");
    sessionStorage.setItem("0-historyIndex", `${historyLength}`);
}

async function cancelNameChange (e) {
    const cardId = e.target.dataset.cardId;
    const boardId = e.target.dataset.boardId;
    const inputField = document.querySelector(`#new-card-title-${boardId}`);
    const currentCardName = document.querySelector(`.card-title[data-card-id="${cardId}"]`);
    inputField.parentElement.removeChild(inputField);
    currentCardName.classList.remove("hidden");
}

function sortByCardOrder (a, b) {
    if (a.card_order < b.card_order) {
        return -1;
    }
    if (a.card_order > b.card_order) {
        return 1;
    }
    return 0;
}

async function deleteCardHandler (clickEvent) {
    const boardId = clickEvent.currentTarget.dataset.boardId;
    const cardId = clickEvent.currentTarget.dataset.cardId;
    const cardName = clickEvent.currentTarget.dataset.cardTitle;
    await deleteCardHistoryHandler(cardName, boardId);
    await historyManager.showHistory()
    await dataHandler.deleteCard(cardId);
    await boardsManager.hideCards(boardId);
    await boardsManager.showColumn(boardId);
    await cardsManager.loadCards(boardId);
    await cardsManager.initDragAndDrop(boardId);
}

const deleteCardHistoryHandler = async (cardName, boardId) => {

    const board = await dataHandler.getBoard(boardId);
    const sessionStorageModifyCardContent = { 'cardName': cardName, 'boardName': board.title };

    if (sessionStorage.getItem("0-historyIndex")) {
        let historyLength = +sessionStorage.getItem("0-historyIndex") + 1;
        sessionStorage.setItem("0-historyIndex", `${historyLength}`);
    } else {
        sessionStorage.setItem("0-historyIndex", "1")
    }

    sessionStorage.setItem(`${sessionStorage.getItem("0-historyIndex")}-deleteCard`, JSON.stringify(sessionStorageModifyCardContent));
    let historyLength = sessionStorage.getItem("0-historyIndex");
    sessionStorage.setItem("0-historyIndex", `${historyLength}`);
}

let addToArchiveHandler = async (event) => {
    const cardId = event.currentTarget.dataset.cardId;
    const boardId = event.currentTarget.dataset.boardId;
    const card = document.querySelector(`.card[data-card-id="${cardId}"]`);
    card.setAttribute("hidden", "");
    await dataHandler.updateArchives(cardId, false);
    const showArchivedButton = document.querySelector(`.show-archive[data-board-id="${boardId}"]`);
    showArchivedButton.removeAttribute("hidden");
}

function initElements (boardId) {
    ui.cards = document.querySelectorAll(`.card[data-board-id="${boardId}"]`);
    ui.slots = document.querySelectorAll(`.board-column-content[data-board-id="${boardId}"]`);

    ui.cards.forEach(function (card) {
        card.setAttribute("draggable", true);
    });
}

function initDragEvents () {
    ui.cards.forEach(function (card) {
        initDraggable(card);
    });

    ui.slots.forEach(function (slot) {
        initDropzone(slot);
    });
}

function initDraggable (draggable) {
    draggable.addEventListener("dragstart", handleDragStart);
    draggable.addEventListener("dragend", handleDragEnd);
    document.addEventListener("drag", handleDrag, false);
}

function initDropzone (dropzone) {
    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);
}

function handleDragStart (e) {
    game.dragged = e.currentTarget;
    game.dragged.classList.add("currently-dragged");
}

async function handleDragEnd () {
    game.dragged.classList.remove("currently-dragged");
    const boardId = game.dragged.dataset.boardId;
    const columns = document.querySelectorAll(`.board-column-content[data-board-id="${boardId}"]`);
    for (let column of columns) {
        for (let i = 0; i < column.children.length; i++) {
            let card = column.children[i];
            let cardID = card.dataset.cardId;
            let cardOrder = Array.from(card.parentNode.children).indexOf(card);
            let statusId = card.parentNode.dataset.statusId;
            let payload = {
                'card_id': cardID,
                'card_order': cardOrder,
                'status_id': statusId
            };

            card.children[0].children[0].setAttribute(`data-status-id`, `${statusId}`);
            await dataHandler.updateCards(payload);
        }
    }
    websocketManager.sendCardDropped(boardId);
    game.dragged = null;
}

function handleDrag (e) {
    websocketManager.sendCardPosition(e.target.dataset.cardId, { x: e.clientX, y: e.clientY })
}

function handleDragEnter (e) {
    ui.slots.forEach(function (slots) {
        slots.classList.remove("highlighted-slots");
    });
    if (game.dragged.dataset.boardId === e.currentTarget.dataset.boardId) {
        e.currentTarget.classList.add("highlighted-good-slots");
    } else {
        e.currentTarget.classList.add("highlighted-bad-slots");
    }
}

function handleDragOver (e) {
    e.preventDefault();
    const dropzone = e.currentTarget;
    const afterElement = getDragAfterElement(dropzone, e.clientY);
    const draggable = document.querySelector('.currently-dragged');
    if (game.dragged.classList.contains("card")) {
        if (dropzone.dataset.boardId === game.dragged.dataset.boardId) {
            if (afterElement == null) {
                dropzone.appendChild(draggable);
            } else dropzone.insertBefore(draggable, afterElement);
        }
    }
}

function handleDragLeave (e) {
    e.currentTarget.classList.remove("highlighted-slots");
    e.currentTarget.classList.remove("highlighted-good-slots");
    e.currentTarget.classList.remove("highlighted-bad-slots");

    ui.slots.forEach(function (slots) {
        slots.classList.add("highlighted-slots");
    });
}

function handleDrop (e) {
    e.preventDefault();
}

function getDragAfterElement (container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.currently-dragged)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
