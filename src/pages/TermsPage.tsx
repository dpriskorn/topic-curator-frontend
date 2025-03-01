import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Term } from "../models/Term";
import { TermSource } from "../enums/TermSource";
import { Item } from "../models/Item";
import { Terms } from "../models/Terms"; 

const TermsComponent = ({ default_limit }) => {
  const [searchParams] = useSearchParams();
  const qid = searchParams.get("qid") || "N/A";
  const lang = searchParams.get("lang") || "en";
  const subgraph = searchParams.get("subgraph") || "default";
  const label = searchParams.get("label") || "N/A";

  const [termsManager] = useState(new Terms(label));
  const [newTerm, setNewTerm] = useState("");
  const [showError, setShowError] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (qid === "N/A") return;

    const fetchAliases = async () => {
      try {
        const item = new Item(qid, lang);
        const fetchedAliases = await item.fetchAliases();
        console.debug("Fetched Aliases from API:", fetchedAliases);

        const processedAliases = fetchedAliases.map(alias => alias.preparedTerm());
        console.debug("Processed Aliases:", processedAliases);

        termsManager.addTerms(processedAliases);
        console.debug("Terms after adding aliases:", termsManager.getTerms());
      } catch (error) {
        setFetchError(error.message);
      }
    };

    fetchAliases();
  }, [qid, lang]);

  const addTerm = () => {
    if (newTerm.trim() !== "") {
      const termObj = new Term(newTerm, TermSource.USER);
      termsManager.addTerm(termObj);
      setNewTerm("");
      setShowError(false);
    }
  };

  return (
    <main className="container mb-3">
      <div className="alert alert-info">
        <h3>Subtopic Details</h3>
        <p><strong>QID:</strong> {qid}</p>
        <p><strong>Label:</strong> {label}</p>
        <p><strong>Language:</strong> {lang}</p>
        <p><strong>Subgraph:</strong> {subgraph}</p>
      </div>

      {fetchError && <p className="alert alert-danger">Error: {fetchError}</p>}

      <div className="row">
        <form action="/results" method="get">
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name="subgraph" value={subgraph} />
          <input type="hidden" name="qid" value={qid} />
          <input type="hidden" name="label" value={label} />

          <h3>Term list</h3>
          {showError && <p className="alert alert-danger">At least one term is required.</p>}

          <div className="row">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Check</th>
                  <th scope="col">Term</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                {termsManager.getTerms().map((term, index) => (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" name="terms" checked={true} readOnly />
                    </td>
                    <td>{term.string}</td>
                    <td><span className="source">{term.source}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <input
              type="text"
              className="form-control"
              placeholder="Add term to list"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
            />
            <button type="button" onClick={addTerm} className="btn btn-secondary btn-sm">
              Add term
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default TermsComponent;
