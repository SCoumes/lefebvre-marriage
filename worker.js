let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== '/total') {
      return new Response('Not found', { status: 404 });
    }

    if (cache && Date.now() - cacheTime < CACHE_TTL) {
      return json(cache);
    }

    let total = 0, count = 0, currency = null, cursor = null;
    const messages = [];

    do {
      const params = cursor
        ? { cursor }
        : { modifiedAfter: '2016-04-10T12:00:00Z', modifiedBefore: '2028-04-15T12:30:00Z' };

      const res = await fetch(
        'https://api.squarespace.com/1.0/commerce/orders?' + new URLSearchParams(params),
        { headers: { Authorization: `Bearer ${env.SQUARESPACE_API_TOKEN}`, 'User-Agent': 'wedding-lefebvre' } }
      );

      const data = await res.json();

      for (const order of data.result ?? []) {
        total += parseFloat(order.grandTotal?.value ?? 0);
        count++;
        currency ??= order.grandTotal?.currency;
        const msg = order.formSubmission?.find(f => f.label === 'Petit mot')?.value;
        if (msg) messages.push(msg);
      }

      cursor = data.pagination?.hasNextPage ? data.pagination.nextPageCursor : null;
    } while (cursor);

    cache = { total: total.toFixed(2), currency, orderCount: count, messages };
    cacheTime = Date.now();

    return json(cache);
  }
};

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
