from flask import Flask, render_template, url_for, request, redirect, session
from dotenv import load_dotenv


from util import json_response, hash_password, check_password
import mimetypes
import queires

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


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
    return queires.get_boards()


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


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
