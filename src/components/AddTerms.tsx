import { useState } from 'react';
import { Term } from '../models/Term';
import { TermSource } from '../enums/TermSource';
import { TERM_CHARACTER_CHECK_LIMIT } from '../../public/config/limit.tsx';

interface AddTermsProps {
    termsManagerRef: React.MutableRefObject<{
        addTerm: (term: Term) => void;
        getTerms: () => Term[];
    }>;
    setTerms: React.Dispatch<React.SetStateAction<Term[]>>;
    showError: boolean;
    setShowError: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTerms = ({
    termsManagerRef,
    setTerms,
    showError,
    setShowError,
}: AddTermsProps) => {
    const [newTerm, setNewTerm] = useState('');

    const addTerm = () => {
        if (newTerm.trim() !== '') {
            const termObj = new Term(newTerm, TermSource.USER);
            termsManagerRef.current.addTerm(termObj);
            setTerms([...termsManagerRef.current.getTerms()]);
            setNewTerm('');
            setShowError(false);
        }
    };

    const terms = termsManagerRef.current.getTerms();

    return (
        <>
            <h2>Term list</h2>
            {showError && (
                <p className="alert alert-danger">
                    At least one term is required.
                </p>
            )}
            <div className="row">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th scope="col" className="col-1"></th>
                            <th scope="col" className="col-1">
                                Source
                            </th>
                            <th scope="col" className="col-10">
                                Term
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {terms.map((term, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        name="terms"
                                        value={term.string}
                                        defaultChecked={
                                            term.string.length >
                                            TERM_CHARACTER_CHECK_LIMIT
                                        }
                                    />
                                </td>
                                <td>{term.source}</td>
                                <td>{term.string}</td>
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
                <button
                    type="button"
                    onClick={addTerm}
                    className="btn btn-secondary btn-sm me-2"
                >
                    Add term
                </button>
                <button type="submit" className="btn btn-primary btn">
                    Fetch matches
                </button>
            </div>
        </>
    );
};

export default AddTerms;
