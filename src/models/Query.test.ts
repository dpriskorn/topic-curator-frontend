import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Query } from './Query';
import { Term } from './Term';
//import { TopicParameters } from './TopicParameters';
import { SparqlItem } from './SparqlItem';
import apiClient from '../components/apiClient';
import { WIKIDATA_SPARQL_ENDPOINT } from '../../public/config/sparql';
import { TermSource } from '../enums/TermSource';

vi.mock('../components/apiClient');

describe('Query', () => {
    let term, parameters, query;

    beforeEach(() => {
        term = new Term('example term', TermSource.ALIAS);
        parameters = {
            limit: 10,
            getCirrusSearch: vi.fn(() => ({
                url: 'https://example.com',
                escapedCirrussearchString: 'example'
            })),
            topic: { qid: 'Q123' }
        };
        query = new Query('en', term, parameters);
    });

    it('should initialize correctly', () => {
        expect(query.lang).toBe('en');
        expect(query.term).toBe(term);
        expect(query.parameters).toBe(parameters);
        expect(query.items).toEqual([]);
        expect(query.itemCount).toBe(0);
        expect(query.hasBeenRun).toBe(false);
    });

    it('should return correct cirrussearch instance', () => {
        const search = query.cirrussearch;
        expect(parameters.getCirrusSearch).toHaveBeenCalledWith(term);
        expect(search.url).toBe('https://example.com');
    });

    it('should calculate remaining limit correctly', () => {
        query.itemCount = 4;
        expect(query.calculatedLimit).toBe(6);
    });

    it('should generate correct SPARQL query string', () => {
        const queryString = query.wdqsQueryString;
        expect(queryString).toContain('SELECT DISTINCT ?item ?itemLabel');
        expect(queryString).toContain('LIMIT 10');
    });

    it('should call API and return parsed results', async () => {
        const mockResponse = {
            results: {
                bindings: [
                    {
                        item: { type: 'uri', value: 'http://www.wikidata.org/entity/Q42' },
                        itemLabel: { type: 'literal', value: 'Douglas Adams' }
                    }
                ]
            }
        };
        apiClient.get.mockResolvedValue(mockResponse);

        const items = await query.runAndGetItems();
        expect(apiClient.get).toHaveBeenCalledWith(WIKIDATA_SPARQL_ENDPOINT, expect.any(Object));
        expect(items).toHaveLength(1);
        console.debug(items[0]);
        expect(items[0]).toBeInstanceOf(SparqlItem);
        expect(items[0].qid).toBe('Q42');
        expect(items[0].itemLabel).toBe('Douglas Adams');
    });

    it('should throw an error if query string is empty', async () => {
        vi.spyOn(query, 'wdqsQueryString', 'get').mockReturnValue('');
        await expect(query.runAndGetItems()).rejects.toThrow('no query string');
    });
});
