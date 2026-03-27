import React, { useState } from 'react';
import { Lexeme } from '../models/Lexeme';
import { Terms } from '../models/Terms';
import { Term } from '../models/Term';

interface LexemeFetchProps {
    lang: string;
    termsManagerRef: React.MutableRefObject<Terms>;
    setTerms: React.Dispatch<React.SetStateAction<Term[]>>;
}

const LexemeFetch: React.FC<LexemeFetchProps> = ({
    lang,
    termsManagerRef,
    setTerms,
}) => {
    const [lexemeId, setLexemeId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFetch = async () => {
        try {
            setLoading(true);
            const lexeme = new Lexeme(lexemeId);
            const forms = await lexeme.getForms();

            const terms: Term[] = forms.flatMap((form) =>
                form.getTermsByLanguage(lang),
            );
            console.debug("Adding terms from lexeme forms: ", terms);
            termsManagerRef.current.addTerms(terms);
            setTerms([...termsManagerRef.current.getTerms()]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2">Fetch Lexeme Forms</h2>
            <input
                type="text"
                className="border px-2 py-1 w-full mb-2"
                placeholder="Enter Lexeme ID (e.g. L123)"
                value={lexemeId}
                onChange={(e) => setLexemeId(e.target.value)}
            />
            <button
                className="btn btn-primary"
                onClick={handleFetch}
                disabled={loading}
            >
                {loading ? 'Fetching...' : 'Fetch forms as terms'}
            </button>
        </div>
    );
};

export default LexemeFetch;
