import React, { useState } from 'react';
import { ResultItem } from '../models/ResultItem';
import { Item } from '../models/Item';
import JournalTable from './JournalTable';

interface ResultsTableProps {
    results: ResultItem[];
    item: Item;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, item }) => {
    const [selectedQIDs, setSelectedQIDs] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectAllByJournal, setSelectAllByJournal] = useState<
        Record<string, boolean>
    >({});

    const handleCheckboxChange = (qid: string) => {
        setSelectedQIDs((prev) =>
            prev.includes(qid)
                ? prev.filter((id) => id !== qid)
                : [...prev, qid],
        );
    };

    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedQIDs([]); // Uncheck all
        } else {
            setSelectedQIDs(results.map((item) => item.qid)); // Check all
        }
        setSelectAll(!selectAll);
    };

    const handleJournalSelectAll = (
        journal: string,
        journalResults: ResultItem[],
    ) => {
        const journalQIDs = journalResults.map((item) => item.qid);
        if (selectAllByJournal[journal]) {
            setSelectedQIDs((prev) =>
                prev.filter((qid) => !journalQIDs.includes(qid)),
            );
        } else {
            setSelectedQIDs((prev) => [...new Set([...prev, ...journalQIDs])]);
        }
        setSelectAllByJournal((prev) => ({
            ...prev,
            [journal]: !selectAllByJournal[journal],
        }));
    };

    const generateQsCommands = (
        mainSubject: string,
        selectedQIDs: string[],
    ) => {
        return selectedQIDs
            .map((qid) => `${qid}|P921|${mainSubject}|S887|Q69652283`)
            .join('||');
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedQIDs.length === 0) {
            alert('Please select at least one item.');
            return;
        }

        const commands = generateQsCommands(item.qid, selectedQIDs);
        const baseUrl = 'https://quickstatements.toolforge.org';
        const qsUrl = `${baseUrl}/#/v1=${encodeURIComponent(commands)}`;

        window.open(qsUrl, '_blank');
    };

    if (results.length === 0) {
        return <p className="alert alert-warning">No results found.</p>;
    }

    // Group results by journal label
    const groupedResults = results.reduce(
        (acc, result) => {
            const journalLabel = result.publicationLabel || 'Unknown Journal';
            if (!acc[journalLabel]) {
                acc[journalLabel] = [];
            }
            acc[journalLabel].push(result);
            return acc;
        },
        {} as Record<string, ResultItem[]>,
    );

    return (
        <form onSubmit={handleSubmit}>
            {Object.entries(groupedResults).map(([journal, journalResults]) => (
                <JournalTable
                    key={journal}
                    journal={journal}
                    journalResults={journalResults}
                    selectedQIDs={selectedQIDs}
                    onSelectAll={() =>
                        handleJournalSelectAll(journal, journalResults)
                    }
                    onCheckboxChange={handleCheckboxChange}
                />
            ))}

            {/* "Check All" Checkbox & Warning Message */}
            <div className="form-check mt-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkAll"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
                <label className="form-check-label ms-2" htmlFor="checkAll">
                    Select All
                </label>
            </div>
            <p className="text-warning mt-1">
                ⚠️ Please manually verify that the topic makes sense on all
                items. You are responsible for your edits.
            </p>

            <button type="submit" className="btn btn-primary mt-3 w-100">
                Send to QuickStatements
            </button>
        </form>
    );
};

export default ResultsTable;
