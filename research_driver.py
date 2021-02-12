import pickle

from liars_dice import LiarsDice
from pycfr import CFRTrainer, compress, StrategyAgent

if __name__ == '__main__':
    game = LiarsDice(3, 5)
    trainer = CFRTrainer(game)
    print('First Training Phase')
    game_tree, stats = trainer.train(100)
    for key in stats.keys():
        print("\t{}: {}".format(key, stats[key]))
    print("-------\nResetting Strategy")
    trainer.reset_strategy()
    print("-------\nSecond Training Phase")
    game_tree, stats = trainer.train(900)
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
    # print("-------\nTesting Phase")
    # agents_stats = game.test(1000, [StrategyAgent(strategy), StrategyAgent(strategy)])
    # for player in range(len(agents_stats)):
    #     print("\tAgent: {}".format(player))
    #     for key in agents_stats[player].keys():
    #         print("\t\t{}: {}".format(key, agents_stats[player][key]))