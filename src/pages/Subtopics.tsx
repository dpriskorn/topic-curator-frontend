import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CirrusSearchFetcher from '../components/CirrusSearchFetcher';

const Subtopics = () => {
    const location = useLocation();
    // Provide default values for location.state
    const { subtopics = [], qid = '', subgraph = 'scientific_articles' } = location.state || {};
    const [checkedRows, setCheckedRows] = useState<boolean[]>(
        new Array(subtopics.length).fill(false)
  );

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

  // Handle "Match Directly" button click
  const handleMatchDirectly = () => {
    // Add your logic for direct matching here
    console.log('Matching directly...');
    alert('Direct matching functionality will be implemented here.');
  };

  return (
    <main className="container mt-4">
      <h2>Subtopics for QID: {qid}</h2>

      {/* Show a message and "Match Directly" button if there are no subtopics 
        TODO redirect directly to the terms component instead */}
      {subtopics.length === 0 ? (
        <div>
          <div className="alert alert-info">
            No subtopics found. You can proceed to match directly.
          </div>
          <button
            className="btn btn-primary"
            onClick={handleMatchDirectly}
          >
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
                  {subtopic.label_missing ? (
                    <span>N/A</span> // Display "N/A" for missing labels
                  ) : (
                    <CirrusSearchFetcher
                      qid={subtopic.qid}
                      term={subtopic.label}
                      subgraph={subgraph} // Use subgraph from state
                    />
                  )}
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedRows[index]}
                    disabled
                  />
                </td>
                <td>
                  <button
                    className="btn btn-secondary"
                    disabled={!allChecked}
                  >
                    Match {subtopic.label}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Show the "Check All" section only if there are subtopics */}
      {subtopics.length > 0 && (
        <div className="mt-3">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={handleCheckAll}
          />{' '}
          Check All
          <p className="text-warning">
            Please match all the subtopics individually before proceeding.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleMatchDirectly}
          >
            Match
          </button>
        </div>
      )}
    </main>
  );
};

export default Subtopics;