import {dataHandler} from "../data/dataHandler.js";
import {createNewBoardTitle, htmlFactory, htmlTemplates, newCardTitle} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {reset} from "../main.js";
import {boardsManager} from "./boardsManager.js";

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
        cards.sort( sortByCardOrder );
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.board-column-content[data-status-id="${card.status_id}"][data-board-id="${boardId}"]`, content);
            domManager.addEventListener(`.card-remove[data-card-id="${card.id}"]`, "click", deleteButtonHandler);
            domManager.addEventListener(`.card[data-card-id="${card.id}"][data-board-id="${card.board_id}"]`, "click", renameCard)
        }
    }, initDragAndDrop: async function (boardId) {
        await initElements(boardId);
        await initDragEvents();
    }
};

function renameCard(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    const boardId = clickEvent.target.dataset.boardId;
    const selectorString = `.card[data-card-id="${cardId}"]`
    const rename = document.querySelector(selectorString)
    rename.innerHTML = newCardTitle(boardId)
    domManager.addEventListener(`#submit-new-card-${boardId}`, 'click', async () => {
        const modifiedTitle = document.querySelector(`#new-card-title-${boardId}`).value;
        await dataHandler.renameCard(cardId, modifiedTitle);
        await boardsManager.hideCards(boardId);
        await boardsManager.showCards(boardId);
        await cardsManager.loadCards(boardId);
        await cardsManager.initDragAndDrop(boardId);
    })
}


function sortByCardOrder( a, b ) {
  if ( a.card_order < b.card_order ){
    return -1;
  }
  if ( a.card_order > b.card_order ){
    return 1;
  }
  return 0;
}

async function deleteButtonHandler(clickEvent) {
    const boardId = clickEvent.currentTarget.dataset.boardId;
    const cardId = clickEvent.currentTarget.dataset.cardId;
    await dataHandler.deleteCard(cardId);
    await boardsManager.hideCards(boardId);
    await boardsManager.showCards(boardId);
    await cardsManager.loadCards(boardId);
    await cardsManager.initDragAndDrop(boardId);
}

function initElements(boardId) {
    ui.cards = document.querySelectorAll(`.card[data-board-id="${boardId}"]`);
    ui.slots = document.querySelectorAll(`.board-column-content[data-board-id="${boardId}"]`);

    ui.cards.forEach(function (card) {
        card.setAttribute("draggable", true);
    });
}

function initDragEvents() {
    ui.cards.forEach(function (card) {
        initDraggable(card);
    });

    ui.slots.forEach(function (slot) {
        initDropzone(slot);
    });
}

function initDraggable(draggable) {
    draggable.setAttribute("draggable", true);
    draggable.addEventListener("dragstart", handleDragStart);
    draggable.addEventListener("dragend", handleDragEnd);
}

function initDropzone(dropzone) {
    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);
}

function handleDragStart(e) {
    game.dragged = e.currentTarget;
    game.dragged.classList.add("currently-dragged");
    ui.slots.forEach(function (slots) {
        slots.classList.add("highlighted-slots");
    });
}

function handleDragEnd() {
    game.dragged.classList.remove("currently-dragged");
    ui.slots.forEach(function (slots) {
        slots.classList.remove("highlighted-slots");
        slots.classList.remove("highlighted-good-slots");
        slots.classList.remove("highlighted-bad-slots");
    });
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
            dataHandler.updateCards(payload);
        }
    }
    game.dragged = null;
}

function handleDragEnter(e) {
    ui.slots.forEach(function (slots) {
        slots.classList.remove("highlighted-slots");
    });
    if (game.dragged.dataset.boardId === e.currentTarget.dataset.boardId) {
        e.currentTarget.classList.add("highlighted-good-slots");
    } else {
        e.currentTarget.classList.add("highlighted-bad-slots");
    }
}

function handleDragOver(e) {
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

function handleDragLeave(e) {
    e.currentTarget.classList.remove("highlighted-slots");
    e.currentTarget.classList.remove("highlighted-good-slots");
    e.currentTarget.classList.remove("highlighted-bad-slots");

    ui.slots.forEach(function (slots) {
        slots.classList.add("highlighted-slots");
    });
}

function handleDrop(e) {
    e.preventDefault();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.currently-dragged)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child}
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}
