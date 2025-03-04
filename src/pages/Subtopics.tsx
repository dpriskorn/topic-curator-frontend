import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CirrusSearchFetcher from '../components/CirrusSearchFetcher';
import Footer from '../components/layout/Footer';

const Subtopics = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Extract query parameters
    const qid = searchParams.get('qid');
    const label = searchParams.get('label') || "";
    const lang = searchParams.get('lang') || 'en';
    const subgraph = searchParams.get('subgraph') || 'scientific_articles';

    // Redirect to root if qid is missing
    useEffect(() => {
        if (!qid) {
            setError("Missing required parameters");
            return;
        }
    }, [qid, navigate]);

    // State variables
    const [subtopics, setSubtopics] = useState<any[]>([]);
    const [checkedRows, setCheckedRows] = useState<boolean[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch subtopics from backend on load
    useEffect(() => {
        if (!qid) return;

        setLoading(true);
        fetch(`http://0.0.0.0:8000/v0/subtopics?lang=${lang}&qid=${qid}&subgraph=${subgraph}`)
            .then(response => response.json())
            .then(data => {
                const fetchedSubtopics = data.subtopics || [];
                setSubtopics(fetchedSubtopics);
                setCheckedRows(new Array(fetchedSubtopics.length).fill(false));

                // Redirect to /terms if no subtopics were found
                if (fetchedSubtopics.length === 0) {
                    let redirectUrl = `/terms?qid=${encodeURIComponent(qid)}&label=${encodeURIComponent(label)}`;
                    if (lang !== 'en') redirectUrl += `&lang=${encodeURIComponent(lang)}`;
                    if (subgraph !== 'scientific_articles') redirectUrl += `&subgraph=${encodeURIComponent(subgraph)}`;

                    navigate(redirectUrl, { replace: true });
                }
            })
            .catch(error => {
                console.error('Error fetching subtopics:', error);
                setError('Failed to load subtopics. Please try again.');
            })
            .finally(() => setLoading(false));
    }, [qid, lang, label, subgraph, navigate]);

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
        if (subgraph !== 'scientific_articles') url += `&subgraph=${encodeURIComponent(subgraph)}`;
        if (label) url += `&label=${encodeURIComponent(label)}`;
        return url;
    };

    return (
        <main className="container mt-4">
            <h2>Subtopics for QID: {qid}</h2>

            {loading && <div className="alert alert-info">Loading subtopics...</div>}
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
                                    <a href={generateUrl(subtopic.qid)} target="_blank" rel="noopener noreferrer">
                                        {subtopic.label}
                                    </a>
                                </td>
                                <td>{subtopic.description}</td>
                                <td>
                                    {subtopic.label_missing ? (
                                        <span>N/A</span>
                                    ) : (
                                        <CirrusSearchFetcher qid={subtopic.qid} term={subtopic.label} subgraph={subgraph} />
                                    )}
                                </td>
                                <td>
                                    <input type="checkbox" checked={checkedRows[index]} onChange={() => handleCheckboxChange(index)} />
                                </td>
                                <td>
                                    <a target="_blank" href={generateSubtopicLink(subtopic.qid, subtopic.label)}>
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
                    <input type="checkbox" checked={allChecked} onChange={handleCheckAll} /> Check All
                    <p className="text-warning">Please match all the subtopics individually before proceeding.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/terms')}>
                        Match
                    </button>
                </div>
            )}
            <Footer />
        </main>
    );
};

export default Subtopics;
