import { WIKIDATA_SPARQL_ENDPOINT } from '../../public/config/sparql';
import USER_AGENT from '../../public/config/userAgent';
import apiClient from '../components/apiClient';
import { SparqlResponse } from '../types/sparql';
import { CirrusSearch } from './CirrusSearch';
import { GoogleScholarSearch } from './GoogleScholarSearch';
import { SparqlItem } from './SparqlItem';

/* Term and Item are in CirrusSearch. Lang is in Item */
export class Query {
    limit: number;
    cirrussearch: CirrusSearch;
    items: SparqlItem[] = [];
    hasBeenRun: boolean = false;

    constructor(limit: number, cirrussearch: CirrusSearch) {
        this.limit = limit;
        this.cirrussearch = cirrussearch;
    }

    get itemCount(): number {
        return this.items.length;
    }

    /* TODO why not just use this.limit?  */
    get sparqlLimit(): number {
        return this.limit - this.itemCount;
    }

    private async execute(): Promise<SparqlResponse> {
        console.debug('execute: running');
        if (!this.wdqsQueryString) {
            throw new Error('no query string');
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

    private async runAndParseResults(): Promise<undefined> {
        console.debug('runAndParseResults: running');
        const items: SparqlItem[] = [];
        const results = await this.execute();

        if (!results || !results.results || !results.results.bindings) {
            console.warn('No results returned or results are undefined.');
        }

        for (const itemJson of results.results.bindings) {
            const item = new SparqlItem({
                qid: itemJson.item?.value || '',
                itemLabel: itemJson.itemLabel?.value || 'No label found',
                instanceOfLabel:
                    itemJson.instance_ofLabel?.value || 'No label found',
                publicationLabel:
                    itemJson.publicationLabel?.value || 'No label found',
                doi: itemJson.doi_id?.value || '',
                rawFullResources: itemJson.full_resources?.value || '',
                term: this.cirrussearch.term,
            });
            items.push(item);
        }
        this.items = items;
    }

    async runAndGetItems(): Promise<undefined> {
        console.debug('runAndGetItems: running');
        await this.runAndParseResults();
        this.hasBeenRun = true;
    }

    get generate279MinusLines(): string {
        const lines: string[] = [];
        for (let levels = 2; levels < 15; levels++) {
            const subpath = 'wdt:P921';
            let path = subpath;
            for (let i = 1; i < levels; i++) {
                path += `/${subpath}`;
            }
            lines.push(`\t\tMINUS {?item ${path} wd:${this.cirrussearch.item.qid}. }`);
        }
        return lines.join('\n');
    }

    get wdqsQueryString(): string {
        console.debug('wdqsQueryString: running');
        console.debug(
            `using cirrussearch_string: '${this.cirrussearch.escapedCirrussearchString}'`,
        );
        return `
            #${USER_AGENT}
            SELECT DISTINCT ?item ?itemLabel ?instance_ofLabel
            ?publicationLabel ?doi_id
            (GROUP_CONCAT(DISTINCT ?full_resource; separator=",") as ?full_resources)
            WHERE {
              hint:Query hint:optimizer "None".
              BIND(STR('${this.cirrussearch.escapedCirrussearchString}') as ?search_string)
              SERVICE wikibase:mwapi {
                bd:serviceParam wikibase:api "Search";
                                wikibase:endpoint "www.wikidata.org";
                                mwapi:srsearch ?search_string.
                ?title wikibase:apiOutput mwapi:title.
              }
              BIND(IRI(CONCAT(STR(wd:), ?title)) AS ?item)
              ?item wdt:P31 ?instance_of.
              OPTIONAL { ?item wdt:P1433 ?publication. }
              OPTIONAL { ?item wdt:P356 ?doi_id. }
              OPTIONAL { ?item wdt:P953 ?full_resource. }
              ${this.generate279MinusLines}
              SERVICE wikibase:label { bd:serviceParam wikibase:language "${this.cirrussearch.item.lang}". }
            }
            GROUP BY ?item ?itemLabel ?instance_ofLabel ?publicationLabel ?doi_id
            LIMIT ${this.sparqlLimit}
        `;
    }

    get getInTitleGoogleUrl(): string {
        return new GoogleScholarSearch(this.cirrussearch.term).inTitleUrl();
    }

    get getEverywhereGoogleUrl(): string {
        return new GoogleScholarSearch(this.cirrussearch.term).everywhereUrl();
    }

    /* Helper method */
    get wdqsUrl(): string {
        const encodedQuery = encodeURIComponent(this.wdqsQueryString);
        return `https://query.wikidata.org/#${encodedQuery}`;
    }
}
