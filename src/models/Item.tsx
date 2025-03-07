import apiClient from "../components/apiClient";
import { Term } from "./Term";
import { TermSource } from "../enums/TermSource";

class Item {
    public qid: string;
    public lang: string;

    constructor(qid: string, lang: string = 'en') {
        // Remove "http://www.wikidata.org/entity/" if present
        qid = qid.replace(/^http:\/\/www\.wikidata\.org\/entity\//, '');

        // Validate the qid format
        if (!/^Q\d+$/.test(qid)) {
            throw new Error(`Invalid qid: ${qid}. Expected format: "Q1234".`);
        }

        this.qid = qid;
        this.lang = lang;
    }
    /**
     * Returns the Wikidata URL for the item's QID.
     */
    get qidUrl(): string {
        return `https://www.wikidata.org/wiki/${this.qid}`;
    }
    /**
     * Fetches aliases for the given QID and returns them as Term instances.
     */
    async fetchAliasTerms(): Promise<Term[]> {
        try {
            const aliasesUrl = `/entities/items/${this.qid}/aliases`;
            const response = await apiClient.get(aliasesUrl);

            if (response.status === 200) {
                const aliasStrings: string[] = response.data[this.lang] || [];
                return aliasStrings.map(
                    (alias) => new Term(alias, TermSource.ALIAS),
                );
            } else {
                throw new Error(`Aliases fetch error: ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Failed to fetch aliases: ${error}`);
        }
    }
    /**
     * Fetches the description for the given QID in the specified language.
     */
    async fetchDescription(): Promise<string> {
        try {
            const descriptionUrl = `/entities/items/${this.qid}/descriptions`;
            const response = await apiClient.get(descriptionUrl);

            if (response.status === 200) {
                return (
                    response.data[this.lang] ||
                    'No description yet, please improve'
                );
            } else {
                throw new Error(`Description fetch error: ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Description fetch error: ${error}`);
        }
    }
    /**
     * Fetches the label for the given QID in the specified language.
     */
    async fetchLabel(): Promise<string> {
        try {
            const descriptionUrl = `/entities/items/${this.qid}/labels`;
            const response = await apiClient.get(descriptionUrl);

            if (response.status === 200) {
                return (
                    response.data[this.lang] ||
                    'No label yet, please improve'
                );
            } else {
                throw new Error(`Label fetch error: ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Label fetch error: ${error}`);
        }
    }
}

export { Item };