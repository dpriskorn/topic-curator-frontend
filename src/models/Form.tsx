import { TermSource } from "../enums/TermSource";
import { Term } from "./Term";

class Form {
    public id: string;
    public representations: Record<string, { language: string; value: string }>;

    constructor(
        id: string,
        representations: Record<string, { language: string; value: string }>,
    ) {
        this.id = id;
        this.representations = representations;
    }
    
    getTermsByLanguage(language: string): Term[] {
        return Object.values(this.representations)
            .filter((rep) => rep.language === language)
            .map((rep) => new Term(rep.value, TermSource.FORM));
    }
}

export { Form };
