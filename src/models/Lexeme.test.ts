// __tests__/Lexeme.test.ts
import { entityDataApiClient } from '../components/apiClients';
import { Form } from './Form';
import { Lexeme } from './Lexeme';

jest.mock('../components/apiClients', () => ({
    entityDataApiClient: {
        get: jest.fn(),
    },
}));

describe('Lexeme', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('removes the URL prefix if present', () => {
            const lexeme = new Lexeme('http://www.wikidata.org/entity/L123');
            expect(lexeme.lid).toBe('L123');
        });

        it('accepts a valid LID without prefix', () => {
            const lexeme = new Lexeme('L456');
            expect(lexeme.lid).toBe('L456');
        });

        it('throws an error for invalid LID', () => {
            expect(() => new Lexeme('Q123')).toThrow(
                'Invalid lid: Q123. Expected format: "L1234".',
            );
        });
    });

    describe('url', () => {
        it('returns the correct Wikidata URL', () => {
            const lexeme = new Lexeme('L789');
            expect(lexeme.url).toBe(
                'https://www.wikidata.org/wiki/Lexeme:L789',
            );
        });
    });

    describe('getForms', () => {
        it('returns form instances from API response', async () => {
            const mockForms = [
                {
                    id: 'F1',
                    representations: {
                        en: { language: 'en', value: 'test' },
                    },
                },
            ];

            (entityDataApiClient.get as jest.Mock).mockResolvedValue({
                data: {
                    entities: {
                        L123: {
                            forms: mockForms,
                        },
                    },
                },
            });

            const lexeme = new Lexeme('L123');
            const forms = await lexeme.getForms();

            expect(forms).toHaveLength(1);
            expect(forms[0]).toBeInstanceOf(Form);
            expect(forms[0].id).toBe('F1');
        });

        it('returns an empty array if no forms are found', async () => {
            (entityDataApiClient.get as jest.Mock).mockResolvedValue({
                data: {
                    entities: {
                        L123: {},
                    },
                },
            });

            const lexeme = new Lexeme('L123');
            const forms = await lexeme.getForms();

            expect(forms).toEqual([]);
        });

        it('returns an empty array on API error', async () => {
            (entityDataApiClient.get as jest.Mock).mockRejectedValue(
                new Error('Network error'),
            );

            const lexeme = new Lexeme('L123');
            const forms = await lexeme.getForms();

            expect(forms).toEqual([]);
        });
    });
});
