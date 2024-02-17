class Tail {
    constructor(path, callback) {
        this.path = path;
        this.callback = callback;
        tauri.tauri.invoke('tail_file', { path: this.path })
        tauri.event.listen('log-line', event => callback(event.payload.data))
    }
}