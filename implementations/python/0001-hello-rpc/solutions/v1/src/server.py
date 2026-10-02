#!/usr/bin/env python3
import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get('PORT', '4000'))

class Handler(BaseHTTPRequestHandler):
    def _send_json(self, obj, code=200):
        data = json.dumps(obj).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        try:
            req = json.loads(body)
        except Exception:
            self._send_json({'jsonrpc':'2.0','error':{'code':-32700,'message':'Parse error'},'id':None}, code=400)
            return

        # Minimal validation
        if req.get('jsonrpc') != '2.0':
            self._send_json({'jsonrpc':'2.0','error':{'code':-32600,'message':'Invalid Request'},'id':req.get('id', None)})
            return

        method = req.get('method')
        if method == 'hello':
            if 'id' in req:
                resp = {'jsonrpc':'2.0','result':'Hello, world!','id':req.get('id')}
                self._send_json(resp)
            else:
                # notification: no response
                self.send_response(204)
                self.end_headers()
        else:
            self._send_json({'jsonrpc':'2.0','error':{'code':-32601,'message':'Method not found'},'id':req.get('id', None)})

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', PORT), Handler)
    print(f'Python JSON-RPC hello server listening on {PORT}')
    server.serve_forever()
