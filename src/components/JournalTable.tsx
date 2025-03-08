import React from 'react';
import { ResultItem } from '../models/ResultItem';

interface JournalTableProps {
    journal: string;
    journalResults: ResultItem[];
    selectedQIDs: string[];
    onSelectAll: () => void;
    onCheckboxChange: (qid: string) => void;
}

const JournalTable: React.FC<JournalTableProps> = ({
    journal,
    journalResults,
    selectedQIDs,
    onSelectAll,
    onCheckboxChange,
}) => {
    return (
        <div className="mb-4">
            <p>
                {journal}
            </p>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th className="col-0">#</th>
                        <th className="col-0">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`selectAll-${journal}`}
                                checked={journalResults.every((item) =>
                                    selectedQIDs.includes(item.qid),
                                )}
                                onChange={onSelectAll}
                            />
                        </th>
                        <th className="col-6">Label</th>
                        <th className="col-2">Instance Of</th>
                        <th className="col-0">DOI</th>
                    </tr>
                </thead>
                <tbody>
                    {journalResults.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`checkbox-${item.qid}`}
                                    value={item.qid}
                                    checked={selectedQIDs.includes(item.qid)}
                                    onChange={() => onCheckboxChange(item.qid)}
                                />
                            </td>
                            <td>
                                <a
                                    href={item.qidUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    dangerouslySetInnerHTML={{
                                        __html: item.highlightedItemLabel,
                                    }}
                                ></a>
                            </td>
                            <td>{item.instanceOfLabel}</td>
                            <td>
                                {item.doi ? (
                                    <a
                                        href={item.doiUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Link
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default JournalTable;
