import { Item } from "./Item";
import { Term } from "./Term";
import { Subgraph } from "../enums/Subgraph";
import { prefixConfig } from "../../public/config/prefix";
import { backendConfig } from '../../public/config/backends';
import axios from "axios";

/* This class is needed to construct the correct CirrusSearch strings used in WDQS SPARQL*/
export class CirrusSearch {
    item: Item;
    term: Term;
    subgraph: Subgraph;
    userPrefix: string;
    affix: string;

    constructor(
        topic: Item,
        term: Term,
        subgraph: Subgraph = Subgraph.SCIENTIFIC_ARTICLES,
        userPrefix: string = '',
        affix: string = '',
    ) {
        this.item = topic;
        this.term = term;
        this.subgraph = subgraph;
        this.userPrefix = userPrefix;
        this.affix = affix;
    }

    get buildPrefix(): string {
        if (this.userPrefix) {
            return this.userPrefix;
        }
        const prefixTemplate = prefixConfig[this.subgraph];
        return prefixTemplate
            ? prefixTemplate.replace('{0}', this.item.qid)
            : '';
    }

    get escapedCirrussearchString(): string {
        return `${CirrusSearch.escapeQuotes(this.buildPrefix)} inlabel:"${CirrusSearch.escapeQuotes(this.term.string)}" ${CirrusSearch.escapeQuotes(this.affix)}`;
    }

    get cirrussearchString(): string {
        return `${this.buildPrefix} inlabel:"${this.term.string}" ${this.affix}`;
    }

    static escapeQuotes(input: string): string {
        return input.replace(/'/g, "\\'").replace(/"/g, '\\"');
    }

    async totalHits(): Promise<string> {
        console.debug('Getting CirrusSearch total');

        if (!this.term.string) {
            console.debug("Empty term string, returning 'N/A'.");
            return 'N/A';
        }

        const backendUrl = `${backendConfig.baseUrl}${backendConfig.cirrusSearch}`;
        const params = { srsearch: this.cirrussearchString };

        try {
            const response = await axios.get(backendUrl, { params });
            const totalHits = response.data?.query?.searchinfo?.totalhits || 0;
            console.debug(`CirrusSearch total: ${totalHits}`);
            return totalHits.toString();
        } catch (error) {
            console.error(`Unable to fetch data from backend: ${error}`);
            return 'Error';
        }
    }

    get url(): string {
        console.debug('CirrusSearch:url: running');
        const searchString = this.cirrussearchString;
        console.debug('CirrusSearch String:', searchString);

        if (!searchString) {
            console.error('cirrussearchString is undefined or empty!');
            return '';
        }

        const url = `https://www.wikidata.org/w/index.php?search=${encodeURIComponent(searchString)}&title=Special%3ASearch&profile=advanced&fulltext=1&ns0=1`;
        console.debug('Generated CirrusSearch URL:', url);
        return url;
    }
}
