import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Term } from "../models/Term";
import { TermSource } from "../enums/TermSource";
import { Item } from "../models/Item";
import { Terms } from "../models/Terms"; // Import new class

const TermsComponent = ({ lang, subgraph, default_limit }) => {
  const location = useLocation();
  const { subtopic } = location.state || {};
  const qid = subtopic?.qid || "N/A";
  const label = subtopic?.label || "N/A";

  // Initialize Terms manager
  const [termsManager] = useState(new Terms(label)); // ✅ Encapsulated term management
  const [newTerm, setNewTerm] = useState("");
  const [showError, setShowError] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (qid === "N/A") return;

    const fetchAliases = async () => {
      try {
        const item = new Item(qid, lang);
        const fetchedAliases = await item.fetchAliases();
        console.debug("Fetched Aliases from API:", fetchedAliases); // ✅ Debug: Ensure aliases are fetched

        // Add fetched aliases to termsManager with deduplication
        const processedAliases = fetchedAliases.map(alias => alias.preparedTerm());

        console.debug("Processed Aliases (after preparedTerm):", processedAliases); // ✅ Debug: Ensure preparation works

        // Add processed aliases to the Terms manager
        termsManager.addTerms(processedAliases);
        console.debug("Terms after adding aliases:", termsManager.getTerms()); // ✅ Debug: Ensure termsManager has the aliases

      } catch (error) {
        setFetchError(error.message);
      }
    };

    fetchAliases();
  }, [qid, lang]);

  const addTerm = () => {
    if (newTerm.trim() !== "") {
      const termObj = new Term(newTerm, TermSource.USER);
      termsManager.addTerm(termObj); // ✅ Use Terms manager to add new term
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
      </div>

      {fetchError && <p className="alert alert-danger">Error: {fetchError}</p>}

      <div className="row">
        <form action="/results" method="get">
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name="subgraph" value={subgraph} />
          <input type="hidden" name="qid" value={qid} />

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
