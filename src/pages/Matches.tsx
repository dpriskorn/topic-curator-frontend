import { useState } from "react";
// todo rewrite this once all components from the backend have been translated

const Matches = ({ lang, qid, limit, subgraph, queries, itemCount, excludedItemCount, articleRows, excludedArticleRows }) => {
  const [checkAll, setCheckAll] = useState(false);

  const toggleAllCheckboxes = () => {
    setCheckAll(!checkAll);
  };

  return (
    <div className="container mt-4">
      {/* Navigation Bar */}
      <Navbar />

      <div className="row">
        <WorkingOn />
        <Goto />

        <h2>CirrusSearch query results in Wikidata</h2>
        <p>Language code: {lang} | Subgraph: {subgraph}.</p>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Query</th>
              <th scope="col"># of results</th>
              <th scope="col">Has been run</th>
              <th scope="col">Google Scholar results</th>
            </tr>
          </thead>
          <tbody dangerouslySetInnerHTML={{ __html: queries }} />
        </table>
        <p>Deduplicated results below: {itemCount}</p>
        <p>Excluded results below: {excludedItemCount}</p>
      </div>

      <div className="row">
        <h2>Results</h2>
        <form action="add-main-subject" method="post" target="_blank">
          <div className="alert alert-warning">
            Please lookout for when concepts are used with different meanings: E.g. "mobbing" in zoology and sociology are two different concepts.
          </div>
          <input name="main_subject" type="hidden" value={qid} />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Number</th>
                <th scope="col">
                  <input type="checkbox" checked={checkAll} onChange={toggleAllCheckboxes} />
                </th>
                <th scope="col">Label</th>
                <th scope="col">Instance of (P31)</th>
                <th scope="col">Publication</th>
                <th scope="col">DOI</th>
                <th scope="col">Link to full resource</th>
              </tr>
            </thead>
            <tbody dangerouslySetInnerHTML={{ __html: articleRows }} />
          </table>
          <p>
            <input type="checkbox" id="checkAll" checked={checkAll} onChange={toggleAllCheckboxes} /> Check all checkboxes
          </p>
          <button type="submit" className="btn btn-primary mt-3">
            Send to QuickStatements
          </button>
        </form>
      </div>

      <div className="row">
        <h2>Excluded results that have been undone according to the revision history</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Number</th>
              <th scope="col">Label</th>
              <th scope="col">Instance of (P31)</th>
              <th scope="col">Publication</th>
              <th scope="col">DOI</th>
              <th scope="col">Link to full resource</th>
            </tr>
          </thead>
          <tbody dangerouslySetInnerHTML={{ __html: excludedArticleRows }} />
        </table>
      </div>
    </div>
  );
};

export default Matches;
