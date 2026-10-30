export function filterSafe(tracks, blocklist = []) {
  const blocked = new Set(
    (Array.isArray(blocklist) ? blocklist : [blocklist])
      .map((b) => String(b ?? '').trim().toLowerCase())
      .filter(Boolean)
  );
  const safe = [];
  const skipped = [];
  for (const t of tracks) {
    const key = String(t.uri ?? '').toLowerCase();
    const nameKey = String(t.name ?? '').toLowerCase();
    const hit = blocked.has(key) || blocked.has(nameKey);
    if (t.isExplicit || hit) skipped.push(t);
    else safe.push(t);
  }
  return { safe, skipped };
}
