interface CirrusSearchSettingsProps {
    cirrusPrefix: string;
    setCirrusPrefix: (value: string) => void;
    cirrusAffix: string;
    setCirrusAffix: (value: string) => void;
    showAdvancedSettings: boolean;
    setShowAdvancedSettings: (value: boolean) => void;
}

const CirrusSearchSettings = ({
    cirrusPrefix,
    setCirrusPrefix,
    cirrusAffix,
    setCirrusAffix,
    showAdvancedSettings,
    setShowAdvancedSettings,
}: CirrusSearchSettingsProps) => {
    return (
        <>
            <h2
                id="toggleBtn"
                className="d-flex align-items-center cursor-pointer"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                style={{
                    cursor: 'pointer',
                    userSelect: 'none',
                    display: 'flex',
                    gap: '8px',
                }}
            >
                <span>Advanced CirrusSearch query settings</span>
                <button
                    type="button"
                    className="btn btn-light btn-sm"
                    style={{
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        boxShadow: 'none',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    aria-label="Toggle advanced settings"
                >
                    {showAdvancedSettings ? '▼' : '▶'}
                </button>
            </h2>
            <div
                className={`advancedQuerySettings ${showAdvancedSettings ? '' : 'd-none'}`}
            >
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="csp" className="form-label">
                            CirrusSearch prefix:
                        </label>
                        <input
                            type="text"
                            id="csp"
                            className="form-control"
                            name="prefix"
                            value={cirrusPrefix}
                            onChange={(e) => setCirrusPrefix(e.target.value)}
                            placeholder="haswbstatement:P31=Q13442814 -haswbstatement:P921=Q1334131"
                            title="This is used mainly to control which subset of the graph to work on. Defaults to scientific articles."
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="csa" className="form-label">
                            CirrusSearch affix:
                        </label>
                        <input
                            type="text"
                            id="csa"
                            className="form-control"
                            name="affix"
                            value={cirrusAffix}
                            onChange={(e) => setCirrusAffix(e.target.value)}
                            placeholder="-inlabel:syndrome"
                            title="This is used mainly to exclude terms from the results"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CirrusSearchSettings;
