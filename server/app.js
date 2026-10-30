import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchPlaylist } from '../lib/spotify.js';
import { filterSafe } from '../lib/safety.js';
import { downloadTracks } from '../lib/downloader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/playlist', async (req, res) => {
  const { url } = req.body ?? {};
  if (!url) return res.status(400).json({ error: 'url requerido' });
  try {
    const { playlistId, tracks } = await fetchPlaylist(url);
    const { safe, skipped } = filterSafe(tracks);
    res.json({ playlistId, skipped, tracks: safe });
  } catch (e) {
    res.status(500).json({ error: e?.message ?? 'error interno' });
  }
});

app.post('/api/download', async (req, res) => {
  const { ids = [] } = req.body ?? {};
  try {
    const results = await downloadTracks(ids);
    res.json({ results });
  } catch (e) {
    res.status(500).json({ error: e?.message ?? 'error interno' });
  }
});

export default app;
