# Automated Web-Based Faculty Upscaling for Higher Education

Restored **academic team project / portfolio demonstration** based on the November 2024 thesis. The restored app uses **React**, an optional **Express API**, a real **Python (NLTK + scikit-learn)** recommender, and optional **MongoDB** demo persistence.

## Quick demo (frontend only)

```bash
cd client
npm install
npm start
```

Open http://localhost:3000. Runs without Python, Express, or MongoDB via its browser-based recommendation fallback and localStorage.

## Run full Python recommendation flow

Install Node.js 18+, Python 3.10+; from the repo root:

```bash
cd server
python -m pip install -r requirements.txt
npm install
npm start
```

In a **second** terminal:

```bash
cd client
npm install
npm start
```

The React interface automatically uses the Python scikit-learn recommender while the API is reachable. The sidebar identifies the active engine. To check:

```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/recommendations -H "Content-Type: application/json" -d '{"profile":{"department":"Computer Science and Engineering","interests":"machine learning artificial intelligence"}}'
```

On Windows PowerShell use `Invoke-RestMethod` for these requests, or use `python server/recommend.py` with JSON on stdin.

## Optional MongoDB

Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI=mongodb://127.0.0.1:27017/faculty_upscaling` and start local MongoDB, or use a MongoDB Atlas URI. Restart Express. `GET /api/health` must now show `"mongo":"connected"`. The demo's single shared record is saved to the `demorecords` collection in database `faculty_upscaling`; the frontend also continues to store local copies. View persisted data with `mongosh faculty_upscaling --eval 'db.demorecords.find().pretty()'`. If MongoDB is unavailable, API and frontend remain usable. Never commit `.env` or real credentials.

**Important:** This demo uses a public, unauthenticated API, and a role switch; the shared MongoDB document is for *local demonstration only*. Do not expose this server to the internet or use personal faculty data. Multi-user authentication, JWT, role-based access control, Google sign-in, and password reset are not implemented in this restored demo.

## NLP pipeline

`server/recommend.py` reads the original `CourseSheet.csv` and constructs document features using lowercase normalization, Porter stemming, scikit-learn `CountVectorizer(max_features=20000, stop_words="english")`, and cosine similarity. Unlike the legacy `script.py`, it vectorizes the **actual faculty interests, specialization, expertise, department and designation** with the *same vectorizer* used for courses. Six ranked courses are returned, excluding exact previously completed course titles. No offline pickle model is required; models are recomputed per API request. Suitable for this small dataset, not an optimized deployment.

The original raw NPTEL dataset is preserved. Course links were collected around 2024, so some may have expired. The historic backend models/components remain in the repository as reference; **the active demo uses `client/src/demo/PortfolioDemo.js`, `server/index.js` and `server/recommend.py`.**

## Suggested live walkthrough

Edit faculty interests → see Python-driven recommendations → add a course → adjust progress → switch to admin dashboard → add appraisal feedback. You can also demonstrate saving to MongoDB by querying `demorecords` after editing the profile. For a GitHub README, describe authentication/admin controls as demonstration-only, not secure multi-user functionality.

## GitHub

This archive intentionally excludes `.git`. Unzip it into a *new branch* of your existing repository (or copy changed files), review `git diff`, and commit/push only once you're happy. Never overwrite your repository without a backup.

## Verification status

Checked in the packaging environment: Python compilation, Python recommendation generation from the real CSV, five recommender unit tests, and Node server syntax. **A complete Express/React browser test and actual MongoDB handshake were not possible here** because npm package downloads were unavailable and no MongoDB service was running. Run `npm install` with internet access and verify `GET /api/health` after enabling MongoDB. MongoDB persistence code is implemented but is not claimed to have been tested against a real database in this environment.

```bash
python -m unittest discover -s tests -v
```
