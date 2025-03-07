import { describe, it, expect } from 'vitest';
import { ResultItem } from './ResultItem';
import { Term } from './Term';
import { TermSource } from '../enums/TermSource';

describe('ResultItem', () => {
    it('should initialize with default values', () => {
        const term = new Term('test', TermSource.USER);
        const item = new ResultItem({
            qid: 'Q1',
            term,
        });

        expect(item.qid).toBe('Q1');
        expect(item.itemLabel).toBe('No label found');
        expect(item.instanceOfLabel).toBe('No label found');
        expect(item.publicationLabel).toBe('No label found');
        expect(item.doi).toBe('');
        expect(item.rawFullResources).toBe('');
        expect(item.term).toBe(term);
        expect(item.cleanedItemLabel).toBe('');
    });

    it('should allow custom initialization', () => {
        const term = new Term('science', TermSource.USER);
        const item = new ResultItem({
            qid: 'Q42',
            itemLabel: 'Quantum Science',
            instanceOfLabel: 'Concept',
            publicationLabel: 'Nature',
            doi: '10.1234/example',
            rawFullResources: 'resource-data',
            term,
        });

        expect(item.qid).toBe('Q42');
        expect(item.itemLabel).toBe('Quantum Science');
        expect(item.instanceOfLabel).toBe('Concept');
        expect(item.publicationLabel).toBe('Nature');
        expect(item.doi).toBe('10.1234/example');
        expect(item.rawFullResources).toBe('resource-data');
        expect(item.term).toBe(term);
        expect(item.cleanedItemLabel).toBe('');
    });

    it('should highlight term in itemLabel', () => {
        const term = new Term('Science', TermSource.USER);
        const item = new ResultItem({
            qid: 'Q42',
            itemLabel: 'Quantum Science and Technology',
            term,
        });

        expect(item.highlightedItemLabel).toBe(
            'Quantum <mark>Science</mark> and Technology',
        );
    });

    it('should not modify itemLabel if no match is found', () => {
        const term = new Term('Physics', TermSource.USER);
        const item = new ResultItem({
            qid: 'Q42',
            itemLabel: 'Quantum Science and Technology',
            term,
        });

        expect(item.highlightedItemLabel).toBe(
            'Quantum Science and Technology',
        );
    });

    it("should not highlight 'No label found'", () => {
        const term = new Term('Science', TermSource.USER);
        const item = new ResultItem({
            qid: 'Q42',
            term,
        });

        expect(item.highlightedItemLabel).toBe('No label found');
    });
});
