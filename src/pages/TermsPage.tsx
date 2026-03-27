import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Term } from '../models/Term';
import { TermSource } from '../enums/TermSource';
import { Item } from '../models/Item';
import { Terms } from '../models/Terms';
import Footer from '../components/layout/Footer';
import NavbarComponent from '../components/layout/Navbar.tsx';
import AddTerms from '../components/AddTerms.tsx';
import CirrusSearchSettings from '../components/CirrusSearchSettings.tsx';
import LexemeFetch from '../components/LexemeFetch.tsx';

const TermsPage = () => {
    const [searchParams] = useSearchParams();
    const qid = searchParams.get('qid') || 'N/A';
    const labelParam = searchParams.get('label') || '';
    const lang = searchParams.get('lang') || 'en';
    const subgraph = searchParams.get('subgraph') || 'default';

    const termsManagerRef = useRef(new Terms([]));

    // const [newTerm, setNewTerm] = useState('');
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

        // Set label from params and fallback to fetching
        if (labelParam === '') {
            fetchLabel();
        } else {
            setLabel(labelParam);
            document.title = `Results: ${label}`;
            termsManagerRef.current.addTerms([
                new Term(labelParam, TermSource.LABEL),
            ]);
            setTerms([...termsManagerRef.current.getTerms()]);
        }
        fetchAliases();
    }, [qid, lang]);

    /* const addTerm = () => {
        if (newTerm.trim() !== '') {
            const termObj = new Term(newTerm, TermSource.USER);
            termsManagerRef.current.addTerm(termObj);
            setTerms([...termsManagerRef.current.getTerms()]);
            setNewTerm('');
            setShowError(false);
        }
    }; */

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
                        <CirrusSearchSettings
                            cirrusPrefix={cirrusPrefix}
                            setCirrusPrefix={setCirrusPrefix}
                            cirrusAffix={cirrusAffix}
                            setCirrusAffix={setCirrusAffix}
                            showAdvancedSettings={showAdvancedSettings}
                            setShowAdvancedSettings={setShowAdvancedSettings}
                        />
                        <AddTerms
                            termsManagerRef={termsManagerRef}
                            setTerms={setTerms}
                            showError={showError}
                            setShowError={setShowError}
                        />
                        <LexemeFetch
                            lang={lang}
                            termsManagerRef={termsManagerRef}
                            setTerms={setTerms}
                        />
                    </form>
                </div>
                <Footer />
            </main>
        </>
    );
};

export default TermsPage;
