import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Term } from "../models/Term";
import { TermSource } from "../enums/TermSource";
import { Item } from "../models/Item";
import { Terms } from "../models/Terms";
import Footer from "../components/layout/Footer";

const TermsComponent = () => {
  const [searchParams] = useSearchParams();
  const qid = searchParams.get("qid") || "N/A";
  const lang = searchParams.get("lang") || "en";
  const subgraph = searchParams.get("subgraph") || "default";
  const label = searchParams.get("label") || "";

  // Use useRef for termsManager to persist without triggering re-renders
  const termsManagerRef = useRef(new Terms(label ? [new Term(String(label), TermSource.LABEL)] : []));

  const [newTerm, setNewTerm] = useState("");
  const [showError, setShowError] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [terms, setTerms] = useState(termsManagerRef.current.getTerms()); // Track terms separately for rendering

  useEffect(() => {
    if (qid === "N/A") return;

    const fetchAliases = async () => {
      try {
        const item = new Item(qid, lang);
        const fetchedAliases = await item.fetchAliasTerms(); // FIX: Correct method name
        console.debug("Fetched Aliases from API:", fetchedAliases);

        // Ensure aliases are valid Term objects before adding them
        if (!Array.isArray(fetchedAliases) || fetchedAliases.some(alias => !(alias instanceof Term))) {
          console.error("Invalid alias data format:", fetchedAliases);
          setFetchError("Fetched aliases contain invalid data.");
          return;
        }

        termsManagerRef.current.addTerms(fetchedAliases);
        setTerms([...termsManagerRef.current.getTerms()]); // Trigger re-render
      } catch (error) {
        setFetchError(error.message);
      }
    };

    fetchAliases();
  }, [qid, lang]); // 'termsManagerRef' is stable and does not need to be in dependencies

  const addTerm = () => {
    if (newTerm.trim() !== "") {
      const termObj = new Term(newTerm, TermSource.USER);
      termsManagerRef.current.addTerm(termObj);
      setTerms([...termsManagerRef.current.getTerms()]); // Update state to trigger re-render
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
                {terms.map((term, index) => (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" name="terms" value={term.string} defaultChecked />
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
            <button type="button" onClick={addTerm} className="btn btn-secondary btn-sm me-2">
              Add term
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Fetch matches
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </main>
  );
};

export default TermsComponent;
