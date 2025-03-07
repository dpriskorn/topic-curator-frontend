import React from 'react';
import { ResultQuery } from '../models/ResultQuery';

interface QueryTableProps {
    queries: ResultQuery[];
}

const QueryTable: React.FC<QueryTableProps> = ({ queries }) => {
    return (
        <div className="row">
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
                <tbody>
                    {queries.map((query, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{query.cirrussearch.term.string}</td>
                            <td>
                                <a
                                    href={query.wdqsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {query.itemCount}
                                </a>
                            </td>
                            <td>{query.hasBeenRun ? 'Yes' : 'No'}</td>
                            <td>
                                <a
                                    href={query.getInTitleGoogleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    In title
                                </a>{' '}
                                |{' '}
                                <a
                                    href={query.getEverywhereGoogleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Everywhere
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QueryTable;
