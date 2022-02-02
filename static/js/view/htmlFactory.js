export const htmlTemplates = {
    board: 1,
    card: 2,
    status: 3
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.status:
            return statusBuilder
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
                    <button class="toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down" data-board-id="${board.id}"></i></button>
                    <button class="board-delete" data-board-id="${board.id}">X</button>
                </div>
                <div class="board-columns" data-board-id="${board.id}">
                </div>
            </section>`
}


export function createNewBoardTitle(boardId = '') {
    console.log('asd');
    boardId = boardId ? `-${boardId}`: ""
    return `<input type="text" 
                    placeholder="Board Title" 
                    id="new-board-title${boardId}" >
            <input type="checkbox" value="true" id="private-checkbox${boardId}">
            <label for="private-checkbox${boardId}">Private</label>
           <button id="submit-new-board-title${boardId}">Submit</button>`
}


export function createNewBoard() {
    return `<button type="button" id="new-board">Submit new board</button>`
}

//-------------OG--------------------------->
// `<div class="board-container">
//                 <div class="board"  data-board-id=${board.id}>${board.title}</div>
//                 <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
//             </div>`;
//-------------NEW-------------------------------------------->
// `<section className="board" data-board-id=${board.id}>
//     <div className="board-header" data-board-id=${board.id}>
//         <span className="board-title" data-board-id=${board.id}>${board.title}</span>
//         <button className="board-add" data-board-id="${board.id}>Add Card</button>
//         <button className="board-toggle" data-board-id="${board.id}><i className="fas fa-chevron-down"></i></button>
//         <button className="board-delete" data-board-id="${board.id}>X</button>
//     </div>
//     <div className="board-columns" data-board-id=${board.id}>
//
//      </div>
// </section>`


function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

function statusBuilder(status, boardId){
    return`<div class="board-column">
                <div class="board-column-title">${status.title}</div>
                <div class="board-column-content" data-status-id="${status.id}" data-board-id="${boardId}">
                </div>
           </div>`
}

// <div class="board-column">
//     <div class="board-column-title">New</div>
//     <div class="board-column-content">
//     </div>
// </div>
