import { Item } from './Item';

class SubtopicItem extends Item {
    label: string;
    description: string;

    constructor({
        qid,
        lang = 'en',
        label = 'No label found',
        description = 'No description available',
    }: {
        qid: string;
        lang: string;
        label: string;
        description: string;
    }) {
        super(qid);
        super(lang);
        this.label = label;
        this.description = description;
    }
}

export { SubtopicItem };
