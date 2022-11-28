export function shortenAddress(str = '') {
    return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shorten(str: string, key?: number | 'symbol' | 'name' | 'choice'): string {
    if (!str) return str;
    let limit;
    if (typeof key === 'number') limit = key;
    if (key === 'symbol') limit = 6;
    if (key === 'name') limit = 64;
    if (key === 'choice') limit = 12;
    if (limit)
        return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
    return shortenAddress(str);
}

export function loadStyle(url){
    let el = document.createElement("link");
    el.type = "text/css";
    el.rel = "stylesheet";
    el.href = url;
    document.head.appendChild(el);
}

export default {
    shortenAddress,
    shorten
}