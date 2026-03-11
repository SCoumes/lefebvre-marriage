const https = require('https');
const http = require('http');

const PORT = process.env.PORT || 3000;
const API_TOKEN = process.env.SQUARESPACE_API_TOKEN;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cache = null;
let cacheTime = 0;

function fetchPage(cursor) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      modifiedAfter: '2016-04-10T12:00:00Z',
      modifiedBefore: '2028-04-15T12:30:00Z',
    });
    if (cursor) params.set('cursor', cursor);

    const options = {
      hostname: 'api.squarespace.com',
      path: `/1.0/commerce/orders?${params}`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'User-Agent': 'wedding-lefebvre-order-total',
      },
    };

    https.get(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function computeTotal() {
  let total = 0;
  let orderCount = 0;
  let currency = null;
  let cursor = null;

  do {
    const data = await fetchPage(cursor);
    for (const order of data.result || []) {
      const val = parseFloat(order.grandTotal?.value);
      if (!isNaN(val)) {
        total += val;
        orderCount++;
        currency = currency || order.grandTotal?.currency;
      }
    }
    cursor = data.pagination?.hasNextPage ? data.pagination.nextPageCursor : null;
  } while (cursor);

  return { total: total.toFixed(2), currency, orderCount };
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url !== '/total' || req.method !== 'GET') {
    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Not found' }));
  }

  if (!API_TOKEN) {
    res.writeHead(500);
    return res.end(JSON.stringify({ error: 'SQUARESPACE_API_TOKEN not set' }));
  }

  if (cache && Date.now() - cacheTime < CACHE_TTL) {
    res.writeHead(200);
    return res.end(JSON.stringify(cache));
  }

  try {
    cache = await computeTotal();
    cacheTime = Date.now();
    res.writeHead(200);
    res.end(JSON.stringify(cache));
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Failed to fetch orders' }));
  }
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
