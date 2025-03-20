import { WIKIBASE_MAIN_SPARQL_ENDPOINT } from '../../public/config/backends';
import { WIKIBASE_SCHOLARLY_SPARQL_ENDPOINT } from '../../public/config/backends';
import apiClient from '../components/apiClient';
import { SparqlResponse } from '../types/sparql';
import { Item } from './Item';

export abstract class Query {
    use_scholarly_endpoint: boolean;
    items: Item[] = [];
    hasBeenRun: boolean = false;

    // This is mandatory for all instantiations
    constructor(use_scholarly_endpoint: boolean) {
        this.use_scholarly_endpoint = use_scholarly_endpoint;
    }

    get itemCount(): number {
        return this.items.length;
    }

    // Enforce implementation by subclasses
    abstract get wdqsQueryString(): string;

    protected async execute(): Promise<SparqlResponse> {
        console.debug('execute: running');
        if (!this.wdqsQueryString) {
            throw new Error('No query string provided');
        }
        console.debug('wdqsQueryString:', this.wdqsQueryString);

        // Select the endpoint based on use_scholarly_endpoint flag
        const endpoint = this.use_scholarly_endpoint
            ? WIKIBASE_SCHOLARLY_SPARQL_ENDPOINT
            : WIKIBASE_MAIN_SPARQL_ENDPOINT;

        console.debug(`Selected SPARQL endpoint: ${endpoint}`);

        try {
            const response = await apiClient.get(endpoint, {
                params: { query: this.wdqsQueryString, format: 'json' },
            });
            console.debug('SPARQL response received:', response.data);
            return response.data;
        } catch (error) {
            console.error('SPARQL query failed:', error);
            throw new Error('SPARQL execution failed');
        }
    }

    // Enforce implementation by subclasses
    protected abstract runAndParseResults(): Promise<void>;

    async runAndGetItems(): Promise<void> {
        console.debug('runAndGetItems: running');
        await this.runAndParseResults();
        this.hasBeenRun = true;
    }

    /* Helper method */
    get wdqsUrl(): string {
        const encodedQuery = encodeURIComponent(this.wdqsQueryString);
        return `https://query.wikidata.org/#${encodedQuery}`;
    }
}
