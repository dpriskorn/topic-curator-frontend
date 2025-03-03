import React from "react";
import { Item } from "../models/Item";

interface ResultsTableProps {
  results: Item[];
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
          <th>QID</th>
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
              <a href={`https://www.wikidata.org/wiki/${item.qid}`} target="_blank" rel="noopener noreferrer">
                {item.qid}
              </a>
            </td>
            <td>{item.itemLabel}</td>
            <td>{item.instanceOfLabel}</td>
            <td>{item.publicationLabel}</td>
            <td>{item.doi || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
