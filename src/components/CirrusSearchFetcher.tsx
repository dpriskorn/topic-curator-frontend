import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendConfig } from '../../public/config/backend';
import { prefixConfig } from '../../public/config/prefix';

// Define the type for the component props
interface CirrusSearchFetcherProps {
    qid: string;
    term: string;
    subgraph: string; // Assuming subgraph is a string, change if necessary
}

// Utility function to retry a request
const retryRequest = async (
    requestFn: () => Promise<any>,
    retries = 5,
    delay = 1000,
): Promise<any> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await requestFn();

            // Validate the response structure
            if (
                !response.data ||
                !response.data.query ||
                !response.data.query.searchinfo
            ) {
                console.log('Response:', response);
                throw new Error('Invalid response structure from Wikidata API');
            }

            return response;
        } catch (err) {
            if (attempt === retries) {
                throw err;
            }
            await new Promise((resolve) =>
                setTimeout(resolve, delay * attempt),
            );
        }
    }
};

const CirrusSearchFetcher: React.FC<CirrusSearchFetcherProps> = ({
    qid,
    term,
    subgraph,
}) => {
    const [totalHits, setTotalHits] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCirrusSearchMatches = async () => {
            try {
                const prefix =
                    prefixConfig[subgraph]?.replace('{0}', qid) || '';
                const searchString = `${prefix} inlabel:"${term}"`;

                const response = await retryRequest(() =>
                    axios.get(
                        `${backendConfig.baseUrl}${backendConfig.cirrusSearch}`,
                        {
                            params: { srsearch: searchString },
                        },
                    ),
                );

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

    if (loading) return <span>Loading...</span>;
    if (error) return <span className="text-danger">{error}</span>;

    return <span>{totalHits}</span>;
};

export default CirrusSearchFetcher;
