import math
import random as rand

import numpy as np

from pycfr import Game, StrategyAgent, Agent


class LiarsDice(Game):
    def __init__(self, num_players, num_dice, sampling=False):
        self.hands = []
        self.bid_history = []
        self.current_player = 0
        self.total_players = num_players
        self.active_dice = [num_dice for _ in range(num_players)]
        self.num_dice = num_dice
        self.create_hands()

        self.sampling = sampling
        self.last_loser = -1

    def create_hands(self):
        self.hands = [[0 for _ in range(6)] for _ in range(self.total_players)]
        for i in range(self.total_players):
            for _ in range(self.active_dice[i]):
                self.hands[i][rand.randint(0, 5)] += 1

    def is_terminal(self) -> bool:
        if self.sampling:
            return self.last_loser != -1
        else:
            value = len([dice for dice in self.active_dice if dice != 0]) == 1
            return len([dice for dice in self.active_dice if dice != 0]) == 1

    def utility(self, player: int) -> float:
        if self.sampling:
            return 1 if player != self.last_loser else -1
        else:
            return self.active_dice[player]

    def info_set(self) -> str:
        """
        Format: {d}x{f} such that d is the number of dice in other players hands that would need to be something
                other than 1 or the target face.
            d = other_players_dice - (claim - known_target_dice)
            f = target_face_value
        :return: an information set.
        """
        # hand = self.hands[self.active_player()]
        # other_players_dice = sum([self.active_dice[p] for p in range(len(self.active_dice)) if p != self.active_player()])
        # if not self.bid_history:
        #     return 'start'
        # else:
        #     return ','.join(['{}x{}'.format(other_players_dice - (bid[1] - (hand[bid[2] - 1] + hand[0])), bid[2]) for bid in self.bid_history[-min(3, len(self.bid_history)):]])
        return str(self.hands[self.active_player()]) + ', ' + ','.join(
            ['{}x{}'.format(bid[1], bid[2]) for bid in self.bid_history[-min(3, len(self.bid_history)):]])

    def actions(self) -> list:
        if len(self.bid_history) == 0:
            return [("raise", q, f) for q in range(1, 3) for f in range(2, 7)]
        bid = self.bid_history[-1]
        last_quantity = bid[1]
        last_face = bid[2]
        actions = []
        actions.append(('doubt',))
        for face in range(last_face + 1, 7):
            actions.append(("raise", last_quantity, face))
        for face in range(2, 7):
            actions.append(("raise", last_quantity + 1, face))
        for face in range(2, 7):
            actions.append(("raise", last_quantity + 2, face))
        return actions

    def perform(self, action, verbose: bool = False) -> None:
        if verbose:
            print("Player {}: {}".format(self.current_player, action))
        if not self.bid_history:
            if action[0] == "doubt":
                raise RuntimeError("Invalid action: cannot doubt on first bid")
            elif action[1] < 1:
                raise RuntimeError("Invalid action: quantity must be positive")
            elif not 2 <= action[2] <= 6:
                raise RuntimeError("Invalid action: face value must be between 2 and 6")
            self.bid_history.append(action)
            self.current_player = self.get_next_active_player(self.current_player)
        else:
            bid = self.bid_history[-1]
            last_quantity = bid[1]
            last_face = bid[2]
            if action[0] == "doubt":
                quantity_on_board = sum(hand[0] + hand[last_face - 1] for hand in self.hands)
                if last_quantity > quantity_on_board:
                    last_player = self.get_last_player()
                    self.last_loser = last_player
                    self.active_dice[last_player] -= 1
                    if self.active_dice[last_player] != 0:
                        self.current_player = last_player
                    else:
                        self.current_player = self.get_next_active_player(last_player)
                else:
                    self.last_loser = self.current_player
                    self.active_dice[self.current_player] -= 1
                    if self.active_dice[self.current_player] == 0:
                        self.current_player = self.get_next_active_player(self.current_player)
                self.create_hands()
                self.bid_history = []
                if verbose:
                    print('Player {} lost a die'.format(self.last_loser))
            elif action[0] == "raise":
                new_quantity = action[1]
                new_face = action[2]
                if not (new_quantity > last_quantity or (new_quantity == last_quantity and new_face > last_face)):
                    raise RuntimeError(
                        "Invalid bid: last bid was {} {}, new bid was {} {}".format(last_quantity, last_face,
                                                                                    new_quantity, new_face))
                elif not 2 <= new_face <= 6:
                    raise RuntimeError("Invalid bid: face value must be between 2 and 6")
                self.bid_history.append(action)
                self.current_player = self.get_next_active_player(self.current_player)
            else:
                raise RuntimeError("Invalid bid: must either raise or doubt")

    def get_last_player(self):
        result = self.current_player - 1
        if result < 0:
            result = self.total_players - 1
        while self.active_dice[result] == 0:
            result -= 1
            if result < 0:
                result = self.total_players - 1
        return result

    def get_next_active_player(self, player):
        result = player + 1
        if result >= self.total_players:
            result = 0
        while self.active_dice[result] == 0:
            result += 1
            if result >= self.total_players:
                result = 0
        return result

    def sampling_reset(self, num_dice, num_players):
        if not self.sampling:
            raise RuntimeError('not in sampling mode. ')
        self.num_dice = num_dice
        self.total_players = num_players
        self.active_dice = [rand.randint(1, num_dice) for _ in range(self.total_players)]
        self.create_hands()
        self.bid_history = []
        self.current_player = rand.randint(0, num_players - 1)
        self.last_loser = -1

    def reset(self) -> None:
        self.active_dice = [self.num_dice for _ in range(self.total_players)]
        self.create_hands()
        self.bid_history = []
        self.current_player = 0
        self.last_loser = -1

    def active_player(self) -> int:
        return self.current_player

    def num_players(self) -> int:
        return self.total_players


class EasyAgent(StrategyAgent):
    def pretest(self, game: LiarsDice):
        player = game.active_player()
        hand = game.hands[player]
        num_unknown = sum([game.active_dice[p] for p in range(len(game.active_dice)) if p != player])
        if not game.bid_history:
            face = rand.randint(2, 6)
            num_face_in_hand = hand[face - 1] + hand[0]
            quantity = math.floor(num_face_in_hand + 1.0 / 3 * num_unknown)
            if quantity == 0:
                quantity += 1
            return "raise", int(quantity), int(face)
        else:
            last_quantity = game.bid_history[-1][1]
            last_face = game.bid_history[-1][2]
            num_face_in_hand = hand[last_face - 1] + hand[0]
            expected_value = math.floor(num_face_in_hand + 1.0 / 3 * num_unknown)
            if last_quantity > expected_value:
                return "doubt",
            else:
                quantity = last_quantity + 1
                return "raise", int(quantity), int(last_face)


class MediumAgent(StrategyAgent):
    def pretest(self, game: LiarsDice):
        player = game.active_player()
        hand = game.hands[player]
        num_unknown = sum([game.active_dice[p] for p in range(len(game.active_dice)) if p != player])
        if not game.bid_history:
            face = rand.randint(2, 6)
            num_face_in_hand = hand[face - 1] + hand[0]
            quantity = math.floor(num_face_in_hand + 1.0 / 3 * num_unknown)
            if quantity == 0:
                quantity += 1
            return "raise", int(quantity), int(face)
        else:
            last_quantity = game.bid_history[-1][1]
            last_face = game.bid_history[-1][2]
            num_face_in_hand = hand[last_face - 1] + hand[0]
            expected_value = math.floor(num_face_in_hand + 1.0 / 3 * num_unknown)
            if last_quantity > expected_value:
                return "doubt",
            else:
                most_face = np.argmax(hand) + 1
                if most_face == 1:
                    return 'raise', int(last_quantity + 1), int(last_face)
                elif most_face > last_face:
                    return 'raise', int(last_quantity), int(most_face)
                else:
                    return "raise", int(last_quantity + 1), int(most_face)


class HardAgent(StrategyAgent):
    def pretest(self, game: LiarsDice):
        player = game.active_player()
        hand = game.hands[player]
        num_unknown = sum([game.active_dice[p] for p in range(len(game.active_dice)) if p != player])
        if not game.bid_history:
            face = np.argmax(hand[1:]) + 2
            num_face_in_hand = hand[face - 1] + hand[0]
            quantity = math.floor(num_face_in_hand + 1.0 / 3 * num_unknown)
            if quantity == 0:
                quantity += 1
            return "raise", int(quantity), int(face)
        else:
            last_quantity = game.bid_history[-1][1]
            last_face = game.bid_history[-1][2]
            num_face_in_hand = hand[last_face - 1] + hand[0]
            expected_value = math.floor(num_face_in_hand + 1.0 / 3 * num_unknown)
            if last_quantity > expected_value:
                return "doubt",
            else:
                most_face = np.argmax(hand) + 1
                if most_face == 1:
                    return 'raise', last_quantity + 1, last_face
                elif most_face > last_face:
                    return 'raise', int(last_quantity), int(most_face)
                else:
                    return "raise", int(last_quantity + 1), int(most_face)


class HeuristicAgent(Agent):
    def get_action(self, game):
        player = game.active_player()
        hand = game.hands[player]
        num_unknown = sum([game.active_dice[p] for p in range(len(game.active_dice)) if p != player])
        if not game.bid_history:
            face = rand.randint(2, 6)
            num_face_in_hand = hand[face - 1] + hand[0]
            quantity = math.floor(num_face_in_hand + 1.0 / 3 * num_unknown)
            if quantity == 0:
                quantity += 1
            return "raise", int(quantity), int(face)
        else:
            last_quantity = game.bid_history[-1][1]
            last_face = game.bid_history[-1][2]
            num_face_in_hand = hand[last_face - 1] + hand[0]
            expected_value = math.floor(num_face_in_hand + 1.0 / 3 * num_unknown)
            if last_quantity > expected_value:
                return "doubt",
            else:
                quantity = last_quantity + 1
                return "raise", int(quantity), int(last_face)
