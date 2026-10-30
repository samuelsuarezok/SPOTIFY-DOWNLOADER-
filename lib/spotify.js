const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';

let token = null;
let expiresAt = 0;

async function getAccessToken() {
  if (token && Date.now() < expiresAt - 30_000) return token;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Faltan credenciales: SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET');
  }
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('No se pudo obtener token de Spotify');
  token = data.access_token;
  expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
  return token;
}

export function resolvePlaylistId(url) {
  const m = String(url ?? '').match(/playlist\/([A-Za-z0-9]+)/);
  if (!m) throw new Error('URL de playlist invalida');
  return m[1];
}

export async function fetchPlaylist(url) {
  const id = resolvePlaylistId(url);
  const accessToken = await getAccessToken();
  const res = await fetch(
    `${API_BASE}/playlists/${id}/tracks?fields=items(id,name,artists,uri,isExplicit,track_number)&limit=100`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  const tracks = (data.items ?? []).map((it) => ({
    id: it.track?.id ?? String(it.track?.uri ?? '').split(':').pop() ?? '',
    name: it.track?.name ?? '',
    artists: (it.track?.artists ?? []).map((a) => a.name).join(', '),
    uri: it.track?.uri ?? '',
    isExplicit: Boolean(it.track?.isExplicit),
  }));
  return { playlistId: id, tracks };
}
