export const htmlTemplates = {
    board: 1,
    card: 2,
    status: 3,
    addStatusButton: 4,
    addModal: 5,
    addCreateCardButton: 6,
    createNewCard: 7,
    addColumnModalBody: 8,
    addModalArchiveBody: 9,
    addModalArchiveCard: 10,
    newColumnTitle: 11,
    newCardTitle: 12,
    createNewBoardTitle: 13,
    createNewBoard: 14,
    showHistory: 15,
    showHistoryUpdate: 16,
}

export function htmlFactory (template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder;
        case htmlTemplates.card:
            return cardBuilder;
        case htmlTemplates.status:
            return statusBuilder;
        case htmlTemplates.addStatusButton:
            return addStatusBuilder;
        case htmlTemplates.addModal:
            return addModalBuilder;
        case htmlTemplates.addCreateCardButton:
            return addCreateCardBuilder;
        case htmlTemplates.createNewCard:
            return createNewCardInputBuilder;
        case htmlTemplates.addColumnModalBody:
            return addModalColumnBodyBuilder;
        case htmlTemplates.addModalArchiveBody:
            return addModalArchiveBodyBuilder;
        case htmlTemplates.addModalArchiveCard:
            return addModalArchiveCardBuilder;
        case htmlTemplates.newColumnTitle:
            return newColumnTitle;
        case htmlTemplates.newCardTitle:
            return newCardTitle;
        case htmlTemplates.createNewBoardTitle:
            return createNewBoardTitle;
        case htmlTemplates.createNewBoard:
            return createNewBoard;
        case htmlTemplates.showHistory:
            return showHistoryBuilder;
        case htmlTemplates.showHistoryUpdate:
            return showHistoryUpdateBuilder
        default:
            console.error("Undefined template: " + template)
            return () => {
                return ""
            }
    }
}

function boardBuilder (board) {
    return `<section class="board" data-board-id="${board.id}">
                <div class="board-header" data-board-id="${board.id}">
                    <span class="board-title" data-board-id="${board.id}">${board.title}</span>
                    <button class="board-delete" data-board-id="${board.id}">X</button>
                    <span Class="add-card-button-container${board.id}"></span>
                    <span class="toggle-board-button-container">
                        <button class="toggle-board-button" data-board-id="${board.id}">
                            <i class="fas fa-chevron-down" data-board-id="${board.id}"></i>
                        </button>
                        <button type="button" class="show-archive" data-board-id="${board.id}" data-toggle="modal" data-target="#AddArchiveModal${board.id}" hidden>Show archived cards
                            <i class="fas fa-archive" data-board-id="${board.id}"></i>
                        </button>
                    </span>
                </div>
                <div class="board-columns" data-board-id="${board.id}">
                </div>
            </section>`;
}

export function createNewBoardTitle (boardId = '') {
    let boardIdWithDash = boardId ? `-${boardId}` : ""
    return `<input type="text" 
                    placeholder="Board Title" 
                    id="new-board-title${boardIdWithDash}"
                    data-board-id="${boardId}"
                    autofocus>
           <button id="submit-new-board-title${boardIdWithDash}" data-board-id="${boardId}">Submit</button>`;
}

export function newColumnTitle (boardId = "", statusId = "") {
    return `<input type="text" 
                    placeholder="Enter new column title" 
                    id="new-column-title-${statusId}"
                    data-board-id="${boardId}"
                    data-status-id="${statusId}"
                    autofocus>`;
}

export function newCardTitle (boardId = "", cardId = "", currentCardTitle="", statusId="") {
    return `<input type="text" 
                    placeholder="${currentCardTitle}" 
                    id="new-card-title-${boardId}"
                    data-board-id="${boardId}"
                    data-card-id="${cardId}"
                    data-status-id="${statusId}"
                    autofocus>`;
}

function createNewBoard () {
    return `<input type="text" placeholder="Board Title" id="new-board-input-field" autofocus>
           <button id="new-board">Save</button>`;
}

function cardBuilder (card) {
    return `<div class="card" data-card-id="${card.id}" data-board-id="${card.board_id}">
                <div class="card-title"  data-card-id="${card.id}" data-board-id="${card.board_id}">
                    <span class="cardName" data-card-id="${card.id}" data-board-id="${card.board_id}" data-status-id="${card.status_id}">${card.title}</span>
                </div>
                <div class="archive-add" data-card-id="${card.id}" data-board-id="${card.board_id}">
                    <i class="fas fa-archive"></i>
                </div>
                <div class="card-remove" data-card-id="${card.id}" data-board-id="${card.board_id}" data-card-title="${card.title}">
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>`;
}

function statusBuilder (status, boardId) {
    return `<div class="board-column">
                <div class="board-column-title-${status.id} board-column-title-container">
                    <span id="columnName${status.id}" data-status-id="${status.id}" data-board-id="${boardId}">${status.title}</span>
                    <span class="delete-column-button"><i class="fas fa-trash-alt pointer" id="delete-column-button-${boardId}-${status.id}" data-board-id=${boardId} data-status-id=${status.id}></i></span>
                </div>
                <div class="board-column-content" data-status-id="${status.id}" data-board-id="${boardId}">
                </div>
           </div>`;
}

function addStatusBuilder (boardId) {
    return `<div class="add-column-board-column">
                <button type="button" class="add-column btn btn-info btn-lg" data-board-id="${boardId}" data-toggle="modal" data-target="#AddColumnModal${boardId}">+ Add column</button>
                </div>
            </div>`;
}

function addModalBuilder (modalTitle, type, boardId = null) {
    let modalContent = "";
    modalContent += `<div class="modal fade" id="Add${type}Modal${boardId}" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">${modalTitle}</h4>
                                </div>
                                <div class="modal-body-${type}-${boardId}">
                                    
                                </div>`;
    if (type === "Column") {
        modalContent += `<div class="modal-footer">
                            <span class="board-id-for-modal"></span>
                            <button id="modalSubmitButton${boardId}" class="btn" data-board-id="${boardId}" data-dismiss="modal" disabled>Create</button>
                        </div>`;
    }
    modalContent += `</div>
                </div>
            </div>`;
    return modalContent;
}

const addModalColumnBodyBuilder = (boardId, modalLabelText, placeholderText) => {
    return `<label for="modalInputId${boardId}">${modalLabelText}</label>
            <input type="text" id="modalInputId${boardId}" placeholder="${placeholderText}" minLength="1" data-board-id="${boardId}"
               required autoFocus>`;
}

const addModalArchiveBodyBuilder = (boardId) => {
    return `<ul class="archived-cards-${boardId}"></ul>`;
}

function addCreateCardBuilder (boardId) {
    return `<button class="board-add-new-card" data-board-id="${boardId}">Create new card</button>`;
}

function createNewCardInputBuilder (boardId) {
    return `<input type="text" placeholder="Card name" id="new-card-input-field${boardId}" data-board-id="${boardId}" autofocus>
           <button id="new-card${boardId}" class="" data-board-id="${boardId}" disabled>Save</button>`;
}

const addModalArchiveCardBuilder = (archivedCard) => {
    return `<li class="archived-card-li-${archivedCard.id}"><div class="archived-card"  data-card-id="${archivedCard.id}" data-board-id="${archivedCard.board_id}">
                    <span class="archived-cardName" data-card-id="${archivedCard.id}" data-board-id="${archivedCard.board_id}">${archivedCard.title}</span>
                    <i class="un-archive fas fa-archive" data-card-id="${archivedCard.id}" data-board-id="${archivedCard.board_id}"></i>
                </div>
            </div></li>`;
}

const showHistoryBuilder = (action, boardName, cardName) => {
    return `<li>
                <span>${cardName} card in board: ${boardName} has been ${action}!</span>
            </li>`
}

const showHistoryUpdateBuilder = (statusName, modifiedTitle, previousTitle) => {
    return `<li>
                <span>${previousTitle} has been renamed to: ${modifiedTitle} at ${statusName} column!</span>
            </li>`
}
