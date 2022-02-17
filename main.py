from flask import Flask, render_template, url_for, request, redirect, session
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit

from util import json_response, hash_password, check_password, jsonify_dict
import mimetypes
import queires

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
socketio = SocketIO(app)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    user_id = session['id'] if 'id' in session else None
    return queires.get_boards(user_id)


@app.route("/api/boards/<board_id>")
@json_response
def get_board(board_id):
    return queires.get_board_by_id(board_id)


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queires.get_cards_for_board(board_id)


@app.route("/api/statuses/")
@json_response
def get_statuses():
    return queires.get_statuses()


@app.route("/api/statuses/<status_id>")
@json_response
def get_status_by_status_id(status_id):
    return queires.get_status_by_status_id(status_id)


@app.route("/api/cards/<int:card_id>")
@json_response
def get_card(card_id):
    return queires.get_card_by_id(card_id)


@app.route("/api/newBoards", methods=['POST'])
def create_board():
    board_title = request.get_json()["board_title"]
    user_id = request.get_json()["user_id"] if request.get_json()["user_id"] else None
    queires.create_board(board_title, user_id)
    return redirect("/")


@app.route("/api/modifiedBoards/<board_id>", methods=['GET', 'PUT'])
def update_board(board_id):
    request_json = request.get_json()
    modified_name = request_json["new_title"]
    queires.modify_board_title(board_id, modified_name)
    return redirect("/")


@app.route('/api/<board_id>/create-card', methods=['POST'])
def create_new_card(board_id):
    new_card_name = request.json["new_card_name"]
    status_id = queires.get_first_status_by_board_id(board_id)["id"]
    card_order = queires.get_card_order_by_status_id(status_id)
    if card_order["card_order"] is None:
        card_order = 0
    else:
        card_order = card_order["card_order"] + 1
    if queires.create_card(new_card_name, board_id, status_id, card_order):
        return jsonify_dict({'message': f" Successfully added new card: {new_card_name}."})
    return jsonify_dict({'message': f" Failed to add new card: {new_card_name}."})


@app.route('/registration', methods=['GET', 'POST'])
def registration():
    error_message = ''
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if queires.get_user(username):
            error_message = "Username already in use."
            return render_template('registration.html', message=error_message)
        else:
            queires.create_user(username, hash_password(password))
            return redirect(url_for('index'))
    return render_template('registration.html', message=error_message)


@app.route('/login', methods=['GET', 'POST'])
def login():
    error_message = ''
    if request.method == 'POST':
        username = dict(request.form)['username']
        password = dict(request.form)['password']
        user = queires.get_user(username)
        if user:
            if check_password(password, user['password']):
                session['username'] = username
                session['id'] = user['id']
                return redirect(url_for('index'))
        error_message = 'Invalid credentials.'
    return render_template('login.html', message=error_message)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route('/api/update/card', methods=["POST"])
def update_cards_by_card_id():
    card_id = request.json['card_id']
    card_order = request.json['card_order']
    status_id = request.json['status_id']
    if queires.update_card_by_card_id(card_id, card_order, status_id):
        return jsonify_dict({'message': f" Successfully updated card with id:{card_id}."})
    return jsonify_dict({'message': f" Failed to update card with id:{card_id}."})


@app.route('/api/cards/<card_id>', methods=['PUT'])
def rename_card(card_id):
    data = request.get_json()
    modified_title = data['modified_title']
    queires.rename_card(card_id, modified_title)
    return "", 204


@app.route('/api/columns/<status_id>', methods=['PUT'])
def rename_column(status_id):
    data = request.get_json()
    modified_title = data['modified_title']
    queires.rename_column(status_id, modified_title)
    return "", 204


@app.route('/api/cards/<card_id>', methods=['DELETE'])
def delete_card(card_id):
    queires.delete_card(card_id)
    return "", 204


@app.route('/api/boards/<board_id>', methods=['DELETE'])
def delete_board(board_id):
    queires.delete_board(board_id)
    return "", 204


@app.route('/api/columns/<board_id>/<status_id>', methods=['DELETE'])
def delete_column(board_id, status_id):
    queires.delete_columns(status_id)
    queires.delete_column_cards(board_id, status_id)
    return "", 204


@app.route('/api/add-new-column', methods=["POST"])
def add_new_column():
    board_id = request.json['board_id']
    new_column_title = request.json['new_column_title']
    if queires.create_status(new_column_title, board_id):
        return jsonify_dict({'message': f" Successfully added new column in board with id:{board_id}."})
    return jsonify_dict({'message': f" Failed to add new column in board with id:{board_id}."})


@socketio.on('create_card')
def handle_socketio_create_card(create_card_data):
    emit('something_happened', {'boardId': create_card_data['boardId']}, broadcast=True, include_self=False)


@socketio.on('move_card')
def handle_socketio_move_card(move_card_data):
    emit('move_card', {'cardId': move_card_data['cardId'], 'position': move_card_data['position']}, broadcast=True, include_self=False)


def main():
    socketio.run(app, debug=True, port=5001)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
