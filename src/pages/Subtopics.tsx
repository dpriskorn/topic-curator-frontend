import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CirrusSearchFetcher from '../components/CirrusSearchFetcher';
import Footer from '../components/layout/Footer';
import { Item } from '../models/Item';
import ItemDetails from '../components/ItemDetails';
import { SubtopicItem } from '../models/SubtopicItem';
import { SubtopicQuery } from '../models/SubtopicQuery';
import { TermSource } from '../enums/TermSource';
import { CirrusSearch } from '../models/CirrusSearch';
import { Term } from '../models/Term';
import NavbarComponent from '../components/layout/Navbar';

const Subtopics = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Extract query parameters
    const qid = searchParams.get('qid');
    const lang = searchParams.get('lang') || 'en';
    const subgraph = searchParams.get('subgraph') || 'scientific_articles';

    // State variables
    const [subtopics, setSubtopics] = useState<SubtopicItem[]>([]);
    const [checkedRows, setCheckedRows] = useState<boolean[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [label, setLabel] = useState<string | null>(null);

    useEffect(() => {
        if (!qid) {
            setError('Missing required parameter {qid}');
            return;
        }
        document.title = `Subtopics: ${label}`;


        const fetchData = async () => {
            try {
                const item = new Item(qid, lang);
                const labelValue = await item.fetchLabel();
                setLabel(labelValue);

                setLoading(true);
                const query = new SubtopicQuery(item);
                await query.fetchAndParse();
                const fetchedSubtopics = query.items || [];
                setSubtopics(fetchedSubtopics);
                setCheckedRows(new Array(fetchedSubtopics.length).fill(false));

                if (fetchedSubtopics.length === 0) {
                    let redirectUrl = `/terms?qid=${encodeURIComponent(qid ?? '')}`;
                    if (lang !== 'en')
                        redirectUrl += `&lang=${encodeURIComponent(lang)}`;
                    if (subgraph !== 'scientific_articles')
                        redirectUrl += `&subgraph=${encodeURIComponent(subgraph)}`;

                    navigate(redirectUrl, { replace: true });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [qid, lang, subgraph, navigate]);

    // Handle checkbox selection
    const handleCheckboxChange = (index: number) => {
        const newCheckedRows = [...checkedRows];
        newCheckedRows[index] = !newCheckedRows[index];
        setCheckedRows(newCheckedRows);
    };

    // Handle "Check All" checkbox
    const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedRows(new Array(subtopics.length).fill(e.target.checked));
    };

    // Check if all checkboxes are selected
    const allChecked = checkedRows.every((checked) => checked);

    // Generate URL for a subtopic based on its QID
    const generateUrl = (qid: string) => `https://www.wikidata.org/wiki/${qid}`;

    // Generate a link to the subtopics page with parameters
    const generateSubtopicLink = (subtopicQid: string, label: string) => {
        let url = `/subtopics?qid=${encodeURIComponent(subtopicQid)}`;
        if (lang !== 'en') url += `&lang=${encodeURIComponent(lang)}`;
        if (subgraph !== 'scientific_articles')
            url += `&subgraph=${encodeURIComponent(subgraph)}`;
        if (label) url += `&label=${encodeURIComponent(label)}`;
        return url;
    };

    return (
        <>
            <NavbarComponent />
            <main className="container mt-3">
                <NavbarComponent />
                <h2>
                    Subtopics for{' '}
                    {label ? (
                        <a href={`https://www.wikidata.org/wiki/${qid}`}>{label}</a>
                    ) : (
                        <span>Loading...</span>
                    )}
                </h2>
                {qid && <ItemDetails item={new Item(qid, lang)} />}

                {loading && (
                    <div className="alert alert-info">Loading subtopics...</div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}

                {subtopics.length > 0 && (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Subtopic</th>
                                <th>Description</th>
                                <th>CirrusSearch Matches</th>
                                <th>Matched</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subtopics.map((subtopic: any, index: number) => (
                                <tr key={subtopic.qid}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <a
                                            href={generateUrl(subtopic.qid)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {subtopic.label}
                                        </a>
                                    </td>
                                    <td>{subtopic.description}</td>
                                    <td>
                                        {subtopic.label ? (
                                            <CirrusSearchFetcher
                                                cirrusSearch={
                                                    new CirrusSearch(
                                                        new Item(subtopic.qid),
                                                        new Term(
                                                            subtopic.label,
                                                            TermSource.USER,
                                                        ),
                                                    )
                                                }
                                            />
                                        ) : (
                                            <span>Loading...</span>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={checkedRows[index]}
                                            onChange={() =>
                                                handleCheckboxChange(index)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <a
                                            target="_blank"
                                            href={generateSubtopicLink(
                                                subtopic.qid,
                                                subtopic.label,
                                            )}
                                        >
                                            Match
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {subtopics.length > 0 && (
                    <div className="mt-3">
                        <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={handleCheckAll}
                        />{' '}
                        Check All
                        <p className="text-warning">
                            Please match all the subtopics individually before
                            proceeding.
                        </p>
                        <button
                            className="btn btn-primary mt-3 w-100"
                            onClick={() => {
                                if (!allChecked) return;
                                let redirectUrl = `/terms?qid=${encodeURIComponent(qid ?? '')}&label=${encodeURIComponent(label ?? '')}`;
                                if (lang !== 'en')
                                    redirectUrl += `&lang=${encodeURIComponent(lang)}`;
                                if (subgraph !== 'scientific_articles')
                                    redirectUrl += `&subgraph=${encodeURIComponent(subgraph)}`;

                                navigate(redirectUrl);
                            }}
                            disabled={!allChecked}
                        >
                            Match {label ?? 'Topic'}
                        </button>{' '}
                    </div>
                )}
                <Footer />
            </main>
        </>
    );
};

export default Subtopics;
