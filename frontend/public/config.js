class Config {
    constructor(path, defaultValue) {
        this.path = path;
        this.defaultValue = defaultValue == null ? {} : defaultValue
    }
    load = async () => {
        this.path = await window.__TAURI__.path.appConfigDir() + this.path;
        if (!await window.__TAURI__.fs.exists(this.path)) {
            this.config = this.defaultValue
            return false;
        }
        let data = await window.__TAURI__.fs.readTextFile(this.path);
        this.config = JSON.parse(data);
        console.log(this.config);
        return true;
    }
    get = (name) => {
        if (this.config[name] == null) {
            if (this.defaultValue[name] != null) {
                this.config[name] = this.defaultValue[name];
                return this.config[name];
            } else return null;
        } else return this.config[name];
    }
    set = async (name, val) => {
        console.log(name, val);
        this.config[name] = val;
        await window.__TAURI__.fs.writeTextFile(this.path, JSON.stringify(this.config))
    }
}

window.Config = Config;