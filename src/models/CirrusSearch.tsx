import { Item } from "./Item";
import { Term } from "./Term";
import { Subgraph } from "../enums/Subgraph";
import { prefixConfig } from "../../public/config/prefix";
import axios from "axios";

export class CirrusSearch {
    topic: Item;
    term: Term;
    subgraph: Subgraph;
    userPrefix: string;
    affix: string;

    constructor(
        topic: Item,
        term: Term,
        subgraph: Subgraph,
        userPrefix: string = "",
        affix: string = ""
    ) {
        this.topic = topic;
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
        return prefixTemplate ? prefixTemplate.replace("{0}", this.topic.qid) : "";
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

    async cirrussearchTotal(): Promise<number> {
        console.debug("Getting CirrusSearch total");

        if (!this.term.string) {
            console.debug("Empty term string, returning 0.");
            return 0;
        }

        const baseUrl = "https://www.wikidata.org/w/api.php";
        const params = {
            action: "query",
            format: "json",
            list: "search",
            formatversion: "2",
            srsearch: this.cirrussearchString,
            srlimit: "1",
            srprop: "size",
        };

        try {
            const response = await axios.get(baseUrl, { params });
            const totalHits = response.data?.query?.searchinfo?.totalhits || 0;
            console.debug(`CirrusSearch total: ${totalHits}`);
            return totalHits;
        } catch (error) {
            console.error(`Unable to fetch data: ${error}`);
            return 0;
        }
    }

    get cirrussearchUrl(): string {
        console.debug("Accessing cirrussearchUrl getter...");
        const searchString = this.cirrussearchString;
        console.debug("CirrusSearch String:", searchString);
    
        if (!searchString) {
            console.error("cirrussearchString is undefined or empty!");
            return "";
        }
    
        const url = `https://www.wikidata.org/w/index.php?search=${encodeURIComponent(searchString)}&title=Special%3ASearch&profile=advanced&fulltext=1&ns0=1`;
        console.debug("Generated CirrusSearch URL:", url);
        return url;
    }
}
