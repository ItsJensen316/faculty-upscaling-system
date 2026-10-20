"""Run with: python -m unittest discover -s tests -v"""
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1] / 'server'))
from recommend import COURSES, normalize, recommend

class RecommenderTests(unittest.TestCase):
    def test_dataset(self):
        self.assertGreaterEqual(len(COURSES), 190)
    def test_stemming(self):
        self.assertEqual(normalize('Learning'), normalize('learn'))
    def test_scores_ordered(self):
        rows = recommend({'department':'Computer Science', 'interests':'machine learning neural networks'})
        self.assertEqual(len(rows), 6)
        self.assertGreater(rows[0]['score'],0)
        self.assertEqual([r['score'] for r in rows],sorted((r['score'] for r in rows),reverse=True))
    def test_completed_exclusion(self):
        rows = recommend({'interests':'machine learning', 'completed':'Introduction to Machine Learning'})
        self.assertNotIn('Introduction to Machine Learning',[r['title'] for r in rows])
    def test_invalid(self):
        with self.assertRaises(ValueError): recommend({})

if __name__=='__main__': unittest.main()
