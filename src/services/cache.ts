import NodeCache from 'node-cache';

export class CacheService {
    public static cache: NodeCache;

    public static init() {
        CacheService.cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
    }
}