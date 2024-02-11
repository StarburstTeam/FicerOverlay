import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'

export class Tail {
    constructor(path, callback) {
        this.path = path;
        this.callback = callback;
        invoke('tail_file', { path: this.path })
        listen('log-line', event => callback(event.payload.data))
    }
}