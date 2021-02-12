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

        # test valid raise
        # test correct doubt
        # test incorrect doubt
        # test case where player loses last die