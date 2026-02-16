import axios from 'axios';
import USER_AGENT from '../../public/config/userAgent';
import {
    WIKIBASE_ENTITY_DATA_API,
    WIKIBASE_REST_API,
} from '../../public/config/backends';

export const restApiClient = axios.create({
    baseURL: WIKIBASE_REST_API,
    headers: {
        'User-Agent': USER_AGENT,
    },
});

export const entityDataApiClient = axios.create({
    baseURL: WIKIBASE_ENTITY_DATA_API,
    headers: {
        'User-Agent': USER_AGENT,
    },
});
