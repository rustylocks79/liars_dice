import pickle

from liars_dice import LiarsDice
from pycfr import CFRTrainer, compress, StrategyAgent, Game


def check_for_impossible_bet(game: LiarsDice):
    if not game.bid_history:
        return None
    total_dice = sum([len(hand) for hand in game.hands])
    last_quantity = game.bid_history[-1][1]
    if last_quantity > total_dice:
        return 'doubt',
    else:
        return None


if __name__ == '__main__':
    game = LiarsDice(10, 5)
    # TODO: sampling using a bool variable in the game. so many iterations of each player number. random dice for each player
    trainer = CFRTrainer(game, pretest=check_for_impossible_bet)
    print('First Training Phase')
    game_tree, stats = trainer.train(10_000)
    for key in stats.keys():
        print("\t{}: {}".format(key, stats[key]))
    print("-------\nSaving Tree to File")
    pickle.dump(game_tree, open('trees/liars_dice.pickle', 'wb'))
    print("-------\nCreating Strategy")
    strategy = compress(game_tree)
    print("-------\nSaving Strategy To File")
    pickle.dump(strategy, open('strategies/liars_dice.pickle', 'wb'))
