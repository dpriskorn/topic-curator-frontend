import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultQuery } from '../models/ResultQuery';
import { Term } from '../models/Term';
import { TermSource } from '../enums/TermSource';
import { Item } from '../models/Item';
import { Terms } from '../models/Terms';
import { Subgraph } from '../enums/Subgraph';
import ResultsTable from '../components/ResultsTable';
import QueryTable from '../components/QueryTable';
import { ResultItem } from '../models/ResultItem';
import ItemDetails from '../components/ItemDetails';
import Footer from '../components/layout/Footer';
import { CirrusSearch } from '../models/CirrusSearch';
import NavbarComponent from '../components/layout/Navbar';

const Results = () => {
    const [searchParams] = useSearchParams();
    const qid = searchParams.get('qid');
    const labelParam = searchParams.get('label') || '';
    const prefix = searchParams.get('prefix') || '';
    const affix = searchParams.get('affix') || '';
    const lang = searchParams.get('lang') || 'en';
    const subgraph = searchParams.get('subgraph') || 'scientific_articles';
    const terms = useMemo(() => searchParams.getAll('terms'), [searchParams]); // Memoized

    const [queries, setQueries] = useState<ResultQuery[]>([]);
    const [results, setResults] = useState<ResultItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [label, setLabel] = useState<string | null>(null);


    useEffect(() => {
        if (!qid || terms.length === 0) {
            console.warn('Missing required parameters:', { qid, terms });
            setError('Missing required parameters');
            setLoading(false);
            return;
        }
        document.title = `Results`;

        const fetchLabel = async () => {
            try {
                const item = new Item(qid, lang);
                const label = await item.fetchLabel();
                setLabel(label);
                document.title = `Results: ${label}`;
            } catch (error) {
                setError((error as Error).message);
            }
        };

        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);

                const topicItem = new Item(qid);
                const termsObject = new Terms(
                    terms.map((t) => new Term(t, TermSource.USER)),
                );

                console.debug('Total terms:', terms.length);
                console.debug('Terms object:', termsObject);

                const subgraphInstance = Object.values(Subgraph).includes(
                    subgraph as Subgraph,
                )
                    ? (subgraph as Subgraph)
                    : Subgraph.SCIENTIFIC_ARTICLES;

                // 10k is max because of limitations in CirrusSearch
                const limit = 10000;
                const allQueries: ResultQuery[] = [];
                const allResultsMap = new Map<string, ResultItem>(); // Map to track unique items by QID

                console.log(`Executing ${terms.length} queries...`);

                for (const termString of terms) {
                    const term = new Term(termString, TermSource.USER);
                    const cirrussearch = new CirrusSearch(
                        topicItem,
                        term,
                        subgraphInstance,
                        prefix,
                        affix
                    );
                    const query = new ResultQuery(limit, cirrussearch);
                    await query.runAndGetItems();

                    console.debug('query has been run: ', query.hasBeenRun);
                    console.debug('query itemCount: ', query.itemCount);

                    allQueries.push(query);

                    // Prevent duplicates by adding only unique QIDs
                    for (const item of query.items) {
                        if (!allResultsMap.has(item.qid)) {
                            allResultsMap.set(item.qid, item);
                        }
                    }
                }

                const allResults = Array.from(allResultsMap.values());

                console.log('Total unique results fetched:', allResults.length);
                setQueries(allQueries);
                setResults(allResults);
            } catch (err) {
                console.error('Error fetching results:', err);
                setError(
                    err instanceof Error ? err.message : 'An unknown error occurred',
                );
            } finally {
                setLoading(false);
            }
        };

        // Set label from params and fallback to fetching
        if (labelParam === ''){   
            fetchLabel();
        } else {
            setLabel(labelParam);
            document.title = `Results: ${label}`;
        }
        fetchResults();
    }, [qid, lang, subgraph, terms]); // Using memoized `terms` prevents infinite re-renders

    return (
        <>
            <NavbarComponent />
            <main className="container mt-3">
                <h1>
                    {label}
                </h1>
                {qid && <ItemDetails item={new Item(qid, lang)} />}
                <h2>
                    <strong>CirrusSearch queries</strong>
                </h2>
                <p>
                    Language code: {lang} | Subgraph: {subgraph}
                </p>
                {loading && (
                    <p className="alert alert-info">Fetching results...</p>
                )}
                {error && <p className="alert alert-danger">Error: {error}</p>}
                {!loading && !error && queries.length > 0 && (
                    <QueryTable queries={queries} />
                )}
                <p>Total deduplicated results: {results.length}</p>
                <h2>
                    Results
                </h2>
                {!loading && !error && results.length > 0 && qid && (
                    <ResultsTable
                        results={results}
                        item={new Item(qid, lang)}
                    />
                )}
                <Footer />
            </main>
        </>
    );
};

export default Results;
