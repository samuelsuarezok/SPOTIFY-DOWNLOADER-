import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function downloadTracks(ids, outDir = 'downloads') {
  const results = [];
  for (const id of ids) {
    const url = `https://open.spotify.com/track/${id}`;
    try {
      await execFileAsync(
        'yt-dlp',
        ['-x', '--audio-format', 'mp3', '-o', '%(id)s.%(ext)s', url],
        { cwd: outDir }
      );
      results.push({ id, ok: true });
    } catch (e) {
      results.push({ id, ok: false, error: e?.message ?? 'error' });
    }
  }
  return results;
}
