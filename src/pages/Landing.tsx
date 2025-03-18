import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import NavbarComponent from '../components/layout/Navbar';

const LandingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Extract query parameters
    const qidParam = searchParams.get('qid') || '';
    const langParam = searchParams.get('lang') || 'en';
    const subgraphParam = searchParams.get('subgraph') || 'scientific_articles';

    const [formData, setFormData] = useState({
        qid: qidParam,
        lang: langParam,
        subgraph: subgraphParam,
    });

    const [error, setError] = useState('');

    const qidInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.title = 'Wikidata Topic Curator';
        if (qidInputRef.current) {
            qidInputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setFormData({
            qid: qidParam,
            lang: langParam,
            subgraph: subgraphParam,
        });
    }, [qidParam, langParam, subgraphParam]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? value : '') : value,
        }));

        if (name === 'qid' && error) {
            setError('');
        }
    };

    const validateQid = (qid: string) => /^Q\d+$/.test(qid);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.qid.trim()) {
            setError('A QID is required to proceed.');
            return;
        }

        if (!validateQid(formData.qid)) {
            setError(
                'QID must start with "Q" followed by numbers (e.g., Q123).',
            );
            return;
        }

        navigate(`/subtopics?qid=${encodeURIComponent(formData.qid)}`, {
            state: { qid: formData.qid },
        });
    };

    return (
        <>
            <NavbarComponent />
            <main className="container mt-4">
                <div className="row">
                    <form id="langForm">
                        <dl className="row">
                            <dt className="col-sm">
                                <label htmlFor="qid">
                                    Topic item to work on:
                                </label>
                            </dt>
                            <dd className="col-sm">
                                <input
                                    type="text"
                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                    id="qid"
                                    name="qid"
                                    value={formData.qid}
                                    onChange={handleInputChange}
                                    placeholder="Q1949144"
                                    ref={qidInputRef}
                                    title="This is the topic to curate."
                                    required
                                />
                                {error && (
                                    <div className="invalid-feedback">
                                        {error}
                                    </div>
                                )}
                            </dd>
                        </dl>

                        <dl className="row">
                            <dt className="col-sm">Language code:</dt>
                            <dd className="col-sm">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lang"
                                    name="lang"
                                    maxLength={3}
                                    value={formData.lang}
                                    onChange={handleInputChange}
                                    title="Input a language code supported by Wikimedia."
                                    required
                                />
                            </dd>
                        </dl>

                        <dl className="row">
                            <dt className="col-sm">Choose Subgraph:</dt>
                            <dd className="col-sm">
                                {[
                                    'scientific_journals',
                                    'scientific_articles',
                                    'riksdagen_documents',
                                ].map((option) => (
                                    <label key={option}>
                                        <input
                                            type="checkbox"
                                            name="subgraph"
                                            value={option}
                                            checked={
                                                formData.subgraph === option
                                            }
                                            onChange={handleInputChange}
                                        />{' '}
                                        {option
                                            .replace('_', ' ')
                                            .charAt(0)
                                            .toUpperCase() +
                                            option.replace('_', ' ').slice(1)}
                                    </label>
                                ))}
                            </dd>
                        </dl>

                        <button
                            type="submit"
                            className="btn btn-primary mt-3 w-100"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </form>
                </div>
                <Footer />
            </main>
        </>
    );
};

export default LandingPage;
