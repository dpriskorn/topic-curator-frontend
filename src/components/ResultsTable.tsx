import React from "react";
import { SparqlItem } from "../models/SparqlItem";

interface ResultsTableProps {
  results: SparqlItem[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  if (results.length === 0) {
    return <p className="alert alert-warning">No results found.</p>;
  }

  return (
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
            <td><input type="checkbox" /></td>
            <td>
              <a href={item.qidUrl} target="_blank" rel="noopener noreferrer">
                {item.itemLabel}
              </a>
            </td>
            <td>{item.instanceOfLabel}</td>
            <td>{item.publicationLabel}</td>
            <td>
              {item.doi ? <a href={item.doiUrl} target="_blank" rel="noopener noreferrer">{item.doi}</a> : "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
