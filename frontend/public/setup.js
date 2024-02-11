import { Config } from "./config"
import { $ } from "./global"
import { I18n } from "./i18n"

const config = new Config(`config.json`, {
    lang: 'en_us',
    lang_hypixel: 'en_us',
    ign: '',
    logPath: '',
    apiKey: '',
    lastType: 'bw',
    lastSub: '',
    autoShrink: true,
    notification: true,
});

let i18n = null;
window.onload = async () => {
    $.id('minimize').onclick = _ => window.__TAURI__.window.appWindow.minimize();
    $.id('quit').onclick = _ => window.__TAURI__.window.appWindow.close();

    await config.load();
    i18n = new I18n(config.get('lang'));
    await i18n.load();
    i18n.initPage();

    $.id('setting_change_log_path').onclick = _ => selectLogFile();
    $.id('lang').onclick = async _ => {
        i18n.set($.id('lang').value);
        await i18n.load();
        i18n.initPage();
    }
    $.id('done').onclick = async _ => {
        await config.set('lang', $.id('lang').value);
        await config.set('lang_hypixel', $.id('lang_hypixel').value);
        await config.set('ign', $.id('ign').value);
        await config.set('logPath', $.id('logpath').value);
        await config.set('apiKey', $.id('apikey').value);

        window.location.href = 'index.html';
    }
}

const selectLogFile = async () => {
    let temppath = await window.__TAURI__.dialog.open({
        multiple: false,
        title: i18n.now().hud_select_log_file_title,
        filters: [{
            name: 'Log file',
            extensions: ['latest.log']
        }]
    });
    if (temppath != null)
        $.id('logpath').value = temppath.split('\\').join('/');
}