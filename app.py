import uuid

import flask
import flask_cors
import flask_praetorian
import flask_praetorian.base
import flask_socketio
import flask_sqlalchemy
from flask_praetorian import PraetorianError
from flask_praetorian.constants import AccessType

db = flask_sqlalchemy.SQLAlchemy()
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()
socketio = flask_socketio.SocketIO(cors_allowed_origins='*')
rooms = {}


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
    if username is None or len(username) < 4:
        return flask.jsonify({'error': 'invalid username. '}), 400
    if db.session.query(User).filter(User.username == username).first() is not None:
        return flask.jsonify({'error': 'user already exists with username: {}. '.format(username)}), 400
    password = request.get("password", None)
    if password is None or len(password) < 4:
        return flask.jsonify({'error': 'invalid password. '}), 400
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
def test_connect():
    print('A user connected')


@socketio.on('create_game')
def create_game(json):
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    print('Received create_game from {}: {}'.format(current_user.username, json))
    lobby_id = str(uuid.uuid1().hex)[:8]
    flask_socketio.join_room(lobby_id)
    rooms[lobby_id] = {'players': [current_user.username], 'bots': [], 'num_dice': 5}
    flask_socketio.emit('created_game', {'lobbyId': lobby_id, 'players': [current_user.username]})


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
        room['players'].append(current_user.username)
        flask_socketio.emit('joined_game', {
            'lobbyId': lobby_id,
            'players': room['players'],
            'bots': room['bots'],
            'numDice': room['num_dice']}, to=lobby_id)
    else:
        flask_socketio.emit('invalid_id')


@socketio.on('update_game')
def update_game(json):
    lobby_id = json['lobbyId']
    jwt_token = json['jwtToken']
    num_dice = json['num_dice']
    bots = json['bots']
    current_user = get_current_user_from_token(jwt_token)
    print('received update_game from {}: {}'.format(current_user.username, json))
    room = rooms[lobby_id]
    room['bots'] = bots
    room['num_dice'] = num_dice
    flask_socketio.emit('updated_game', {
        'lobbyId': lobby_id,
        'bots': room['bots'],
        'num_dice': room['num_dice']
    }, to=lobby_id)


@socketio.on('start_game')
def start_game(json):
    print('received start_game: ' + str(json))
    lobby_id = json['lobbyId']
    jwt_token = json['jwtToken']
    current_user = get_current_user_from_token(jwt_token)
    print('received start_game from {}: {}'.format(current_user.username, json))
    num_players = rooms[lobby_id]['players']
    print(num_players)


if __name__ == "__main__":
    socketio.run(app)
