import flask
import flask_sqlalchemy
import flask_praetorian
import flask_cors
import flask_socketio

db = flask_sqlalchemy.SQLAlchemy()
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()
socketio = flask_socketio.SocketIO(logger=True, engineio_logger=True)


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


@app.route("/login", methods=["POST"])
def login():
    request = flask.request.get_json(force=True)
    username = request.get("username", None)
    password = request.get("password", None)
    authenticated_user = guard.authenticate(username, password)
    response = {"access_token": guard.encode_jwt_token(authenticated_user)}
    return flask.jsonify(response), 200


@app.route("/signup", methods=["POST"])
def signup():
    request = flask.request.get_json(force=True)
    username = request.get("username", None)
    password = request.get("password", None)
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
        "username: ": current_user.username,
        "correct_doubts": current_user.correct_doubts,
        "incorrect_doubts": current_user.incorrect_doubts,
        "successful_raises": current_user.successful_raises,
        "caught_raises": current_user.caught_raises,
        "games_played": current_user.games_played,
        "games_won": current_user.games_won
    }
    return flask.jsonify(response), 200


@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)


if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=8080)
    socketio.run(app)
