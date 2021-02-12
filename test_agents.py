import pickle

from liars_dice import LiarsDice
from pycfr import StrategyAgent, Game, Agent
from research_driver import check_for_impossible_bet


class LDStrategyAgent(StrategyAgent):
    def pretest(self, game: Game):
        return check_for_impossible_bet(game)

class PlayerAgent (Agent):

    def get_action(self, game: Game):
        action = input("action: ")
        quantity = int(input("quantity: "))
        face = int(input("face: "))
        if action == "raise":
            return action, quantity, face
        else:
            return action


if __name__ == '__main__':
    game = LiarsDice(3, 5)
    strategy = pickle.load(open('strategies/liars_dice.pickle', 'rb'))
    print("-------\nTesting Phase")
    agents_stats = game.test(1, [PlayerAgent(), LDStrategyAgent(strategy), LDStrategyAgent(strategy)])
    for player in range(len(agents_stats)):
        print("\tAgent: {}".format(player))
        for key in agents_stats[player].keys():
            print("\t\t{}: {}".format(key, agents_stats[player][key]))