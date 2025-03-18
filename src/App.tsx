import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Subtopics from './pages/Subtopics';
import Terms from './pages/TermsPage';
import Results from './pages/Results';
import CoMaintainer from './pages/CoMaintainer';

function App() {
    // We intentionally don't set any default props here and handle undefined in the page components.
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/subtopics" element={<Subtopics />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/results" element={<Results />} />
                <Route path="/co-maintainer" element={<CoMaintainer />} />
            </Routes>
        </Router>
    );
}

export default App;
