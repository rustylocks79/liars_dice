import random
import time
from typing import Tuple

import numpy as np


def normalize(array: np.array) -> np.array:
    """
    :param array: a numpy array
    :return: the parameter array normalized, if the sum of the array is less than 0 return an array of 1/len(array)
    """
    normalizing_sum = np.sum(array, where=array > 0)
    if normalizing_sum > 0.0:
        result = array / normalizing_sum
        result[result < 0] = 0
        return result
    else:
        return np.full(len(array), 1.0 / len(array), dtype=float)


def compress(game_tree: dict) -> dict:
    """
    :param game_tree: A game tree created using the
    :return: the strategy represented by the game tree.
    """
    return {key: value.get_average_strategy() for key, value in game_tree.items()}


class Game:
    def is_terminal(self) -> bool:
        """
        :return: true if the game is in a terminal state, false otherwise
        """
        pass

    def utility(self, player: int) -> float:
        """
        precondition: is_terminal() must be true for this method to be called.
        :param player: an int index of a player
        :return: the utility achieved by player
        """
        pass

    def info_set(self) -> str:
        """
        :return: the information set for the current state of the game.
        """
        pass

    def actions(self) -> list:
        """
        :return: a list of all possible actions at the current state of the game.
        """
        pass

    def preform(self, action) -> None:
        """
        :param action: usually a string or tuple, one of the actions returned by actions() for the active
            player to preform.
        :return: None
        """
        pass

    def reset(self) -> None:
        """
        Resets the game to the start state.
        :return: None
        """
        pass

    def active_player(self) -> int:
        """
        :return: the active player
        """
        pass

    def num_players(self) -> int:
        """
        :return: the number of players in the game.
        """
        pass

    def test(self, iterations: int, agents: list) -> list:
        """
        evaluates the performance of the agents.
        :param iterations: the number of iterations to test each agent.
        :param agents: the agents to test.
        :return: an array of statistic dictionaries
        """
        assert len(agents) == self.num_players()
        agent_stats = []
        for p in range(self.num_players()):
            agent_stats.append({
                "name": type(agents[p]),
                "wins": 0,
                "utility": 0,
            })
        for i in range(iterations):
            while not self.is_terminal():
                self.preform(agents[self.active_player()].get_action(self))

            utils = [self.utility(p) for p in range(self.num_players())]
            winner = np.argmax(utils)
            agent_stats[winner]["wins"] += 1
            for p in range(self.num_players()):
                agent_stats[p]["utility"] += self.utility(p)
            self.reset()
        for p in range(self.num_players()):
            agent_stats[p]["utility"] /= iterations
        return agent_stats


class Agent:
    def get_action(self, game: Game):
        """
        :param game: the game and current state.
        :return: an action (required to be one of the value in game.actions()) to be preformed by the agent while
            they are the active player.
        """
        pass


class StrategyAgent(Agent):
    def __init__(self, strategy: dict) -> None:
        """
        :param strategy: a strategy dictionary {information set: probability distribution}
        """
        self.strategy = strategy

    def get_action(self, game: Game):
        """
        :param game: the game and current state.
        :return: an action chosen random with the probability found in self.strategy.
        """
        return random.choices(game.actions(), weights=self.strategy[game.info_set()])[0]


class Node:
    def __init__(self, actions: np.array):
        """
        :param actions: the list of actions that can be preformed at this information set.
        """
        self.observations = 0
        self.sum_regret = np.zeros(shape=len(actions), dtype=np.float64)
        self.sum_strategy = np.zeros(shape=len(actions), dtype=np.float64)

    def get_strategy(self) -> np.array:
        """
        :return: the training strategy.
        """
        return normalize(self.sum_regret)

    def get_average_strategy(self) -> np.array:
        """
        :return: the average strategy produced by the algorithm.
        """
        return normalize(self.sum_strategy)


class CFRTrainer:
    def __init__(self, game: Game):
        """
        :param game: the game to train an agent for.
        """
        self.game = game
        self.game_tree = {}

    def train(self, iterations: int) -> Tuple[dict, dict]:
        """
        Trains a game tree
        :param iterations: the number of iterations to train.
        :return: a game tree
        """
        start_time = time.process_time()
        for i in range(iterations):
            self.cfr(1.0, 1.0, i % self.game.num_players())
            self.game.reset()
        total_time = time.process_time() - start_time
        stats = {
            "iterations": iterations,
            "information sets": len(self.game_tree),
            "total time": total_time,
            "average observations: ": np.average([node.observations for node in self.game_tree.values()])
        }
        return self.game_tree, stats

    def cfr(self, pi: float, pi_prime: float, training_player: int) -> Tuple[float, float]:
        """
        This method should only be used internally by CFRTrainer.
        :param pi: probability of reaching a node.
        :param pi_prime: probability of reaching the terminal node.
        :param training_player: the index of the agent currently being trained.
        :return: pi, pi_prime
        """
        player = self.game.active_player()
        if self.game.is_terminal():
            return self.game.utility(player) / pi_prime, 1.0

        info_set = self.game.info_set()
        actions = self.game.actions()
        if info_set in self.game_tree:
            node = self.game_tree[info_set]
        else:
            node = Node(actions)
            self.game_tree[info_set] = node

        strategy = node.get_strategy()
        epsilon = 0.6
        if player == training_player:
            probability = np.multiply(epsilon / len(actions) + (1.0 - epsilon), node.get_strategy())
        else:
            probability = np.copy(strategy)

        action_idx = random.choices(np.arange(len(actions)), weights=strategy)[0]
        action = actions[action_idx]
        self.game.preform(action)
        util, p_tail = self.cfr(pi * strategy[action_idx], pi_prime * probability[action_idx], training_player) \
            if player == training_player else self.cfr(pi, pi_prime, training_player)

        node.observations += 1

        if player == training_player:
            w = util * p_tail
            regret = w * (1 - strategy)
            regret[action_idx] = -w * strategy[action_idx]
            node.sum_regret += regret
            return util, p_tail * strategy[action_idx]
        else:
            node.sum_strategy += strategy / pi_prime
            return util, p_tail

    def reset_strategy(self) -> None:
        """
        Resets the average strategy of a game tree.
        :return: None
        """
        for key in self.game_tree.keys():
            self.game_tree[key].sum_strategy = np.zeros(shape=len(self.game_tree[key].sum_regret), dtype=np.float64)
