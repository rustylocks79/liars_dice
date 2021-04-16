import eventlet
from eventlet import wsgi

eventlet.monkey_patch()

import argparse
import copy
import pickle
import time
import uuid

import flask
import flask_cors
import flask_praetorian
import flask_praetorian.base
import flask_socketio
import flask_sqlalchemy
import numpy as np
from flask_praetorian import PraetorianError
from flask_praetorian.constants import AccessType

from liars_dice import LiarsDice, MediumAgent, EasyAgent, HardAgent

MAX_PLAYERS = 12
TIME_DELAY = 2

db = flask_sqlalchemy.SQLAlchemy()
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()
socketio = flask_socketio.SocketIO(cors_allowed_origins='*')
rooms = {}
strategy = pickle.load(open('strategies/liars_dice.pickle', 'rb'))
ghost_agent = MediumAgent(strategy)


class GameUser:
    def __init__(self, username, sid, ghost):
        self.username = username
        self.sid = sid
        self.ghost = ghost

    def __str__(self) -> str:
        return '[' + self.username + ', ' + self.sid + ', ' + self.ghost + ']'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    hashed_password = db.Column(db.Text)
    roles = db.Column(db.Text)
    games_played = db.Column(db.Integer, default=0)
    games_won = db.Column(db.Integer, default=0)
    correct_doubts = db.Column(db.Integer, default=0)
    incorrect_doubts = db.Column(db.Integer, default=0)
    successful_raises = db.Column(db.Integer, default=0)
    caught_raises = db.Column(db.Integer, default=0)

    @property
    def identity(self):
        return self.id

    @property
    def rolenames(self):
        try:
            return self.roles.split(",")
        except Exception:
            return []

    @property
    def password(self):
        return self.hashed_password

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)


app = flask.Flask(__name__)
app.debug = True
app.config["SECRET_KEY"] = "top secret"
app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite://"

guard.init_app(app, User)
db.init_app(app)
cors.init_app(app)
socketio.init_app(app)

with app.app_context():
    db.create_all()
    db.session.add(
        User(
            username="jeremy",
            hashed_password=guard.hash_password("password"),
        )
    )
    db.session.add(
        User(
            username="long",
            hashed_password=guard.hash_password("password"),
        )
    )
    db.session.add(
        User(
            username="ben",
            hashed_password=guard.hash_password("password"),
        )
    )
    db.session.add(
        User(
            username="nate",
            hashed_password=guard.hash_password("password"),
        )
    )
    db.session.commit()


def get_current_user_from_token(jwt_token: str):
    data = guard.extract_jwt_token(jwt_token, access_type=AccessType.access)
    user_id = data.get('id')
    PraetorianError.require_condition(
        user_id is not None,
        "Could not fetch an id from the registration token",
    )
    user = guard.user_class.identify(user_id)
    PraetorianError.require_condition(
        user is not None,
        "Could not identify the user from the registration token",
    )
    return user


@app.route("/login", methods=["POST"])
def login():
    request = flask.request.get_json(force=True)
    username = request.get("username", None)
    password = request.get("password", None)
    authenticated_user = guard.authenticate(username, password)
    response = {"accessToken": guard.encode_jwt_token(authenticated_user)}
    return flask.jsonify(response), 200


@app.route("/signup", methods=["POST"])
def signup():
    request = flask.request.get_json(force=True)
    username = request.get("username", None)
    if username is None:
        return flask.jsonify({'error': 'invalid username. '}), 400
    elif len(username) < 4:
        return flask.jsonify({'error': 'Username must be more than 4 characters. '}), 400
    elif len(username) > 32:
        return flask.jsonify({'error': 'Username cannot contain more than 32 characters. '}), 400
    elif ' ' in username:
        return flask.jsonify({'error': 'Username cannot contain spaces. '}), 400
    if db.session.query(User).filter(User.username == username).first() is not None:
        return flask.jsonify({'error': 'User already exists with username: {}. '.format(username)}), 400
    password = request.get("password", None)
    if password is None:
        return flask.jsonify({'error': 'invalid password. '}), 400
    elif len(password) < 4:
        return flask.jsonify({'error': 'Password must be more than 4 characters. '}), 400
    elif len(password) > 32:
        return flask.jsonify({'error': 'Password cannot contain more than 32 characters. '}), 400
    elif ' ' in password:
        return flask.jsonify({'error': 'Password cannot contain spaces. '}), 400
    db.session.add(
        User(
            username=username,
            hashed_password=guard.hash_password(password)
        )
    )
    db.session.commit()
    response = {"username": username}
    return flask.jsonify(response), 200


@app.route("/user", methods=["GET"])
@flask_praetorian.auth_required
def user():
    current_user = flask_praetorian.current_user()
    response = {
        "username": current_user.username,
        "correctDoubts": current_user.correct_doubts,
        "incorrectDoubts": current_user.incorrect_doubts,
        "successfulRaises": current_user.successful_raises,
        "caughtRaises": current_user.caught_raises,
        "gamesPlayed": current_user.games_played,
        "gamesWon": current_user.games_won
    }
    return flask.jsonify(response), 200


@socketio.on('connect')
def connect():
    print('A user connected')


@socketio.on('disconnect')
def disconnect():
    print('A user disconnected')


@socketio.on('create_game')
def create_game(json):
    print()
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    print('Received create_game from {}: {}'.format(current_user.username, json))
    lobby_id = str(uuid.uuid1().hex)[:8]
    flask_socketio.join_room(lobby_id)
    rooms[lobby_id] = {'players': [GameUser(current_user.username, flask.request.sid, False)], 'bots': [], 'num_dice': 5, 'host': current_user.username, 'game': None}
    flask_socketio.emit('created_game', {'lobbyId': lobby_id, 'players': [current_user.username], 'host': current_user.username})


@socketio.on('join_game')
def join_game(json):
    lobby_id = json['lobbyId']
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    print('received join_game from {}: {}'.format(current_user.username, json))
    if lobby_id in rooms:
        print(current_user)
        flask_socketio.join_room(lobby_id)
        room = rooms[lobby_id]
        if len(room['players']) >= MAX_PLAYERS:
            flask_socketio.emit('error', {'reason', 'The lobby is full. '})
        if len(room['players']) + len(room['bots']) >= MAX_PLAYERS:
            room['bots'].pop()
        room['players'].append(GameUser(current_user.username, flask.request.sid, False))
        flask_socketio.emit('joined_game', {
            'lobbyId': lobby_id,
            'host': room['host'],
            'players': [game_user.username for game_user in room['players']],
            'bots': room['bots'],
            'numDice': room['num_dice']}, room=lobby_id)
    else:
        flask_socketio.emit('error', {'reason': lobby_id + ' is not a valid lobby id. '})


@socketio.on('update_game')
def update_game(json):
    lobby_id = json['lobbyId']
    jwt_token = json['jwtToken']
    bots = json['bots']
    num_dice = json['numDice']
    current_user = get_current_user_from_token(jwt_token)
    print('received update_game from {}: {}'.format(current_user.username, json))
    room = rooms[lobby_id]
    if current_user.username != room['host']:
        flask_socketio.emit('error', {'reason', 'invalid permissions. '})
    else:
        room['bots'] = bots
        room['num_dice'] = num_dice
        flask_socketio.emit('updated_game', {
            'lobbyId': lobby_id,
            'bots': room['bots'],
            'numDice': room['num_dice']
        }, room=lobby_id)


@socketio.on('leave_game')
def leave_game(json):
    lobby_id = json['lobbyId']
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    print('received leave_game from {}: {}'.format(current_user.username, json))
    room = rooms[lobby_id]
    room['players'].remove((current_user.username, flask.request.sid))
    if len(room['players']) == 0:
        del rooms[lobby_id]
    elif room['host'] == current_user.username:
        room['host'] = room['players'][0][0]
    flask_socketio.emit('left_game', {
        'lobbyId': lobby_id,
        'players': [game_user.username for game_user in room['players']],
        'host': room['host'],
        'lostPlayer': current_user.username
    }, room=lobby_id)


@socketio.on('start_game')
def start_game(json):
    lobby_id = json['lobbyId']
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    print('received start_game from {}: {}'.format(current_user.username, json))
    room = rooms[lobby_id]
    num_dice = room['num_dice']
    num_players = len(room['players']) + len(room['bots'])
    room['game'] = LiarsDice(num_players, num_dice)
    if len(room['players']) + len(room['bots']) < 2:
        flask_socketio.emit('error', {
            'reason': 'Can not start a game with just yourself'
        })
    else:
        for bot in room['bots']:
            if bot['level'] == 'easy':
                bot['instance'] = EasyAgent(strategy)
            elif bot['level'] == 'medium':
                bot['instance'] = MediumAgent(strategy)
            elif bot['level'] == 'hard':
                bot['instance'] = HardAgent(strategy)
        for idx, game_user in enumerate(room['players']):
            flask_socketio.emit('started_game', {
                'index': idx,
                'hand': room['game'].hands[idx],
                'currentPlayer': room['game'].active_player(),
                'activeDice': room['game'].active_dice
            }, to=game_user.sid)


def test_terminal(room, lobby_id) -> bool:
    game = room['game']
    if game.is_terminal():
        winner = int(np.argmax([game.utility(p) for p in range(game.num_players())]))
        for idx, game_user in enumerate(room['players']):
            user_account = db.session.query(User).filter(User.username == game_user.username).first()
            if idx == winner:
                user_account.games_won += 1
            user_account.games_played += 1
            db.session.commit()
        flask_socketio.emit('terminal', {
            'winner': int(np.argmax([game.utility(p) for p in range(game.num_players())]))
        }, to=lobby_id)
        return True
    else:
        return False


def update_after_doubt(room, hands, quantity_on_board, doubter, loser) -> None:
    game = room['game']
    for idx, game_user in enumerate(room['players']):
        flask_socketio.emit('doubted', {
            'oldHands': hands,
            'quantityOnBoard': quantity_on_board,
            'doubter': doubter,
            'loser': loser,
            'hand': game.hands[idx],
            'currentPlayer': game.active_player(),
            'activeDice': game.active_dice
        }, to=game_user.sid)


def is_human_player(idx, room):
    return idx < len(room['players'])


@socketio.on('doubt')
def action_doubt(json):
    lobby_id = json['lobbyId']
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    print('received doubt from {}: {}'.format(current_user.username, json))
    room = rooms[lobby_id]
    game = room['game']
    # TODO: check active player
    try:
        active_player = game.active_player()
        last_player = game.get_last_player()
        hands = copy.deepcopy(game.hands)
        quantity_on_board = game.perform(('doubt',))
        if active_player == game.last_loser:
            current_user.incorrect_doubts += 1
            if is_human_player(last_player, room):
                user_account = db.session.query(User).filter(User.username == room['players'][last_player].username).first()
                user_account.successful_raises += 1
        else:
            current_user.correct_doubts += 1
            if is_human_player(last_player, room):
                user_account = db.session.query(User).filter(User.username == room['players'][last_player].username).first()
                user_account.caught_raises += 1
        db.session.commit()
        update_after_doubt(room, hands, quantity_on_board, active_player, game.last_loser)
        terminal = test_terminal(room, lobby_id)
        if not terminal:
            poll_bots(lobby_id)
    except RuntimeError as err:
        flask_socketio.emit('error', {'reason': str(err)})


@socketio.on('raise')
def action_raise(json):
    lobby_id = json['lobbyId']
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    print('received raise from {}: {}'.format(current_user.username, json))
    room = rooms[lobby_id]
    game = room['game']
    # TODO: check active player
    quantity = int(json['quantity'])
    face = int(json['face'])
    try:
        game.perform(('raise', quantity, face))
        flask_socketio.emit('raised', {
            'currentPlayer': game.active_player(),
            'bidHistory': game.bid_history
        }, to=lobby_id)
        poll_bots(lobby_id)
    except RuntimeError as err:
        print('error')
        flask_socketio.emit('error', {'reason': str(err)})


def poll_bots(lobby_id: str):
    room = rooms[lobby_id]
    game = room['game']
    active_player = game.active_player()
    while active_player >= len(room['players']) or room['players'][active_player].ghost:
        time.sleep(TIME_DELAY)
        if active_player >= len(room['players']):
            bot = room['bots'][active_player - len(room['players'])]['instance']
        else:
            bot = ghost_agent
        action = bot.get_action(room['game'])
        if action[0] == 'raise':
            game.perform(action)
            flask_socketio.emit('raised', {
                'currentPlayer': game.active_player(),
                'bidHistory': game.bid_history
            }, to=lobby_id)
        elif action[0] == 'doubt':
            active_player = game.active_player()
            last_player = game.get_last_player()
            hands = copy.deepcopy(game.hands)
            quantity_on_board = game.perform(action)
            if active_player == game.last_loser:
                if is_human_player(last_player, room):
                    username = room['players'][last_player][0]
                    user_account = db.session.query(User).filter(User.username == username).first()
                    user_account.successful_raises += 1
            else:
                if is_human_player(last_player, room):
                    username = room['players'][last_player][0]
                    user_account = db.session.query(User).filter(User.username == username).first()
                    user_account.caught_raises += 1
            db.session.commit()
            update_after_doubt(room, hands, quantity_on_board, active_player, game.last_loser)
            terminal = test_terminal(room, lobby_id)
            if terminal:
                break
        else:
            raise RuntimeError('Invalid Action: ' + action[0])
        active_player = game.active_player()


@socketio.on('exit')
def exit_game(json):
    lobby_id = json['lobbyId']
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    print('received exit from {}: {}'.format(current_user.username, json))
    room = rooms[lobby_id]
    if len(room['players']) == 0:
        del rooms[lobby_id]
    else:
        all_ghosts = True
        for i in range(len(room['players'])):
            if room['players'][i].username == current_user.username:
                room['players'][i].ghost = True
            elif not room['players'][i].ghost:
                all_ghosts = False
        if all_ghosts:
            del rooms[lobby_id]
        else:
            poll_bots(lobby_id)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run the liars dice web app')
    parser.add_argument('-p', '--production', help='production mode')
    args = parser.parse_args()
    if args.production is not None:
        wsgi.server(eventlet.listen(('', 8080)), app)
    else:
        socketio.run(app, port=8080)
