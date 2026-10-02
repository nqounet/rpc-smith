package main

import (
    "encoding/json"
    "io/ioutil"
    "log"
    "net/http"
    "os"
)

type Request struct {
    JSONRPC string          `json:"jsonrpc"`
    Method  string          `json:"method"`
    Params  json.RawMessage `json:"params,omitempty"`
    ID      *json.RawMessage `json:"id,omitempty"`
}

func writeJSON(w http.ResponseWriter, v interface{}) {
    data, _ := json.Marshal(v)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(data)
}

func handler(w http.ResponseWriter, r *http.Request) {
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "", http.StatusBadRequest)
        return
    }
    var req Request
    if err := json.Unmarshal(body, &req); err != nil {
        writeJSON(w, map[string]interface{}{"jsonrpc":"2.0","error":map[string]interface{}{"code":-32700,"message":"Parse error"},"id":nil})
        return
    }
    if req.JSONRPC != "2.0" {
        writeJSON(w, map[string]interface{}{"jsonrpc":"2.0","error":map[string]interface{}{"code":-32600,"message":"Invalid Request"},"id":req.ID})
        return
    }
    if req.Method == "hello" {
        if req.ID == nil {
            w.WriteHeader(http.StatusNoContent)
            return
        }
        // echo id as-is
        var id interface{}
        _ = json.Unmarshal(*req.ID, &id)
        writeJSON(w, map[string]interface{}{"jsonrpc":"2.0","result":"Hello, world!","id":id})
        return
    }
    writeJSON(w, map[string]interface{}{"jsonrpc":"2.0","error":map[string]interface{}{"code":-32601,"message":"Method not found"},"id":req.ID})
}

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "4000"
    }
    http.HandleFunc("/rpc", handler)
    log.Printf("Go JSON-RPC hello server listening on %s", port)
    log.Fatal(http.ListenAndServe(":"+port, nil))
}
