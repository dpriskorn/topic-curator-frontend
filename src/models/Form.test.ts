// src/models/Form.test.ts
import { Form } from './Form';
import { Term } from './Term';
import { TermSource } from '../enums/TermSource';

describe('Form.getTermsByLanguage', () => {
    const form = new Form('F1', {
        rep1: { language: 'sv', value: 'springa' },
        rep2: { language: 'en', value: 'run' },
        rep3: { language: 'sv', value: 'löpa' },
    });

    it('returns Term instances for the given language', () => {
        const terms = form.getTermsByLanguage('sv');
        expect(terms).toHaveLength(2);
        expect(terms[0]).toBeInstanceOf(Term);
        expect(terms[0].string).toBe('springa');
        expect(terms[1].string).toBe('löpa');
        expect(terms[0].source).toBe(TermSource.FORM);
    });

    it('returns an empty array if no representation matches the language', () => {
        const terms = form.getTermsByLanguage('de');
        expect(terms).toEqual([]);
    });
});
