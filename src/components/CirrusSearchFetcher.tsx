import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendConfig } from '../../public/config/backend';
import { prefixConfig } from '../../public/config/prefix';

// Utility function to retry a request
const retryRequest = async (requestFn, retries = 5, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await requestFn();

      // Validate the response structure
      if (!response.data || !response.data.query || !response.data.query.searchinfo) {
        // Log the full response for debugging
        console.log('Response:', response);
        throw new Error('Invalid response structure from Wikidata API');
      }

      return response; // Return the response if successful and valid
    } catch (err) {
      if (attempt === retries) {
        throw err; // Throw the error if all retries fail
      }
      await new Promise((resolve) => setTimeout(resolve, delay * attempt)); // Wait before retrying
    }
  }
};

const CirrusSearchFetcher = ({ qid, term, subgraph }) => {
  /* Fetcher that use the FastAPI backend because of CORS errors */
  const [totalHits, setTotalHits] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch CirrusSearch matches
  useEffect(() => {
    const fetchCirrusSearchMatches = async () => {
      try {
        // Build the prefix based on the subgraph and qid
        const prefix = prefixConfig[subgraph]?.replace('{0}', qid) || '';
        const searchString = `${prefix} inlabel:"${term}"`;

        // Use the FastAPI proxy server with retries
        const response = await retryRequest(
          async () => {
            return await axios.get(`${backendConfig.baseUrl}${backendConfig.cirrusSearch}`, {
              params: {
                srsearch: searchString, // Pass the search string to the proxy
              },
            });
          },
          3, // Retry up to 3 times
          1000 // Delay of 1 second between retries
        );

        // Extract the total hits from the response
        const totalHits = response.data.query.searchinfo.totalhits || 0;
        setTotalHits(totalHits);
      } catch (err) {
        setError('Failed to fetch CirrusSearch matches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCirrusSearchMatches();
  }, [qid, term, subgraph]);

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span className="text-danger">{error}</span>;
  }

  return <span>{totalHits}</span>;
};

export default CirrusSearchFetcher;