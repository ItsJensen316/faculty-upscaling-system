#!/usr/bin/env python3
"""NPTEL faculty recommender: JSON stdin -> JSON stdout (no Mongo requirement).

Derived from the original academic pipeline: NPTEL data, lowercase normalization,
Porter stemming, CountVectorizer, cosine similarity. Trained at startup/on invocation
instead of relying on version-dependent pickle artifacts. No external downloads.
"""
import csv
import json
import re
import sys
from pathlib import Path
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

DATASET = Path(__file__).with_name('CourseSheet.csv')
STEMMER = PorterStemmer()

def normalize(value):
    terms = re.findall(r"[a-z0-9]+", str(value or '').lower())
    return ' '.join(STEMMER.stem(term) for term in terms)

def load_courses():
    with DATASET.open(encoding='latin-1', newline='') as stream:
        reader = csv.DictReader(stream)
        result = []
        seen = set()
        for index, row in enumerate(reader):
            title = (row.get('Course Name') or '').strip()
            if not title or not (row.get('About') or '').strip():
                continue
            identifier = (row.get('Course ID') or str(index)).strip()
            if identifier in seen:
                continue
            seen.add(identifier)
            result.append({
                'id': identifier, 'title': title,
                'discipline': (row.get('Discipline') or '').strip(),
                'institute': (row.get('Institute') or '').strip(),
                'duration': (row.get('Duration') or '').strip(),
                'prerequisite': (row.get('Prerequiste') or row.get('Prerequisite') or '').strip(),
                'description': (row.get('About') or '').strip(),
                'industry': (row.get('Industry support') or '').strip(),
                'url': (row.get('Link') or '').strip(),
            })
    if not result:
        raise ValueError('NPTEL course dataset is empty')
    return result

COURSES = load_courses()
CORPUS = [normalize(' '.join([c['title']] * 3 + [c['discipline'], c['prerequisite'], c['description'], c['industry']])) for c in COURSES]
VECTORIZER = CountVectorizer(max_features=20000, stop_words='english')
VECTORS = VECTORIZER.fit_transform(CORPUS)

def recommend(profile, limit=6):
    if not isinstance(profile, dict):
        raise ValueError('profile must be an object')
    limit = max(1, min(int(limit), 20))
    text = ' '.join(str(profile.get(key) or '') for key in ('interests','specialization','expertise','designation','department'))
    if not text.strip():
        raise ValueError('Enter at least a department or specialization / interests')
    query = VECTORIZER.transform([normalize(text)])
    if query.nnz == 0:
        raise ValueError('Profile has no recognizable course keywords; add more specific interests')
    scores = cosine_similarity(query, VECTORS).ravel()
    completed = {v.strip().casefold() for v in re.split(r'[;,\n]+', str(profile.get('completed') or '')) if v.strip()}
    candidates = [i for i,c in enumerate(COURSES) if c['title'].casefold() not in completed]
    ranked = sorted(candidates, key=lambda i: (-float(scores[i]), COURSES[i]['title']))[:limit]
    return [{**COURSES[i], 'score': round(float(scores[i]), 5)} for i in ranked]

def main():
    try:
        payload = json.load(sys.stdin)
        print(json.dumps({'recommendations': recommend(payload.get('profile', {}), payload.get('limit', 6)), 'engine':'python-sklearn'}))
    except (ValueError, TypeError, KeyError, json.JSONDecodeError) as exc:
        print(json.dumps({'error': str(exc)}))
        sys.exit(1)

if __name__ == '__main__':
    main()
