# Spotify Playlist Downloader — ODD task

## Objective
Web app: paste a Spotify playlist URL → downloads tracks as MP3 → skips unsafe tracks → paste link, done.

## Problem / why
User wants offline downloads from Spotify playlists without unsafe content.

## Scope
- Fetch playlist tracks via Spotify Web API (client credentials).
- Safety filter: skip tracks flagged `isExplicit`, optional manual blocklist.
- Download audio via yt-dlp per track.
- Deploy to Vercel.

## Tasks
- [ ] T1 Scaffold (package.json, server, lib, public, env, vercel).
- [ ] T2 Spotify client: token + playlist tracks.
- [ ] T3 Safety filter.
- [ ] T4 Downloader.
- [ ] T5 UI.
- [ ] T6 Deploy to Vercel.

## Acceptance
- Paste playlist URL → filtered list returned.
- Download all safe tracks → MP3s.
- Deployed on Vercel.
