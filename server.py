import os, json, time, urllib.request, urllib.parse
from flask import Flask, jsonify

app = Flask(__name__)
TOKEN = os.environ['SQUARESPACE_API_TOKEN']
_cache = {}

def fetch_total():
    total, count, currency, cursor = 0, 0, None, None
    while True:
        params = {'modifiedAfter': '2016-04-10T12:00:00Z', 'modifiedBefore': '2028-04-15T12:30:00Z'}
        if cursor:
            params['cursor'] = cursor
        req = urllib.request.Request(
            'https://api.squarespace.com/1.0/commerce/orders?' + urllib.parse.urlencode(params),
            headers={'Authorization': f'Bearer {TOKEN}', 'User-Agent': 'wedding-lefebvre'})
        with urllib.request.urlopen(req) as r:
            data = json.load(r)
        for order in data.get('result', []):
            gt = order.get('grandTotal', {})
            total += float(gt.get('value', 0))
            count += 1
            currency = currency or gt.get('currency')
        pag = data.get('pagination', {})
        cursor = pag.get('nextPageCursor') if pag.get('hasNextPage') else None
        if not cursor:
            break
    return {'total': f'{total:.2f}', 'currency': currency, 'orderCount': count}

@app.get('/total')
def total():
    if not _cache.get('data') or time.time() - _cache.get('t', 0) > 300:
        _cache['data'], _cache['t'] = fetch_total(), time.time()
    return jsonify(_cache['data']), 200, {'Access-Control-Allow-Origin': '*'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 3000)))
