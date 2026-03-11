# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Utility scripts for the Lefebvre wedding website, which runs on Squarespace. Currently contains a single script for querying the Squarespace Commerce API.

## Files

### `get_orders.sh`

Fetches raw orders JSON from the Squarespace Commerce API (for debugging). The bearer token is hardcoded; update it if the token is rotated.

### `server.py`

Python/Flask server deployed on Render. Exposes a single endpoint:

- `GET /total` — fetches all paginated orders from Squarespace and returns `{ total, currency, orderCount }`. Results are cached in-memory for 5 minutes.

Run locally:

```bash
pip install flask
SQUARESPACE_API_TOKEN=<token> python server.py
# → http://localhost:3000/total
```

The API token must be set as the `SQUARESPACE_API_TOKEN` environment variable (configured in Render's dashboard, not committed to the repo).

Render settings: **Build command** `pip install -r requirements.txt`, **Start command** `python server.py`.
