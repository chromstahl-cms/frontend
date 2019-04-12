import { HttpClient } from "../HttpClient";
import { Resolver } from "@kloudsoftware/eisen";

// Types used for clarity in data structures
export type Locale = string;
export type Key = string;

export class ApiResolver implements Resolver {
    private const i18nEndpoint: string = "/i18n";
    private httpClient: HttpClient;
    private cache: Map<Locale, Map<Key, string>>;

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
        this.cache = new Map();
    }

    getPrefix(): string {
        return "$_"
    }

    get(key: string, locale: string): string {
        const fromCache = this.getFromCache(locale, key);
        if (fromCache != undefined) {
            return fromCache;
        }
    }

    private getFromCache(locale: Locale, key: Key): string | undefined {
        if (!this.cache.has(locale)) return undefined;

        const keyMap = this.cache.get(locale);
        return keyMap.get(key);
    }

    private loadFromApiAndPutIntoCache(locale: Locale, key: Key): string | undefined {
        this.httpClient.peformGet(this.buildEndpoint(locale, key));
    }

    private buildEndpoint(locale: Locale, key: Key): string {
        return `${this.i18nEndpoint}/locale/key`;
    }
}
