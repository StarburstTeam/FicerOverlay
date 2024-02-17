class Config {
    constructor(path, defaultValue) {
        this.configPath = null;
        this.path = path;
        this.defaultValue = defaultValue == null ? {} : defaultValue
    }
    getPath = async () => {
        if (this.configPath === null) {
            this.configPath = await tauri.path.appConfigDir();
            if (!await tauri.fs.exists(this.configPath))
                await tauri.fs.createDir(this.configPath);
        }
        return this.configPath + this.path;
    }
    load = async () => {
        let path = await this.getPath();
        if (!await tauri.fs.exists(path)) {
            this.config = this.defaultValue
            return false;
        }
        let data = await tauri.fs.readTextFile(path);
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
        await tauri.fs.writeTextFile(await this.getPath(), JSON.stringify(this.config))
    }
}

window.Config = Config;