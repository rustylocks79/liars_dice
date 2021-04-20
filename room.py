class RoomUser:
    def __init__(self, username, sid, ghost):
        self.username = username
        self.sid = sid
        self.ghost = ghost

    def __str__(self) -> str:
        return '[' + self.username + ', ' + self.sid + ', ' + self.ghost + ']'


class Room:
    def __init__(self, room_id, host: RoomUser):
        self.room_id = room_id
        self.players = [host]
        self.bots = []
        self.game = None
        self.num_dice = 5
        self.host = host
