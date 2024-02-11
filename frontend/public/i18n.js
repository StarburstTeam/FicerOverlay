import { $ } from "./global";
import { EN_US } from "./lang/en_us";
import { ZH_CN } from "./lang/zh_cn";

export class I18n {
    constructor(current) {
        this.current = current;
    }
    load = async () => {
        this.data = {};
        for (let d of [EN_US, ZH_CN])
            this.data[d.id] = d;
    }
    now = () => this.data[this.current].values;
    games = () => this.data[this.current].games;
    template = () => this.data[this.current].template;
    titleMode = () => this.data[this.current].titleMode;
    set = (id) => this.current = id;
    initPage = () => {
        console.log(this.data);
        console.log(this.current);
        Object.keys(this.data[this.current].page).forEach((i) => {
            let e = $.id(i);
            if (e != null) e.innerHTML = this.data[this.current].page[i];
        });
    }
    getMainModeHTML = () => this.data[this.current].mode.reduce((p, c) => p + `<option value="${c.id}">${c.name}</option>`, '');
}