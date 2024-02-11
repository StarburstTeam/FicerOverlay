import { fetch } from "@tauri-apps/api/http";

export let blacklist = {};

export const loadBlacklist = async () => {
    blacklist = await fetch("https://starburst.iafenvoy.net/blacklist.json")
        .then(res => res.data);
}