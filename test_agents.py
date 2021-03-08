import math
import pickle
import random as rand

from liars_dice import LiarsDice
from pycfr import StrategyAgent, Game, Agent
from research_driver import check_bet


class LDStrategyAgent(StrategyAgent):
    def pretest(self, game: Game, index: int):
        return check_bet(game, index)


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

class HeuristicAgent (Agent):
    def get_action(self, game, index: int):
        num_unknown = sum([game.active_dice[p] for p in range(len(game.active_dice)) if p != index])
        if not game.bid_history:
            face = rand.randint(2, 6)
            num_face_in_hand = game.hands[index][face - 1] + game.hands[index][0]
            quantity = math.floor(num_face_in_hand + 1.0/3*num_unknown)
            if quantity == 0:
                quantity += 1
            return "raise", quantity, face
        else:
            last_quantity = game.bid_history[-1][1]
            last_face = game.bid_history[-1][2]
            num_face_in_hand = game.hands[index][last_face - 1] + game.hands[index][0]
            expected_value = math.floor(num_face_in_hand + 1.0/3*num_unknown)
            if last_quantity > expected_value:
                return ("doubt", )
            else:
                quantity = last_quantity + 1
                return "raise", quantity, last_face




# if __name__ == '__main__':
#     game = LiarsDice(3, 5)
#     strategy = pickle.load(open('strategies/liars_dice.pickle', 'rb'))
#     print("-------\nTesting Phase")
#     agents_stats = game.test(1, [PlayerAgent(), LDStrategyAgent(strategy), LDStrategyAgent(strategy)], True)
#     for player in range(len(agents_stats)):
#         print("\tAgent: {}".format(player))
#         for key in agents_stats[player].keys():
#             print("\t\t{}: {}".format(key, agents_stats[player][key]))

# LDStrategy vs. Heuristic
if __name__ == '__main__':
    game = LiarsDice(2, 5, sampling=True)
    strategy = pickle.load(open('strategies/liars_dice.pickle', 'rb'))
    print("-------\nTesting Phase")
    agents_stats = game.test(10_000, [LDStrategyAgent(strategy), HeuristicAgent()], False)
    for player in range(len(agents_stats)):
        print("\tAgent: {}".format(player))
        for key in agents_stats[player].keys():
            print("\t\t{}: {}".format(key, agents_stats[player][key]))