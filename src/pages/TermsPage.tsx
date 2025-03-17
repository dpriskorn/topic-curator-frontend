import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Term } from '../models/Term';
import { TermSource } from '../enums/TermSource';
import { Item } from '../models/Item';
import { Terms } from '../models/Terms';
import Footer from '../components/layout/Footer';
import { TERM_CHARACTER_CHECK_LIMIT } from '../../public/config/limit.tsx';
import NavbarComponent from '../components/layout/Navbar.tsx';

const TermsPage = () => {
    const [searchParams] = useSearchParams();
    const qid = searchParams.get('qid') || 'N/A';
    const lang = searchParams.get('lang') || 'en';
    const subgraph = searchParams.get('subgraph') || 'default';

    const termsManagerRef = useRef(new Terms([]));

    const [newTerm, setNewTerm] = useState('');
    const [showError, setShowError] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [terms, setTerms] = useState(termsManagerRef.current.getTerms());
    const [label, setLabel] = useState<string | null>(null);
    const [cirrusPrefix, setCirrusPrefix] = useState('');
    const [cirrusAffix, setCirrusAffix] = useState('');
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

    useEffect(() => {
        if (qid === 'N/A') return;
        document.title = `Terms`;

        const fetchLabel = async () => {
            try {
                const item = new Item(qid, lang);
                const label = await item.fetchLabel();
                setLabel(label);
                document.title = `Terms: ${label}`;
                termsManagerRef.current.addTerms([
                    new Term(label, TermSource.LABEL),
                ]);
                setTerms([...termsManagerRef.current.getTerms()]);
            } catch (error) {
                setFetchError((error as Error).message);
            }
        };

        const fetchAliases = async () => {
            try {
                const item = new Item(qid, lang);
                const fetchedAliases = await item.fetchAliasTerms();
                if (
                    !Array.isArray(fetchedAliases) ||
                    fetchedAliases.some((alias) => !(alias instanceof Term))
                ) {
                    setFetchError('Fetched aliases contain invalid data.');
                    return;
                }
                termsManagerRef.current.addTerms(fetchedAliases);
                setTerms([...termsManagerRef.current.getTerms()]);
            } catch (error) {
                setFetchError((error as Error).message);
            }
        };

        fetchLabel();
        fetchAliases();
    }, [qid, lang]);

    const addTerm = () => {
        if (newTerm.trim() !== '') {
            const termObj = new Term(newTerm, TermSource.USER);
            termsManagerRef.current.addTerm(termObj);
            setTerms([...termsManagerRef.current.getTerms()]);
            setNewTerm('');
            setShowError(false);
        }
    };

    return (
        <>
            <NavbarComponent />
            <main className="container mt-3">
                <h1>CirrusSearch and term settings</h1>
                {fetchError && (
                    <p className="alert alert-danger">Error: {fetchError}</p>
                )}
                <div className="container">
                    <form action="/results" method="get">
                        <input type="hidden" name="qid" value={qid} />
                        <input type="hidden" name="lang" value={lang} />
                        <input type="hidden" name="subgraph" value={subgraph} />
                        <h2
                            id="toggleBtn"
                            className="d-flex align-items-center cursor-pointer"
                            onClick={() =>
                                setShowAdvancedSettings(!showAdvancedSettings)
                            }
                            style={{
                                cursor: 'pointer',
                                userSelect: 'none',
                                display: 'flex',
                                gap: '8px',
                            }}
                        >
                            <span>Advanced CirrusSearch query settings</span>
                            <button
                                type="button"
                                className="btn btn-light btn-sm"
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                aria-label="Toggle advanced settings"
                            >
                                {showAdvancedSettings ? '▼' : '▶'}
                            </button>
                        </h2>
                        <div
                            className={`advancedQuerySettings ${
                                showAdvancedSettings ? '' : 'd-none'
                            }`}
                        >
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="csp" className="form-label">
                                        CirrusSearch prefix:
                                    </label>
                                    <input
                                        type="text"
                                        id="csp"
                                        className="form-control"
                                        name="prefix"
                                        value={cirrusPrefix}
                                        onChange={(e) =>
                                            setCirrusPrefix(e.target.value)
                                        }
                                        placeholder="haswbstatement:P31=Q13442814 -haswbstatement:P921=Q1334131"
                                        title="This is used mainly to control which subset of the graph to work on. Defaults to scientific articles."
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="csa" className="form-label">
                                        CirrusSearch affix:
                                    </label>
                                    <input
                                        type="text"
                                        id="csa"
                                        className="form-control"
                                        name="affix"
                                        value={cirrusAffix}
                                        onChange={(e) =>
                                            setCirrusAffix(e.target.value)
                                        }
                                        placeholder="-inlabel:syndrome"
                                        title="This is used mainly to exclude terms from the results"
                                    />
                                </div>
                            </div>
                        </div>

                        <h2>
                            Term list
                        </h2>
                        {showError && (
                            <p className="alert alert-danger">
                                At least one term is required.
                            </p>
                        )}
                        <div className="row">
                            <table className="table table-bordered table-striped ">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-1"></th>
                                        <th scope="col" className="col-1">
                                            Source
                                        </th>
                                        <th scope="col" className="col-10">
                                            Term
                                        </th>
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
                                            <td>
                                                <span className="source">
                                                    {term.source}
                                                </span>
                                            </td>
                                            <td>{term.string}</td>
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
                                className="btn btn-primary btn"
                            >
                                Fetch matches
                            </button>
                        </div>
                    </form>
                </div>
                <Footer />
            </main>
        </>
    );
};

export default TermsPage;
