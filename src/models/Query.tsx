import { WIKIDATA_SPARQL_ENDPOINT } from '../../public/config/sparql';
import apiClient from '../components/apiClient';
import { SparqlResponse } from '../types/sparql';
import { Item } from './Item';

export abstract class Query {
    items: Item[] = [];
    hasBeenRun: boolean = false;

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

        try {
            const response = await apiClient.get(WIKIDATA_SPARQL_ENDPOINT, {
                params: { query: this.wdqsQueryString, format: 'json' },
            });
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
