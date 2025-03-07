import { Item } from './Item';
import { Query } from './Query';
import { SubtopicItem } from './SubtopicItem';

export class SubtopicQuery extends Query {
    item: Item;
    limit: number = 1000;
    items: SubtopicItem[] = [];

    constructor(item: Item) {
        super(); // Call the parent class constructor if any
        this.item = item;
    }

    get wdqsQueryString(): string {
        return `
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>

    SELECT ?item ?itemLabel ?itemDescription
    WHERE {
      ?item wdt:P279 wd:${this.item.qid}.

      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "${this.item.lang}".
        ?item rdfs:label ?itemLabel.
        ?item schema:description ?itemDescription.
      }
    }
    `;
    }

    protected async runAndParseResults(): Promise<undefined> {
        console.debug('runAndParseResults: running');
        const items: SubtopicItem[] = [];
        const results = await this.execute();

        if (!results || !results.results || !results.results.bindings) {
            console.warn('No results returned or results are undefined.');
        }

        for (const itemJson of results.results.bindings) {
            const item = new SubtopicItem({
                qid: itemJson.item?.value || '',
                lang: this.item.lang,
                label: itemJson.itemLabel?.value || 'No label found',
                description:
                    itemJson.itemDescription?.value || 'No description found',
            });
            items.push(item);
        }
        this.items = items;
    }

    async fetchSubtopics(): Promise<void> {
        console.debug(`Fetching subtopics for ${this.item.qid}`);
        await this.runAndGetItems();
    }

    async fetchAndParse(): Promise<void> {
        await this.fetchSubtopics();
    }
}
