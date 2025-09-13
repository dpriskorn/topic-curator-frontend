import { entityDataApiClient } from '../components/apiClients';
import { Form } from './Form';

interface Representation {
    language: string;
    value: string;
}

interface FormData {
    id: string;
    representations: { [key: string]: Representation };
}

class Lexeme {
    public lid: string;

    constructor(lid: string) {
        // Remove "http://www.wikidata.org/entity/" if present
        lid = lid.replace(/^http:\/\/www\.wikidata\.org\/entity\//, '');

        // Validate the lid format
        if (!/^L\d+$/.test(lid)) {
            throw new Error(`Invalid lid: ${lid}. Expected format: "L1234".`);
        }

        this.lid = lid;
    }

    /**
     * Returns the Wikidata URL for the lexeme's LID.
     */
    get url(): string {
        return `https://www.wikidata.org/wiki/Lexeme:${this.lid}`;
    }

    /**
     * Fetches the forms of the lexeme using the ENTITY DATA API client.
     * We could also use wikibase-sdk, but it seems like a lot of overhead for just fetching forms 
     * https://github.com/maxlath/wikibase-sdk/blob/HEAD/docs/get_entities.md
     */
    async getForms(): Promise<Form[]> {
        try {
            const response = await entityDataApiClient.get(`/${this.lid}.json`);
            const lexemeData = response.data.entities?.[this.lid];

            if (!lexemeData || !lexemeData.forms) {
                throw new Error(`No forms found for lexeme ${this.lid}`);
            }

            return lexemeData.forms.map(
                (form: FormData) => new Form(form.id, form.representations),
            );
        } catch (error) {
            console.error(`Error fetching forms for ${this.lid}:`, error);
            return [];
        }
    }
}

export { Lexeme };
