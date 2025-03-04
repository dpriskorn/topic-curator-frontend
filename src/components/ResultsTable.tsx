import React, { useState } from "react";
import { SparqlItem } from "../models/SparqlItem";
import { Item } from "../models/Item"; // Ensure this import matches your project structure

interface ResultsTableProps {
  results: SparqlItem[];
  item: Item; // The main subject item
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, item }) => {
  const [selectedQIDs, setSelectedQIDs] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleCheckboxChange = (qid: string) => {
    setSelectedQIDs((prevSelected) =>
      prevSelected.includes(qid)
        ? prevSelected.filter((id) => id !== qid)
        : [...prevSelected, qid]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedQIDs([]); // Uncheck all
    } else {
      setSelectedQIDs(results.map((item) => item.qid)); // Check all
    }
    setSelectAll(!selectAll);
  };

  const generateQsCommands = (mainSubject: string, selectedQIDs: string[]) => {
    return selectedQIDs
      .map((qid) => `${qid}|P921|${mainSubject}|S887|Q69652283`)
      .join("||");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedQIDs.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    const commands = generateQsCommands(item.qid, selectedQIDs);
    const baseUrl = "https://quickstatements.toolforge.org";
    const endpoint = `${baseUrl}/#/v1=`;
    const encodedCommands = encodeURIComponent(commands);
    const qsUrl = `${endpoint}${encodedCommands}`;

    window.open(qsUrl, "_blank"); // Open QuickStatements in a new tab
  };

  if (results.length === 0) {
    return <p className="alert alert-warning">No results found.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Select</th>
            <th>Label</th>
            <th>Instance Of</th>
            <th>Publication</th>
            <th>DOI</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-${item.qid}`}
                  name="selected_qids[]"
                  value={item.qid}
                  checked={selectedQIDs.includes(item.qid)}
                  onChange={() => handleCheckboxChange(item.qid)}
                />
              </td>
              <td>
              <a href={item.qidUrl} target="_blank" rel="noopener noreferrer" 
              dangerouslySetInnerHTML={{ __html: item.highlightedItemLabel }}></a>
              </td>
              <td>{item.instanceOfLabel}</td>
              <td>{item.publicationLabel}</td>
              <td>
                {item.doi ? (
                  <a href={item.doiUrl} target="_blank" rel="noopener noreferrer">
                    {item.doi}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* "Check All" Checkbox & Warning Message */}
      <div className="form-check mt-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="checkAll"
          checked={selectAll}
          onChange={handleSelectAllChange}
        />
        <label className="form-check-label ms-2" htmlFor="checkAll">
          Select All
        </label>
      </div>
      <p className="text-warning mt-1">
        ⚠️ Please manually verify that the topic makes sense on all items. You are responsible for your edits.
      </p>

      <button type="submit" className="btn btn-primary mt-3">
        Send to QuickStatements
      </button>
    </form>
  );
};

export default ResultsTable;
