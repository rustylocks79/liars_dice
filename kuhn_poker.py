import pickle
from random import randint

from pycfr import *


class KuhnPoker(Game):
    def __init__(self) -> None:
        """
        Initializes the game to the start state.
        """
        self.plays = 0
        self.history = ''
        self.ACTIONS = ['p', 'b']
        self.cards = []
        self.cards.append(randint(0, 2))
        self.cards.append(randint(0, 2))
        while self.cards[0] == self.cards[1]:
            self.cards[1] = randint(0, 2)

    def is_terminal(self) -> bool:
        """
        :return: weather the game is in a terminal state.
        """
        if self.plays <= 1:
            return False
        terminal_pass = self.history[self.plays - 1] == 'p'
        double_bet = self.history[self.plays - 2: self.plays] == 'bb'
        return terminal_pass or double_bet

    def utility(self, player: int) -> float:
        """
        precondition: is_terminal() must be true for this method to be called.
        :param player: an int index of a player
        :return: the utility achieved by player
        """
        assert self.is_terminal()
        assert 0 <= player <= 1
        terminal_pass = self.history[self.plays - 1] == 'p'
        double_bet = self.history[self.plays - 2: self.plays] == 'bb'
        is_player_card_higher = self.cards[player] > self.cards[1 - player]
        if terminal_pass:
            if self.history == 'pp':
                return 1 if is_player_card_higher else -1
            else:
                return 1
        elif double_bet:
            return 2 if is_player_card_higher else -2

    def info_set(self) -> str:
        """
        :return: the information set for the current state of the game.
        """
        return str(self.cards[self.active_player()]) + self.history

    def actions(self) -> list:
        """
        :return: a list of all possible actions at the current state of the game.
        """
        return self.ACTIONS

    def preform(self, action) -> None:
        """
        :param action: usually a string or tuple, one of the actions returned by actions() for the active
            player to preform.
        :return: None
        """
        self.history += action
        self.plays += 1

    def reset(self) -> None:
        """
        Resets the game to the start state.
        :return: None
        """
        self.history = ''
        self.plays = 0
        self.cards[0] = randint(0, 2)
        self.cards[1] = randint(0, 2)
        while self.cards[0] == self.cards[1]:
            self.cards[1] = randint(0, 2)

    def active_player(self) -> int:
        """
        :return: the active player
        """
        return self.plays % self.num_players()

    def num_players(self) -> int:
        """
        :return: the number of players in the game.
        """
        return 2

    def get_winner(self) -> int:
        """
        :return: the winner of the game.
        """
        return 0 if self.utility(0) > self.utility(1) else 1


class BetAgent(Agent):
    def get_action(self, game: Game):
        return "b"


if __name__ == '__main__':
    game = KuhnPoker()
    trainer = CFRTrainer(game)
    print('First Training Phase')
    game_tree, stats = trainer.train(100_000)
    for key in stats.keys():
        print("\t{}: {}".format(key, stats[key]))
    print("-------\nResetting Strategy")
    trainer.reset_strategy()
    print("-------\nSecond Training Phase")
    game_tree, stats = trainer.train(900_000)
    for key in stats.keys():
        print("\t{}: {}".format(key, stats[key]))
    print("-------\nSaving Tree to File")
    pickle.dump(game_tree, open('trees/kuhn_tree.pickle', 'wb'))
    print("-------\nCreating Strategy")
    strategy = compress(game_tree)
    print("-------\nSaving Strategy To File")
    pickle.dump(strategy, open('strategies/kuhn_strategy.pickle', 'wb'))
    print("-------\nResulting Strategy")
    for info_set in sorted(strategy.keys()):
        print("{}: {}".format(info_set, strategy[info_set]))
    print("-------\nTesting Phase")
    agents_stats = game.test(1000, [BetAgent(), StrategyAgent(strategy)])
    for player in range(len(agents_stats)):
        print("\tAgent: {}".format(player))
        for key in agents_stats[player].keys():
            print("\t\t{}: {}".format(key, agents_stats[player][key]))
