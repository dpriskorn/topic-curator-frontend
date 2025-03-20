import axios from 'axios';
import USER_AGENT from '../../public/config/userAgent';
import { WIKIBASE_ACTION_API, WIKIBASE_REST_API } from '../../public/config/backends';

export const restApiClient = axios.create({
    baseURL: WIKIBASE_REST_API,
    headers: {
        'User-Agent': USER_AGENT,
    },
});

export const actionApiClient = axios.create({
    baseURL: WIKIBASE_ACTION_API,
    headers: {
        'User-Agent': USER_AGENT,
    },
});
