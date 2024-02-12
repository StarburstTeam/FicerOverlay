class Tail {
    constructor(path, callback) {
        this.path = path;
        this.callback = callback;
        window.__TAURI__.tauri.invoke('tail_file', { path: this.path })
        window.__TAURI__.event.listen('log-line', event => callback(event.payload.data))
    }
}