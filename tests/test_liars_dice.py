import unittest

from liars_dice import LiarsDice


class LiarsDiceTests (unittest.TestCase):
    def test_actions(self):
        l = LiarsDice(3, 5)
        self.assertEqual([('raise', 1, 2), ('raise', 1, 3), ('raise', 1, 4), ('raise', 1, 5), ('raise', 1, 6)], l.actions())
        l.bid_history = [("raise", 2, 2)]
        self.assertEqual([('doubt',), ('raise', 2, 3), ('raise', 2, 4), ('raise', 2, 5), ('raise', 2, 6), ('raise', 3, 2), ('raise', 3, 3), ('raise', 3, 4), ('raise', 3, 5), ('raise', 3, 6)], l.actions())

    def test_perform(self):
        l = LiarsDice(3, 5)

        # test doubt w/ empty BH
        with self.assertRaises(RuntimeError):
            l.perform(("doubt",))

        with self.assertRaises(RuntimeError):
            l.perform(("raise", -2, 3))
        with self.assertRaises(RuntimeError):
            l.perform(("raise", 2, 0))
        with self.assertRaises(RuntimeError):
            l.perform(("raise", 2, 7))

        # test raise w/ empty BH
        l.perform(("raise", 2, 3))
        self.assertEqual([("raise", 2, 3)], l.bid_history)
        self.assertEqual(1, l.current_player)

        l.perform(("raise", 3, 3))
        self.assertEqual(2, l.current_player)

        #  quantity > last or (quantities equal and face is greater)
        with self.assertRaises(RuntimeError):
            l.perform(("raise", 1, 3))
        with self.assertRaises(RuntimeError):
            l.perform(("raise", 2, 2))
        with self.assertRaises(RuntimeError):
            l.perform(("raise", 2, 0))
        with self.assertRaises(RuntimeError):
            l.perform(("raise", 2, 7))
        with self.assertRaises(RuntimeError):
            l.perform(("sadfadsjlka", 3, 3))

        l = LiarsDice(3, 2)
        l.hands = [[2, 2], [2, 2], [2, 2]]

        # correct doubts
        l.perform(("raise", 2, 4))
        l.perform(("doubt",))
        self.assertEqual(1, len(l.hands[0]))
        self.assertEqual(0, l.current_player)
        l.hands = [[2], [2, 2], [2, 2]]
        with self.assertRaises(RuntimeError):
            l.perform(("doubt", ))
        l.perform(("raise", 8, 2))
        l.perform(("doubt", ))
        self.assertEqual(0, len(l.hands[0]))
        self.assertEqual(False, l.active[0])
        self.assertEqual(1, l.current_player)

        # test incorrect doubts
        l = LiarsDice(3, 2)
        l.hands = [[2, 2], [2, 2], [2, 2]]
        l.perform(("raise", 6, 2))
        l.perform(("doubt", ))
        self.assertEqual(1, len(l.hands[1]))
        self.assertEqual(1, l.current_player)
        l.hands = [[2, 2], [2], [2, 2]]
        l.perform(("raise", 3, 2))
        l.perform(("raise", 4, 2))
        l.perform(("raise", 5, 2))
        l.perform(("doubt", ))
        self.assertEqual(0, len(l.hands[1]))
        self.assertEqual(False, l.active[1])

        # test end of game
        l = LiarsDice(2, 3)
        l.hands = [[2], [4, 6]]
        l.perform(("raise", 1, 5))
        l.perform(("doubt", ))
        self.assertEqual(True, l.is_terminal())
        self.assertEqual(2, l.utility(1))
        self.assertEqual(0, l.utility(0))

    def test_reset(self):
        l = LiarsDice(2, 3)
        l.reset()
        # bid history, current player, active
        self.assertEqual([], l.bid_history)
        self.assertEqual(0, l.current_player)
        self.assertEqual([True, True], l.active)

