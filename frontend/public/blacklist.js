let blacklist = {};

const loadBlacklist = async () => {
    blacklist = await window.__TAURI__.http.fetch("https://starburst.iafenvoy.net/blacklist.json")
        .then(res => res.data);
}