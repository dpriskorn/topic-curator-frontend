import { Item } from "./Item";
import { Term } from "./Term";

export default class SparqlItem extends Item {
    // qid is inherited
    itemLabel: string;
    instanceOfLabel: string;
    publicationLabel: string;
    doi: string;
    rawFullResources: string;
    term: Term;
    cleanedItemLabel: string;

    constructor({
        qid,
        itemLabel = "No label found",
        instanceOfLabel = "No label found",
        publicationLabel = "No label found",
        doi = "",
        rawFullResources = "",
        term,
    }: {
        qid: string;
        itemLabel?: string;
        instanceOfLabel?: string;
        publicationLabel?: string;
        doi?: string;
        rawFullResources?: string;
        term: Term;
    }) {
        super(qid);
        this.itemLabel = itemLabel;
        this.instanceOfLabel = instanceOfLabel;
        this.publicationLabel = publicationLabel;
        this.doi = doi;
        this.rawFullResources = rawFullResources;
        this.term = term;
        this.cleanedItemLabel = "";
    }

    get highlightedItemLabel(): string {
        if (this.itemLabel !== "No label found") {
            const highlightList = [this.term.string];
            const highlightStr = new RegExp(`\b(?:${highlightList.join('|')})\b`, 'gi');
            
            return this.itemLabel.replace(highlightStr, (match) => `<mark>${match}</mark>`);
        } else {
            return this.itemLabel;
        }
    }
}
