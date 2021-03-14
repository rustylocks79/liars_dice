import pickle

from liars_dice import LiarsDice, MediumAgent, EasyAgent, HardAgent, HeuristicAgent
from pycfr import Agent


class PlayerAgent(Agent):
    def get_action(self, game: LiarsDice):
        print(game.active_dice)
        print(game.hands[0])
        action = input("action: ")

        if action == "raise":
            quantity = int(input("quantity: "))
            face = int(input("face: "))
            return action, quantity, face
        else:
            return action,


if __name__ == '__main__':
    game = LiarsDice(4, 5)
    strategy = pickle.load(open('strategies/liars_dice.pickle', 'rb'))
    print("-------\nTesting Phase")
    agents_stats = game.test(10_000, [EasyAgent(strategy), MediumAgent(strategy), HardAgent(strategy), HeuristicAgent()], False)
    for player in range(len(agents_stats)):
        print("\tAgent: {}".format(player))
        for key in agents_stats[player].keys():
            print("\t\t{}: {}".format(key, agents_stats[player][key]))
