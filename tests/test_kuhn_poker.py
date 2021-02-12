import unittest

from kuhn_poker import KuhnPoker


class MyTestCase(unittest.TestCase):
    def test_preform(self):
        game = KuhnPoker()
        game.perform("p")
        self.assertEqual(1, game.plays)
        self.assertEqual("p", game.history[0:])

    def test_reset(self):
        game = KuhnPoker()
        game.perform("p")
        game.perform("p")
        self.assertEqual(2, game.plays)
        self.assertEqual("pp", game.history[0:])
        game.reset()
        self.assertEqual(0, game.plays)
        self.assertEqual("", game.history[0:])


if __name__ == '__main__':
    unittest.main()
