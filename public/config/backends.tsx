// backends.tsx

export const backendConfig = {
    baseUrl: 'http://localhost:8000/v0', // Base URL of your backend
    cirrusSearch: '/api/wikidata', // API endpoint path
};

// We default to Wikidata endpoints
export const WIKIBASE_API_URL = 'https://www.wikidata.org/w/api.php';

export const WIKIBASE_REST_API =
    'https://www.wikidata.org/w/rest.php/wikibase/v1';

// This should be an endpoint containing the scientific article graph
export const WIKIBASE_SCHOLARLY_SPARQL_ENDPOINT =
    'https://query-scholarly.wikidata.org/sparql';
export const WIKIBASE_MAIN_SPARQL_ENDPOINT = 'https://query-main.wikidata.org/sparql';
// export const QLEVER_SPARQL_ENDPOINT = "";
