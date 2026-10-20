require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { spawn } = require('child_process');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const URI = process.env.MONGODB_URI;
const python = process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');

app.use(cors({ origin: (process.env.CLIENT_ORIGIN || 'http://localhost:3000').split(','), methods: ['GET', 'POST', 'PUT'] }));
app.use(express.json({ limit: '64kb' }));

const demoSchema = new mongoose.Schema({
  _id: String,
  profile: mongoose.Schema.Types.Mixed,
  recommendations: [mongoose.Schema.Types.Mixed],
  recommendationsUpdatedAt: Date,
  updatedAt: Date
}, { versionKey: false, strict: true });

const DemoRecord = mongoose.models.DemoRecord || mongoose.model('DemoRecord', demoSchema);
const isConnected = () => mongoose.connection.readyState === 1;

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    mongo: isConnected() ? 'connected' : URI ? 'disconnected' : 'not-configured',
    recommender: 'python-sklearn'
  });
});

app.get('/health', (_req, res) => res.redirect('/api/health'));

app.post('/api/recommendations', (req, res) => {
  const profile = req.body?.profile || {};
  const child = spawn(python, ['recommend.py'], { cwd: __dirname, stdio: ['pipe', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  let done = false;

  const timer = setTimeout(() => {
    if (done) return;
    done = true;
    child.kill();
    res.status(504).json({ error: 'Recommendation timed out' });
  }, 30000);

  child.stdout.on('data', chunk => {
    stdout += chunk.toString();
    if (stdout.length > 1024 * 1024) child.kill();
  });

  child.stderr.on('data', chunk => {
    stderr += chunk.toString().slice(0, 2000);
  });

  child.on('error', error => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    res.status(503).json({ error: `Python unavailable: ${error.message}` });
  });

  child.on('close', async code => {
    if (done) return;
    done = true;
    clearTimeout(timer);

    let result;
    try {
      result = JSON.parse(stdout);
    } catch (error) {
      console.error(stderr || error.message);
      return res.status(500).json({ error: 'Python recommender failed; check backend console' });
    }

    if (code !== 0 || result.error) {
      return res.status(400).json(result);
    }

    if (!Array.isArray(result.recommendations)) {
      return res.status(500).json({ error: 'Invalid recommendation response' });
    }

    if (isConnected()) {
      try {
        await DemoRecord.findByIdAndUpdate(
          'faculty-demo',
          {
            $set: {
              recommendations: result.recommendations,
              recommendationsUpdatedAt: new Date()
            }
          },
          { upsert: true, runValidators: true }
        );
      } catch (error) {
        console.error('Failed to save recommendations:', error.message);
      }
    }

    res.json(result);
  });

  child.stdin.on('error', () => {});
  child.stdin.end(JSON.stringify({ profile, limit: 6 }));
});

app.get('/api/demo', async (_req, res) => {
  if (!isConnected()) {
    return res.status(503).json({ error: 'MongoDB not connected; local browser storage remains available' });
  }
  try {
    const record = await DemoRecord.findById('faculty-demo').lean();
    res.json({
      profile: record?.profile || null,
      recommendations: record?.recommendations || [],
      recommendationsUpdatedAt: record?.recommendationsUpdatedAt || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Database read failed' });
  }
});

app.put('/api/demo', async (req, res) => {
  if (!isConnected()) return res.status(503).json({ error: 'MongoDB not connected' });
  if (!req.body || !req.body.profile || typeof req.body.profile !== 'object' || Array.isArray(req.body.profile)) {
    return res.status(400).json({ error: 'Invalid profile' });
  }
  try {
    await DemoRecord.findByIdAndUpdate(
      'faculty-demo',
      { $set: { profile: req.body.profile, updatedAt: new Date() } },
      { upsert: true, runValidators: true }
    );
    res.json({ saved: true });
  } catch (error) {
    res.status(500).json({ error: 'Database save failed' });
  }
});

app.listen(PORT, () => console.log(`Faculty demo API listening on http://localhost:${PORT}`));

if (URI) {
  mongoose.connect(URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.warn(`MongoDB unavailable: ${error.message}. Demo still works using browser storage.`));
} else {
  console.log('MongoDB optional. Set MONGODB_URI in .env to enable persistence.');
}
