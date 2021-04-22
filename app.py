import argparse
import pickle
import time
import uuid

import eventlet
import flask
import flask_cors
import flask_praetorian
import flask_praetorian.base
import flask_socketio
import flask_sqlalchemy
import numpy as np
from eventlet import wsgi
from flask_praetorian import PraetorianError
from flask_praetorian.constants import AccessType

from liars_dice import LiarsDice, MediumAgent, EasyAgent, HardAgent
from room import RoomUser, Room

eventlet.monkey_patch()

MAX_PLAYERS = 12
TIME_DELAY = 2

parser = argparse.ArgumentParser(description='Run the liars dice web app')
parser.add_argument('-p', '--production', help='production mode')
args = parser.parse_args()

db = flask_sqlalchemy.SQLAlchemy()
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()
socketio = flask_socketio.SocketIO(cors_allowed_origins='*')
rooms = {}
strategy = pickle.load(open('strategies/liars_dice.pickle', 'rb'))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), unique=True)
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
if args.production:
    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root@localhost/liarsdice"
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite://"

guard.init_app(app, User)
db.init_app(app)
cors.init_app(app)
socketio.init_app(app)

with app.app_context():
    db.create_all()

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
    bot_names = ["Aaron", "Ace", "Bailee", "Buddy", "Chad", "Charles", "James", "Robert", "Patricia", "Barbara", "Jimmy"]
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
    elif username in bot_names:
        return flask.jsonify({'error': 'User already exists with username: {}. '.format(username)}), 400
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
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    if current_user is None:
        flask_socketio.emit('error', {'reason': 'invalid user. '})
    print('Received create_game from {}: {}'.format(current_user.username, json))
    room_id = str(uuid.uuid1().hex)[:8]
    flask_socketio.join_room(room_id)
    host = RoomUser(current_user.username, 'red', sid=flask.request.sid, bot=False)
    room = Room(room_id, host)
    host.color = room.colors.pop()
    flask_socketio.emit('created_game', {'lobbyId': room_id, 'players': [host.to_dict()], 'host': host.username})
    rooms[room_id] = room


def validate_request(json, msg, host=False):
    room_id = json['lobbyId']
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    if current_user is None:
        flask_socketio.emit('error', {'reason': 'invalid user. '})
        return None, None, None
    print('received {} from {}: {}'.format(msg, current_user.username, json))
    if room_id not in rooms:
        flask_socketio.emit('error', {'reason': room_id + ' is not a valid lobby id. '})
        return None, None, None
    room = rooms[room_id]
    if host and current_user.username != room.host.username:
        flask_socketio.emit('error', {'reason': 'invalid permissions. '})
        return None, None, None
    return room_id, room, current_user


@socketio.on('join_game')
def join_game(json):
    room_id, room, current_user = validate_request(json, 'join_game')
    if room_id is None:
        return
    if room.game is not None:
        flask_socketio.emit('error', {'reason': 'Game has already begun. '})
        return
    was_added = room.try_add_human(current_user.username, flask.request.sid)
    if was_added:
        flask_socketio.join_room(room_id)
        flask_socketio.emit('joined_game', {
            'lobbyId': room_id,
            'host': room.host.username,
            'players': [player.to_dict() for player in room.players],
            'numDice': room.num_dice}, room=room_id)
    else:
        flask_socketio.emit('error', {'reason': 'The lobby is full. '})


@socketio.on('add_bot')
def add_bot(json):
    room_id, room, current_user = validate_request(json, 'add_bot', host=True)
    if room_id is None:
        return
    was_added = room.try_add_bot()
    if was_added:
        flask_socketio.emit('updated_bots', {
            'players': [player.to_dict() for player in room.players]
        }, room=room_id)
    else:
        flask_socketio.emit('error', {
            'reason': 'room is full'
        }, room=room_id)


@socketio.on('update_level')
def update_level(json):
    room_id, room, current_user = validate_request(json, 'update_level', host=True)
    if room_id is None:
        return
    username = json['username']
    level = json['level']
    if level != 'Easy' and level != 'Medium' and level != 'Hard':
        flask_socketio.emit('error', {
            'reason': 'Invalid level: ' + str(level)
        })
        return
    for player in room.players:
        if player.username == username:
            player.level = level
            break
    flask_socketio.emit('updated_bots', {
        'players': [player.to_dict() for player in room.players]
    }, room=room_id)


@socketio.on('delete_bot')
def delete_bot(json):
    room_id, room, current_user = validate_request(json, 'delete_bot', host=True)
    if room_id is None:
        return
    username = json['username']
    room.remove_bot(username)
    flask_socketio.emit('updated_bots', {
        'players': [player.to_dict() for player in room.players]
    }, room=room_id)


@socketio.on('clear_bots')
def clear_bots(json):
    room_id, room, current_user = validate_request(json, 'clear_bots', host=True)
    if room_id is None:
        return
    room.clear_bots()
    flask_socketio.emit('updated_bots', {
        'players': [player.to_dict() for player in room.players]
    }, room=room_id)


@socketio.on('update_game')
def update_game(json):
    room_id, room, current_user = validate_request(json, 'update_game', host=True)
    if room_id is None:
        return
    room.num_dice = json['numDice']
    flask_socketio.emit('updated_game', {
        'lobbyId': room_id,
        'numDice': room.num_dice
    }, room=room_id)


@socketio.on('leave_game')
def leave_game(json):
    room_id, room, current_user = validate_request(json, 'leave_game')
    if room_id is None:
        return
    room.players = [x for x in room.players if x.username != current_user.username]
    if len(room.players) == 0:
        del rooms[room_id]
    elif room.host.username == current_user.username:
        all_bots = True
        host_name = ''
        for idx, player in enumerate(room.players):
            if not player.bot:
                host_name = player.username
                all_bots = False
                room.host.username = host_name
                room.players.insert(0, room.players.pop(idx))
                break
        if all_bots:
            del rooms[room_id]
    flask_socketio.emit('left_game', {
        'lobbyId': room_id,
        'players': [game_user.to_dict() for game_user in room.players],
        'host': room.host.username,
        'lostPlayer': current_user.username
    }, room=room_id)


@socketio.on('start_game')
def start_game(json):
    room_id, room, current_user = validate_request(json, 'update_game', host=True)
    if room_id is None:
        return
    num_dice = room.num_dice
    num_players = len(room.players)
    if num_players < 2:
        flask_socketio.emit('error', {
            'reason': 'Can not start a game with just yourself'
        })
        return
    room.game = LiarsDice(num_players, num_dice)
    for player in room.players:
        if player.bot:
            if player.level == 'Easy':
                player.instance = EasyAgent(strategy)
            elif player.level == 'Medium':
                player.instance = MediumAgent(strategy)
            elif player.level == 'Hard':
                player.instance = HardAgent(strategy)
    for idx, player in enumerate(room.players):
        if not player.bot:
            flask_socketio.emit('started_game', {
                'index': idx,
                'hand': room.game.hands[idx],
                'players': [player.to_dict() for player in room.players],
                'currentPlayer': room.game.active_player(),
                'activeDice': room.game.active_dice
            }, to=player.sid)


def test_terminal(room, lobby_id) -> bool:
    game = room.game
    if game.is_terminal():
        winner = int(np.argmax([game.utility(p) for p in range(game.num_players())]))
        for idx, player in enumerate(room.players):
            if not player.bot:
                user_account = db.session.query(User).filter(User.username == player.username).first()
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


def update_after_doubt(room, response) -> None:
    for idx, player in enumerate(room.players):
        if not player.bot:
            response['hand'] = room.game.hands[idx]
            flask_socketio.emit('doubted', response, to=player.sid)


@socketio.on('doubt')
def action_doubt(json):
    room_id, room, current_user = validate_request(json, 'doubt')
    if room_id is None:
        return
    game = room.game
    # TODO: check active player
    try:
        response = game.perform(('doubt',))
        if response['doubter'] == response['loser']:
            current_user.incorrect_doubts += 1
            if not room.players[response['doubted']].bot:
                user_account = db.session.query(User).filter(
                    User.username == room.players[response['doubted']].username).first()
                user_account.successful_raises += 1
        else:
            current_user.correct_doubts += 1
            if not room.players[response['doubted']].bot:
                user_account = db.session.query(User).filter(
                    User.username == room.players[response['doubted']].username).first()
                user_account.caught_raises += 1
        db.session.commit()
        update_after_doubt(room, response)
        terminal = test_terminal(room, room_id)
        if not terminal:
            time.sleep(5)
            poll_bots(room_id)
    except RuntimeError as err:
        flask_socketio.emit('error', {'reason': str(err)})


@socketio.on('raise')
def action_raise(json):
    room_id, room, current_user = validate_request(json, 'raise')
    if room_id is None:
        return
    game = room.game
    # TODO: check active player
    quantity = int(json['quantity'])
    face = int(json['face'])
    try:
        game.perform(('raise', quantity, face))
        flask_socketio.emit('raised', {
            'currentPlayer': game.active_player(),
            'bidHistory': game.bid_history
        }, to=room_id)
        poll_bots(room_id)
    except RuntimeError as err:
        print('error')
        flask_socketio.emit('error', {'reason': str(err)})


def poll_bots(room_id: str):
    room = rooms[room_id]
    game = room.game
    active_player = game.active_player()
    while room.players[active_player].bot:
        time.sleep(TIME_DELAY)
        bot = room.players[active_player]
        action = bot.instance.get_action(room.game)
        if action[0] == 'raise':
            response = game.perform(action)
            flask_socketio.emit('raised', response, to=room_id)
        elif action[0] == 'doubt':
            response = game.perform(action)
            if response['doubter'] == response['loser']:
                if not room.players[response['doubted']].bot:
                    user_account = db.session.query(User).filter(
                        User.username == room.players[response['doubted']].username).first()
                    user_account.successful_raises += 1
            else:
                if not room.players[response['doubted']].bot:
                    user_account = db.session.query(User).filter(
                        User.username == room.players[response['doubted']].username).first()
                    user_account.caught_raises += 1
            db.session.commit()
            update_after_doubt(room, response)
            terminal = test_terminal(room, room_id)
            if terminal:
                break
            else:
                time.sleep(5)
        else:
            raise RuntimeError('Invalid Action: ' + action[0])
        active_player = game.active_player()


@socketio.on('exit')
def exit_game(json):
    room_id, room, current_user = validate_request(json, 'exit')
    if room_id is None:
        return
    all_bots = True
    for idx, player in enumerate(room.players):
        if player.username == current_user.username:
            player.bot = True
            player.sid = None
            player.instance = MediumAgent(strategy)
        elif not player.bot:
            all_bots = False
    if all_bots:
        del rooms[room_id]
    else:
        print(str(room.players[1]))
        poll_bots(room_id)


if __name__ == "__main__":
    if args.production is not None:
        wsgi.server(eventlet.listen(('', 8080)), app)
    else:
        socketio.run(app, port=8080)
