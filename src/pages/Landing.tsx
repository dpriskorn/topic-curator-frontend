import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import NavbarComponent from '../components/layout/Navbar';

const LandingPage = () => {
    const [formData, setFormData] = useState({
        qid: '',
        lang: 'en',
        subgraph: 'scientific_articles', // Default selected subgraph
    });
    const [error, setError] = useState(''); // State for error messages
    const navigate = useNavigate(); // Initialize navigate

    // Create a reference for the QID input field
    const qidInputRef = useRef<HTMLInputElement>(null);

    // Focus on the QID input field when the component loads
    useEffect(() => {
        document.title = 'Wikidata Topic Curator';
        if (qidInputRef.current) {
            qidInputRef.current.focus();
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (checked ? value : '') : value,
        });
        // Clear error when user starts typing
        if (name === 'qid' && error) {
            setError('');
        }
    };

    const validateQid = (qid: string) => {
        const qidPattern = /^Q\d+$/; // Regex to match "Q" followed by one or more digits
        return qidPattern.test(qid);
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate qid
        if (formData.qid.trim() === '') {
            setError('A QID is required to proceed.');
            return;
        }

        if (!validateQid(formData.qid)) {
            setError(
                'QID must start with a capital "Q" followed by numbers (e.g., Q123).',
            );
            return;
        }

        // Navigate to the Subtopics page with qid as a query param
        navigate(`/subtopics?qid=${encodeURIComponent(formData.qid)}`, {
            state: { qid: formData.qid },
        });
    };

    return (
        <main className="container mb-3">
            <NavbarComponent />
            <div className="row">
                <form id="langForm">
                    <dl className="row">
                        <dt className="col-sm-4">
                            <label htmlFor="qid">Topic item to work on:</label>
                        </dt>
                        <dd className="col-sm-3">
                            <input
                                type="text"
                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                id="qid"
                                name="qid"
                                value={formData.qid}
                                onChange={handleInputChange}
                                placeholder="Q1949144"
                                ref={qidInputRef}
                                title="This is the topic to curate. Items that already have a P921 statement with this value will be excluded by default."
                                required
                            />
                            {error && (
                                <div className="invalid-feedback">{error}</div>
                            )}
                        </dd>
                    </dl>

                    <dl className="row">
                        <dt className="col-sm-4">Language code:</dt>
                        <dd className="col-sm-3">
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
                        <dt className="col-sm-4">Choose Subgraph:</dt>
                        <dd className="col-sm-3">
                            <label>
                                <input
                                    type="checkbox"
                                    name="subgraph"
                                    value="scientific_journals"
                                    checked={
                                        formData.subgraph ===
                                        'scientific_journals'
                                    }
                                    onChange={handleInputChange}
                                />{' '}
                                Scientific Journals
                            </label>
                            <br />
                            <label>
                                <input
                                    type="checkbox"
                                    name="subgraph"
                                    value="scientific_articles"
                                    checked={
                                        formData.subgraph ===
                                        'scientific_articles'
                                    }
                                    onChange={handleInputChange}
                                />{' '}
                                Scientific Articles and Preprints
                            </label>
                            <br />
                            <label>
                                <input
                                    type="checkbox"
                                    name="subgraph"
                                    value="riksdagen_documents"
                                    checked={
                                        formData.subgraph ===
                                        'riksdagen_documents'
                                    }
                                    onChange={handleInputChange}
                                />{' '}
                                Riksdagen Documents
                            </label>
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
    );
};

export default LandingPage;
