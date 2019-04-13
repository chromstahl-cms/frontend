import { Resolver } from "@kloudsoftware/eisen";

// Types used for clarity in data structures
export type Locale = string;
export type Key = string;

export class I18nCache {
    private cache: Map<Locale, Map<Key, string>>;

    constructor() {
        this.cache = new Map();
    }

    public putIntoCache(locale: Locale, key: Key, value: string) {
        const localeResults = this.cache.get(locale);

        if (localeResults == undefined) {
            const keyMap = new Map<Key, string>();
            keyMap.set(key, value);
            this.cache.set(locale, keyMap);
            return;
        }

        localeResults.set(key, value);
    }

    public getFromCache(locale: Locale, key: Key): string | undefined {
        const localeResults = this.cache.get(locale);
        if (localeResults == undefined) return undefined;

        return localeResults.get(key);
    }
}

export class CacheResolver extends Resolver {
    private cache: I18nCache;

    constructor(cache: I18nCache) {
        super();
        this.cache = cache;
    }

    get(key: string, locale: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const match = this.cache.getFromCache(locale, key);
            if (match == undefined) {
                reject(`No match for ${key} in ${locale} in cache found`);
                return;
            }

            resolve(match);
        });
    }
}
