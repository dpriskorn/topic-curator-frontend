// config/prefix.tsx

interface PrefixConfig {
    [key: string]: string;
  }
  
  export const prefixConfig: PrefixConfig = {
    scientific_articles: "haswbstatement:P31=Q13442814 -haswbstatement:P921={0}",
    scientific_journals: "haswbstatement:P31=Q41298 -haswbstatement:P921={0}",
    riksdagen_documents: "haswbstatement:P8433 -haswbstatement:P921={0}",
  };