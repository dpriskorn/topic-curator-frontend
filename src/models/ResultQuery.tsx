import USER_AGENT from '../../public/config/userAgent';
import { CirrusSearch } from './CirrusSearch';
import { GoogleScholarSearch } from './GoogleScholarSearch';
import { Query } from './Query';
import { ResultItem } from './ResultItem';

/* Term and Item are in CirrusSearch. Lang is in Item */
export class ResultQuery extends Query {
    items: ResultItem[] = [];
    limit: number = 10000;
    cirrussearch: CirrusSearch;

    constructor(
        use_scholarly_endpoint: boolean, limit: number,
        cirrussearch: CirrusSearch,
    ) {
        super(use_scholarly_endpoint); // Call the parent class constructor if any
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

    protected async runAndParseResults(): Promise<undefined> {
        console.debug('runAndParseResults: running');
        const items: ResultItem[] = [];
        const results = await this.execute();

        if (!results || !results.results || !results.results.bindings) {
            console.warn('No results returned or results are undefined.');
        }

        for (const itemJson of results.results.bindings) {
            const item = new ResultItem({
                qid: itemJson.item?.value || '',
                lang: this.cirrussearch.item.lang,
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

    get generate279MinusLines(): string {
        const lines: string[] = [];
        for (let levels = 2; levels < 15; levels++) {
            const subpath = 'wdt:P921';
            let path = subpath;
            for (let i = 1; i < levels; i++) {
                path += `/${subpath}`;
            }
            lines.push(
                `\t\tMINUS {?item ${path} wd:${this.cirrussearch.item.qid}. }`,
            );
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
}
