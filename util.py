from functools import wraps

import bcrypt
from flask import jsonify


def jsonify_dict(var):
    return jsonify(var)


def json_response(func):
    """
    Converts the returned dictionary into a JSON response
    :param func:
    :return:
    """
    @wraps(func)
    def decorated_function(*args, **kwargs):
        return jsonify(func(*args, **kwargs))

    return decorated_function


def hash_password(pw):
    hashed_bytes = bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def check_password(password, user_password):
    return bcrypt.checkpw(password.encode('utf-8'), user_password.encode('utf-8'))