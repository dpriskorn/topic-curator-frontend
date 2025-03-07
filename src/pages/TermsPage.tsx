import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Term } from '../models/Term';
import { TermSource } from '../enums/TermSource';
import { Item } from '../models/Item';
import { Terms } from '../models/Terms';
import Footer from '../components/layout/Footer';
import { TERM_CHARACTER_CHECK_LIMIT } from '../../public/config/limit.tsx';

const TermsComponent = () => {
    const [searchParams] = useSearchParams();
    const qid = searchParams.get('qid') || 'N/A';
    const lang = searchParams.get('lang') || 'en';
    const subgraph = searchParams.get('subgraph') || 'default';

    // Use useRef for termsManager to persist without triggering re-renders
    const termsManagerRef = useRef(new Terms([]));

    const [newTerm, setNewTerm] = useState('');
    const [showError, setShowError] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [terms, setTerms] = useState(termsManagerRef.current.getTerms()); // Track terms separately for rendering

    useEffect(() => {
        if (qid === 'N/A') return;

        const fetchLabel = async () => {
            try {
                const item = new Item(qid, lang);
                const label = await item.fetchLabel(); // FIX: Correct method name
                console.debug('Fetched label from API:', label);

                termsManagerRef.current.addTerms([
                    new Term(label, TermSource.LABEL),
                ]);
                setTerms([...termsManagerRef.current.getTerms()]); // Trigger re-render
            } catch (error) {
                setFetchError((error as Error).message);
            }
        };

        const fetchAliases = async () => {
            try {
                const item = new Item(qid, lang);
                const fetchedAliases = await item.fetchAliasTerms(); // FIX: Correct method name
                console.debug('Fetched Aliases from API:', fetchedAliases);

                // Ensure aliases are valid Term objects before adding them
                if (
                    !Array.isArray(fetchedAliases) ||
                    fetchedAliases.some((alias) => !(alias instanceof Term))
                ) {
                    console.error('Invalid alias data format:', fetchedAliases);
                    setFetchError('Fetched aliases contain invalid data.');
                    return;
                }

                termsManagerRef.current.addTerms(fetchedAliases);
                setTerms([...termsManagerRef.current.getTerms()]); // Trigger re-render
            } catch (error) {
                setFetchError((error as Error).message);
            }
        };

        fetchLabel();
        fetchAliases();
    }, [qid, lang]); // 'termsManagerRef' is stable and does not need to be in dependencies

    const addTerm = () => {
        if (newTerm.trim() !== '') {
            const termObj = new Term(newTerm, TermSource.USER);
            termsManagerRef.current.addTerm(termObj);
            setTerms([...termsManagerRef.current.getTerms()]); // Update state to trigger re-render
            setNewTerm('');
            setShowError(false);
        }
    };

    return (
        <main className="container mb-3">
            {fetchError && (
                <p className="alert alert-danger">Error: {fetchError}</p>
            )}

            <div className="row">
                <form action="/results" method="get">
                    <input type="hidden" name="qid" value={qid} />
                    <input type="hidden" name="lang" value={lang} />
                    <input type="hidden" name="subgraph" value={subgraph} />

                    <h3>Term list</h3>
                    {showError && (
                        <p className="alert alert-danger">
                            At least one term is required.
                        </p>
                    )}

                    <div className="row">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Check</th>
                                    <th scope="col">Term</th>
                                    <th scope="col">Source</th>
                                </tr>
                            </thead>
                            <tbody>
                                {terms.map((term, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="terms"
                                                value={term.string}
                                                defaultChecked={
                                                    term.string.length >
                                                    TERM_CHARACTER_CHECK_LIMIT
                                                }
                                            />
                                        </td>
                                        <td>{term.string}</td>
                                        <td>
                                            <span className="source">
                                                {term.source}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Add term to list"
                            value={newTerm}
                            onChange={(e) => setNewTerm(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={addTerm}
                            className="btn btn-secondary btn-sm me-2"
                        >
                            Add term
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                        >
                            Fetch matches
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </main>
    );
};

export default TermsComponent;
