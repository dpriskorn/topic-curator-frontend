import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import CirrusSearchFetcher from '../components/CirrusSearchFetcher';


const Subtopics = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Extract query parameters
    const qidParam = searchParams.get('qid');
    const langParam = searchParams.get('lang') || 'en';
    const subgraphParam = searchParams.get('subgraph') || 'scientific_articles';

    // Redirect to root if qid is missing
    useEffect(() => {
        if (!qidParam) {
            navigate('/');
        }
    }, [qidParam, navigate]);

    // State variables for query parameters
    const [qid, setQid] = useState(qidParam || '');
    const [lang, setLang] = useState(langParam);
    const [subgraph, setSubgraph] = useState(subgraphParam);

    // Update state when query params change
    useEffect(() => {
        if (qidParam) setQid(qidParam);
        setLang(langParam);
        setSubgraph(subgraphParam);
    }, [qidParam, langParam, subgraphParam]);

    // Provide default values for location.state
    const { subtopics = []} = location.state || {};
    const [checkedRows, setCheckedRows] = useState<boolean[]>(new Array(subtopics.length).fill(false));

    // Handle individual checkbox change
    const handleCheckboxChange = (index: number) => {
        const newCheckedRows = [...checkedRows];
        newCheckedRows[index] = !newCheckedRows[index];
        setCheckedRows(newCheckedRows);
    };

    // Handle "Check All" checkbox change
    const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setCheckedRows(new Array(subtopics.length).fill(isChecked));
    };

    // Check if all checkboxes are checked
    const allChecked = checkedRows.every((checked) => checked);

    // Generate URL for a subtopic based on its qid
    const generateUrl = (qid: string) => {
        return `https://www.wikidata.org/wiki/${qid}`;
    };

    // Navigate to Terms.tsx with the selected subtopic
    const handleMatch = (subtopic: { qid: string; label: string }) => {
        navigate('/terms', { state: { subtopic: { qid: subtopic.qid, label: subtopic.label } } });
    };

    // Handle "Match Directly" button click
    const handleMatchDirectly = () => {
        navigate('/terms');
    };

    return (
        <main className="container mt-4">
            <h2>Subtopics for QID: {qid}</h2>

            {subtopics.length === 0 ? (
                <div>
                    <div className="alert alert-info">
                        No subtopics found. You can proceed to match directly.
                    </div>
                    <button className="btn btn-primary" onClick={handleMatchDirectly}>
                        Match
                    </button>
                </div>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Subtopic</th>
                            <th>Description</th>
                            <th>CirrusSearch Matches</th>
                            <th>Matched</th>
                            <th>Action</th>
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
                                    {subtopic.label_missing ? (
                                        <span>N/A</span>
                                    ) : (
                                        <CirrusSearchFetcher
                                            qid={subtopic.qid}
                                            term={subtopic.label}
                                            subgraph={subgraph}
                                        />
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={checkedRows[index]}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleMatch(subtopic)}
                                    >
                                        Match
                                    </button>
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
                    <button className="btn btn-primary" onClick={handleMatchDirectly}>
                        Match
                    </button>
                </div>
            )}
        </main>
    );
};

export default Subtopics;