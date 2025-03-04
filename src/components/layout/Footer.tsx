import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer mb-3">
      <div className="container">
        Design and <a href="https://github.com/dpriskorn/topic-creator-frontend">code</a> by
        <a href="https://www.wikidata.org/wiki/User:So9q" target="_blank" rel="noopener noreferrer"> Nizo Priskorn</a>. 
        Thanks to Egon Willinghagen and Ainali for suggestions.
        Tip: Try the <a href="https://www.wikidata.org/wiki/User:So9q/wikidata-topic-curator-link.js" target="_blank" rel="noopener noreferrer">user script</a>!
      </div>
    </footer>
  );
};

export default Footer;
