import { CirrusSearch } from "./CirrusSearch";
import { Subgraph } from "../enums/Subgraph";
import { Term } from "./Term";
import { Terms } from "./Terms";
import { Item } from "./Item";

export class TopicParameters {
    topic: Item;
    limit: number;
    terms: Terms;
    subgraph: Subgraph;
    userPrefix: string;
    affix: string;

    constructor(
        topic: Item,
        limit: number,
        terms: Terms,
        subgraph: Subgraph,
        userPrefix: string = "",
        affix: string = ""
    ) {
        this.topic = topic;
        this.limit = limit;
        this.terms = terms;
        this.subgraph = subgraph;
        this.userPrefix = userPrefix;
        this.affix = affix;
    }

    getCirrusSearch(term: Term): CirrusSearch {
        if (!term) {
            throw new Error("no term");
        }
        const searchInstance = new CirrusSearch(
            this.topic,
            term,
            this.subgraph,  // Correct position
            this.userPrefix,
            this.affix
        );
        console.debug("Constructed CirrusSearch instance:", searchInstance);
        return searchInstance;
    }
}
