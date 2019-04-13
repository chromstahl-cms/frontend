import { HttpClient } from "../HttpClient";
import { I18nCache } from "./cache";
import { Resolver } from "@kloudsoftware/eisen";

class TranslationDTO {
    locale: string
    key: string;
    value: string
}

const i18nEndpoint: string = "/i18n";
export class ApiResolver extends Resolver {
    private httpClient: HttpClient;
    private cache: I18nCache;

    constructor(httpClient: HttpClient, cache: I18nCache) {
        super();
        this.httpClient = httpClient;
        this.cache = cache;
    }

    async get(key: string, locale: string): Promise<string> {
        const resp = await this.httpClient.performGet(this.buildEndpoint(locale, key));

        const dto = (await resp.json()) as TranslationDTO;
        this.cache.putIntoCache(dto.locale, dto.key, dto.value)

        return dto.value;
    }

    private buildEndpoint(locale: string, key: string): string {
        return `${i18nEndpoint}/locale/key`;
    }
}
