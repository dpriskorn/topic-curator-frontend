import { describe, it, expect, beforeEach } from 'vitest';
import { Query } from '../models/Query';
import { Term } from '../models/Term';
import { TermSource } from '../enums/TermSource';
import { Item } from '../models/Item';
import { CirrusSearch } from '../models/CirrusSearch';

describe('Query', () => {
    let term: Term, cirrussearch: CirrusSearch, query: Query;

    beforeEach(() => {
        term = new Term('example term', TermSource.ALIAS);
        cirrussearch = new CirrusSearch(
            new Item('Q123'),
            term,
        );
        query = new Query(10, cirrussearch);
    });

    it('should initialize Query with given parameters', () => {
        expect(query).toBeDefined();
        expect(query.limit).toBe(10);
        expect(query.cirrussearch.item.qid).toBe('Q123');
    });

    it('should generate the correct CirrusSearch URL', () => {
        expect(query.cirrussearch.url).toContain(
            'https://www.wikidata.org/w/index.php?search=',
        );
    });

    it('should correctly escape CirrusSearch strings', () => {
        expect(query.cirrussearch.escapedCirrussearchString).toContain(
            'inlabel:"example term"',
        );
    });
});
