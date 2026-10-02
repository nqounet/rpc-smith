const express = require('express');
const app = express();

app.use(express.json());

const store = {};

function makeError(code, message, data) {
  const err = { code, message };
  if (data !== undefined) err.data = data;
  return err;
}

function handleSingle(reqObj) {
  if (!reqObj || typeof reqObj !== 'object') {
    return { jsonrpc: '2.0', error: makeError(-32600, 'Invalid Request'), id: null };
  }
  if (reqObj.jsonrpc !== '2.0') {
    return { jsonrpc: '2.0', error: makeError(-32600, 'Invalid Request: jsonrpc must be "2.0"'), id: reqObj.id === undefined ? null : reqObj.id };
  }

  const isNotification = (reqObj.id === undefined);
  const id = reqObj.id;
  const method = reqObj.method;
  const params = reqObj.params;

  const sendError = (code, message, data) => ({ jsonrpc: '2.0', error: makeError(code, message, data), id: id === undefined ? null : id });

  const methods = {
    hello: () => ({ jsonrpc: '2.0', result: 'Hello, world!', id }),
    echo: () => {
      if (Array.isArray(params)) return { jsonrpc: '2.0', result: params[0], id };
      if (params && typeof params === 'object') {
        if ('message' in params) return { jsonrpc: '2.0', result: params.message, id };
        return { jsonrpc: '2.0', result: params, id };
      }
      return { jsonrpc: '2.0', result: params, id };
    },
    sum: () => {
      if (!Array.isArray(params)) return sendError(-32602, 'Invalid params: expected array of numbers');
      const invalid = params.some(p => typeof p !== 'number');
      if (invalid) return sendError(-32602, 'Invalid params: all elements must be numbers');
      return { jsonrpc: '2.0', result: params.reduce((a, b) => a + b, 0), id };
    },
    subtract: () => {
      if (!params || typeof params !== 'object') return sendError(-32602, 'Invalid params: expected object');
      const minuend = params.minuend;
      const subtrahend = ('subtrahend' in params) ? params.subtrahend : 0;
      if (typeof minuend !== 'number' || typeof subtrahend !== 'number') return sendError(-32602, 'Invalid params: numbers required');
      return { jsonrpc: '2.0', result: minuend - subtrahend, id };
    },
    notify_log: () => { console.log('[notify_log]', params); return null; },
    divide: () => {
      if (!params || typeof params !== 'object') return sendError(-32602, 'Invalid params: expected object');
      const a = params.dividend !== undefined ? params.dividend : params.a;
      const b = params.divisor !== undefined ? params.divisor : params.b;
      if (typeof a !== 'number' || typeof b !== 'number') return sendError(-32602, 'Invalid params: numbers required');
      if (b === 0) return sendError(-32000, 'Division by zero');
      return { jsonrpc: '2.0', result: a / b, id };
    },
    status: () => ({ jsonrpc: '2.0', result: 'ok', id }),
    set: () => {
      if (!params || typeof params !== 'object' || typeof params.key !== 'string') return sendError(-32602, 'Invalid params: expected {key,value}');
      store[params.key] = params.value;
      return { jsonrpc: '2.0', result: true, id };
    },
    get: () => {
      if (!params || typeof params !== 'object' || typeof params.key !== 'string') return sendError(-32602, 'Invalid params: expected {key}');
      if (!(params.key in store)) return sendError(-32001, 'Key not found', { key: params.key });
      return { jsonrpc: '2.0', result: store[params.key], id };
    }
  };

  if (!method || typeof method !== 'string' || !(method in methods)) {
    return isNotification ? null : sendError(-32601, 'Method not found');
  }

  try {
    const res = methods[method]();
    if (isNotification) return null;
    if (res && res.error) return res;
    if (res === null) return null;
    return res;
  } catch (e) {
    return isNotification ? null : sendError(-32000, 'Server error', e.message);
  }
}

app.post('/rpc', (req, res) => {
  const body = req.body;
  if (body === undefined) {
    res.status(400).json({ jsonrpc: '2.0', error: makeError(-32700, 'Parse error'), id: null });
    return;
  }

  const isBatch = Array.isArray(body);
  if (isBatch) {
    if (body.length === 0) {
      res.json({ jsonrpc: '2.0', error: makeError(-32600, 'Invalid Request'), id: null });
      return;
    }
    const responses = [];
    for (const item of body) {
      const r = handleSingle(item);
      if (r !== null) responses.push(r);
    }
    if (responses.length === 0) {
      res.status(204).send();
    } else {
      res.json(responses);
    }
  } else {
    const r = handleSingle(body);
    if (r === null) {
      res.status(204).send();
    } else {
      res.json(r);
    }
  }
});

// JSON parse error handler
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    res.status(400).json({ jsonrpc: '2.0', error: makeError(-32700, 'Parse error'), id: null });
  } else {
    next(err);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('JSON-RPC server listening on port', port));
