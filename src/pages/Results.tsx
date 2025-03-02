import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Query } from "../models/Query";
import { Term } from "../models/Term";
import { TermSource } from "../enums/TermSource";
import { TopicParameters } from "../models/TopicParameters";
import { Item } from "../models/Item";
import { Terms } from "../models/Terms";
import { Subgraph } from "../enums/Subgraph";

const Results = () => {
  const [searchParams] = useSearchParams();
  const qid = searchParams.get("qid");
  const lang = searchParams.get("lang") || "en";
  const subgraph = searchParams.get("subgraph") || "scientific_articles";
  const terms = useMemo(() => searchParams.getAll("terms"), [searchParams]); // Memoized

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!qid || terms.length === 0) {
      console.warn("Missing required parameters:", { qid, terms });
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const topicItem = new Item(qid);
        const termsObject = new Terms(terms.map(t => new Term(t, TermSource.USER)));

        console.debug("Total terms:", terms.length);
        console.debug("Terms object:", termsObject);

        const subgraphInstance = Object.values(Subgraph).includes(subgraph as Subgraph)
          ? (subgraph as Subgraph)
          : Subgraph.SCIENTIFIC_ARTICLES;

        const topicParameters = new TopicParameters(topicItem, 10, termsObject, subgraphInstance);
        let allResults = [];

        console.log(`Executing ${terms.length} queries...`);

        for (const termString of terms) {
          const term = new Term(termString, TermSource.USER);
          const query = new Query(lang, term, topicParameters);
          const queryResults = await query.runAndGetItems();
          allResults = [...allResults, ...queryResults];
        }

        console.log("Total results fetched:", allResults.length);
        setResults(allResults);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [qid, lang, subgraph, terms]); // Using memoized `terms` prevents infinite re-renders

  return (
    <main className="container mt-3">
      <h2>Query Results</h2>

      {loading && <p className="alert alert-info">Fetching results...</p>}
      {error && <p className="alert alert-danger">Error: {error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="alert alert-warning">No results found.</p>
      )}

      {!loading && results.length > 0 && (
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
      )}
    </main>
  );
};

export default Results;
