import random

MAX_PLAYERS = 12


class RoomUser:
    def __init__(self, username: str, color: str, sid=None, bot=True, level='medium'):
        self.username = username
        self.sid = sid
        self.bot = bot
        self.color = color
        self.level = level
        self.instance = None

    def to_dict(self) -> dict:
        if self.bot:
            return {
                'username': self.username,
                'color': self.color,
                'bot': self.bot,
                'level': self.level
            }
        else:
            return {
                'username': self.username,
                'color': self.color,
                'bot': self.bot,
            }

    def __str__(self) -> str:
        return '[username={}, color={}, bot={}]'.format(self.username, self.color, self.bot)


class Room:
    def __init__(self, room_id, host: RoomUser):
        self.room_id = room_id
        self.players = [host]
        self.game = None
        self.num_dice = 5
        self.host = host
        self.bot_names = ["Aaron",
                          "Ace",
                          "Bailee",
                          "Buddy",
                          "Chad",
                          "Charles",
                          "James",
                          "Robert",
                          "Patricia",
                          "Barbara",
                          "Jimmy"]
        random.shuffle(self.bot_names)
        self.colors = [
            'Red',
            'RebeccaPurple',
            'Blue',
            'DarkRed',
            'DarkSeaGreen',
            'DarkGoldenRod',
            'DarkSlateGray',
            'Tomato',
            'SaddleBrown',
            'Turquoise',
            'Green',
            'DimGray'
        ]
        random.shuffle(self.colors)

    def try_add_bot(self) -> bool:
        if len(self.players) < MAX_PLAYERS:
            name = self.bot_names.pop()
            color = self.colors.pop()
            self.players.append(RoomUser(name, color))
            return True
        else:
            return False

    def remove_bot(self, username):
        delete_idx = 0
        for idx, player in enumerate(self.players):
            if player.username == username:
                self.bot_names.append(player.username)
                self.colors.append(player.color)
                delete_idx = idx
        del self.players[delete_idx]

    def clear_bots(self):
        for idx, player in enumerate(self.players):
            if player.bot:
                self.bot_names.append(player.username)
                self.colors.append(player.color)
        self.players = [player for player in self.players if not player.bot]

    def try_add_human(self, username, sid) -> bool:
        if len(self.players) != MAX_PLAYERS:
            color = self.colors.pop()
            self.players.append(RoomUser(username, color, sid=sid, bot=False))
            return True
        for idx in range(len(self.players)):
            if self.players[idx].bot:
                color = self.colors.pop()
                self.players[idx] = RoomUser(username, color, sid=sid, bot=False)
                return True
        return False
