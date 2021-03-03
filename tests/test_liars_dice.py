import unittest

from liars_dice import LiarsDice


class LiarsDiceTests (unittest.TestCase):
    def test_actions(self):
        game = LiarsDice(3, 5)
        self.assertEqual([('raise', 1, 2), ('raise', 1, 3), ('raise', 1, 4), ('raise', 1, 5), ('raise', 1, 6), ('raise', 2, 2), ('raise', 2, 3), ('raise', 2, 4), ('raise', 2, 5), ('raise', 2, 6)], game.actions())
        game.bid_history = [("raise", 2, 2)]
        self.assertEqual([('raise', 2, 3), ('raise', 2, 4), ('raise', 2, 5), ('raise', 2, 6), ('raise', 3, 2), ('raise', 3, 3), ('raise', 3, 4), ('raise', 3, 5), ('raise', 3, 6), ('raise', 4, 2), ('raise', 4, 3), ('raise', 4, 4), ('raise', 4, 5), ('raise', 4, 6)], game.actions())

    def test_perform(self):
        game = LiarsDice(3, 5)

        # test doubt w/ empty BH
        with self.assertRaises(RuntimeError):
            game.perform(("doubt",), False)
        with self.assertRaises(RuntimeError):
            game.perform(("raise", -2, 3), False)
        with self.assertRaises(RuntimeError):
            game.perform(("raise", 2, 0), False)
        with self.assertRaises(RuntimeError):
            game.perform(("raise", 2, 7), False)

        # test raise w/ empty BH
        game.perform(("raise", 2, 3), False)
        self.assertEqual([("raise", 2, 3)], game.bid_history)
        self.assertEqual(1, game.current_player)

        game.perform(("raise", 3, 3), False)
        self.assertEqual(2, game.current_player)

        #  quantity > last or (quantities equal and face is greater)
        with self.assertRaises(RuntimeError):
            game.perform(("raise", 1, 3), False)
        with self.assertRaises(RuntimeError):
            game.perform(("raise", 2, 2), False)
        with self.assertRaises(RuntimeError):
            game.perform(("raise", 2, 0), False)
        with self.assertRaises(RuntimeError):
            game.perform(("raise", 2, 7), False)
        with self.assertRaises(RuntimeError):
            game.perform(("sadfadsjlka", 3, 3), False)

        game = LiarsDice(3, 2)
        game.hands = [[0, 2, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0]]
        game.active_dice = [2, 2, 2]

        # correct doubts
        game.perform(("raise", 2, 4), False)
        game.perform(("doubt",), False)
        self.assertEqual(1, game.active_dice[0])
        self.assertEqual(0, game.current_player)
        game.hands = [[0, 1, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0]]
        game.active_dice = [1, 2, 2]
        with self.assertRaises(RuntimeError):
            game.perform(("doubt",), False)
        game.perform(("raise", 8, 2), False)
        game.perform(("doubt",), False)
        self.assertEqual(0, game.active_dice[0])
        self.assertEqual(1, game.current_player)

        # test incorrect doubts
        game = LiarsDice(3, 2)
        game.hands = [[0, 2, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0]]
        game.active_dice = [2, 2, 2]
        game.perform(("raise", 6, 2), False)
        game.perform(("doubt",), False)
        self.assertEqual(1, game.active_dice[1])
        self.assertEqual(1, game.current_player)
        game.hands = [[0, 2, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0]]
        game.active_dice = [2, 1, 2]
        game.perform(("raise", 3, 2), False)
        game.perform(("raise", 4, 2), False)
        game.perform(("raise", 5, 2), False)
        game.perform(("doubt",), False)
        self.assertEqual(0, game.active_dice[1])

        # test end of game
        game = LiarsDice(2, 3)
        game.hands = [[0, 1, 0, 0, 0, 0], [0, 0, 0, 1, 0, 1]]
        game.active_dice = [1, 2]
        game.perform(("raise", 1, 5), False)
        game.perform(("doubt",), False)
        self.assertTrue(game.is_terminal())
        self.assertEqual(2, game.utility(1))
        self.assertEqual(0, game.utility(0))

    def test_reset(self):
        game = LiarsDice(2, 3)
        game.reset()
        # bid history, current player, active
        self.assertEqual([], game.bid_history)
        self.assertEqual(0, game.current_player)
        self.assertEqual([3, 3], game.active_dice)

