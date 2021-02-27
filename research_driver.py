import math
import pickle
import time
from typing import Tuple

import numpy as np

from liars_dice import LiarsDice
from pycfr import CFRTrainer, compress


class CustomTrainer(CFRTrainer):
    def train(self, iterations: int) -> Tuple[dict, dict]:
        """
        Trains a game tree using the sampling method implemented in
        :param iterations: the number of iterations to train.
        :return: a game tree
        """
        start_time = time.process_time()
        for players in range(2, 11):
            print('players: {}'.format(players))
            for i in range(iterations):
                self.cfr(1.0, 1.0, i % self.game.num_players())
                self.game.sampling_reset(5, players)
        total_time = time.process_time() - start_time
        stats = {
            "iterations": iterations * 10,
            "information sets": len(self.game_tree),
            "total time": total_time,
            "average observations: ": np.average([node.observations for node in self.game_tree.values()])
        }
        return self.game_tree, stats


def check_bet(game: LiarsDice, index: int):
    if game.bid_history:
        num_unknown = sum([game.active_dice[p] for p in range(len(game.active_dice)) if p != index])
        last_quantity = game.bid_history[-1][1]
        last_face = game.bid_history[-1][2]
        num_face_in_hand = game.hands[index][last_face - 1] + game.hands[index][0]
        expected_value = math.floor(num_face_in_hand + 1.0 / 3 * num_unknown)
        if last_quantity > expected_value:
            return 'doubt',
    return None


if __name__ == '__main__':
    game = LiarsDice(2, 5, sampling=True)
    trainer = CustomTrainer(game, pretest=check_bet)
    print('First Training Phase')
    game_tree, stats = trainer.train(1_000_000)
    for key in stats.keys():
        print("\t{}: {}".format(key, stats[key]))
    print("-------\nSaving Tree to File")
    pickle.dump(game_tree, open('trees/liars_dice.pickle', 'wb'))
    print("-------\nCreating Strategy")
    strategy = compress(game_tree)
    print("-------\nSaving Strategy To File")
    pickle.dump(strategy, open('strategies/liars_dice.pickle', 'wb'))
