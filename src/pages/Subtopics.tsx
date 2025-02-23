import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CirrusSearchFetcher from '../components/CirrusSearchFetcher';

const Subtopics = () => {
  const location = useLocation();
  const { subtopics, qid, subgraph } = location.state || { subtopics: [], qid: '', subgraph: 'scientific_articles' }; // Default subgraph

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

  // Check if the label is a placeholder for a missing label
  const isMissingLabel = (label: string) => {
    return label.toLowerCase().includes('label missing in this language');
  };

  return (
    <main className="container mt-4">
      <h2>Subtopics for QID: {qid}</h2>
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
                {isMissingLabel(subtopic.label) ? (
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
      <div className="mt-3">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={handleCheckAll}
        /> Check All
        <p className="text-warning">Please match all the subtopics individually before proceeding.</p>
      </div>
    </main>
  );
};

export default Subtopics;