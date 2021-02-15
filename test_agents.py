import pickle

from liars_dice import LiarsDice
from pycfr import StrategyAgent, Game, Agent
from research_driver import check_for_impossible_bet
import random as rand


class LDStrategyAgent(StrategyAgent):
    def pretest(self, game: Game):
        return check_for_impossible_bet(game)

class PlayerAgent (Agent):

    def get_action(self, game, index:int):
        print(game.hands)
        action = input("action: ")

        if action == "raise":
            quantity = int(input("quantity: "))
            face = int(input("face: "))
            return action, quantity, face
        else:
            return (action, )

# class HeuristicAgent (Agent):
#     def get_action(self, game, index:int):
#         if game.bid_history == []:
#             face = rand.randint(2,6)
#             num_face = 1.0/3*game.
#         last_quantity = game.bid_history[-1][1]
#         last_face = game.bid_history[-1][2]


if __name__ == '__main__':
    game = LiarsDice(3, 5)
    strategy = pickle.load(open('strategies/liars_dice.pickle', 'rb'))
    print("-------\nTesting Phase")
    agents_stats = game.test(1, [PlayerAgent(), LDStrategyAgent(strategy), LDStrategyAgent(strategy)], True)
    for player in range(len(agents_stats)):
        print("\tAgent: {}".format(player))
        for key in agents_stats[player].keys():
            print("\t\t{}: {}".format(key, agents_stats[player][key]))