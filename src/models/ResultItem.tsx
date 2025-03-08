import { Item } from "./Item";
import { Term } from "./Term";

class ResultItem extends Item {
    // qid is inherited
    itemLabel: string;
    instanceOfLabel: string;
    publicationLabel: string;
    doi: string;
    rawFullResources: string;
    // term is needed for highlighting
    term: Term;
    cleanedItemLabel: string;

    constructor({
        qid,
        itemLabel = 'No label found',
        instanceOfLabel = 'No label found',
        publicationLabel = 'No label found',
        doi = '',
        rawFullResources = '',
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
        this.cleanedItemLabel = '';
    }

    get highlightedItemLabel(): string {
        if (this.itemLabel !== 'No label found') {
            // Escape special characters in term.string to avoid regex errors
            const escapedTerm = this.term.string.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&',
            );
            const highlightStr = new RegExp(`\\b${escapedTerm}\\b`, 'gi');

            return this.itemLabel.replace(
                highlightStr,
                (match) => `<mark>${match}</mark>`,
            );
        } else {
            return this.itemLabel;
        }
    }

    get highlightSuccess(): boolean {
        return this.highlightedItemLabel.includes('<mark>');
    }

    /**
     * Returns the DOI URL if the QID corresponds to a DOI entity.
     */
    get doiUrl(): string {
        return `https://doi.org/${this.doi}`;
    }
}
export { ResultItem };