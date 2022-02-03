export const htmlTemplates = {
    board: 1,
    card: 2,
    status: 3,
    addStatusButton: 4,
    addModal: 5
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.status:
            return statusBuilder
        case htmlTemplates.addStatusButton:
            return addStatusBuilder
        case htmlTemplates.addModal:
            return addModalBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(board) {
    return `<section class="board" data-board-id="${board.id}">
                <div class="board-header" data-board-id="${board.id}">
                    <span class="board-title" data-board-id="${board.id}">${board.title}</span>
                    <button class="board-add" data-board-id="${board.id}">Add Card</button>
                    <button class="toggle-board-button" data-board-id="${board.id}">
                        <i class="fas fa-chevron-down" data-board-id="${board.id}"></i>
                    </button>
                    <button class="board-delete" data-board-id="${board.id}">X</button>
                </div>
                <div class="board-columns" data-board-id="${board.id}">
                </div>
            </section>`
}

export function createNewBoardTitle(boardId = '') {
    boardId = boardId ? `-${boardId}`: ""
    return `<input type="text" 
                    placeholder="Board Title" 
                    id="new-board-title${boardId}" >
           <button id="submit-new-board-title${boardId}">Submit</button>`
}

export function createNewBoard() {
    return `<input type="text" placeholder="Board Title" id="new-board-input-field">
           <button id="new-board">Save</button>`
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" data-board-id="${card.board_id}">${card.title}</div>`;
}

function statusBuilder(status, boardId){
    return`<div class="board-column">
                <div class="board-column-title">${status.title}</div>
                <div class="board-column-content" data-status-id="${status.id}" data-board-id="${boardId}">
                </div>
           </div>`
}

function addStatusBuilder(boardId) {
    return `<div class="add-column-board-column">
                <button type="button" class="add-column btn btn-info btn-lg" data-board-id="${boardId}" data-toggle="modal" data-target="#AddColumnModal${boardId}">+ Add column</button>
                </div>
            </div>`
}

function addModalBuilder(modalTitle, modalLabelText, placeholderText, boardId=null) {
    return `
<div class="modal fade" id="AddColumnModal${boardId}" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">${modalTitle}</h4>
            </div>
            <div class="modal-body">
                <label for="modalInputId${boardId}">${modalLabelText}</label>
                <input type="text" id="modalInputId${boardId}" placeholder="${placeholderText}" minlength="1" data-board-id="${boardId}" required>
            </div>
            <div class="modal-footer">
                <span class="board-id-for-modal"></span>
                <button id="modalSubmitButton${boardId}" class="btn" data-board-id="${boardId}" data-dismiss="modal" disabled>Create</button>
            </div>
        </div>
    </div>
</div>`
}