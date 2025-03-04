import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Query } from "../models/Query";
import { Term } from "../models/Term";
import { TermSource } from "../enums/TermSource";
import { TopicParameters } from "../models/TopicParameters";
import { Item } from "../models/Item";
import { Terms } from "../models/Terms";
import { Subgraph } from "../enums/Subgraph";
import ResultsTable from "../components/ResultsTable";
import QueryTable from "../components/QueryTable";
import { SparqlItem } from "../models/SparqlItem";
import ItemDetails from "../components/ItemDetails";

const Results = () => {
  const [searchParams] = useSearchParams();
  const qid = searchParams.get("qid");
  const lang = searchParams.get("lang") || "en";
  const subgraph = searchParams.get("subgraph") || "scientific_articles";
  const terms = useMemo(() => searchParams.getAll("terms"), [searchParams]); // Memoized

  const [queries, setQueries] = useState<Query[]>([]);
  const [results, setResults] = useState<SparqlItem[]>([]);
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
        const allQueries: Query[] = [];
        let allResults: SparqlItem[] = [];

        console.log(`Executing ${terms.length} queries...`);

        for (const termString of terms) {
          const term = new Term(termString, TermSource.USER);
          const query = new Query(lang, term, topicParameters);
          await query.runAndGetItems();
          
          console.debug("query has been run: ", query.hasBeenRun);
          console.debug("query itemCount: ", query.itemCount);

          allQueries.push(query);
          // TODO prevent duplicates
          allResults = [...allResults, ...query.items];
        }

        console.log("Total results fetched:", allResults.length);
        setQueries(allQueries);
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
      <h1>Working on: {terms[0]}</h1>
      {qid && <ItemDetails item={new Item(qid, lang)} />}
      <h2>CirrusSearch queries</h2>
      <p>
          Language code: {lang} | Subgraph: {subgraph}
      </p>

      {loading && <p className="alert alert-info">Fetching results...</p>}
      {error && <p className="alert alert-danger">Error: {error}</p>}

      {!loading && !error && queries.length > 0 && <QueryTable queries={queries} />}
      
      <h2>Results</h2>
      {!loading && !error && results.length > 0 && qid && <ResultsTable results={results} item={new Item(qid, lang)} />}
    </main>
  );
};

export default Results;
