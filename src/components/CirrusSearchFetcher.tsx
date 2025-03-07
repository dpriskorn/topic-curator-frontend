import { useEffect, useState } from 'react';
import { CirrusSearch } from '../models/CirrusSearch';

interface CirrusSearchFetcherProps {
    cirrusSearch: CirrusSearch;
}

const CirrusSearchFetcher: React.FC<CirrusSearchFetcherProps> = ({
    cirrusSearch,
}) => {
    const [totalHits, setTotalHits] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    if (cirrusSearch.term.string.toLowerCase().includes('label missing')) {
        return <span>N/A</span>;
    }

    useEffect(() => {
        const fetchCirrusSearchMatches = async () => {
            try {
                const totalHits = await cirrusSearch.totalHits();
                setTotalHits(totalHits);
            } catch (err) {
                setError('Failed to fetch CirrusSearch matches');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCirrusSearchMatches();
    }, [cirrusSearch]);

    if (loading) return <span>Loading...</span>;
    if (error) return <span className="text-danger">{error}</span>;

    return (
        <span>
            <a
                href={cirrusSearch.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                {totalHits}
            </a>
        </span>
    );
};

export default CirrusSearchFetcher;
