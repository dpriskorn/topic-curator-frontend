import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProgressStep = ({ isActive, id, text }: { isActive: boolean; id: string; text: string }) => (
  <li className={isActive ? 'active' : ''} id={id}>
    <strong>{text}</strong>
  </li>
);

const LandingPage = () => {
  const [formData, setFormData] = useState({
    qid: '',
    lang: 'en',
    subgraph: 'scientific_articles' // Default selected subgraph
  });
  const [loading, setLoading] = useState(false);
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate(); // Initialize navigate

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? value : '') : value
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

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate qid
    if (formData.qid.trim() === '') {
      setError('A QID is required to proceed.');
      return;
    }

    if (!validateQid(formData.qid)) {
      setError('QID must start with a capital "Q" followed by numbers (e.g., Q123).');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://0.0.0.0:8000/subtopics?lang=${formData.lang}&qid=${formData.qid}&subgraph=${formData.subgraph}`
      );
      const data = await response.json();
      setSubtopics(data.subtopics || []);

      // Navigate to the Subtopics page with state
      navigate('/subtopics', { state: { subtopics: data.subtopics, qid: formData.qid } });
    } catch (error) {
      console.error('Error fetching subtopics:', error);
    }
    setLoading(false);
  };

  return (
    <main className="container mb-3">
      <div className="row justify-content-center">
        <div className="text-center">
        <ul id="progressbar">
            <ProgressStep isActive={true} id="step1" text="Choose language, topic and subgraph" />
            <ProgressStep isActive={false} id="step2" text="Process subtopics" />
            <ProgressStep isActive={false} id="step3" text="Choose terms" />
            <ProgressStep isActive={false} id="step4" text="Handle results" />
            <ProgressStep isActive={false} id="step5" text="Send to QS" />
          </ul>
          <div className="progress">
            <div className="progress-bar"></div>
          </div>
          <br />
        </div>
      </div>

      <div className="row">
        <form id="langForm">
          <dl className="row">
            <dt className="col-sm-4">
              <label htmlFor="qid">Topic item to work on:</label>
            </dt>
            <dd className="col-sm-3">
              <input
                type="text"
                className={`form-control ${error ? 'is-invalid' : ''}`} // Add 'is-invalid' class if there's an error
                id="qid"
                name="qid"
                value={formData.qid}
                onChange={handleInputChange}
                placeholder="Q1949144"
                title="This is the topic to curate. Items that already have a P921 statement with this value will be excluded by default."
                required
              />
              {error && <div className="invalid-feedback">{error}</div>} {/* Display error message */}
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
                  checked={formData.subgraph === 'scientific_journals'}
                  onChange={handleInputChange}
                /> Scientific Journals
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  name="subgraph"
                  value="scientific_articles"
                  checked={formData.subgraph === 'scientific_articles'}
                  onChange={handleInputChange}
                /> Scientific Articles and Preprints
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  name="subgraph"
                  value="riksdagen_documents"
                  checked={formData.subgraph === 'riksdagen_documents'}
                  onChange={handleInputChange}
                /> Riksdagen Documents
              </label>
            </dd>
          </dl>

          <button 
            type="submit" 
            className="btn btn-primary mt-3"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Next'}
          </button>
        </form>
      </div>

      {subtopics.length > 0 && (
        <div className="mt-4">
          <h3>Subtopics:</h3>
          <ul>
            {subtopics.map((subtopic) => (
              <li key={subtopic.qid}>
                <strong>{subtopic.label}</strong>: {subtopic.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default LandingPage;