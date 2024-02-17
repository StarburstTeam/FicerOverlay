let blacklist = {};

const loadBlacklist = async () => {
    blacklist = await tauri.http.fetch("https://starburst.iafenvoy.net/blacklist.json")
        .then(res => res.data);
}