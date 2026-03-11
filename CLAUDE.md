# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Utility scripts for the Lefebvre wedding website, which runs on Squarespace. Currently contains a single script for querying the Squarespace Commerce API.

## Files

### `get_orders.sh`

Fetches raw orders JSON from the Squarespace Commerce API (for debugging). The bearer token is hardcoded; update it if the token is rotated.

### `worker.js`

Cloudflare Worker (JavaScript). Exposes a single endpoint:

- `GET /total` — fetches all paginated orders from Squarespace and returns `{ total, currency, orderCount }`. Results are cached in-memory for 5 seconds.

Deploy by pasting the file contents into the Cloudflare Workers dashboard editor. Set `SQUARESPACE_API_TOKEN` as an environment variable (secret) in the Worker settings.

### `server.py` / `requirements.txt`

Older Python/Flask backend, previously deployed on Render. Superseded by `worker.js`.
