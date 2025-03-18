import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import NavbarComponent from '../components/layout/Navbar';

const LandingPage = () => {
    const [searchParams] = useSearchParams();

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
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'qid' && error) {
            setError('');
        }
    };

    const validateQid = (qid: string) => /^Q\d+$/.test(qid);

    const handleSubmit = (e: React.FormEvent) => {
        if (!formData.qid.trim()) {
            e.preventDefault();
            setError('A QID is required to proceed.');
            return;
        }

        if (!validateQid(formData.qid)) {
            e.preventDefault();
            setError(
                'QID must start with "Q" followed by numbers (e.g., Q123).',
            );
            return;
        }
    };

    return (
        <>
            <NavbarComponent />
            <main className="container mt-4">
                <div className="row">
                    <form
                        id="langForm"
                        method="GET"
                        action="/subtopics"
                        onSubmit={handleSubmit}
                    >
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
                                    <label className="m-1 d-block" key={option}>
                                        <input
                                            type="radio"
                                            name="subgraph"
                                            value={option}
                                            checked={
                                                formData.subgraph === option
                                            }
                                            onChange={handleInputChange}
                                            required
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
