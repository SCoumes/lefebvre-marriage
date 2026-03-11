# Wedding Lefebvre – Order Tracker

Displays Squarespace order statistics on the wedding website: total amount collected, milestone progress, and guests' personal messages.

## Architecture

Two components:

- **Cloudflare Worker** (`worker.js`): serverless endpoint that fetches all orders from the Squarespace API, sums the totals, and collects "Petit mot" messages. Free tier, no cold starts, 100k requests/day.
- **Squarespace snippet** (`snip.js`): HTML/JS block pasted into a Squarespace Code Block. Calls the Worker and renders the total, next milestone countdown, milestone list, and messages.

## Cloudflare Worker

**Live URL:** `https://wed.simon-0fc.workers.dev/total`

**Response:**
```json
{
  "total": "123.45",
  "currency": "EUR",
  "orderCount": 12,
  "messages": ["Bon voyage !", "Plein de bonheur !"]
}
```

**Deployment:** synced from the `main` branch via Cloudflare's GitHub integration (no build step, entry point: `worker.js`).

**Environment variable:** set `SQUARESPACE_API_TOKEN` as a secret in the Worker settings on the Cloudflare dashboard.

Results are cached in-memory for 5 seconds.

## Squarespace Snippet

Paste `snip.js` into a Squarespace Code Block. Before pasting, edit the `MILESTONES` array at the top of the file:

```js
const MILESTONES = [
  { amount: 500, text: "un photographe supplémentaire sera là" },
  { amount: 1000, text: "une surprise vous attend" },
];
```

Each milestone shows in green once the total exceeds its amount. The line above the list shows how much is needed to reach the next one.

## Local Setup

```bash
cp .env.example .env
# fill in SQUARESPACE_API_TOKEN in .env
```

Fetch raw orders JSON (for debugging):

```bash
bash get_orders.sh
```

## Files

| File | Description |
|------|-------------|
| `worker.js` | Cloudflare Worker — API aggregation endpoint |
| `snip.js` | Squarespace Code Block snippet |
| `get_orders.sh` | Debug script: dumps raw Squarespace orders JSON |
| `.env.example` | Template for local credentials |
| `server.py`, `requirements.txt` | Old Python/Render backend — no longer deployed, kept for reference |
| `order_query_answer_example.json` | Example Squarespace API response |
